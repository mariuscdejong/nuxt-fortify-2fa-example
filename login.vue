<template>
	<main data-name="login" class="container flex flex-col space-y-6">
		<Heading>Login</Heading>

    <StatusMessageError exception="LoginException" />

		<FormulateForm @submit="submitLoginForm" class="w-full">
			<FormulateInput
				v-model="email"
        label="E-Mail Address"
				type="email"
				placeholder="E-mailadres"
				validation="required|email" />

			<FormulateInput
				v-model="password"
        label="Password"
				type="password"
				placeholder="Wachtwoord"
				validation="required" />

      <ButtonPrimary>Inloggen</ButtonPrimary>
		</FormulateForm>

		<NuxtLink to="/password-reset" class="underline text-center text-sm">I forgot my password</NuxtLink>
	</main>
</template>

<script>
import { defineComponent, ref, useContext, useStore } from '@nuxtjs/composition-api';

export default defineComponent({
	auth: 'guest',
  layout: 'auth',

  setup() {
		const { $auth, $catch, $clearError } = useContext();
		const store = useStore();

		const email = ref('');
		const password = ref('');

		const submitLoginForm = async () => {
			$clearError('LoginException');

      $auth.$storage.setUniversal('challengeCompleted', false);
      $auth.$storage.removeUniversal('twoFactorEnabled');

			try {
				store.commit('SET_LOADING', true);

        const response = await $auth.loginWith('local', {
					data: {
						email: email.value,
						password: password.value,
            device_name: 'test123',
					},
				});

        if (response) {
          $auth.$storage.setUniversal('twoFactorEnabled', response.data.two_factor);

          store.commit('SET_LOADING', false);

          // Set user to empty object for redirect (loggedIn state)
          $auth.setUser({});
        }

			} catch (error) {
				$catch('LoginException', error);
				store.commit('SET_LOADING', false);
			}
		}

		return {
			email,
			password,
			submitLoginForm,
		}
  },
});
</script>

