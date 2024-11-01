<template>
  <pv-dropdown
    v-model="locale"
    :options="languages"
  />
</template>

<script>
export default {
  name: "language-switcher",
  data() {
    return {
      languages: ['English', 'Español'],
      locale: null
    }
  },
  created() {
    this.locale = this.getCurrentLanguage();
  },
  methods: {
    getCurrentLanguage() {
      this.$i18n.locale = localStorage.getItem("preferred-language") ?? "en";
      switch(this.$i18n.locale) {
        case 'en': return 'English';
        case 'es': return 'Español';
        default: return 'English';
      }
    }
  },
  watch: {
    locale(selectedLanguage) {
      this.$i18n.locale = selectedLanguage.slice(0, 2).toLowerCase();
      localStorage.setItem("preferred-language", this.$i18n.locale);
    }
  }
}
</script>

<style scoped>

</style>