<template>
  <div class="flex items-center justify-center" v-if="this.user">
    <div class="bg-white dark:bg-black shadow-xl rounded px-8 pt-6 pb-8">
      <div class="flex flex-col space-y-6">
        <div>
          <h1 class="text-center font-bold text-3xl">{{ $t('auth.edit-profile') }}</h1>
        </div>
        <div class="flex justify-center">
          <div class="h-48 w-48 shadow rounded-full overflow-hidden">
            <img class="h-full w-full object-cover" :src="this.profilePictureUrl" alt="User profile picture" />
          </div>
        </div>
        <div class="grid">
          <h1 class="text-center font-bold text-3xl">{{this.user.firstname + " " + this.user.lastname}}</h1>
          <p class="text-center text-xl">{{this.user.email}}</p>
        </div>
        <form v-on:submit="saveChanges($event)" class="flex flex-col space-y-3">
          <div class="justify-center flex items-center">
            <pv-file-upload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000"
                            @select="selectedFile"
            />
          </div>
          <div class="grid grid-cols-2 items-end gap-4">
            <div>
              <label for="first-name">{{ $t('auth.first-name') }}</label>
              <pv-input
                  required
                  id="first-name"
                  class="w-full"
                  v-model="firstname"
                  :placeholder="$t('auth.first-name')"
                  type="text"
              />
            </div>
            <div>
              <label for="last-name">{{ $t('auth.last-name') }}</label>
              <pv-input
                  required
                  id="last-name"
                  class="w-full"
                  v-model="lastname"
                  :placeholder="$t('auth.last-name')"
                  type="text"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 items-end gap-4">
            <div>
              <label for="country">{{ $t('auth.country') }}</label>
              <pv-dropdown
                  required
                  id="country"
                  class="w-full"
                  v-model="selectedCountry"
                  :options="countries"
                  :placeholder="$t('auth.select-country')"
              />
            </div>
            <div>
              <label for="phone-number">{{ $t('auth.phone-number') }}</label>
              <pv-input
                  required
                  id="phone-number"
                  class="w-full"
                  v-model="phoneNumber"
                  type="number"
              />
            </div>
          </div>
          <pv-button type="submit" :label="$t('auth.save-changes')" />
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
import {CountriesApiService} from "../../shared/services/countries.service.js";
import {getUser} from "../../shared/services/user.js";
import {UsersApiService} from "../../shared/services/users.service.js";
import {useUserStore} from "../../shared/store/user-store.store.js";
export default {
  name: "user-profile-form",
  data() {
    return {
      firstname: '',
      lastname: '',
      phoneNumber: '',
      selectedCountry: '',
      profilePictureUrl: '',
      countries: [],
      countriesApi: new CountriesApiService(),
      userApi: new UsersApiService(),
      user:null,

      profilePictureFile: null
    }
  },
  created() {
    this.loadCountries();

    this.userApi.getById(getUser().id).then(
        response => {
          this.user = response.data;
          this.updateForm();
        }
    ).catch(e => {
      console.log(e);
    });
  },
  methods: {
    updateForm () {
      this.firstname = this.user.firstname;
      this.lastname = this.user.lastname;
      this.phoneNumber = this.user.phoneNumber;
      this.selectedCountry = this.user.country;
      this.profilePictureUrl = this.user.profilePictureUrl;
    },
    loadCountries() {
      this.countriesApi.getCountries()
          .then(response => {
            this.countries = response.data.map(countryData => countryData.name.common);
            this.countries.sort();
          })
          .catch(e => {
            this.countries.push("Error loading countries");
          })
    },
    selectedFile(event) {
      const file = event.files[0];
      this.profilePictureFile = file;

      if (file) {
        try {
          this.profilePictureUrl = URL.createObjectURL(file);
        } catch (error) {
          this.$toast.add({
            severity: "warn",
            detail: "Error uploading file",
            summary: error,
            life: 2000
          });
        }
      } else {
        this.$toast.add({
          severity: "warn",
          detail: "Invalid file type",
          summary: error.response.data.message,
          life: 2000
        });
      }
    },
    uploadPicture(){
      this.userApi.changeProfilePicture(this.user.id, this.profilePictureFile)
          .then(response => {
            this.profilePictureUrl = response.data.profilePictureUrl;
            this.updateUser();
          })
          .catch(e => {
            console.error(e.response);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Error uploading profile picture",
              life: 1000
            });
          });
    },
    updateUser(){
      this.userApi.updateById(this.user.id, {
        firstname: this.firstname,
        lastname: this.lastname,
        phoneNumber: this.phoneNumber,
        profilePictureUrl: this.profilePictureUrl,
        country: this.selectedCountry,
      })
          .then(response => {
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "User updated successfully",
              life: 1000
            });
            const userStore = useUserStore();
            userStore.updateUser();
          })
          .catch(e => {
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Error updating user",
              life: 1000
            });
          });
    },
    saveChanges(event) {
      event.preventDefault();

      this.user.firstname = this.firstname;
      this.user.lastname = this.lastname;
      this.user.phoneNumber = this.phoneNumber;
      this.user.country = this.selectedCountry;
      this.user.profilePicturUrl = this.profilePictureUrl;

      if (this.profilePictureFile !== null) {
        this.uploadPicture();
      }
      else {
        this.updateUser();
      }

      const userStore = useUserStore();
      userStore.updateUser();
      this.updateForm();
    },
  }
}
</script>