<template>
  <form class="grid"
        @submit.prevent="updateEnabledRecruitment(recruitment)">
    <div class="grid w-full gap-2">
      <div>
        <p>
          {{ $t('recruitment.dashboard.type_1') }}
          <span class="font-bold text-primary">{{ recruitment.jobPost.title }}</span>
          {{ $t('recruitment.dashboard.type_2') }}
        </p>
      </div>
      <pv-input required
                v-model="typeTitle"
                :placeholder="recruitment.jobPost.title"
                type="text"
      />
      <pv-button type="submit"
                 severity="danger"
                 :label="this.loadingFinishingRecruitment ? $t('loading') : $t('accept')"
      />
    </div>
  </form>
</template>

<script>
import {RecruitmentApiService} from "../../shared/services/recruitment.service.js";

export default {
  name: "finish-reopen-recruitment-dialog",
  props: {
    recruitment: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      recruitmentService: new RecruitmentApiService(),
      loadingFinishingRecruitment: false,
      typeTitle: ''
    }
  },
  created() {
    this.deleteRecruitmentDialog = true;
  },
  methods:{
    updateEnabledRecruitment(recruitment){
      if (this.typeTitle !== recruitment.jobPost.title) {
        this.$toast.add({
          severity: "error",
          summary: "JobSync",
          detail: "Please enter the correct title",
          life: 2000
        });
        return;
      }

      this.loadingFinishingRecruitment = true;
      this.recruitmentService.updateEnabledRecruitmentProcess(recruitment.id)
          .then(() => {
            this.$emit('updatedRecruitment');
            this.$toast.add({
              severity: "success",
              summary: "JobSync",
              detail: "Updated",
              life: 2000
            });
          })
      this.deleteRecruitmentDialog = false;
      this.loadingFinishingRecruitment = false;
    }
  }
}

</script>