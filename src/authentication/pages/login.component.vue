<template>
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="w-full max-w-xl">
      <login-form />
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/login-form.component.vue";

export default {
  name: "login",
  components: {LoginForm}
}
</script>

<style scoped>

</style>