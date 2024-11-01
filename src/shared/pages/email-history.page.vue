<template>
  <div class="grid gap-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ $t('email-history') }}</h1>
      <pv-button
          :label="this.$t('email')"
          icon="pi pi-envelope"
          severity="contrast"
          @click="emailDialog = true"
      />
    </div>
    <div class="grid md:flex w-full gap-4">
      <pv-button
          class="w-full"
          icon="pi pi-inbox"
          :label="this.$t('received-emails')"
          @click="displayedEmails = 'received'"
          :severity="this.displayedEmails === 'received' ? 'primary' : 'secondary'"
      />
      <pv-button
          class="w-full"
          icon="pi pi-send"
          :label="this.$t('sent-emails')"
          @click="displayedEmails = 'sent'"
          :severity="this.displayedEmails === 'sent' ? 'primary' : 'secondary'"
      />
    </div>

    <div v-if="displayedEmails === 'sent' ? this.sentEmails : this.receivedEmails" class="overflow-x-auto">
      <pv-data-table
          :value="displayedEmails === 'sent' ? this.sentEmails : this.receivedEmails" paginator :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          @row-click="onRowClick"
      >
        <pv-column field="subject" :header="this.$t('subject')"></pv-column>
        <pv-column field="sender" :header="this.$t('from')"></pv-column>
        <pv-column :header="this.$t('to')">
          <template #body="slotProps">
            <p>{{ slotProps.data.to.join(', ') }}</p>
          </template>
        </pv-column>
        <pv-column header="CC">
          <template #body="slotProps">
            <p v-if="slotProps.data.cc.length">{{ slotProps.data.cc.join(', ') }}</p>
            <p v-else></p>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
    <div v-else>
      <div class="flex items-center justify-center">
        <pv-spinner />
      </div>
    </div>

    <pv-dialog
        v-model:visible="emailDialog" modal
        :header="$t('email')"
        :style="{ width: '50vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :draggable="false"
        position="top"
    >
      <email-form
          :emailTo="this.selectedEmails"
          :emailCC="this.selectedCC"
          :emailSubject="this.emailSubject"
          :emailContent="this.emailContent"
      />
    </pv-dialog>

    <pv-dialog
        v-model:visible="emailDetailsDialog" modal
        :header="$t('email')"
        :style="{ width: '50vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
        :draggable="false"
        position="top">
      <email-form
          :isDisabled="true"
          :emailTo="this.selectedEmailDetails.to"
          :emailCC="this.selectedEmailDetails.cc"
          :emailSubject="this.selectedEmailDetails.subject"
          :emailContent="this.selectedEmailDetails.body"
      />
    </pv-dialog>
  </div>
</template>

<script>
import {EmailService} from "../services/email.service.js";
import EmailForm from "../components/email-form.component.vue";
import {useUserStore} from "../store/user-store.store.js";

export default {
  name: "email-history-page",
  components: {EmailForm},
  data(){
    return {
      emailHistory: null,
      emailService: new EmailService(),
      selectedEmail: null,
      emailDialog: false,
      selectedEmails: [],
      selectedCC: [],
      emailSubject: "",
      emailContent: "",
      sentEmails:[],
      receivedEmails:[],
      displayedEmails: null,
      emailDetailsDialog: false,
      selectedEmailDetails: null
    }
  },
  created(){
    this.displayedEmails = 'received'
    this.updateReceivedEmails();
    this.updateSentEmails();
  },
  methods: {
    updateReceivedEmails(){
      const userStore = useUserStore();
      const userEmail = userStore.user.email;

      this.emailService.getReceivedEmailsByEmail(userEmail)
          .then(response => {
            if (response.data.length > 0) {
              this.receivedEmails = response.data;
            }
          })
          .catch(error => {
            this.receivedEmails = [];
          });
    },
    updateSentEmails(){
      const userStore = useUserStore(); // User id => userStore.user.id
      const userEmail = userStore.user.email;
      this.emailService.getSentEmailsByEmail(userEmail)
          .then(response => {
            if (response.data.length > 0) {
              this.sentEmails = response.data;
            }
          })
          .catch(error => {
            this.sentEmails = [];
          });
    },
    onRowClick(event) {
      this.selectedEmailDetails = event.data;
      this.emailDetailsDialog = true;
    },
    formatDate(date) {
      if (!date) return "";
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    showEmailDialog(_email){
      this.selectedEmail = _email;
      this.emailDialog = true;
    },
    resetEmailDialog(){
      this.emailSubject = "";
      this.emailContent = "";
    }
  }
}
</script>