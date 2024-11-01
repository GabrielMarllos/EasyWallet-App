<template>
  <div v-if="applications">
    <div class="mb-4 flex gap-4">
      <pv-input
          icon="pi pi-search"
          v-model="applicantNameFilter"
          type="text"
          :placeholder="$t('search')"
      />
      <pv-button
          :label="$t('email-all')"
          icon="pi pi-envelope"
          severity="contrast"
          @click="openEmailDialog(applications)"
      />
    </div>
    <div class="overflow-x-auto w-full">
      <pv-data-table
          :value="filteredApplications"
          size="small"
          stripedRows
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
      >
        <pv-column :header="$t('applicant')">
          <template #body="slotProps">
            <div class="flex gap-2 items-center">
              <div class="flex justify-center items-center w-24 h-24 p-4">
                <img
                    :src="slotProps.data.applicant.profilePictureUrl"
                    alt="User profile picture"
                    class="object-cover w-full h-full rounded-full"
                />
              </div>
              <div>
                <p>
                  {{ slotProps.data.applicant.firstname }} {{ slotProps.data.applicant.lastname }}
                </p>
                <a
                    :href="'mailto:' + slotProps.data.applicant.username"
                    target="_blank"
                    class="font-bold text-primary underline"
                >
                  {{ slotProps.data.applicant.username }}
                </a>
              </div>
            </div>
          </template>
        </pv-column>
        <pv-column :header="$t('CV')">
          <template #body="slotProps">
            <div class="flex gap-2">
              <a :href="slotProps.data.applicant.cvUrl" target="_blank">
                <pv-button
                    icon="pi pi-file"
                    severity="info"
                    :disabled="!slotProps.data.applicant.cvUrl"
                />
              </a>
              <a :href="slotProps.data.applicant.linkedinUrl" target="_blank">
                <pv-button
                    icon="pi pi-linkedin"
                    severity="info"
                    :disabled="!slotProps.data.applicant.linkedinUrl"
                />
              </a>
              <a :href="slotProps.data.applicant.portfolioUrl" target="_blank">
                <pv-button
                    icon="pi pi-briefcase"
                    severity="info"
                    :disabled="!slotProps.data.applicant.portfolioUrl"
                />
              </a>
            </div>
          </template>
        </pv-column>
        <pv-column :header="$t('application-date')" sortable="application_date">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.application_date) }}
          </template>
        </pv-column>
        <pv-column :header="$t('recruitment-phase')">
          <template #body="slotProps">
            {{ slotProps.data.currentRecruitmentPhase.title }}
          </template>
        </pv-column>
        <pv-column :header="$t('actions')">
          <template #body="slotProps">
            <div class="flex gap-2">
              <pv-button
                  icon="pi pi-envelope"
                  severity="contrast"
                  rounded
                  @click="openEmailDialog(slotProps.data)"
              />
              <pv-button
                  icon="pi pi-pencil"
                  severity="warn"
                  rounded
                  @click="openEditDialog(slotProps.data)"
              />
            </div>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <pv-spinner />
    </div>
  </div>

  <pv-dialog v-model:visible="emailDialog"
             :header="$t('email')"
             modal :dismissableMask="true"
             position="top"
             class="w-1/2">
    <email-form
                :emailTo="selectedEmails"
                :emailCC="selectedCC"
                :emailSubject="emailSubject"
                :emailContent="emailContent"
    />
  </pv-dialog>
  <pv-dialog v-model:visible="editDialog"
             :header="$t('edit')"
             modal :dismissableMask="true"
             position="top"
             class="w-1/2">
    <edit-application-dialog
        :application="selectedApplication"
        @edit-application-phase="editApplicationPhase"
    />
  </pv-dialog>
</template>

<script>
import EmailForm from "../../shared/components/email-form.component.vue";
import EditApplicationDialog from "./edit-application-dialog.component.vue";
import {ApplicationsService} from "../../shared/services/applications.service.js";
import {CompaniesService} from "../../organizations/service/companies.service.js";
import {useUserStore} from "../../shared/store/user-store.store.js";

export default {
  name: "all-applicants-dialog",
  components: {EditApplicationDialog, EmailForm},
  props: {
    applications: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      applicantNameFilter: '',
      editDialog: false,
      emailDialog: false,
      selectedApplications: [],
      emailSubject: '',
      emailContent: '',
      selectedEmails: [],
      selectedCC: [],
      companyService: new CompaniesService(),
      applicationService: new ApplicationsService(),
      selectedApplication: null,
    }
  },
  computed: {
    filteredApplications() {
      if (!this.applicantNameFilter) {
        return this.applications;
      }
      const filter = this.applicantNameFilter.toLowerCase();
      return this.applications.filter(application =>
          application.applicant.firstname.toLowerCase().includes(filter) ||
          application.applicant.lastname.toLowerCase().includes(filter)
      );
    }
  },
  created() {
    const userStore = useUserStore();

    this.companyService.getRecruitersByCompanyId(userStore.user.company.id)
        .then(response => {
          this.selectedCC = response.data.map(recruiter => recruiter.username);
        })
        .catch(e => {
          console.log(e);
        });
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    setUpApplications(applications) {
      this.selectedEmails = [];

      if (!Array.isArray(applications)) {
        this.selectedEmails.push(applications.applicant.username);
        return;
      }

      applications.forEach(application => {
        this.selectedEmails.push(application.applicant.username);
      });
    },
    openEmailDialog(applications) {
      this.setUpApplications(applications);
      this.emailDialog = true;
    },
    openEditDialog(applications) {
      this.setUpApplications(applications);
      this.selectedApplication = applications;
      this.editDialog = true;
    },
    editApplicationPhase(application) {
      this.$emit('edit-application-phase');
      this.editDialog = false;
    }
  }
}
</script>
