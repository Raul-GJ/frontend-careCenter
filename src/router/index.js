/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useLoadingStore } from '@/stores/loadingStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// PROTECCIÓN DE RUTAS
router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.start()

  const token = localStorage.getItem('token')
  const isLoginOrRegisterOrRoot = ['/auth/login', '/auth/registro', '/'].includes(to.path)

  if (!token && !isLoginOrRegisterOrRoot) {
    // Si no hay token y no es una ruta de login, registro o root, redirige al login
    next({ path: '/auth/login' })
  } else if (token && isLoginOrRegisterOrRoot) {
    // Si hay token y se intenta acceder a login, registro o root, redirige a home
    next({ path: '/home' })
  } else {
    // Si hay token o es una ruta pública, permite el acceso
    next()
  }
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()
  loadingStore.stop()
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
