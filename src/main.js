/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
// Agregar importación del router
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersistedstate)

registerPlugins(app)

// Usar router antes de montar la app
app.use(pinia)
app.use(router)
app.mount('#app')
