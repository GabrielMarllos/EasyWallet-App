<template>
  <pv-toast />
  <navbar :user="user" />
  <div class="container mx-auto py-8 px-2">
    <RouterView />
  </div>
</template>

<script>
import { useThemeStore } from "./settings/stores/app-theme.store.js";
import { useUserStore } from "./shared/store/user-store.store.js";
import Navbar from "./shared/components/navbar.component.vue";

export default {
  components: { Navbar },
  data() {
    return {
      user: {}, // Initialize user as an empty object
    };
  },
  created() {
    this.$i18n.locale = localStorage.getItem("preferred-language") ?? "en";
    const user = localStorage.getItem("auth");

    if (user) {
      this.user = JSON.parse(user).user;
    }
  },
  computed: {
    theme() {
      return useThemeStore().theme;
    },
    storedUser() {
      return useUserStore().user;
    }
  },
  watch: {
    theme(newTheme) {
      const store = useThemeStore();
      store.setTheme(newTheme);
    },
    storedUser(newUser) {
      if (newUser) {
        this.user = newUser;
      }
    }
  },
  mounted() {
    const userStore = useUserStore();
    const userData = localStorage.getItem('auth');

    if (userData) {
      userStore.login(JSON.parse(userData));
    }

    const themeStore = useThemeStore();
    const theme = localStorage.getItem('theme');
    themeStore.setTheme(theme);
  },
}
</script>