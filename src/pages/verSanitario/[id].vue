<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useLoadingStore } from '@/stores/loadingStore'

  const route = useRoute()
  const loadingStore = useLoadingStore()
  const usuarioStore = useUsuarioStore()
  const idSanitario = route.params.id
  const sanitario = ref(null)

  async function loadSanitario() {
    loadingStore.start()
    try {
      sanitario.value = await usuarioStore.getUsuario(idSanitario)
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
    <div v-if="!loadingStore.loading && sanitario">
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
              v-if="sanitario.tipo === 'ESPECIALISTA'"
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