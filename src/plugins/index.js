/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

export function registerPlugins (app) {
  const pinia = createPinia()
  pinia.use(piniaPersistedstate)
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
