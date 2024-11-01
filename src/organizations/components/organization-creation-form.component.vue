<template>
  <form v-on:submit.prevent="createCompany" class="flex flex-col bg-white dark:bg-black rounded-xl shadow-lg gap-4 p-8">
    <p class="text-3xl text-center font-bold">{{ $t('create-org.title') }}</p>
    <div class="flex flex-col items-center gap-4 py-8">
      <img :src="previewImage ?? '/organization-placeholder.png'" alt="Organization preview image"
           class="h-44 w-44 object-cover rounded-full border-2 border-black p-3">
      <div class="flex justify-center items-center gap-3">
        <pv-file-upload ref="fileUpload" mode="basic" v-model="file" accept="image/*"
                        :chooseLabel="$t('create-org.choose-picture')" :maxFileSize="5000000"
                        @select="selectedFile"/>
        <pv-button v-if="previewImage" icon="pi pi-trash" severity="danger" @click="clearImageUpload"/>
      </div>
    </div>
    <div>
      <p>{{ $t('create-org.company-name') }}</p>
      <pv-input class="w-full" placeholder="JobSync Inc." required v-model="name"/>
    </div>
    <div>
      <p>{{ $t('create-org.company-description') }}</p>
      <pv-textarea class="w-full" v-model="description"/>
    </div>
    <div class="grid grid-cols-2 items-end gap-4">
      <div>
        <label for="country">{{ $t('create-org.country') }}</label>
        <pv-dropdown required id="country" class="w-full" v-model="country" :options="countries"
                     :placeholder="$t('create-org.select-country')"/>
      </div>
      <div>
        <label for="industry">{{ $t('create-org.industry') }}</label>
        <pv-input id="industry" required class="w-full" v-model="industry"/>
      </div>
    </div>
    <div>
      <p>{{ $t('create-org.company-address') }}</p>
      <pv-input class="w-full" :placeholder="$t('create-org.address-placeholder')" required v-model="address"/>
    </div>
    <div>
      <p>{{ $t('create-org.website') }}</p>
      <pv-input class="w-full" placeholder="jobsync.com" required v-model="website"/>
    </div>
    <pv-message severity="info" :closable="false">{{ $t('create-org.add-members-msg') }}</pv-message>
    <pv-button type="submit" :label="$t('create-org.create-organization')"/>
  </form>
</template>

<script>
import { CountriesApiService } from "../../shared/services/countries.service.js";
import { useUserStore } from "../../shared/store/user-store.store.js";
import { CompaniesService } from "../service/companies.service.js";
import { getUser } from "../../shared/services/user.js";
import { ApplicantsService } from "../../applicant/service/applicants.service.js";
import { UsersApiService } from "../../shared/services/users.service.js";

export default {
  name: "organization-creation-form",
  data() {
    return {
      reader: new FileReader(),
      file: null,
      previewImage: null,
      countries: [],
      name: '',
      description: '',
      country: '',
      address: '',
      logoUrl: '',
      website: '',
      industry: '',
      countriesApi: new CountriesApiService(),
      companiesApi: new CompaniesService(),
      applicantApi: new ApplicantsService(),
      usersApi: new UsersApiService(),
    };
  },
  created() {
    this.loadCountries();
  },
  methods: {
    loadCountries() {
      this.countriesApi.getCountries()
          .then(response => {
            this.countries = response.data.map(countryData => countryData.name.common);
            this.countries.sort();
          })
          .catch(e => {
            this.countries.push("Error loading countries");
          });
    },
    selectedFile(event) {
      const file = event.files[0];
      this.reader.onload = (e) => this.previewImage = e.target.result;
      this.reader.readAsDataURL(file);
    },
    clearImageUpload() {
      this.file = null;
      this.previewImage = null;
      this.$refs.fileUpload.clear();
    },
    updateUser() {
      const userStore = useUserStore();
      const userId = userStore.user.id;
      this.usersApi.getById(userId)
          .then((response) => {
            const userStore = useUserStore();
            // Persist updated user info to localStorage
            localStorage.setItem('auth', JSON.stringify({
              isAuthenticated: userStore.isAuthenticated,
              user: response.data,
              role: userStore.role,
              hasCompany: response.data.company !== null,
              token: userStore.token
            }));
            console.log('User updated', response.data.company);

            userStore.hasCompany = response.data.company !== null;
            userStore.user = response.data;
            userStore.role = response.data.role;

            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Company created successfully',
              life: 1000
            });

            this.$router.push('/recruitments');
          }).catch((error) => {
        console.error(error);
      });
    },
    createCompany(event) {
      event.preventDefault();

      const userStore = useUserStore();
      const recruiterId = userStore.user.id;

      const companyData = {
        name: this.name,
        description: this.description,
        country: this.country,
        address: this.address,
        logoUrl: 'https://planetajob.es/api/uploads/company_logos/no_logo.png',
        website: this.website,
        industry: this.industry,
      };

      this.companiesApi.createCompany(companyData, recruiterId)
          .then(() => {
            this.updateUser();
          })
          .catch((e) => {
            this.$toast.add({severity: 'error', summary: 'Error', detail: 'Failed to create company. The company name may be already taken.', life: 1000});
            console.log(e);
          });
    },
  },
};
</script>