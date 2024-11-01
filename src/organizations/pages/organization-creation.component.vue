<template>
  <div class="flex justify-center">
    <div class="py-4">
      <organization-creation-form />
    </div>
  </div>
</template>

<script>
import OrganizationCreationForm from "../components/organization-creation-form.component.vue";

export default {
  name: "organization-creation",
  components: {OrganizationCreationForm},
}
</script>

<style scoped>

</style>