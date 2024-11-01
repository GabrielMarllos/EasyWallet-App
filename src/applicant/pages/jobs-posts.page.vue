<template>
  <div v-if="recruitmentProcesses">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl text-primary font-bold py-2">{{$t('navbar.jobs')}}</h1>
      <div class="flex items-center">
        <input type="text" v-model="searchTerm" @keyup.enter="confirmSearch" placeholder="Search..." class="border p-2 rounded"/>
        <pv-button icon="pi pi-search" aria-label="Search" @click="confirmSearch" />
      </div>
    </div>
    <p>{{ $t('showing') }} {{recruitmentProcesses.length}} {{$t('navbar.jobs')}}</p>
    <div class="grid md:grid-cols-2 gap-4 py-4">
      <div v-for="recruitmentProcess in displayedRecruitmentProcesses" :key="recruitmentProcess.id">
        <job-post-card
            :recruitment="recruitmentProcess"
            @click="showJobPostDialog(recruitmentProcess)"
            @confirmation="this.jobPostDialog=false"
        />
      </div>
      <pv-dialog v-model:visible="jobPostDialog" modal :dismissableMask="true" class="w-full md:w-1/2" position="top">
        <job-post-dialog :recruitmentProcess="selectedRecruitmentProcess" />
      </pv-dialog>
    </div>
    <pv-paginator
        :totalRecords="filteredRecruitmentProcesses.length"
        @page="handlePageChange"
        :rows="pageSize"
    />
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <pv-spinner />
    </div>
  </div>
</template>

<script>
import {RecruitmentApiService} from "../../shared/services/recruitment.service.js";
import JobPostCard from "../../shared/components/job-post-card.component.vue";
import JobPostDialog from "../components/job-post-dialog.vue";
import {ApplicationsService} from "../../shared/services/applications.service.js";

export default {
  name: "jobs-posts-page",
  components: {JobPostCard, JobPostDialog},
  data(){
    return {
      recruitmentProcesses: null,
      recruitmentProcessService: new RecruitmentApiService(),
      page: 1,
      pageSize: 8,
      searchTerm: '',
      filteredRecruitmentProcesses: [],
      jobPostDialog: false,
      selectedRecruitmentProcess: null,
      alreadyApplied: null,
      applicationsService: new ApplicationsService(),
    }
  },
  created() {
    this.fetchRecruitmentProcesses();
  },
  computed: {
    displayedRecruitmentProcesses() {
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredRecruitmentProcesses.slice(startIndex, endIndex);
    }
  },
  methods: {
    fetchRecruitmentProcesses() {
      this.recruitmentProcessService
          .getAllRecruitmentProcessesWithActiveJobPost()
          .then((response) => {
            this.recruitmentProcesses = response.data.reverse();
            this.filteredRecruitmentProcesses = this.recruitmentProcesses;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    handlePageChange(event) {
      this.page = event.page + 1;
    },
    confirmSearch() {
      if (!this.searchTerm) {
        this.filteredRecruitmentProcesses = this.recruitmentProcesses;
      } else {
        this.filteredRecruitmentProcesses = this.recruitmentProcesses.filter(recruitmentProcess =>
            recruitmentProcess.jobPost.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            recruitmentProcess.jobPost.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
      this.page = 1;
    },
    showJobPostDialog(_recruitmentProcess){
      this.selectedRecruitmentProcess = _recruitmentProcess;
      this.jobPostDialog = true;
    },
  }
}
</script>

<style scoped>
</style>