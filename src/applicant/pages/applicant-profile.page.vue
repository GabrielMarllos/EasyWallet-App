<template>
  <div v-if="applicant!==null" class="flex justify-center items-center">
    <div class="flex bg-white dark:bg-black shadow-xl rounded p-12 justify-center items-center">
      <div class="flex flex-col space-y-6">
        <div>
          <h1 class="text-center font-bold text-3xl">{{ $t('profile-settings.applicant-title') }}</h1>
        </div>
        <div class="grid" v-if="this.applicant">
          <h1 class="text-center font-bold text-3xl">{{this.applicant.firstname + " " + this.applicant.lastname}}</h1>
          <p class="text-center text-xl">{{this.applicant.email}}</p>
        </div>
        <form v-on:submit="saveChanges($event)" class="flex flex-col space-y-3">
          <div class="flex gap-2 items-end">
            <div class="w-full">
              <label for="cvUrl">{{ $t('profile-settings.change-cv-url') }}</label>
              <a :href="cvUrl" target="_blank">
                <pv-input
                    id="cvResumeUrl"
                    class="w-full"
                    v-model="cvUrl"
                    placeholder="URL"
                    type="text"
                    disabled
                />
              </a>
            </div>
            <pv-button icon="pi pi-file-export" severity="info" aria-label="User" @click="openCvUrl" />
            <pv-file-upload mode="basic" name="demo[]" url="/api/upload"
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            :maxFileSize="1000000" @select="uploadCVUrl" />
          </div>
          <div>
            <label for="linkedinUrl">{{ $t('profile-settings.change-linkedin-url') }}</label>
            <pv-input
                id="linkedinUrl"
                class="w-full"
                v-model="linkedInUrl"
                placeholder="URL"
                type="text"
            />
          </div>
          <div>
            <label for="linkedinUrl">{{ $t('profile-settings.change-portfolio-url') }}</label>
            <pv-input
                id="cvResumeUrl"
                class="w-full"
                v-model="portfolioUrl"
                placeholder="URL"
                type="text"
            />
          </div>
          <pv-button type="submit" @click="saveChanges" :label="$t('auth.save-changes')" />
          <pv-button @click="cancelChanges" severity="danger" :label="$t('profile-settings.discard-changes')" />
        </form>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <pv-spinner />
    </div>
  </div>
</template>

<script>
import {getUser} from "../../shared/services/user.js";
import {ApplicantsService} from "../service/applicants.service.js";

export default {
  name: "applicant-profile-page",
  components: {  },
  data(){
    return {
      cvUrl: '',
      linkedInUrl: '',
      portfolioUrl: '',
      applicantApi: new ApplicantsService(),
      applicant:null,

      cvFile: null
    }
  },
  created(){
    this.applicantApi.getById(getUser().id).then(
        response => {
          this.applicant = response.data;

          this.cvUrl = this.applicant.cvUrl;
          this.linkedInUrl = this.applicant.linkedInUrl;
          this.portfolioUrl = this.applicant.portfolioUrl;
        }
    ).catch(e => {
      console.log(e);
    });
  },
  methods: {
    saveChanges() {
      event.preventDefault();

      if (this.cvFile !== null) {
        this.applicantApi.changeCV(this.applicant.id, this.cvFile).then(
            response => {
              this.cvUrl = response.data.cvUrl

              console.log("CV uploaded successfully");

              this.cvFile= null;

              this.updateApplicant();
            }
        ).catch(e => {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "There was an error updating CV. Try again later.",
            life: 2000
          });
          this.cvFile= null;
        });
      }
      else {
        this.updateApplicant();
      }
    },
    updateApplicant() {
      this.applicantApi.updateById(this.applicant.id, {
        linkedInUrl: this.linkedInUrl,
        portfolioUrl: this.portfolioUrl,
      }).then(
          response => {
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "Changes saved successfully.",
              life: 2000
            });

            this.applicantApi.getById(getUser().id).then(
                response => {
                  this.applicant = response.data;

                  this.cvUrl = this.applicant.cvUrl;
                  this.linkedInUrl = this.applicant.linkedInUrl;
                  this.portfolioUrl = this.applicant.portfolioUrl;
                }
            ).catch(e => {
              console.log(e);
            });
          }
      ).catch(e => {
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: e.data.message,
          life: 2000
        });
      });


      this.applicantApi.getById(getUser().id).then(
          response => {
            this.applicant = response.data;

            this.cvUrl = this.applicant.cvUrl;
            this.linkedInUrl = this.applicant.linkedInUrl;
            this.portfolioUrl = this.applicant.portfolioUrl;
          }
      ).catch(e => {
        console.log(e);
      });
    },
    cancelChanges() {
      this.cvUrl = this.applicant.cvUrl;
      this.linkedinUrl = this.applicant.linkedinUrl;
      this.portfolioUrl = this.applicant.portfolioUrl;
      this.cvFile = null;

      location.reload();
    },
    openCvUrl() {
      if (this.cvUrl) {
        window.open(this.cvUrl, '_blank');
      }
    },
    uploadCVUrl(event) {
      this.cvFile = event.files[0];
    }
  }
}
</script>

<style scoped>
</style>