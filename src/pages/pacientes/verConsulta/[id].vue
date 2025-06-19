<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { useConsultaStore } from '@/stores/consultaStore'

  const consultaStore = useConsultaStore()

  const route = useRoute()
  const idConsulta = route.params.id
  const consulta = ref(null)

  const respondida = ref(false)

  function loadConsulta() {
    consulta.value = consultaStore.getConsulta(idConsulta)
    if (consulta.value.respuesta != null)
      respondida.value = true
  }

  loadConsulta()
</script>

<template>
  <v-container>
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