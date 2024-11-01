<template>
  <div class="grid grid-cols-2 w-full">
    <theme-item
      themeId="light"
      :name="$t('settings.theme.light')"
      class-theme="light-theme"
    />
    <theme-item
      themeId="dark"
      :name="$t('settings.theme.dark')"
      class-theme="dark-theme"
    />
  </div>
</template>

<script>
import ThemeItem from "./theme-item.component.vue";

export default {
  name: "theme-switcher",
  components: {ThemeItem}
}
</script>

<style>
  .light-theme {
    background-color: #f5f9ff;
  }
  .dark-theme {
    background-color: rgb(15 23 42);
  }
</style>