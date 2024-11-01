<template>
  <div v-if="recruitment && applications">
    <div class="grid gap-4">
      <job-post-card :recruitment="recruitment" />
      <div class="grid md:flex gap-4">
        <pv-button
            class="w-full"
            severity="contrast"
            :label="$t('recruitment.dashboard.add-phase-lbl')"
            @click="this.newPhaseDialog = true"
        />
        <pv-button
            class="w-full"
            severity="warn"
            :label="$t('recruitment.dashboard.edit-post')"
            @click="this.editJobPostDialog = true"
        />
        <pv-button
            class="w-full"
            severity="help"
            :label="automationLabel"
            @click="this.automationDialog = true"
        />
        <pv-button
            class="w-full"
            severity="danger"
            :label="recruitment.enabled ? $t('recruitment.dashboard.finish-recruitment') : $t('recruitment.dashboard.reopen')"
            @click="this.deleteRecruitmentDialog = true"
        />
      </div>
      <div class="grid gap-2">
        <h1 class="text-2xl font-bold uppercase text-primary">{{ $t('recruitment.dashboard.phases-title') }}</h1>
        <div class="grid lg:flex gap-8">
          <div class="grid gap-4 w-full lg:w-1/3">
            <div class="flex flex-col gap-4">
              <pv-button
                  class="w-full"
                  :label="$t('view-applicants')"
                  @click="this.selectedPhase=null"
              />
              <recruitment-phase-card
                  :phase="phases[0]"
                  :bgColor="bgColors[0]"
                  :bgColorDark="bgColorsDark[0]"
                  :isFirstPhase="true"
                  @click="this.selectedPhase= 0"
                  @update="updateRecruitment"
              />
              <recruitment-phase-card
                  v-for="(phase, index) in phases.slice(1)"
                  :applications="getApplicationsByPhaseId()"
                  :key="phase.id"
                  :recruitmentProcess="this.recruitment"
                  :phase="phase"
                  :bgColor="bgColors[1]"
                  :bgColorDark="bgColorsDark[1]"
                  :isFirstPhase="false"
                  @update="updateRecruitment"
                  @click="this.selectedPhase= index + 1"
              />
            </div>
          </div>
          <div class="w-full lg:w-2/3 overflow-x-auto h-full">
            <p class="text-neutral-500 py-1">{{ $t('showing') + " " + (getCurrentPhaseTitle()==='' ? $t('all'):getCurrentPhaseTitle()) + " " + $t('applications-lbl')}}</p>
            <all-applicants-dialog
                class="overflow-x-auto h-full"
                :applications="getApplicationsByPhaseId()"
                @edit-application-phase="updateRecruitment"
            />
          </div>
        </div>
      </div>
    </div>
    <!--New Phase Dialog-->
    <pv-dialog v-model:visible="newPhaseDialog"
               :header="$t('recruitment.dashboard.add-phase-lbl')"
               modal :dismissableMask="true"
               class="w-full md:w-1/3">
      <create-recruitment-phase-form :recruitment-process-id="recruitment.id"
                                     @createdPhase="updateRecruitment" />
    </pv-dialog>
    <!--New Phase Dialog-->
    <pv-dialog v-model:visible="automationDialog"
               :header="$t('automation')"
               modal :dismissableMask="true"
               class="w-full md:w-1/3">
      <div class="grid gap-4">
        <h1 class="font-medium">{{ $t('automation-description-main') }}</h1>
        <div class="grid md:flex gap-8 items-center justify-center md:justify-between w-full">
          <p>{{ $t('automation-description') }}</p>
          <pv-button
              class="w-full md:w-1/2"
              :severity="isLoading? 'secondary' : recruitment.automaticEmails ? 'success' : 'danger'"
              :label="this.recruitment.automaticEmails ? $t('active') : $t('inactive')"
              :icon="this.recruitment.automaticEmails ? 'pi pi-check' : 'pi pi-times'"
              :disabled="isLoading"
              @click="toggleAutomaticEmails"
          />
        </div>
      </div>
    </pv-dialog>
    <!--Edit Job Post Dialog-->
    <pv-dialog v-model:visible="editJobPostDialog"
               :header="$t('edit-jobPost')"
               modal :dismissableMask="true"
               class="w-full md:w-1/3">
      <edit-jobPost-form
          :jobPost="recruitment.jobPost"
          @updatedJobPost="updateRecruitment" />
    </pv-dialog>
    <!--Delete Recruitment Dialog-->
    <pv-dialog v-model:visible="deleteRecruitmentDialog"
               :header="recruitment.enabled ? $t('recruitment.dashboard.finish-recruitment'):$t('recruitment.dashboard.reopen')"
               modal :dismissableMask="true"
               class="w-full md:w-1/3">
      <finish-reopen-recruitment-dialog
          :recruitment="recruitment"
          @updatedRecruitment="updateRecruitment" />
    </pv-dialog>
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <pv-spinner />
    </div>
  </div>
