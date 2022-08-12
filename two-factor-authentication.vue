<template>
  <main data-name="2fa" class="container flex flex-col space-y-6">
    <Heading>Two-factor authentication</Heading>

    <StatusMessageError exception="TwoFactorAuthException" />

    <!-- QR-code -->
    <div v-if="!twoFactorEnabled" class="flex flex-col items-center space-y-4 justify-center bg-white px-4 py-6 rounded-lg shadow-card">
      <p class="md:max-w-sm md:mx-auto text-sm text-center">Scan the QR-code with an authenticator app like Google Authenticator or Microsoft Authenticator.</p>
      <div v-html="qrCodeSvg"></div>

      <a :href="authenticatorUrl" class="underline text-center text-sm text-black">
        Or open authenticator app on this device.
      </a>
    </div>

    <!-- Recovery codes -->
    <div v-if="challengeCompleted" class="bg-white px-4 py-6 rounded-lg shadow-card flex flex-col space-y-4">
      <h2>Two factor authentication enabled</h2>
      <p>Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.</p>

      <ul v-if="recoveryCodes" class="text-sm">
        <li v-for="recoveryCode in recoveryCodes" :key="recoveryCode">{{ recoveryCode }}</li>
      </ul>

      <NuxtLink to="/">
        <ButtonPrimary class="mt-6">Continue to dashboard</ButtonPrimary>
      </NuxtLink>
    </div>

    <!-- Challenge form -->
    <template v-if="!challengeCompleted">
      <p class="text-black">Enter the security code displayed in your authenticator app.</p>

      <FormulateForm @submit="confirmCode">
        <FormulateInput
          name="code"
          label="Authentication Code"
          validation="required"
          :validation-messages="{
            required: 'Is required',
          }" />

        <ButtonPrimary class="mt-6">Verify</ButtonPrimary>
      </FormulateForm>

      <p v-if="twoFactorEnabled" class="md:max-w-sm md:mx-auto text-sm text-center">Can't receive your code? Enter a recovery code above.</p>

      <ButtonSecondary @click="$auth.logout()">Log Out</ButtonSecondary>
    </template>
  </main>
</template>

<script>
import { defineComponent, useFetch, useContext, ref, computed, useRouter, useStore } from '@nuxtjs/composition-api';

export default defineComponent({
  layout: 'auth',

  middleware({ $auth, redirect }) {
    if ($auth.$storage.getUniversal('challengeCompleted')) {
      return redirect('/');
    }
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const { $api, $catch, $clearError, $auth } = useContext();

    const qrCodeSvg = ref(null);
    const authenticatorUrl = ref(null);

    useFetch(async () => {
      $clearError('TwoFactorAuthException');

      try {
        if (!twoFactorEnabled.value) {
          await $api.twoFactorAuth.enable();

          const { svg, url } = await $api.twoFactorAuth.qrCodeSvg();
          qrCodeSvg.value = svg;
          authenticatorUrl.value = url;
        }
      } catch (error) {
        $catch('TwoFactorAuthException', error);
      }
    });

    const recoveryCodes = ref(null);

    const confirmCode = async (formData) => {
      $clearError('TwoFactorAuthException');

      try {
        // Code correct, show recovery codes if 2FA was not already enabled
        if (!twoFactorEnabled.value) {
          await $api.twoFactorAuth.confirm(formData.code);

          const recoveryCodesResponse = await $api.twoFactorAuth.recoveryCodes();
          recoveryCodes.value = recoveryCodesResponse;

          // Set 2FA enabled to true
          $auth.$storage.setUniversal('twoFactorEnabled', true);
        } else {
          if (formData.code.replace(/\s/g, '').length === 6) {
            await $api.twoFactorAuth.challenge(formData.code);
          } else {
            await $api.twoFactorAuth.confirmWithRecoveryCode(formData.code);
          }
        }

        // Refetch user
        await $auth.fetchUser();

        // Set challenge completed to true
        $auth.$storage.setUniversal('challengeCompleted', true);

        // If not showing recovery codes, redirect to dashboard
        if (twoFactorEnabled.value) {
          router.push('/');
        }

      } catch (error) {
        $catch('TwoFactorAuthException', error);
      }
    };

    const twoFactorEnabled = computed(() => {
      return store.state.auth.twoFactorEnabled || $auth.$storage.getUniversal('twoFactorEnabled');
    });

    const challengeCompleted = computed(() => {
      return store.state.auth.challengeCompleted;
    });

    return {
      qrCodeSvg,
      authenticatorUrl,
      recoveryCodes,
      confirmCode,
      twoFactorEnabled,
      challengeCompleted,
    }
  },
})
</script>
