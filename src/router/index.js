/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { useLoadingStore } from '@/stores/loadingStore'

const navigationHistory = []

// PROTECCIÓN DE RUTAS
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound.vue')
    }
  ],
})

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('token')
  const isLoginOrRegisterOrRoot = ['/auth/login', '/auth/registro', '/'].includes(to.path)

  if (!token && !isLoginOrRegisterOrRoot) {
    // Si no hay token y no es una ruta pública, redirige al login
    next({ path: '/auth/login' })
  } else if (token && isLoginOrRegisterOrRoot && from.path === '/auth/login') {
    // Solo usa replace tras login exitoso
    next({ path: '/home', replace: true })
  } else if (token && isLoginOrRegisterOrRoot) {
    // Si ya está autenticado y navega manualmente a login/registro/root, redirige a home (sin replace)
    next({ path: '/home' })
  } else {
    // Permite el acceso normal
    next()
  }
})

router.afterEach((to) => {
  navigationHistory.push(to.fullPath)
  console.log('Historial de navegación:', navigationHistory)
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