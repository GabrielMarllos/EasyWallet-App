<template>
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="w-full max-w-xl">
      <password-recovery-form/>
    </div>
  </div>
</template>

<script>
import PasswordRecoveryForm from "../components/password-recovery-form.component.vue";

export default {
  name: "password-recovery",
  components: {PasswordRecoveryForm}
}
</script>

<style scoped>

</style>