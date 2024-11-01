<template>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-full max-w-xl">
        <password-forgot-form/>
      </div>
    </div>
</template>
  
<script>
import PasswordForgotForm from "../components/password-forgot-form.component.vue";

export default {
  name: "password-forgot",
  components: {PasswordForgotForm}
}
</script>

<style scoped>

</style>