</template>

<script>
import {RecruitmentApiService} from "../../shared/services/recruitment.service.js";
import RecruitmentPhaseCard from "../components/recruitment-phase-card.component.vue";
import {useUserStore} from "../../shared/store/user-store.store.js";
import {ApplicationsService} from "../../shared/services/applications.service.js";
import FinishReopenRecruitmentDialog from "../components/finish-reopen-recruitment.component.vue";
import EditJobPostForm from "../components/edit-jobpost.component.vue";
import CreateRecruitmentPhaseForm from "../components/create-recruitment-phase.component.vue";
import AllApplicantsDialog from "../components/all-applicants-dialog.component.vue";
import JobPostCard from "../../shared/components/job-post-card.component.vue";

export default {
  name: "recruitment-dashboard",
  components: {
    JobPostCard,
    AllApplicantsDialog,
    EditJobPostForm,
    CreateRecruitmentPhaseForm,
    FinishReopenRecruitmentDialog,
    RecruitmentPhaseCard,
  },
  computed: {
    automationLabel() {
      return this.$t('automation') + ' 🆕';
    }
  },
  data() {
    return {
      recruitmentApi: new RecruitmentApiService(),
      applicationsApi: new ApplicationsService(),
      recruitment: null,
      phases: [],
      applications: null,
      newPhaseTitle: '',
      newPhaseDescription: '',
      deleteRecruitmentDialog: false,
      editJobPostDialog: false,
      newPhaseDialog: false,
      automationDialog: false,
      selectedPhase: null,
      bgColors: [
        'bg-lime-100',
        'bg-indigo-100'
      ],
      bgColorsDark:[
        'dark:bg-cyan-900',
        'dark:bg-gray-700'
      ],
      isLoading: false,
    }
  },
  created() {
    this.updateRecruitment();
  },
  methods: {
    updateRecruitment() {
      this.recruitment = null;

      const recruitmentId = this.$route.params.id;
      const userStore = useUserStore();
      const companyId = userStore.user.company.id;

      this.recruitmentApi.isRecruitmentProcessFromCompany(recruitmentId, companyId)
          .then(response => {
            if (response.data === false) {
              this.$router.push({name: '404'});
            } else {
              this.recruitmentApi.getRecruitmentProcessById(recruitmentId)
                  .then(response => {
                    this.recruitment = response.data
                    this.phases = this.recruitment.recruitmentPhases;
                    this.applicationsApi.getApplicationsRecruitmentProcessId(recruitmentId)
                        .then(response => {
                          this.applications = response.data;
                        });
                  });
            }
          });
      this.deleteRecruitmentDialog = false;
      this.editJobPostDialog = false;
      this.newPhaseDialog = false;
    },
    toggleAutomaticEmails(){
      this.isLoading = true;

      if (this.recruitment.automaticEmails !== true) {
        this.recruitmentApi.activateAutomaticEmails(this.recruitment.id)
            .then(() => {
              this.$toast.add({
                severity: 'success',
                summary: this.$t('success'),
                detail: this.$t('success-toggle-automatic-emails'),
                life: 2000
              });
              this.recruitment.automaticEmails = true;
              this.isLoading = false;
            })
            .catch(error => {
              this.$toast.add({
                severity: 'error',
                summary: this.$t('error'),
                detail: error.response.data.message || this.$t('error-toggle-automatic-emails'),
                life: 2000
              });
              this.isLoading = false;
            })
      }
      else {
        this.recruitmentApi.deactivateAutomaticEmails(this.recruitment.id)
            .then(() => {
              this.$toast.add({
                severity: 'success',
                summary: this.$t('success'),
                detail: this.$t('success-toggle-automatic-emails'),
                life: 2000
              });
              this.recruitment.automaticEmails = false;
              this.isLoading = false;
            })
            .catch(error => {
              this.$toast.add({
                severity: 'error',
                summary: this.$t('error'),
                detail: error.response.data.message || this.$t('error-toggle-automatic-emails'),
                life: 2000
              });
              this.isLoading = false;
            })
      }
    },
    getApplicationsByPhaseId() {
      if (this.selectedPhase === null) {
        return this.applications || [];
      }

      const selectedPhaseId = this.phases[this.selectedPhase]?.id;
      return this.applications?.filter(application => application.currentRecruitmentPhase.id === selectedPhaseId) || [];
    },
    getCurrentPhaseTitle() {
      if (this.selectedPhase === null) {
        return '';
      }

      return this.phases[this.selectedPhase]?.title || '';
    }
  }
}
</script>