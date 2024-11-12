<template>
  <div class="bg-container min-h-screen W-full flex items-center justify-center">
    <form class="bg-white dark:bg-black shadow-xl rounded px-8 pt-6 pb-8">
      <div class="flex flex-col space-y-6">
        <div>
          <h1 class="text-left font-bold text-3xl">
            {{ $t('auth.password-forgot.title') }}
          </h1>
        </div>
        <div>
          <p class="text-gray-500 dark:text-white">
            {{ $t('auth.password-forgot.description') }}
          </p>
        </div>
        <div class="w-full">
          <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="email">
            {{ $t('auth.e-mail') }}
          </label>
          <pv-input id="password" class="w-full" placeholder="example@mail.com" type="email" />
        </div>
        <pv-button type="submit" label="Send me the link"/>
        <div class="grid place-items-center">
          <p>   {{ $t('auth.password-forgot.go-back') }}
            <router-link to="/login">
            <span class="hover:font-medium text-primary">
                {{ $t('auth.login') }}
            </span>
            </router-link>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
    name: "password-forgot-form"
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