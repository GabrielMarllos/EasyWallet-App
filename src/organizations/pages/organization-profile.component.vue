<template>
  <div class="space-y-4">
    <div class="justify-center items-center">
      <div v-if="!this.company" class="flex items-center">
        <div class="flex items-center justify-center w-full">
          <pv-spinner />
        </div>
      </div>
      <div v-else>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="col-span-1">
            <organization-settings-form
                :isTheCurrentUserOwner="isTheCurrentUserOwner"
                :currentOrganization="company"
                @updatedCompany="updateCompanyInfo"
            />
          </div>
          <div class="col-span-1">
            <organization-members
                :isTheCurrentUserOwner="isTheCurrentUserOwner"
                :currentOrganization="company"
                @updatedCompany="updateCompanyInfo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrganizationSettingsForm from "../components/organization-settings-form.component.vue";
import {useUserStore} from "../../shared/store/user-store.store.js";
import {CompaniesService} from "../service/companies.service.js";
import OrganizationMembers from "../components/organization-members.component.vue";

export default {
  name: "organization-profile",
  components: {OrganizationMembers, OrganizationSettingsForm},
  data(){
    return {
      company: null,
      companyService: new CompaniesService(),
    }
  },
  created() {
    this.updateCompanyInfo();
  },
  computed: {
    isTheCurrentUserOwner() {
      const userStore = useUserStore();
      return userStore.user.id === userStore.user.company.recruiter_owner_id;
    },
  },
  methods: {
    updateCompanyInfo() {
      const userStore = useUserStore();
      this.companyService.getCompanyById(userStore.user.company.id)
          .then(response => {
            this.company = response.data;
          })
          .catch(error => {
            console.error(error);
          });

    }
  }
}
</script>

<style scoped>
</style>