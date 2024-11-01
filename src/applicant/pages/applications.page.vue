<template>
  <div v-if="applications">
    <pv-data-table :value="applications">
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl text-900 font-bold">{{ $t('navbar.applications') }}</span>
          <pv-button icon="pi pi-refresh" rounded raised @click="updateApplications" severity="success" />
        </div>
      </template>
      <pv-column field="id" header="#" />
      <pv-column :header="$t('company')">
        <template #body="slotProps">
          <div class="flex gap-2 items-center">
            <div class="w-24 h-24 shadow p-4 overflow-hidden">
              <img class="object-cover w-full h-full" :src="slotProps.data.recruitmentProcess.company.logoUrl" alt="company logo" />
            </div>
            <div>
              <a :href="formatUrl(slotProps.data.recruitmentProcess.company.website)" target="_blank" class="font-bold text-primary underline">
                {{ slotProps.data.recruitmentProcess.company.name }}
              </a>
              <p>
                {{ slotProps.data.recruitmentProcess.company.country }}
              </p>
            </div>
          </div>
        </template>
      </pv-column>
      <pv-column :header="$t('job')">
        <template #body="slotProps">
          <span>{{ slotProps.data.recruitmentProcess.jobPost.title }}</span>
        </template>
      </pv-column>
      <pv-column :header="$t('recruitment-phase')">
        <template #body="slotProps">
          <span>{{ slotProps.data.currentRecruitmentPhase.title }}</span>
        </template>
      </pv-column>
      <pv-column :header="$t('application-date')">
        <template #body="slotProps">
          <span>{{ formatDate(slotProps.data.application_date) }}</span>
        </template>
      </pv-column>
      <pv-column :header="$t('phase-description')">
        <template #body="slotProps">
          <span>{{ slotProps.data.currentRecruitmentPhase.description }}</span>
        </template>
      </pv-column>
      <pv-column :header="$t('active')">
        <template #body="slotProps">
          <div v-if="slotProps.data.recruitmentProcess.enabled === true">
            <pv-button :label="$t('active')" severity="success" />
          </div>
          <div v-else>
            <pv-button :label="$t('finished')" severity="danger" />
          </div>
        </template>
      </pv-column>
      <pv-column :header="$t('actions')">
        <template #body="slotProps">
          <pv-button
              rounded
              severity="contrast"
              :disabled="slotProps.data.recruitmentProcess.enabled === false"
              :icon="slotProps.data.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-envelope'"
              @click="showEmailDialog(slotProps.data)"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <pv-spinner />
    </div>
  </div>

  <pv-dialog
      v-model:visible="emailDialog" modal
      :header="$t('email')"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
      :draggable="false"
      position="top"
  >
    <email-form
        :emailTo="selectedEmails"
        :emailCC="selectedCC"
        :emailSubject="emailSubject"
        :emailContent="emailContent"
    />
  </pv-dialog>
</template>

<script>
import { useUserStore } from "../../shared/store/user-store.store.js";
import { ApplicationsService } from "../../shared/services/applications.service.js";
import { RecruitmentApiService } from "../../shared/services/recruitment.service.js";
import EmailForm from "../../shared/components/email-form.component.vue";

export default {
  name: "jobs-posts-page",
  components: { EmailForm },
  data() {
    return {
      applications: null,
      applicationService: new ApplicationsService(),
      recruitmentProcessService: new RecruitmentApiService(),
      selectedApplication: null,
      emailDialog: false,
      selectedEmails: [],
      selectedCC: [],
      emailSubject: "",
      emailContent: "",
    };
  },
  created() {
    this.updateApplications();
  },
  methods: {
    updateApplications() {
      this.applications = null;
      const userStore = useUserStore();
      const applicantId = userStore.user.id;

      this.applicationService.getApplicationsByApplicantId(applicantId).then(
          response => {
            this.applications = response.data.map(application => ({
              ...application,
              isLoading: false, // Add isLoading property to each application
            }));
          }
      ).catch(e => {
        console.log(e);
      });
    },
    formatUrl(url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
      }
      return url;
    },
    formatDate(date) {
      if (!date) return "";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    showEmailDialog(application) {
      application.isLoading = true; // Set loading state for the specific application
      this.selectedApplication = application;

      this.selectedEmails = [];
      this.selectedCC = [];
      this.emailSubject = `JobSync - ` + this.$t('application-for') + ` ${application.recruitmentProcess.jobPost.title}`;

      this.applicationService.getRecruitersEmails(application.id).then(response => {
        this.selectedEmails = response.data;
        application.isLoading = false; // Reset loading state after data is fetched
        this.emailDialog = true;
      }).catch(() => {
        application.isLoading = false; // Reset loading state in case of error
      });
    },
  },
};
</script>