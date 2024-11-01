<template>
  <div class="max-w-container border-2 px-8 py-4 rounded-lg duration-300 hover:border-primary">
    <div v-if="recruitment">
      <div class="flex gap-8">
        <div class="w-24 h-24 shadow p-4 overflow-hidden">
          <img class="object-cover w-full h-full" :src="recruitment.company.logoUrl" alt="company logo" />
        </div>
        <ul>
          <li>
            <h1 class="font-semibold text-2xl">{{ recruitment.jobPost.title }}</h1>
          </li>
          <li class="font-medium">
            <a :href="formatUrl(recruitment.company.website)" target="_blank"><span class="font-bold text-primary underline">{{ recruitment.company.name }}</span></a>
            •
            {{ recruitment.company.country }}
          </li>
          <li>
            <span class="font-semibold">{{ $t('recruitment-card.start-date-label') }}: </span>
            {{ formatDate(recruitment.created_date) }}
            <span class="font-medium">
            ({{ getPassedDays(recruitment.created_date) }} ago)
          </span>
          </li>
          <li>
            {{ applicationsCount }} {{ $t('applications') }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div class="flex items-center justify-center">
        <pv-spinner />
      </div>
    </div>
  </div>
</template>

<script>
import { ApplicationsService } from "../services/applications.service.js";

export default {
  name: "jobPost-card",
  props: {
    recruitment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      applicationsService: new ApplicationsService(),
      applicationsCount: 0
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    getPassedDays(date) {
      if (!date) return "";
      const today = new Date();
      const createdDate = new Date(date);
      const diffTime = today - createdDate;

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        return diffHours + (diffHours === 1 ? " hour" : " hours");
      }

      return diffDays + (diffDays === 1 ? " day" : " days");
    },
    formatUrl(url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
      }
      return url;
    },
    getApplicationsCount() {
      this.applicationsService.getApplicationsRecruitmentProcessId(this.recruitment.id)
          .then((response) => {
            this.applicationsCount = response.data.length > 100 ? "100+" : response.data.length;
          }
          ).catch(e => {
            console.log(e);
          });
    }
  },
  created() {
    this.getApplicationsCount();
  }
};
</script>