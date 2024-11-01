<template>
  <div v-if="alreadyApplied !== null" class="grid gap-4">
    <div class="grid md:flex justify-center md:justify-between items-center">
      <div class="grid md:flex gap-8">
        <div class="w-24 h-24 shadow p-4 overflow-hidden">
          <img class="object-cover w-full h-full" :src="recruitmentProcess.company.logoUrl" alt="company logo" />
        </div>
        <ul>
          <li>
            <h1 class="font-semibold text-2xl">{{ recruitmentProcess.jobPost.title }}</h1>
          </li>
          <li>
            <span class="font-semibold">{{ $t('recruitment-card.start-date-label') }}: </span>
            {{ formatDate(recruitmentProcess.created_date) }}
            <span class="font-medium">
            ({{ getPassedDays(recruitmentProcess.created_date) }} ago)
          </span>
          </li>
          <li class="font-medium">
            <span class="font-bold text-primary">{{ recruitmentProcess.company.name }}</span>
            •
            {{ recruitmentProcess.company.country }}
          </li>
          <li>
            <span class="font-semibold text-primary">{{ $t('recruitment-card.job-post-status-label') }}: </span>
            <span v-if="recruitmentProcess.jobPost.enabled===true">
              {{ $t('recruitment-card.open') }} 🟢
            </span>
            <span v-else>
              {{ $t('recruitment-card.closed') }} 🔴
            </span>
          </li>
        </ul>
      </div>
      <pv-button
          :label="this.alreadyApplied ? $t('applied'):$t('apply-to-job')"
          :disabled="this.alreadyApplied"
          @click="openConfirmationDialog"
      />
    </div>
    <div>
      <h2 class="font-semibold">
        {{ $t('recruitment.create-recruitment.description-placeholder') }}
      </h2>
      <p>
        {{ recruitmentProcess.jobPost.description }}
      </p>
    </div>
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <pv-spinner />
    </div>
  </div>

  <pv-dialog v-model:visible="isDialogVisible" header="" modal>
    <div class="p-4">
      <p>{{ $t('confirm-application-msg') }}</p>
      <div class="flex justify-end gap-4 mt-4">
        <pv-button :enabled="!this.isLoading"
                   :label="this.isLoading ? $t('loading') : $t('accept')"
                   @click="applyToJob" />
        <pv-button :label="$t('cancel')" @click="this.isDialogVisible = false" severity="danger" />
      </div>
    </div>
  </pv-dialog>
</template>

<script>
import JobPostCard from "../../shared/components/job-post-card.component.vue";
import {useUserStore} from "../../shared/store/user-store.store.js";
import {ApplicationsService} from "../../shared/services/applications.service.js";

export default {
  name: "jobs-posts-dialog",
  components: {JobPostCard},
  props: {
    recruitmentProcess: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      isDialogVisible: false,
      isLoading: false,
      alreadyApplied: null,
      applicationService: new ApplicationsService()
    }
  },
  created() {
    this.checkApplication();
  },

  methods: {
    checkApplication(){
      const userStore = useUserStore();
      const applicantId = userStore.user.id;

      this.applicationService.getApplicationsByApplicantId(applicantId).then(
          response => {
            const applications = response.data;
            const hasApplied = applications.some(application => application.recruitmentProcess.id === this.recruitmentProcess.id);

            this.alreadyApplied = !!hasApplied;
          }
      ).catch(e => {
        console.log(e);
      });
    },
    openConfirmationDialog() {
      if (this.alreadyApplied) {
        this.$toast.add({severity: 'info', summary: this.$t('info'), detail: this.$t('already-applied'), life:2000});
        return;
      }

      this.$emit('confirmation');
      this.isDialogVisible = true;
    },
    applyToJob() {
      this.isLoading = true;
      const userStore = useUserStore();

      const applicantId = userStore.user.id;
      const recruitmentId = this.recruitmentProcess.id;

      this.applicationService.applyToJob(applicantId,recruitmentId).then(
          () => {
            this.$toast.add({severity: 'success', summary: "JobSync", detail: "Applied", life:2000});
            this.checkApplication();
          }
      ).catch(e => {
        console.log(e)
        this.$toast.add({severity: 'error', summary: "Error", detail: "There was an error. Try again later " + e.response, life:2000});
      })
          .finally(
              () => {
                this.isDialogVisible = false;
                this.isLoading = false;
              }
          )
    },
    formatDate(date) {
      if (!date) return "";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    getPassedDays(date) {
      if (!date) return "";
      const today = new Date();
      const createdDate = new Date(date);
      const diffTime = today - createdDate;

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        return diffHours + (diffHours === 1 ? " hour" : " hours");
      }

      return diffDays + (diffDays === 1 ? " day" : " days");
    }
  }
}

</script>