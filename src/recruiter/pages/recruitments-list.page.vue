<template>
  <div v-if="recruitmentProcesses">
    <h1 class="text-2xl text-primary font-bold py-2">{{$t('recruitment.title')}}</h1>
    <div class="flex justify-between items-center">
      <pv-button @click="openCreateRecruitmentProcess"
                 icon="pi pi-plus"
                 :label = "$t('organization-profile.new-recruitment-btn-label')"
      />
      <div class="flex items-center">
        <input type="text" v-model="searchTerm" @keyup.enter="confirmSearch" :placeholder="$t('search')" class="border p-2 rounded"/>
        <pv-button icon="pi pi-search" :aria-label="$t('search')" @click="confirmSearch" />
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4 py-4">
      <div v-for="recruitmentProcess in displayedRecruitmentProcesses" :key="recruitmentProcess.id">
        <router-link :to="`recruitment/${recruitmentProcess.id}/dashboard`">
          <job-post-card :recruitment="recruitmentProcess" />
        </router-link>
      </div>
    </div>
    <pv-paginator
        :totalRecords="filteredRecruitmentProcesses.length"
        @page="handlePageChange"
        :rows="pageSize"
    />
    <pv-dialog v-model:visible="createRecruitmentProcessDialog"
               :header="$t('organization-profile.new-recruitment-btn-label')" modal class="w-full md:w-1/3"
               dismissableMask>
      <create-recruitment-process @post-created="handlePostCreated"/>
    </pv-dialog>
  </div>
  <div v-else>
    <div class="flex items-center justify-center">
      <pv-spinner />
    </div>
  </div>
</template>



<script>
import CreateRecruitmentProcess from "../components/create-recruitment-process.component.vue";
import { useUserStore } from "../../shared/store/user-store.store.js";
import { RecruitmentApiService } from "../../shared/services/recruitment.service.js";
import JobPostCard from "../../shared/components/job-post-card.component.vue";

export default {
  name: "RecruitmentsListPage",
  components: {JobPostCard, CreateRecruitmentProcess },
  data() {
    return {
      recruitmentProcesses: null,
      recruitmentProcessService: new RecruitmentApiService(),
      createRecruitmentProcessDialog: false,
      page: 1,
      pageSize: 8,
      searchTerm: '',
      filteredRecruitmentProcesses: [],
    };
  },
  created() {
    const userStore = useUserStore();
    const companyId = userStore.user.company.id;
    this.fetchRecruitmentProcesses(companyId);
  },
  computed: {
    displayedRecruitmentProcesses() {
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredRecruitmentProcesses.slice(startIndex, endIndex);
    }
  },
  methods: {
    openCreateRecruitmentProcess() {
      this.createRecruitmentProcessDialog = true;
    },
    fetchRecruitmentProcesses(companyId) {
      this.recruitmentProcessService
          .getRecruitmentProcessesByCompanyId(companyId)
          .then((response) => {
            this.recruitmentProcesses = response.data.reverse();
            this.filteredRecruitmentProcesses = this.recruitmentProcesses;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    handlePostCreated() {
      const userStore = useUserStore();
      const companyId = userStore.user.company.id;
      this.fetchRecruitmentProcesses(companyId);
      this.createRecruitmentProcessDialog = false;
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
    }
  }
};
</script>