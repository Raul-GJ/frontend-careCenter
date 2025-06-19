<template>
  <v-app>
    <v-main>
      <!-- Loader global centrado -->
      <v-overlay
        :model-value="loadingStore.loading"
        persistent
        z-index="9999"
      >
        <div class="d-flex justify-center align-center" style="height: 100vh; width: 100vw;">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
        </div>
      </v-overlay>
      <router-view />
      <AppFooter />
    </v-main>
  </v-app>
</template>

<script setup>
import AppFooter from './components/AppFooter.vue';
import { useLoadingStore } from '@/stores/loadingStore'
const loadingStore = useLoadingStore()
</script>
