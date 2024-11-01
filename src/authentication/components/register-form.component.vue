<template>
  <div>
    <div class="bg-white dark:bg-black shadow-xl rounded px-8 pt-6 pb-8">
      <div class="flex flex-col space-y-6">
        <div class="flex justify-center">
          <img class="h-8 w-auto" src="/jobsync-logo.png" alt="JobSync Logo">
        </div>
        <div>
          <h1 class="text-center font-bold text-3xl">{{ $t('auth.sign-up-title') }}</h1>
        </div>
        <div class="grid grid-cols-2 font-medium gap-8">
          <button
              aria-label="Activate candidate form"
              class="rounded py-3"
              :class="[isApplicant ? 'bg-primary text-white' : 'border-2 border-primary text-primary']"
              @click="setIsApplicant(true)"
          >
            {{ $t('auth.candidate') }}
          </button>
          <button
              aria-label="Activate recruiter form"
              class="rounded py-3"
              :class="[!isApplicant ? 'bg-primary text-white' : 'border-2 border-primary text-primary']"
              @click="setIsApplicant(false)"
          >
            {{ $t('auth.recruiter') }}
          </button>
        </div>
        <form
            v-on:submit="register($event)"
            class="flex flex-col space-y-3"
        >
          <div class="grid grid-cols-2 items-end gap-4">
            <div>
              <label for="first-name">{{ $t('auth.first-name') }}</label>
              <pv-input
                  required
                  id="first-name"
                  class="w-full"
                  v-model="firstName"
                  :placeholder="$t('auth.first-name')"
                  type="text"
              />
            </div>
            <div>
              <label for="last-name">{{ $t('auth.first-name') }}</label>
              <pv-input
                  required
                  id="last-name"
                  class="w-full"
                  v-model="lastName"
                  :placeholder="$t('auth.last-name')"
                  type="text"
              />
            </div>
          </div>
          <div>
            <label for="email">{{ $t('auth.e-mail') }}</label>
            <pv-input
                required
                id="email"
                class="w-full"
                v-model="email"
                placeholder="example@mail.com"
                type="email"
            />
          </div>
          <div class="flex flex-cols place-items-end gap-2">
            <div class="grid grid-cols-2 items-end gap-4">
              <div>
                <label for="password">{{ $t('auth.password') }}</label>
                <pv-input
                    required
                    id="password"
                    class="w-full"
                    v-model="password"
                    :type="this.isPassword"
                    placeholder="••••••••••••"
                />
              </div>
              <div>
                <label for="confirm-password">{{ $t('auth.confirm-password') }}</label>
                <pv-input
                    required
                    id="confirm-password"
                    class="w-full"
                    v-model="confirmPassword"
                    :type="this.isPassword"
                    placeholder="••••••••••••"
                />
              </div>
            </div>
            <div>
              <pv-button
                  :icon="this.isPassword === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'"
                  severity="secondary"
                  @click="switchVisiblePassword"
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
          <pv-button type="submit" :label="$t('auth.sign-up')"/>
          <p class="text-center my-4">{{ $t('auth.have-account-question') }}<router-link class="hover:font-medium text-primary" to="/login">{{ $t('auth.sign-title') }}</router-link></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {CountriesApiService} from "../../shared/services/countries.service.js";
import {AuthApiService} from "../services/authApiService.js";
import {useUserStore} from "../../shared/store/user-store.store.js";
export default {
  name: "register-form",
  data() {
    return {
      isPassword: 'password',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: null,
      isApplicant: true,
      countries: [],
      countriesApi: new CountriesApiService(),
      selectedCountry: '',
      authApi: new AuthApiService(),
      avatars: [
        'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
        'https://www.svgrepo.com/show/420364/avatar-male-man.svg',
        'https://www.svgrepo.com/show/420328/avatar-female-girl.svg',
        'https://www.svgrepo.com/show/420346/afro-avatar-male-2.svg',
        'https://www.svgrepo.com/show/420347/avatar-einstein-professor.svg',
        'https://www.svgrepo.com/show/420333/afro-avatar-male.svg',
        'https://www.svgrepo.com/show/420360/avatar-batman-comics.svg',
        'https://www.svgrepo.com/show/420336/indian-male-man.svg',
        'https://www.svgrepo.com/show/420329/anime-away-face.svg',
        'https://www.svgrepo.com/show/420326/afro-female-person.svg',
        'https://www.svgrepo.com/show/420341/avatar-geisha-japanese.svg',
        'https://www.svgrepo.com/show/420339/boy-indian-kid.svg',
        'https://www.svgrepo.com/show/420331/avatar-lazybones-sloth.svg',
        'https://www.svgrepo.com/show/420324/beard-hipster-male.svg',
        'https://www.svgrepo.com/show/420355/animal-avatar-mutton.svg',
      ],
    }
  },
  created() {
    this.loadCountries();
  },
  methods: {
    switchVisiblePassword() {
      this.isPassword = this.isPassword === 'password' ? '' : 'password';
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
    setIsApplicant(state) {
      this.isApplicant = state;
    },
    register(event) {
      event.preventDefault();

      if (this.confirmPassword !== this.password) {
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Passwords do not match",
          life: 1000
        });
        return;
      }

      if (this.isApplicant === true) {
        this.authApi.signUpApplicant(
            this.firstName,
            this.lastName,
            this.selectedCountry,
            this.email,
            this.password,
            this.phoneNumber.toString(),
            this.avatars[Math.floor(Math.random() * this.avatars.length)]
        )
          .then(res => {
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: `Account created, logging in..`,
              life: 2000
            });

            this.authApi.signIn(this.email, this.password)
                .then(res => {
                  const userStore = useUserStore();

                  if (res.data.token) {
                    localStorage.setItem('auth', JSON.stringify(res.data));
                  }
                  userStore.login(res.data);

                  this.$toast.add({
                    severity: "success",
                    summary: "JobSync",
                    detail: "Logged in",
                    life: 2000
                  });

                  this.$router.push("/")
                })
                .catch(err => this.$toast.add({
                  severity: "warn",
                  detail: "Invalid email or password",
                  life: 2000
                }))
                .finally(() =>
                    this.isLoggingIn = false
                );
          })
          .catch(err => {
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: err.response.data.message,
              life: 2000
            });
          }
        )
      }
      else {
        this.authApi.signUpRecruiter(
          this.firstName,
          this.lastName,
          this.selectedCountry,
          this.email,
          this.password,
          this.phoneNumber.toString(),
          this.avatars[Math.floor(Math.random() * this.avatars.length)]
        )
          .then(res => {
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: ` Redirecting to login...`,
              life: 2000
            });
            setTimeout(() => {
              this.$router.push("/login");
            }, 2000);
          })
          .catch(err => {
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: err.response.data.message,
              life: 2000
            });
          }
        )
      }
    }
  }
}
</script>

<style scoped>

</style>