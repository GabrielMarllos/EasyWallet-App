<template>
  <div :class="[
      'max-h-container',
      'rounded-xl',
      'px-4',
      'py-2',
      'w-full',
      'space-y-2',
      'hover:cursor-pointer',
      'hover:scale-95',
      'hover:border-primary',
      'duration-200',
      bgColor,
      bgColorDark
      ]"
  >
    <div v-if="phase">
      <div id="header" class="flex justify-between items-center w-full px-1 py-1">
        <h1 class="font-semibold text-lg">{{ phase.title }}</h1>
        <pv-button
            @click="phaseDialog = true"
            icon="pi pi-ellipsis-h" text rounded size="large" severity="secondary"
            aria-label="Phase dialog expander" />
        <pv-dialog v-model:visible="phaseDialog" modal :header=phase.title class="w-1/2">
          <div class="grid gap-2">
            <form class="grid"
                  @submit.prevent="updatePhase(phase)">
              <div class="grid w-full gap-2">
                <div class="grid">
                  <label for="title">{{ $t('recruitment.create-recruitment.title-placeholder') }}</label>
                  <pv-input
                      id="title"
                      required
                      v-model="this.title"
                      :placeholder="$t('recruitment.create-recruitment.title-placeholder')"
                      type="text"
                  />
                </div>
                <div class="grid">
                  <label for="description">{{ $t('recruitment.create-recruitment.description-placeholder') }}</label>
                  <pv-textarea
                      id="description"
                      v-model="this.description"
                      :placeholder="$t('recruitment.create-recruitment.description-placeholder')"
                      type="text"
                  />
                </div>
                <pv-button type="submit"
                           :disabled="this.loading"
                           :label="this.loading ? $t('loading') : $t('accept')"
                />
              </div>
            </form>
            <div class="grid w-full" v-if="isFirstPhase===false">
              <pv-button type="submit"
                         severity="danger"
                         :disabled="this.loading"
                         :label="this.loading ? $t('loading') : $t('delete')"
                         @click="deletePhase(phase)"
              />
            </div>
          </div>
        </pv-dialog>
      </div>
<!--      <div>-->
<!--        <h1 v-if="this.applications.length === 0">{{ $t('no-applications-found-message')}}</h1>-->
<!--      </div>-->
<!--      <div v-for="application in applications" :key="application.id">-->
<!--        <div @click="openCandidateDialog(application.id)"-->
<!--             class="flex border px-2 py-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:scale-95 duration-100 hover:cursor-pointer items-center space-x-2">-->
<!--          <img class="rounded-full w-12 h-12 object-cover"-->
<!--               :src="application.applicant.profilePictureUrl"-->
<!--               :alt="application.applicant.firstname + ' profile picture'"/>-->
<!--          <div class="grid">-->
<!--            <p class="font-medium">{{ application.applicant.firstname }} {{ application.applicant.lastname }}</p>-->
<!--            <p class="text-xs">{{$t('application-date')}}: {{ formatDate(application.application_date) }}</p>-->
<!--          </div>-->

<!--        </div>-->
<!--      </div>-->
<!--      <pv-dialog v-model:visible="candidateDialog" modal>-->
<!--        <p>-->
<!--          {{ currentCandidate.user.name }}-->
<!--          <br>-->
<!--          Building...-->
<!--        </p>-->
<!--        <template #footer>-->
<!--          <pv-button label="Okay" icon="pi pi-times" @click="candidateDialog = false" text />-->
<!--        </template>-->
<!--      </pv-dialog>-->
    </div>
    <div v-else>
      <div class="flex items-center justify-center">
        <pv-spinner />
      </div>
    </div>
  </div>
</template>


<script>
import {RecruitmentPhaseApiService} from "../services/phases.service.js";

export default {
  name: "recruitment-phase-card",
  props: {
    phase: {
      type: Object,
      required: true
    },
    bgColor: {
      type: String,
      required: true
    },
    bgColorDark: {
      type: String,
      required: true
    },
    isFirstPhase: {
      type: Boolean,
      default: false
    },
    applications : {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      phaseDialog: false,
      candidateDialog: false,
      currentCandidate: {},
      title:'',
      description: '',
      loading: false,
      phaseService: new RecruitmentPhaseApiService(),
    }
  },
  created() {
    this.title = this.phase.title;
    this.description = this.phase.description;
  },
  methods: {
    updatePhase() {
      this.loading = true;

      if (this.phase.title === '' || this.title === '') {
        this.loading = false;
        this.$toast.add({
          severity: "error",
          summary: "JobSync",
          detail: "Title is required",
          life: 2000
        });
        return;
      }

      const newPhase = {
        id: this.phase.id,
        title: this.title,
        description: this.description,
        startDate: this.phase.startDate,
        endDate: this.phase.endDate,
        recruitmentProcessId: this.phase.recruitmentProcessId
      }

      this.phaseService.updatePhase(newPhase.id,newPhase)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: "JobSync",
              detail: this.$t('edited'),
              life: 2000
            });
            this.phase.title = this.title;
            this.phase.description = this.description;
            this.phaseDialog = false;
            this.candidateDialog = false;
          })
          .catch((error) => {
            this.$toast.add({
              severity: "error",
              summary: "JobSync",
              detail: "There was an error. Please try again later: " + error.message,
              life: 2000
            });
          });

      this.loading = false;
    },
    deletePhase() {
      this.loading = true;

      if (this.isFirstPhase === true) {
        return;
      }

      if (this.applications.length > 0) {
        this.loading = false;
        this.$toast.add({
          severity: "error",
          summary: "JobSync",
          detail: this.$t('delete-phase-warn'),
          life: 2000
        });
        return;
      }


      this.phaseService.deletePhase(this.phase.id)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: "JobSync",
              detail: "Deleted",
              life: 2000
            });
            this.$emit('update');
          })
          .catch((error) => {
            this.$toast.add({
              severity: "error",
              summary: "JobSync",
              detail: "There was an error. Please try again later: " + error.message,
              life: 2000
            });
            console.log(error)
          });
      this.loading = false;
    },
  }
}
</script>