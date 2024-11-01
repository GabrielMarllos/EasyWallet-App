<template>
  <form v-on:submit="login($event)" class="bg-white dark:bg-black shadow-xl rounded px-8 pt-6 pb-8">
    <div class="flex flex-col space-y-6">
        <div class="flex justify-center">
          <img class="h-8 w-auto" src="/jobsync-logo.png" alt="JobSync Logo">
        </div>
        <div>
          <h1 class="text-center font-bold text-3xl">{{ $t('auth.login') }}</h1>
        </div>
        <div class="w-full">
          <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="email">
            {{ $t('auth.e-mail') }}
          </label>
          <pv-input id="email" class="w-full" v-model="email" placeholder="Enter your email" type="email" required />
        </div>
      <div class="w-full">
        <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="password">
          {{ $t('auth.password') }}
        </label>
        <div class="flex w-full">
          <pv-input id="password"
                    class="w-full"
                    v-model="password"
                    :type="this.isPassword"
                    placeholder="••••••••••••" required
          />
          <pv-button
              :icon="this.isPassword === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'"
              severity="secondary"
              @click="switchVisiblePassword"
          />
        </div>
      </div>
      <pv-button type="submit"
                 :label="isLoggingIn ? $t('auth.logging-in') : $t('auth.login')"
                 :disabled="isLoggingIn"
      />
      <div class="grid place-items-center">
        <p class="text-primary">
          <router-link to="/forgot-password" class="hover:font-medium">{{ $t('auth.forgot-password') }}</router-link>
        </p>
        <p>{{ $t('auth.account-question') }}
          <router-link class="hover:font-medium text-primary" to="register">{{ $t('auth.sign-up') }}</router-link>
        </p>
      </div>
    </div>
  </form>
</template>

<script>
import {AuthApiService} from "../services/authApiService.js";
import {useUserStore} from "../../shared/store/user-store.store.js";

export default {
  name: "login-form",
  data() {
    return {
      email: '',
      password: '',
      authApi: new AuthApiService(),
      isLoggingIn: false,
      isPassword: 'password'
    }
  },
  methods: {
    switchVisiblePassword() {
      this.isPassword = this.isPassword === 'password' ? '' : 'password';
    },
    login(event) {
      event.preventDefault();
      const userStore = useUserStore();

      this.isLoggingIn = true;

      this.authApi.signIn(this.email, this.password)
        .then(res => {
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
    }
  }
}
</script>

<style scoped>

</style>