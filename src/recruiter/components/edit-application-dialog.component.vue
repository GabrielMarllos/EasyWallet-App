<template>
  <div class="grid gap-2">
    <p>
      {{ $t('edit-candidate-dialog') }}
      <span class="font-medium">{{ application.applicant.firstname + " " + application.applicant.lastname }}</span>
    </p>
    <p>{{ $t('application-date') }}
      <span class="font-medium">{{ formatDate(application.application_date) }}</span>
    </p>
    <div class="flex flex-wrap justify-between items-center">
      <div class="flex gap-2 items-center">
        <div class="flex justify-center items-center w-24 h-24 p-4">
          <img
              :src="application.applicant.profilePictureUrl"
              alt="User profile picture"
              class="object-cover w-full h-full rounded-full"
          />
        </div>
        <div>
          <p>
            {{ application.applicant.firstname }} {{ application.applicant.lastname }}
          </p>
          <a
              :href="'mailto:' + application.applicant.username"
              target="_blank"
              class="font-bold text-primary underline"
          >
            {{ application.applicant.username }}
          </a>
        </div>
      </div>
      <div class="flex gap-2">
        <a :href="application.applicant.cvUrl" target="_blank">
          <pv-button
              icon="pi pi-file"
              severity="info"
              :disabled="!application.applicant.cvUrl"
          />
        </a>
        <a :href="application.applicant.linkedinUrl" target="_blank">
          <pv-button
              icon="pi pi-linkedin"
              severity="info"
              :disabled="!application.applicant.linkedinUrl"
          />
        </a>
        <a :href="application.applicant.portfolioUrl" target="_blank">
          <pv-button
              icon="pi pi-briefcase"
              severity="info"
              :disabled="!application.applicant.portfolioUrl"
          />
        </a>
      </div>
    </div>
    <div class="grid gap-2">
      <h1 class="text-lg md:text-xl font-medium text-primary">{{ $t('edit-phase-title') }}</h1>
      <div v-if="phasesOptions.length > 0">
        <pv-dropdown
            class="w-full"
            v-model="selectedNewPhase.value"
            :options="phasesOptions"
            optionLabel="label"
            optionValue="value"
        />
      </div>
      <div v-else>
        <div class="flex items-center justify-center">
          <pv-spinner />
        </div>
      </div>
    </div>
    <pv-button
        :disabled="isNewPhaseSelected === false"
        class="w-full"
        :label="$t('save')"
        @click="confirmEditDialog = true"
    />
  </div>

  <pv-dialog
      v-model:visible="confirmEditDialog"
      :header="$t('confirm')" modal class="w-full md:w-1/3"
      dismissableMask
  >
    <div class="grid gap-4">
      <div>
        <h1 class="text-xl font-medium">{{ $t('changes') }}</h1>
        <p class="text-gray-500">
          <span class="font-medium">{{ application.currentRecruitmentPhase.title }}</span>
          ->
          <span class="font-medium">{{ selectedNewPhaseLabel }}</span>
        </p>
      </div>

      <div class="flex gap-2">
        <pv-button
            :disabled="isNewPhaseSelected === false"
            class="w-full"
            severity="danger"
            :label="$t('cancel')"
            @click="confirmEditDialog = false"
        />
        <pv-button
            :disabled="isNewPhaseSelected === false"
            class="w-full"
            :label="$t('confirm')"
            @click="editApplicationCurrentPhase"
        />
      </div>
    </div>
  </pv-dialog>
</template>

<script>
import { ApplicationsService } from "../../shared/services/applications.service.js";
import { EmailService } from "../../shared/services/email.service.js";
import {useUserStore} from "../../shared/store/user-store.store.js";

export default {
  name: "edit-application-dialog",
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      phasesOptions: [],
      selectedNewPhase: {
        value: null,
        label: ''
      },
      confirmEditDialog: false,
      applicationsService: new ApplicationsService(),
      emailService: new EmailService(),

    }
  },
  mounted() {
    this.initPhasesOptions();
  },
  watch: {
    application: {
      handler() {
        this.initPhasesOptions();
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    selectedNewPhaseLabel() {
      const selectedPhase = this.phasesOptions.find(phase => phase.value === this.selectedNewPhase.value);
      return selectedPhase ? selectedPhase.label : '';
    },
    isNewPhaseSelected() {
      return this.selectedNewPhase.value !== this.application.currentRecruitmentPhase.id;
    }
  },
  methods: {
    initPhasesOptions() {
      this.phasesOptions = this.application.recruitmentProcess.recruitmentPhases.map(phase => ({
        label: phase.title,
        value: phase.id
      }));

      const currentPhase = this.application.currentRecruitmentPhase;
      this.selectedNewPhase = {
        value: currentPhase.id,
        label: currentPhase.title
      };
    },
    formatDate(date) {
      if (!date) return "";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    editApplicationCurrentPhase() {
      if (!this.isNewPhaseSelected) return;

      if (this.application.recruitmentProcess.recruitmentPhases.map(phase => phase.id).includes(this.selectedNewPhase.value)) {
        this.updateApplicationPhase();
      } else {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: this.$t('phase-not-in-process'), life: 2000 });
      }
    },
    updateApplicationPhase() {
      this.applicationsService.updateApplicationPhase(this.application.id, this.selectedNewPhase.value)
        .then(() => {
          this.$emit('edit-application-phase');
          this.confirmEditDialog = false;

          if (this.application.recruitmentProcess.automaticEmails) {
            this.sendEmailNotification();
          }
        })
        .catch((error) => {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 2000 });
        });
    },
    sendEmailNotification() {
      const userStore = useUserStore(); // User id => userStore.user.id
      const userEmail = userStore.user.email;

      const to = [this.application.applicant.username];
      const cc = [];
      const sender = userEmail;

      const subject = 'Cambio en la fase de reclutamiento';
      const body = `Hola ${this.application.applicant.firstname},\n\nLa fase de tu proceso de reclutamiento ha cambiado a ${this.selectedNewPhaseLabel}.\n\nSaludos,\nEl equipo de Reclutamiento`;

      this.emailService.sendEmail(to, cc, sender, subject, body)
        .then(() => {
          this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Correo enviado correctamente', life: 2000 });
        })
        .catch((error) => {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: `No se pudo enviar el correo: ${error.message}`, life: 2000 });
        });
    }
  }
}
</script>
