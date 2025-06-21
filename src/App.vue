<template>
  <v-app>
    <v-main>
      <!-- Loader global centrado -->
      <v-overlay
        :model-value="loadingStore.loading"
        persistent
        z-index="9999"
      >
        <div
          class="d-flex justify-center align-center"
          style="height: 100vh; width: 100vw;"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
        </div>
      </v-overlay>
      <!-- Barra superior y Drawer global -->
      <v-app-bar v-if="showAppBar">
        <router-link
          to="/home"
          class="text-decoration-none d-flex align-center"
          style="gap: 12px;"
        >
          <v-img
            src="@/assets/logo.png"
            height="40"
            width="40"
            contain
            class="ms-4"
          />
          <span class="text-h5 font-weight-bold">CareCenter</span>
        </router-link>
        <v-spacer />
        <v-btn icon="mdi-magnify" />
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        />
      </v-app-bar>
      <AppDrawer v-model="drawer" />
      <!-- Aquí se renderizan las páginas -->
      <router-view />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import AppFooter from './components/AppFooter.vue';
import AppDrawer from './components/AppDrawer.vue';
import { ref, computed, onMounted } from 'vue'
import { useLoadingStore } from '@/stores/loadingStore'
import { useRoute, useRouter } from 'vue-router'
const loadingStore = useLoadingStore()
const drawer = ref(false)
const route = useRoute()
const router = useRouter()
const hideDrawerRoutes = ['/', '/auth/login', '/auth/registro']
const showAppBar = computed(() => !hideDrawerRoutes.includes(route.path))

onMounted(() => {
  const token = localStorage.getItem('token')
  const expiry = localStorage.getItem('token_expiry')
  if (!token || !expiry || Date.now() > Number(expiry)) {
    localStorage.removeItem('token')
    localStorage.removeItem('token_expiry')
    if (route.path !== '/auth/login' && route.path !== '/auth/registro') {
      router.replace('/auth/login')
    }
  }
})
</script>
