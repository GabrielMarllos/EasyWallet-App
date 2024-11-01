<template>
  <form class="grid"
        @submit.prevent="createRecruitmentProcess">
    <div class="grid w-full gap-2">
      <pv-input required
                v-model="title"
                :placeholder="$t('recruitment.create-recruitment.title-placeholder')"
                type="text"
      />
      <pv-textarea
          v-model="description"
          :placeholder="$t('recruitment.create-recruitment.description-placeholder')"
          type="text"
      />
      <pv-button type="submit"
                 :label="this.isCreating ? $t('recruitment.create-recruitment.creating-lbl') : $t('recruitment.create-recruitment.create-submit-lbl')"
      />
    </div>
  </form>
</template>

<script>
import {JobPostApiService} from "../services/jobpost.service.js";
import {useUserStore} from "../../shared/store/user-store.store.js";

export default {
  name: "CreateRecruitmentProcess",
  setup() {
    return {
      title: '',
      description: '',
      isCreating: false,
      jobPostsApi: new JobPostApiService()
    }
  },
  data() {
    return {
    }
  },
  methods: {
    createRecruitmentProcess(){
      this.isCreating = true;
      const userStore = useUserStore();

      const newJobPost = {
        title: this.title,
        description: this.description
      }

      this.jobPostsApi.createJobPost(
          userStore.user.company.id,
          userStore.user.id,
          newJobPost
      ).then(() => {
        this.$toast.add({
          severity: "success",
          summary: "JobSync",
          detail: "Job Post created successfully!",
          life: 2000
        });

        this.title = '';
        this.description = '';

        this.$emit('post-created');
      }).catch((error) => {
        this.$toast.add({
          severity: "error",
          summary: "JobSync",
          detail: "There was an error creating the job post. Please try again later: " + error.message,
          life: 2000
        });
        console.log(error)
      })
          .finally(() => {
            this.isCreating = false;
          });

    }
  }
}

</script>