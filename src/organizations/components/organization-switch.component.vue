<!--<template>-->
<!--  <button-->
<!--    class="hover:bg-white hover:bg-opacity-50 dark:hover:bg-slate-700 w-full flex px-6"-->
<!--    type="button"-->
<!--    @click="menuVisible = true">-->
<!--    <div class="flex justify-center items-center py-3 gap-2">-->
<!--      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">-->
<!--        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>-->
<!--      </svg>-->
<!--      {{ $t('navbar.switch-team') }}-->
<!--    </div>-->
<!--  </button>-->
<!--  <pv-dialog-->
<!--      v-model:visible="menuVisible" modal :position="menuPosition" :draggable="false"-->
<!--      :header="$t('navbar.switch-team')"-->
<!--      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"-->
<!--      class="w-1/5 overflow-auto">-->
<!--    <div v-for="organization in organizations">-->
<!--      <button @click="switchOrganization"-->
<!--              class="hover:bg-slate-300 hover:bg-opacity-50 dark:hover:bg-slate-700 w-full px-2 py-2 rounded-lg">-->
<!--        <div class="flex items-center gap-1">-->
<!--          <img class="rounded-lg w-auto h-10 object-cover"-->
<!--               :src=organization.avatarUrl-->
<!--               :alt="organization.name + ' icon'"/>-->
<!--          <h2 class="text-md">{{ organization.name }}</h2>-->
<!--        </div>-->
<!--      </button>-->
<!--    </div>-->
<!--    <router-link to="/organizations/create" @click="menuVisible = false">-->
<!--      <div class="bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-500 hover:bg-opacity-70 duration-300 w-full px-2 py-2 rounded-lg">-->
<!--        <h2  class="flex justify-center gap-2 items-center">-->
<!--          <i class="pi pi-plus"></i>-->
<!--          {{ $t('navbar.create-organization')}}-->
<!--        </h2>-->
<!--      </div>-->
<!--    </router-link>-->
<!--  </pv-dialog>-->
<!--</template>-->

<!--<script>-->
<!--import { OrganizationApiService } from "../../shared/services/organizations.service.js";-->

<!--export default {-->
<!--  name: "organization-selection",-->
<!--  data() {-->
<!--    return {-->
<!--      organizations: [],-->
<!--      organizationsApi: new OrganizationApiService(),-->
<!--      menuVisible: false,-->
<!--      menuPosition: 'topleft',-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    this.organizationsApi.getAll().then((response) => {-->
<!--      this.organizations = response.data;-->
<!--    });-->
<!--  },-->
<!--  methods: {-->
<!--    switchOrganization() {-->
<!--      this.menuVisible = false;-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--</style>-->