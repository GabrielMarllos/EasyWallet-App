<template>
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
</template>

<script>
export default {
  name: "recover-password-form"
}
</script>

<style scoped>

</style>