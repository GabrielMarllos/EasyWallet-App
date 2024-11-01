<template>
  <div class="flex gap-2 items-center shadow justify-between">
    <div class="flex gap-2 items-center">
      <div class="flex justify-center items-center w-24 h-24 p-4">
        <img
            :src="recruiter.profilePictureUrl"
            alt="User profile picture"
            class="object-cover w-full h-full rounded-full"
        />
      </div>
      <div>
        <p>{{ recruiter.firstname }} {{ recruiter.lastname }}</p>
        <p class="font-bold text-primary">{{ recruiter.username }}</p>
        <p>{{ this.isOwner ? 'Owner': 'Member' }}</p>
      </div>
    </div>
    <div class="flex gap-2 p-4">
      <pv-button
          icon="pi pi-envelope"
          severity="contrast"
          @click="emailRecruiterDialog = true"
      />
      <div v-if="isTheCurrentUserOwner">
        <pv-button
            :disabled="isOwner"
            @click="this.removeRecruiterDialog = true"
            severity="danger"
            icon="pi pi-times"
        />
      </div>
    </div>
  </div>

  <pv-dialog
      v-model:visible="emailRecruiterDialog"
      :header="$t('email')"
      modal :dismissableMask="true"
      class="w-1/2"
  >
    <email-form
        :emailTo="[this.recruiter.username]"
        :emailCC="this.emailCC"
        :emailSubject="this.emailSubject"
        :emailContent="this.emailContent"
    />
  </pv-dialog>

  <pv-dialog
      v-model:visible="removeRecruiterDialog"
      :header="$t('remove-recruiter')"
      modal :dismissableMask="true"
      class="w-1/2"
  >
    <div class="text-lg grid gap-2">
      <p>{{ $t('remove-recruiter-msg') }}</p>
      <p>
        {{ $t('remove-recruiter-type-1')}}
        <span class="font-bold">{{ recruiter.firstname }} {{ recruiter.lastname }} </span>
        {{ $t('remove-recruiter-type-2') }}
      </p>
      <pv-input
          class="w-full"
          v-model="removeRecruiterInput"
      />
    </div>
    <template #footer>
      <div class="flex gap-2">
        <pv-button
            @click="removeRecruiterDialog = false"
            severity="secondary"
            :label="this.$t('cancel')"
        />
        <pv-button
            @click="removeRecruiter"
            severity="danger"
            :label="this.isLoading? this.$t('loading') : this.$t('remove') + ' ' + recruiter.firstname + ' ' + recruiter.lastname"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<script>
import {CompaniesService} from "../service/companies.service.js";
import EmailForm from "../../shared/components/email-form.component.vue";

export default {
  name: "member-card",
  components: {EmailForm},
  props: {
    recruiter: {
      type: Object,
      required: true,
    },
    isTheCurrentUserOwner: {
      type: Boolean,
      required: true,
    },
  },
  data(){
    return {
      isOwner: null,
      removeRecruiterDialog: false,
      addRecruiterDialog: false,
      removeRecruiterInput: '',
      companyService: new CompaniesService(),
      isLoading: false,
      emailRecruiterDialog:false,
      emailCC: '',
      emailSubject: '',
      emailContent: ''
    }
  },
  created(){
    this.isOwner = this.recruiter.company.recruiter_owner_id === this.recruiter.id;
  },
  methods: {
    removeRecruiter() {
      this.isLoading = true;

      if(!this.isTheCurrentUserOwner){
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('only-owner-can-remove-recruiter'),
          life:2000
        });
        this.isLoading = false;
        return;
      }

      if (this.removeRecruiterInput.toLowerCase() !== this.recruiter.firstname.toLowerCase() + ' ' + this.recruiter.lastname.toLowerCase()) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('remove-recruiter-name-error'),
          life:2000
        });
        this.isLoading = false;
        return;
      }

      // Check if the recruiter is the owner
      if (this.isOwner) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('remove-owner-error'),
          life:2000
        });
        this.isLoading = false;
        return;
      }

      this.companyService.removeRecruiterFromCompany(this.recruiter.company.id,this.recruiter.username)
          .then(() => {
            this.$toast.add({
              severity: 'success',
              summary: this.$t('success'),
              detail: this.$t('remove-recruiter-success'),
              life:2000
            });
            this.removeRecruiterDialog = true;
            this.$emit('updateMember');
          })
          .catch(error => {
            console.error(error);
            this.$toast.add({
              severity: 'error',
              summary: this.$t('error'),
              detail: this.$t('remove-recruiter-error'),
              life:2000
            });
          });
      this.isLoading = false;
    },
  }
}

</script>

