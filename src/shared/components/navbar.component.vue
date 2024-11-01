<template>
  <pv-toolbar v-if="!isAnAuthenticationPath($route.path)" class="sticky top-0 z-50 shadow">
    <template #start>
      <div class="flex items-center gap-2 md:gap-4 lg:gap-6">
        <router-link to="/">
          <img src="/jobsync-logo.png" alt="JobSync Logo" class="h-6 w-auto md:w-auto lg:w-auto" />
        </router-link>
        <div class="hidden md:flex">
          <div v-if="user && user.role === 'ROLE_APPLICANT'" class="flex flex-col md:flex-row">
            <pv-button :label="$t('navbar.jobs')" text plain
                       @click="this.$router.push('/jobs')"
                       class="mb-2 md:mb-0 md:mr-2 lg:mr-4"
            />
            <pv-button :label="$t('navbar.applications')" text plain
                       @click="this.$router.push('/applications')"
                       class="mb-2 md:mb-0 md:mr-2 lg:mr-4"
            />
            <pv-button :label="$t('navbar.profile')" text plain
                       @click="this.$router.push('/profile')"
            />
          </div>
          <div v-else-if="user && user.role === 'ROLE_RECRUITER'" class="flex flex-col md:flex-row">
            <div v-if="user.company">
              <pv-button :label="$t('navbar.recruitments')" text plain
                         @click="this.$router.push('/recruitments')"
                         class="mb-2 md:mb-0 md:mr-2 lg:mr-4"
              />
              <pv-button :label="$t('navbar.company')" text plain
                         @click="this.$router.push('/company-profile')"
              />
            </div>
            <div v-else>
              <pv-button :label="$t('navbar.create-organization')" text plain
                         @click="this.$router.push('/company-create')"
              />
            </div>
          </div>
          <pv-button :label="$t('email')" text plain
                     @click="this.$router.push('/email')"
                     class="mb-2 md:mb-0 md:mr-2 lg:mr-4"
          />
        </div>
      </div>
    </template>
    <template #end>
      <div class="flex gap-4">
        <div class="sm:block md:hidden">
          <pv-button
              icon="pi pi-bars"
              text plain
              @click="this.visibleMobileBar = !this.visibleMobileBar"
          />
        </div>
        <pv-avatar
            shape="circle"
            :image="user && user.profilePictureUrl"
            class="flex justify-center items-center w-9 h-9 hover:cursor-pointer"
            @click="this.userOptions = !this.userOptions"
        >
          <img :src="user && user.profilePictureUrl" alt="profile" class="object-cover w-full h-full" />
        </pv-avatar>
      </div>
    </template>
  </pv-toolbar>
  <pv-dialog v-model:visible="userOptions" :header="greeting()"
             position="topright" :modal="true" :draggable="false" :dismissableMask="true">
    <div class="grid">
      <pv-button :label="$t('navbar.user')" text plain
                 @click="this.$router.push('/manage-profile'); this.userOptions = false"
      />
      <pv-button
          :label="$t('settings.title')" text plain
          @click="this.$router.push('/settings'); this.userOptions = false"
      />
      <pv-button
          :label="$t('auth.logout')" text plain
          @click="logout"
      />
    </div>
  </pv-dialog>

  <pv-dialog v-model:visible="visibleMobileBar"
             position="topright" :modal="true" :draggable="false" :dismissableMask="true">
    <div v-if="user && user.role === 'ROLE_APPLICANT'" class="grid">
      <pv-button :label="$t('navbar.jobs')" text plain
                 @click="this.$router.push('/jobs'); this.visibleMobileBar = false"
      />
      <pv-button :label="$t('navbar.applications')" text plain
                 @click="this.$router.push('/applications'); this.visibleMobileBar = false"
      />
      <pv-button :label="$t('navbar.profile')" text plain
                 @click="this.$router.push('/manage-profile'); this.visibleMobileBar = false"
      />
      <pv-button :label="$t('email')" text plain
                 @click="this.$router.push('/email')"
                 class="mb-2 md:mb-0 md:mr-2 lg:mr-4"
      />
    </div>
    <div v-else-if="user && user.role === 'ROLE_RECRUITER'" class="grid">
      <div v-if="user.company">
        <div class="grid">
          <pv-button :label="$t('navbar.recruitments')" text plain
                     @click="this.$router.push('/recruitments'); this.visibleMobileBar = false"
          />
          <pv-button :label="$t('navbar.company')" text plain
                     @click="this.$router.push('/company-profile'); this.visibleMobileBar = false"
          />
          <pv-button :label="$t('email')" text plain
                     @click="this.$router.push('/email')"
                     class="mb-2 md:mb-0 md:mr-2 lg:mr-4"
          />
        </div>
      </div>
      <div v-else>
        <pv-button :label="$t('navbar.create-organization')" text plain
                   @click="this.$router.push('/create-company'); this.visibleMobileBar = false"
        />
        <pv-button :label="$t('email')" text plain
                   @click="this.$router.push('/email')"
                   class="mb-2 md:mb-0 md:mr-2 lg:mr-4"
        />
      </div>
    </div>
  </pv-dialog>

</template>

<script>
import {useUserStore} from "../store/user-store.store.js";

export default {
  name: "navbar",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visibleMobileBar: false,
      authenticationPaths: new Set([
        "/login",
        "/register",
        "/password-recovery",
        "/forgot-password",
        "/recover-password"
      ]),
      userOptions: false,
    }
  },
  methods: {
    isAnAuthenticationPath(path) {
      return this.authenticationPaths.has(path);
    },
    greeting(user){
      if (user) {
        return this.$t('general.hello') + ", " + user.firstname;
      }
    },
    logout() {
      this.userOptions = false;
      const userStore = useUserStore();
      userStore.logout();
      this.$toast.add({
        severity: "warn",
        summary: "User",
        detail: "Logging out...",
        life: 1000
      });
      this.$router.push("/");
    },
  }
}
</script>

<style scoped>
.sticky {
  position: sticky;
}
</style>
