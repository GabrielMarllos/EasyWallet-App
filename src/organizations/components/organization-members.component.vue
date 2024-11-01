<template>
  <div class="space-y-4">
    <div class="justify-center items-center">
      <div v-if="!recruiters" class="flex items-center">
        <div class="flex items-center justify-center w-full">
          <pv-spinner />
        </div>
      </div>
      <div v-else>
        <div class="grid gap-6">
          <div class="grid gap-2">
            <p class="text-2xl font-bold text-primary py-2 text-center">{{ $t('organization-members') }}</p>
            <div class="flex gap-2 w-full">
              <pv-input
                  class="w-full"
                  :placeholder="this.$t('search-recruiter')"
                  icon="pi pi-search"
                  v-model="searchRecruiter"
              />
              <div v-if="isTheCurrentUserOwner">
                <pv-button
                    class="w-full"
                    label="Invite recruiter"
                    icon="pi pi-plus"
                    @click="addRecruiterDialog = true"
                />
              </div>
            </div>
          </div>
          <pv-data-table
              paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]"
              :value="filteredRecruiters">
            <pv-column
                :header="this.$t('showing') + ' ' + filteredRecruiters.length + '-' + recruiters.length  + ' ' + this.$t('recruiters')"
            >
              <template #body="slotProps">
                <member-card
                    :isTheCurrentUserOwner="isTheCurrentUserOwner"
                    :recruiter="slotProps.data"
                    @updateMember="updateMembers"
                />
              </template>
            </pv-column>
          </pv-data-table>
          <div v-if="!isTheCurrentUserOwner">
            <pv-button
                class="w-full"
                :label="this.$t('leave-organization.title')"
                severity="danger"
                @click="this.leaveOrganizationDialog = true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <pv-dialog
      v-model:visible="addRecruiterDialog"
      :header="$t('add-recruiter')+ ' ' + currentOrganization.name"
      modal :dismissableMask="true"
      class="w-1/2"
  >
    <pv-input
        class="w-full"
        :placeholder="this.$t('search-recruiter')"
        icon="pi pi-search"
        v-model="addRecruiterInput"
    />
    <template #footer>
      <div class="flex gap-2">
        <pv-button
            @click="addRecruiter"
            :label="!this.loading ? this.$t('invite'): this.$t('loading')"
            :disabled="loading"
        />
      </div>
    </template>
  </pv-dialog>
  <pv-dialog
      v-model:visible="leaveOrganizationDialog"
      :header="$t('leave-organization.title')"
      modal :dismissableMask="true"
      class="w-1/2"
  >
    <div class="grid gap-4">
      <div class="grid gap-2">
        <p class="text-lg">
          {{ $t('leave-organization.description') }}
        </p>
        <p>
          {{ $t('leave-organization.type-1')}}
          <span class="font-bold">{{ this.currentOrganization.name }}</span>
          {{ $t('leave-organization.type-2') }}
        </p>
      </div>
      <pv-input
          class="w-full"
          v-model="leaveOrganizationInput"
      />
    </div>
    <template #footer>
      <pv-button
          severity="danger"
          :label="this.loading ? this.$t('loading'): this.$t('leave-organization.leave')"
          :disabled="loading"
          @click="leaveOrganization"
      />
    </template>
  </pv-dialog>
</template>

<script>
import { useUserStore } from "../../shared/store/user-store.store.js";
import { CompaniesService } from "../service/companies.service.js";
import MemberCard from "./member-card.component.vue";

export default {
  name: "organization-members",
  components: { MemberCard },
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
    isTheCurrentUserOwner: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      recruiters: null,
      companyService: new CompaniesService(),
      searchRecruiter: '',
      addRecruiterDialog: false,
      addRecruiterInput: '',
      loading:false,
      leaveOrganizationDialog: false,
      leaveOrganizationInput: '',
    };
  },
  computed: {
    filteredRecruiters() {
      if (!this.searchRecruiter) {
        return this.recruiters;
      }
      const search = this.searchRecruiter.toLowerCase();
      return this.recruiters.filter(recruiter =>
          recruiter.firstname.toLowerCase().includes(search) ||
          recruiter.lastname.toLowerCase().includes(search) ||
          recruiter.username.toLowerCase().includes(search)
      );
    }
  },
  created() {
    this.updateCompanyMembersInfo();
  },
  methods: {
    updateCompanyMembersInfo() {
      const userStore = useUserStore();
      this.companyService.getRecruitersByCompanyId(userStore.user.company.id)
          .then(response => {
            this.recruiters = response.data;
          })
          .catch(error => {
            console.error(error);
          });
    },
    updateMembers() {
      this.recruiters = null;
      this.updateCompanyMembersInfo();
    },
    addRecruiter() {
      this.loading = true;
      // Check if the recruiter is already in the company
      const recruiter = this.recruiters.find(recruiter => recruiter.username === this.addRecruiterInput);
      if (recruiter) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: this.$t('recruiter-has-company'),
          life:2000
        });
      } else {
        this.companyService.addRecruitersToCompany(this.currentOrganization.id,this.addRecruiterInput)
            .then(response => {
              this.addRecruiterDialog = false;
              this.updateMembers();
            })
            .catch(error => {
              this.$toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.response.data.message || this.$t('add-member-error'),
                life:2000
              });
            });
      }
      this.loading = false;
    },
    leaveOrganization() {
      this.loading = true;

      const userStore = useUserStore();

      if (this.isTheCurrentUserOwner) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: this.$t('leave-organization.owner-error'),
          life:2000
        });
        this.loading = false;
        return;
      }

      if (this.leaveOrganizationInput.toLowerCase() !== this.currentOrganization.name.toLowerCase()) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: this.$t('leave-organization.type-error'),
          life:2000
        });
        this.loading = false;
        return;
      }
      this.companyService.removeRecruiterFromCompany(this.currentOrganization.id, userStore.user.username)
          .then(() => {
            this.$toast.add({
              severity: 'success',
              summary: this.$t('success'),
              detail: this.$t('leave-organization.success'),
              life:2000
            });

            const userStore = useUserStore();
            userStore.updateUser();

            this.$router.push('/init');
          })
          .catch(error => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.response.data.message || this.$t('leave-organization.error'),
              life:2000
            });
          });
      this.loading = false;
    }
  }
};
</script>