<template>
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
</template>

<script>
export default {
    name: "password-forgot-form"
}
</script>

<style scoped>
</style>