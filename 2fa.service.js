export class TwoFactorAuthService {
	constructor($axios) {
		this.apiBaseUrl = '/api';
		this.$axios = $axios;
	}

  qrCodeSvg() {
    return this.$axios.$get(`${this.apiBaseUrl}/qrcode`);
  }

  confirm(code) {
    return this.$axios.$post(`${this.apiBaseUrl}/user/confirm-2fa`, {
      code,
    });
  }

  enable() {
    return this.$axios.$post(`${this.apiBaseUrl}/user/two-factor-authentication`);
  }

  confirm(code) {
    return this.$axios.$post(`${this.apiBaseUrl}/user/confirmed-two-factor-authentication`, {
      code,
    });
  }

  confirmWithRecoveryCode(code) {
    return this.$axios.$post(`${this.apiBaseUrl}/two-factor-challenge`, {
      recovery_code: code,
    });
  }

  challenge(code) {
    return this.$axios.$post(`${this.apiBaseUrl}/two-factor-challenge`, {
      code,
    });
  }

  qrCodeSvg() {
    return this.$axios.$get(`${this.apiBaseUrl}/user/two-factor-qr-code`);
  }

  recoveryCodes() {
    return this.$axios.$get(`${this.apiBaseUrl}/user/two-factor-recovery-codes`);
  }

	regenerateRecoveryCodes() {
		return this.$axios.$post(`${this.apiBaseUrl}/user/two-factor-recovery-codes`);
	}

  disable() {
    return this.$axios.$delete(`${this.apiBaseUrl}/user/two-factor-authentication`);
  }
}
