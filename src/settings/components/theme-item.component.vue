<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <button
        class="rounded-full w-24 h-24 p-1"
        :class="[
        themeName === this.themeId
          ? 'border-2 border-black dark:border-white'
          : 'border hover:border-2 border-gray-500'
      ]"
        @click="changeTheme(this.themeId)"
    >
      <div :class="classTheme" class='w-full h-full rounded-full' />
    </button>
    <p class="text-center font-medium capitalize">{{ name }}</p>
  </div>
</template>

<script>
import {useThemeStore} from "../stores/app-theme.store.js";
import {computed} from "vue";
export default {
  name: "theme-item",
  props: {
    themeId: '',
    name: '',
    classTheme: ''
  },
  setup() {
    const themeStore = useThemeStore();
    const themeName = computed(() => themeStore.theme);

    function changeTheme(newTheme) {
      themeStore.setTheme(newTheme);
    }

    return {
      themeName,
      changeTheme
    };
  },
}
</script>

<style scoped>
</style>