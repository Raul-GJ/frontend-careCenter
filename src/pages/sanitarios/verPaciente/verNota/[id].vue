<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { useNotaStore } from '@/stores/notaStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  import { useEspecialistaStore } from '@/stores/especialistaStore'
  const route = useRoute()
  const notaStore = useNotaStore()
  const loadingStore = useLoadingStore()
  const especialistaStore = useEspecialistaStore()

  const idNota = route.params.id
  const nota = ref(null)
  const especialista = ref(null)

  async function loadNota() {
    loadingStore.start()
    nota.value = await notaStore.getNota(idNota)
    if (nota.value) {
      especialista.value = await especialistaStore.getEspecialista(nota.value.sanitario)
    } else {
      console.error('Nota no encontrada')
    }
    loadingStore.stop()
  }

  loadNota()
</script>

<template>
  <v-container>
    <div v-if="!loadingStore.loading">
      <v-row>
        <v-col cols="12">
          <h2>
            Nota
            <v-chip
              :color="nota.privado ? 'green' : 'red'"
              text-color="white"
            >
              {{ nota.privado ? "Privada" : "Pública" }}
            </v-chip>
          </h2>
          <v-text-field
            v-model="nota.asunto"
            variant="solo"
            disabled
          />
          <v-text-field
            v-model="especialista.nombre"
            variant="solo"
            disabled
          />
          <v-textarea
            v-model="nota.contenido"
            variant="solo"
            disabled
            rows="10"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>