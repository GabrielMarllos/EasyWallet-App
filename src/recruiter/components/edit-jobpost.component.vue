<template>
  <div class="grid gap-2">
    <form class="grid"
          @submit.prevent="editJobPost(jobPost)">
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
    <pv-button type="submit"
               :enabled="!this.loading"
               severity="danger"
               :label="jobPost.enabled ? $t('disable-jobpost'):$t('enable-jobpost')"
               @click="updateJobPostStatus(jobPost)"
    />
  </div>
</template>

<script>
import {JobPostApiService} from "../services/jobpost.service.js";

export default {
  name: "edit-jobPost-form",
  props: {
    jobPost: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: '',
      description: '',
      loading: false,
      jobPostsApi: new JobPostApiService()
    }
  },
  created() {
    this.title = this.jobPost.title;
    this.description = this.jobPost.description;
  },
  methods: {
    editJobPost(jobPost){
      this.loading = true;

      const updatedJobPost = {
        title: this.title,
        description: this.description
      }

      this.jobPostsApi.updateJobPost(
          jobPost.id,
          updatedJobPost
      ).then(() => {
        this.$toast.add({
          severity: "success",
          summary: "JobSync",
          detail: "Updated",
          life: 2000
        });

        this.$emit('updatedJobPost');
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
    updateJobPostStatus(jobPost) {
      this.loading = true;

      const updatedJobPost = {
        title: this.title,
        description: this.description
      }

      if (jobPost.enabled) {
        this.jobPostsApi.disableJobPost(jobPost.id)
            .then(() => {
              this.$toast.add({
                severity: "success",
                summary: "JobSync",
                detail: "Disabled",
                life: 2000
              });

              this.$emit('updatedJobPost');
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
      } else {
        this.jobPostsApi.enableJobPost(jobPost.id)
            .then(() => {
              this.$toast.add({
                severity: "success",
                summary: "JobSync",
                detail: "Enabled",
                life: 2000
              });

              this.$emit('updatedJobPost');
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
      }
    }
  }
}
</script>