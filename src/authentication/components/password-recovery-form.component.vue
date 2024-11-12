<template>
  <div class="bg-container min-h-screen W-full flex items-center justify-center">
    <form class="bg-white dark:bg-black shadow-xl rounded px-8 pt-6 pb-8">
      <div class="flex flex-col space-y-6">
        <div>
          <h1 class="text-left font-bold text-3xl">{{ $t('auth.password-recovery.title') }}</h1>
        </div>
        <div>
          <p class="text-gray-500 dark:text-white">{{ $t('auth.password-recovery.enter-new-password') }}</p>
        </div>
        <div class="w-full">
          <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="password">
            {{ $t('auth.password') }}
          </label>
          <pv-input id="password" class="w-full" placeholder="••••••••••••" type="password  " />
        </div>
        <div class="w-full">
          <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="password">
            {{ $t('auth.confirm-password') }}
          </label>
          <pv-input id="password" class="w-full" type="password" placeholder="••••••••••••" />
        </div>
        <pv-button type="submit" label="Change Password" />
        <div class="grid place-items-center">
          <p>{{ $t('auth.password-recovery.go-back') }}
            <router-link to="/login">
              <span class="hover:font-medium text-primary">{{ $t('auth.login') }}</span>
            </router-link>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "recover-password-form"
}
</script>

<style scoped>
.bg-container {
  background-image: url('../../../public/login-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.3); /* Color blanco semitransparente */
  background-blend-mode: lighten; /* Mezcla el blanco con la imagen */
}
</style>