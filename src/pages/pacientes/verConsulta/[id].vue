<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { useConsultaStore } from '@/stores/consultaStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const consultaStore = useConsultaStore()

  const route = useRoute()
  const idConsulta = route.params.id
  const consulta = ref(null)

  const respondida = ref(false)

  async function loadConsulta() {
    loadingStore.start()
    consulta.value = await consultaStore.getConsulta(idConsulta)
    if (consulta.value.respuesta != null)
      respondida.value = true
    loadingStore.stop()
  }

  loadConsulta()
</script>

<template>
  <v-container v-if="!loadingStore.loading && consulta">
    <v-text-field 
      v-model="consulta.asunto"
      label="Asunto"
      disabled
    />
    <v-container>
      <v-textarea
        v-model="consulta.mensaje"
        label="Mensaje"
        auto-grow
        disabled
      />
    </v-container>
    <v-container v-if="respondida">
      <v-textarea
        v-model="consulta.respuesta.mensaje"
        label="Respuesta"
        auto-grow
        disabled
      />
    </v-container>
    <v-container v-else>
      <p>Tu consulta todavía no ha sido respondida</p>
    </v-container>
  </v-container>
</template>