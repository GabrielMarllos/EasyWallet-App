<template>
  <div class="flex flex-col bg-white dark:bg-black rounded-xl shadow-lg gap-4 p-8">
    <p class="text-3xl text-center font-bold">{{ $t('app-settings.title') }}</p>
    <hr class="mb-4">
    <div class="flex flex-wrap items-center gap-6">
      <p class="text-xl font-semibold">{{ $t('app-settings.lang-switcher-label') }}</p>
      <language-switcher />
    </div>
    <div class="flex flex-col justify-center items-start gap-6">
      <p class="text-xl font-semibold">{{ $t('app-settings.theme-switcher-label') }}</p>
      <theme-switcher />
    </div>
  </div>
</template>

<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import ThemeSwitcher from "./theme-switcher.component.vue";

export default {
  name: "app-settings-form",
  components: {ThemeSwitcher, LanguageSwitcher}
}
</script>

<style scoped>
  
</style>