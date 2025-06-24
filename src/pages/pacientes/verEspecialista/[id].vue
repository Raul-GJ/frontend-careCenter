<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { useEspecialistaStore } from '@/stores/especialistaStore'
  import { useLoadingStore } from '@/stores/loadingStore'

  const route = useRoute()
  const loadingStore = useLoadingStore()
  const especialistaStore = useEspecialistaStore()
  const idSanitario = route.params.id
  const sanitario = ref(null)

  async function loadSanitario() {
    loadingStore.start()
    try {
      sanitario.value = await especialistaStore.getEspecialista(idSanitario)
    } catch (error) {
       console.error('Error cargando sanitario:', error)
    } finally {
      loadingStore.stop()
    }
  }

  loadSanitario()
</script>

<template>
  <v-container>
    <div v-if="!loadingStore.loading">
      <v-row>
        <v-col cols="12">
          <v-avatar
            image="@/assets/avatar-perfil-por-defecto.png"
            size="250"
          />
          <v-container>
            <v-text-field
              v-model="sanitario.nombre"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="sanitario.centroDeSalud"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="sanitario.especialidad"
              variant="solo"
              disabled
            />
          </v-container>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>