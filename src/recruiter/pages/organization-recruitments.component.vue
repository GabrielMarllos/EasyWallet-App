<!--<template>-->
<!--  <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">-->
<!--    <div class="flex flex-col gap-4">-->
<!--      <pv-button-->
<!--          rounded-->
<!--          @click="$router.back()"-->
<!--          :label="$t('general.go-back-btn-label')"-->
<!--          icon="pi pi-arrow-left"-->
<!--      />-->
<!--      <pv-button-->
<!--          rounded-->
<!--          aria-label="Create Recruitment"-->
<!--          :label="$t('organization-profile.new-recruitment-btn-label')"-->
<!--          @click="createRecruitmentDialog = true"-->
<!--      />-->
<!--      <pv-button-->
<!--          rounded-->
<!--          aria-label="Recruitments History"-->
<!--          :label="$t('organization-profile.past-recruitment-btn-label')"-->
<!--          @click="recruitmentsHistory = true"-->
<!--      />-->
<!--      <pv-button-->
<!--          rounded-->
<!--          aria-label="Candidates History"-->
<!--          :label="$t('organization-profile.past-candidates-btn-label')"-->
<!--          @click="candidatesHistory = true"-->
<!--      />-->
<!--    </div>-->
<!--    <div class="grid space-y-4 overflow-y-auto">-->
<!--      <h1 v-if="recruitments.length === 0">-->
<!--        {{ $t('recruitment.no-recruitments-found-message') }}-->
<!--      </h1>-->
<!--      <recruitment-card-->
<!--          v-for="recruitment in recruitments.slice().reverse()"-->
<!--          :recruitment="recruitment"-->
<!--      />-->
<!--    </div>-->
<!--  </div>-->

<!--  <pv-dialog v-model:visible="createRecruitmentDialog"-->
<!--             modal-->
<!--             class="w-1/3"-->
<!--             :header="$t('recruitment.create-recruitment.title')">-->
<!--    <form v-on:submit="saveRecruitment($event)">-->
<!--      <div class="grid gap-2">-->
<!--        <pv-input-->
<!--            required-->
<!--            v-model="processTitle"-->
<!--            type="text"-->
<!--            :placeholder="$t('recruitment.create-recruitment.title-placeholder')"-->
<!--        />-->
<!--        <pv-input-->
<!--            v-model="processDescription"-->
<!--            type="text"-->
<!--            :placeholder="$t('recruitment.create-recruitment.description-placeholder')"-->
<!--        />-->
<!--        <div class="grid grid-cols-2 gap-2">-->
<!--          <div>-->
<!--            <label for="starting-date">{{$t('recruitment.create-recruitment.starting-date-lbl')}}</label>-->
<!--            <pv-calendar required v-model="startingDate" inputId="starting-date" />-->
<!--          </div>-->
<!--          <div>-->
<!--            <label for="ending-date">{{$t('recruitment.create-recruitment.ending-date-lbl')}}</label>-->
<!--            <pv-calendar required v-model="endingDate" inputId="ending-date" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <pv-button type="submit" :label="$t('recruitment.create-recruitment.create-submit-lbl')" />-->
<!--      </div>-->
<!--    </form>-->
<!--  </pv-dialog>-->

<!--  <pv-dialog v-model:visible="recruitmentsHistory" modal header="Building">-->
<!--    <template #footer>-->
<!--      <pv-button label="Okay" icon="pi pi-times" @click="recruitmentsHistory = false" text />-->
<!--    </template>-->
<!--  </pv-dialog>-->

<!--  <pv-dialog v-model:visible="candidatesHistory" modal header="Building">-->
<!--    <template #footer>-->
<!--      <pv-button label="Okay" icon="pi pi-times" @click="candidatesHistory = false" text />-->
<!--    </template>-->
<!--  </pv-dialog>-->
<!--</template>-->

<!--<script>-->
<!--import RecruitmentCard from "../components/recruitment-card.component.vue";-->
<!--import {RecruitmentApiService} from "../../shared/services/recruitment.service.js";-->

<!--export default {-->
<!--  name: "organization-recruitments",-->
<!--  components: { RecruitmentCard },-->
<!--  data() {-->
<!--    return {-->
<!--      createRecruitmentDialog: false,-->
<!--      recruitmentsHistory: false,-->
<!--      candidatesHistory: false,-->
<!--      recruitments: [],-->
<!--      recruitmentApi: new RecruitmentApiService(),-->
<!--      processTitle: '',-->
<!--      processDescription: '',-->
<!--      startingDate: null,-->
<!--      endingDate: null,-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    this.recruitmentApi.getAll()-->
<!--        .then(response => this.recruitments = response.data)-->
<!--        .catch(e => {-->
<!--          this.$toast.add({-->
<!--            severity: "error",-->
<!--            summary: "Error loading recruitment processes",-->
<!--            detail: e.response.data,-->
<!--            life: 4000-->
<!--          });-->
<!--        });-->
<!--  },-->
<!--  methods: {-->
<!--    saveRecruitment(event){-->
<!--      event.preventDefault();-->

<!--      this.recruitmentApi.create({-->
<!--        name: this.processTitle,-->
<!--        description: this.processDescription,-->
<!--        startingDate: this.startingDate,-->
<!--        endingDate: this.endingDate,-->
<!--        status: true-->
<!--      }).then(response => {-->
<!--            this.createRecruitmentDialog = false;-->
<!--            this.recruitmentApi.getAll()-->
<!--                .then(response => this.recruitments = response.data);-->
<!--            this.$toast.add({-->
<!--              severity: "success",-->
<!--              summary: "New recruitment process created",-->
<!--              detail: response.data.message,-->
<!--              life: 3000-->
<!--            });-->
<!--          })-->
<!--          .catch(e => {-->
<!--            this.$toast.add({-->
<!--              severity: "error",-->
<!--              summary: "Error creating recruitment process",-->
<!--              detail: e.response.data,-->
<!--              life: 4000-->
<!--            });-->
<!--          });-->
<!--    },-->
<!--  }-->
<!--}-->

<!--</script>-->

<!--<style scoped>-->
<!--</style>-->