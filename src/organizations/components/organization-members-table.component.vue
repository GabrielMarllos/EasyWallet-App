<!--<template>-->
<!--  <pv-data-table-->
<!--      :value="members"-->
<!--      tableStyle="min-width: 50rem"-->
<!--      paginator :rows="5" :rowsPerPageOptions="[5, 10, 20]">-->
<!--    <template #header>-->
<!--      <div class="flex flex-wrap align-items-center justify-content-between gap-2">-->
<!--        <span class="text-xl text-900 font-bold">{{ $t('organization-profile.members-table.members-title') }}</span>-->
<!--      </div>-->
<!--    </template>-->
<!--    <pv-column :header="$t('organization-profile.members-table.name-header')">-->
<!--      <template #body="member">-->
<!--        <div class="flex items-center gap-2">-->
<!--          <img alt="Member Profile Picture"-->
<!--               :src="member.data.user.profileImageUrl"-->
<!--               class="w-12 h-12 rounded-full object-cover" />-->
<!--          <span>{{ member.data.user.name }}</span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </pv-column>-->
<!--    <pv-column :header="$t('organization-profile.members-table.phone-header')">-->
<!--      <template #body="member">-->
<!--        <div class="flex items-center gap-2">-->
<!--          <span>{{ member.data.user.phoneNumber }}</span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </pv-column>-->
<!--    <pv-column :header="$t('organization-profile.members-table.phone-header')">-->
<!--      <template #body="member">-->
<!--        <div class="flex items-center gap-2">-->
<!--          <span>{{ member.data.user.email }}</span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </pv-column>-->
<!--    <pv-column :header="$t('organization-profile.members-table.role-header')">-->
<!--      <template #body="member">-->
<!--        <div class="flex items-center gap-2">-->
<!--          <span>{{ member.data.role }}</span>-->
<!--          <pv-button icon="pi pi-pencil" severity="help" text rounded aria-label="Edit" />-->
<!--        </div>-->
<!--      </template>-->
<!--    </pv-column>-->
<!--  </pv-data-table>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: "members-table",-->
<!--  props: {-->
<!--    members: {-->
<!--      type: Array,-->
<!--      required: true-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--</style>-->