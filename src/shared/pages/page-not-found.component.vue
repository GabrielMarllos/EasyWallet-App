<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "page-not-found",
  data() {
    return {
      currentPath: ''
    }
  },
  created() {
    this.currentPath = this.$route.path;
  },
  methods: {
    goToHome() {
      this.$router.push('/');
    }
  }
})
</script>

<template>
  <section class="flex flex-col justify-center items-center w-full h-full gap-4">
    <img
      src="/not-found.png"
      :alt="$t('page-not-found.main-image-alt')"
      class="h-auto w-56"
    >
    <div class="text-center dark:text-white">
      <p class="text-xl font-bold">{{ $t('page-not-found.exclamation') }}</p>
      <p>{{ $t('page-not-found.message') }}</p>
      <p class="text-sm">{{ currentPath }} {{ $t('page-not-found.doesnt-exist') }}</p>
    </div>
    <pv-button
      rounded
      :label="$t('page-not-found.go-back-to-home')"
      class="text-black dark:text-white"
      @click="goToHome()"
    />
  </section>
</template>

<style scoped>

</style>