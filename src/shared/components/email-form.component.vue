<template>
  <div class="grid gap-4 p-4">
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <p>{{ $t('to') }}:</p>
      <div v-for="(email, index) in emailTo" :key="index">
        <pv-button
            :label="email"
            icon="pi pi-times"
            severity="secondary"
            size="small"
            rounded
            :disabled="isDisabled"
            @click="removeToEmail(index)"
        />
      </div>
      <pv-input
          :invalid="isInvalidTo === true"
          v-model="this.toInput"
          type="email"
          :placeholder="$t('to')"
          :disabled="isDisabled"
          @input="handleToInput"
          @keydown="handleToKeydown"
      />
      <p class="text-red-700 text-xs">{{ this.infoToMessage }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <p>{{ $t('cc') }}:</p>
      <div v-for="(email, index) in emailCC" :key="index">
        <pv-button
            :label="email"
            icon="pi pi-times"
            severity="secondary"
            size="small"
            rounded
            :disabled="isDisabled"
            @click="removeCCEmail(index)"
        />
      </div>
      <pv-input
          :invalid="isInvalidCC === true"
          v-model="this.ccInput"
          type="text"
          :placeholder="$t('cc')"
          @input="handleCCInput"
          :disabled="isDisabled"
          @keydown="handleCCKeydown"
      />
      <p class="text-red-700 text-xs">{{ this.infoCCMessage }}</p>
    </div>

    <div class="w-full">
      <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="subject">
        {{ $t('subject') }}
      </label>
      <pv-input
          class="w-full"
          v-model="this.newEmailSubject"
          :disabled="isDisabled"
          type="text"
      />
    </div>
    <div class="w-full">
      <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="subject">
        {{ $t('content') }}
      </label>
      <pv-textarea
          :disabled="isDisabled"
          class="w-full"
          v-model="this.newEmailContent"
          type="text"
          rows="5"
          cols="30"
      />
    </div>

    <!--    <div class="w-full">
          <label class="block tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2" for="subject">
            {{ $t('attachments') }}
          </label>
          <pv-file-upload
              :auto="true"
              multiple
              chooseLabel="Choose"
              :maxFileSize="1000000"
              @select="onFileSelect"
          />
        </div>-->
    <div v-if="!isDisabled">
      <pv-button
          :disabled="isLoading"
          class="flex w-full"
          iconPos="right"
          :label="this.isLoading ? $t('loading'):$t('send')"
          icon="pi pi-envelope"
          @click="sendEmail"
      />
    </div>
  </div>
</template>

<script>
import {EmailService} from "../services/email.service.js";
import {useUserStore} from "../store/user-store.store.js";

export default {
  name: "EmailForm",
  props: {
    emailTo: {
      type: Array,
      default: () => []
    },
    emailCC: {
      type: Array,
      default: () => []
    },
    emailSubject: {
      type: String,
    },
    emailContent: {
      type: String,
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      infoCCMessage: '',
      infoToMessage: '',
      ccInput: '',
      toInput: '',
      isInvalidTo: false,
      isInvalidCC: false,
      selectedFiles: [],
      newEmailSubject: '',
      newEmailContent: '',
      emailService: new EmailService(),
      isLoading: false
    }
  },
  created() {
    this.newEmailSubject = this.emailSubject;
    this.newEmailContent = this.emailContent;
  },
  methods: {
    isValidEmail(email, type) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const isValid = emailRegex.test(email);

      if (type === 'to') {
        this.isInvalidTo = !isValid;
        this.infoToMessage = isValid ? '' : 'Invalid email address';
      } else {
        this.isInvalidCC = !isValid;
        this.infoCCMessage = isValid ? '' : 'Invalid CC address';
      }

      return isValid;
    },
    handleCCInput(event) {
      this.infoToMessage = '';
      this.infoCCMessage = '';
      const input = event.target.value;
      this.isInvalidCC = !this.isValidEmail(input.trim(), 'cc');
      if (input.includes(' ')) {
        const email = input.trim();
        if (email && this.isValidEmail(email, 'cc')) {
          this.emailCC.push(email);
          this.isInvalidCC = false;
        }
        this.ccInput = '';
      }
    },
    handleCCKeydown(event) {
      this.infoToMessage = '';
      this.infoCCMessage = '';
      if (event.key === 'Enter') {
        const input = this.ccInput.trim();
        if (input && this.isValidEmail(input, 'cc')) {
          this.emailCC.push(input);
          this.isInvalidCC = false;
          this.ccInput = '';
        } else {
          this.isInvalidCC = true;
        }
        event.preventDefault();
      }
    },
    removeCCEmail(index) {
      this.infoMessage = '';
      this.emailCC.splice(index, 1);
    },
    handleToInput(event) {
      this.infoToMessage = '';
      this.infoCCMessage = '';
      const input = event.target.value;
      this.isInvalidTo = !this.isValidEmail(input.trim(), 'to');
      if (input.includes(' ')) {
        const email = input.trim();
        if (email && this.isValidEmail(email,'to')) {
          this.emailTo.push(email);
          this.isInvalidTo = false;
        }
        this.toInput = '';
      }
    },
    handleToKeydown(event) {
      this.infoToMessage = '';
      this.infoCCMessage = '';
      if (event.key === 'Enter') {
        const input = this.toInput.trim();
        if (input && this.isValidEmail(input, 'to')) {
          this.emailTo.push(input);
          this.isInvalidTo = false;
          this.toInput = '';
        } else {
          this.isInvalidTo = true;
        }
        event.preventDefault();
      }
    },
    removeToEmail(index) {
      this.infoToMessage = '';
      this.infoCCMessage = '';
      this.emailTo.splice(index, 1);
    },
    onFileSelect(event) {
      this.selectedFiles = [...this.selectedFiles, ...event.files];
    },
    sendEmail() {
      this.isLoading = true;
      const userStore = useUserStore();
      const sender = userStore.user.email;

      const to = this.emailTo;
      const cc = this.emailCC;
      const subject = this.newEmailSubject;
      const body = this.newEmailContent;

      if (sender === '' || sender === null) {
        this.$toast.add({
          severity: 'error',
          summary: 'JobSync',
          detail: this.$t('email-error')
        });
        this.isLoading = false;
        return;
      }

      if (to.length === 0) {
        this.$toast.add({
          severity: 'error',
          summary: 'JobSync',
          detail: this.$t('email-to-error')
        });
        this.isLoading = false;
        return;
      }

      this.emailService.sendEmail(to,cc,sender,subject,body)
          .then(() => {
            this.$toast.add({
              severity: 'success',
              summary: 'JobSync',
              detail: this.$t('email-success'),
              life: 2000
            });
            // this.emailTo = [];
            // this.emailCC = [];
            // this.newEmailSubject = '';
            // this.newEmailContent = '';
            // this.isLoading = false;
          }).catch((e) => {
        this.$toast.add({
          severity: 'error',
          summary: 'JobSync',
          detail: this.$t('email-error') + ' ' + e,
          life: 2000
        });
        this.isLoading = false;
      });
    }
  }
}
</script>