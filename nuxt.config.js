export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  // target: 'static',

  server: {
		// host: 'myuniforce.test', // default: localhost
	},

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'My Uniforce | Expat Services',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'stylesheet', href: 'https://use.typekit.net/cvs7tlr.css' },
      { rel: 'icon', type: 'image/png', href: '/icon.png' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/mixin.plugin.js',
    '@/plugins/pwa-update.client.js',

    // Providers (context injections)
		'@/providers/service.provider.js',
		'@/providers/notifier.provider.js',
		'@/providers/error-catching.provider.js',
  ],

  // Loading
  loading: {
		height: '4px',
		color: '#1A263F',
	},

  // Generate options
  generate: {
    fallback: true,
  },

  // Router middleware
  router: {
		middleware: [
      'auth',
      'clearErrors',
    ],
	},

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '~/components',
		{ path: '~/components/Dashboard', prefix: 'Dashboard' },
		{ path: '~/components/MyData', prefix: 'MyData' },
		{ path: '~/components/Payslips', prefix: 'Payslip' },
		{ path: '~/components/StatusMessages', prefix: 'StatusMessage' },
		{ path: '~/components/Buttons', prefix: 'Button' },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/composition-api/module',
    '@nuxtjs/tailwindcss',
    '@braid/vue-formulate/nuxt',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    'vue-scrollto/nuxt',
		'portal-vue/nuxt',
    '@nuxtjs/dayjs',
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: 'My Uniforce',
			short_name: 'My Uniforce',
			theme_color: '#1A263F',
    }
  },

  // Tailwind configuration
  tailwindcss: {
		cssPath: '@/assets/styles/main.scss',
		configPath: './tailwind.config.js',
	},

  // DayJS configuration
	dayjs: {
		locales: ['nl'],
		defaultLocale: 'nl',
	},

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.API_BASE_URL || 'http://myuniforce.test',
    // proxy: true,
    credentials: true,
    debug: process.env.NODE_ENV !== 'production',
  },

  // Auth
  auth: {
    strategies: {
      local: {
				token: {
				  property: 'authorisation.token',
				  global: true,
				  required: true,
          maxAge: 10080,
				},

				endpoints: {
				  login: { url: '/api/login', method: 'post' },
				  logout: { url: '/api/logout', method: 'post' },
				  user: { url: '/api/user', method: 'get' },
				},

        user: {
          property: 'employee',
          autoFetch: false,
        },

        refreshToken: {
					maxAge: 20160 * 60
				},
			},
		},

		redirect: {
			home: '/',
			login: '/login',
			logout: '/',
			callback: '/login',
		},
	},
}
