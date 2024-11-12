<template>
  <div class="absolute inset-0 flex items-center justify-start">
    <div class="w-full max-w-xl">
      <register-form/>
    </div>
  </div>
</template>

<script>
import RegisterForm from "../components/register-form.component.vue";

export default {
  name: "register",
  components: {RegisterForm}
}
</script>

<style scoped>

</style>