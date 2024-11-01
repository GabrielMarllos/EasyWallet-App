<template>
  <form class="grid"
        @submit.prevent="createRecruitmentPhase(recruitmentProcessId)">
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
                 :enabled="!this.loading"
                 :label="this.loading ? $t('loading') : $t('accept')"
      />
    </div>
  </form>
</template>

<script>
import {RecruitmentPhaseApiService} from "../services/phases.service.js";

export default {
  name: "create-recruitment-phase-form",
  props: {
    recruitmentProcessId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      title: '',
      description: '',
      loading: false,
      recruitmentPhasesService: new RecruitmentPhaseApiService()
    }
  },
  methods: {
    createRecruitmentPhase(recruitmentProcessId){
      this.loading = true;

      const newPhase = {
        title: this.title,
        description: this.description,
        recruitmentProcessId: recruitmentProcessId
      }

      this.recruitmentPhasesService.createPhase(newPhase).then(() => {
        this.$toast.add({
          severity: "success",
          summary: "JobSync",
          detail: "Created",
          life: 2000
        });

        this.$emit('createdPhase');
      }).catch((error) => {
        this.$toast.add({
          severity: "error",
          summary: "JobSync",
          detail: "There was an error. Please try again later: " + error.message,
          life: 2000
        });
        console.log(error)
      })
          .finally(() => {
            this.loading = false;
          });

    },
  }
}
</script>