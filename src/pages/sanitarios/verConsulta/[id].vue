<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import api from '@/services/api'
  import { useConsultaStore } from '@/stores/consultaStore'

  const consultaStore = useConsultaStore()

  const reglas = ref({
          necesario: value => !!value || 'Campo necesario.',
          limite: value => value.length <= 10000 || 'Máximo 10.000 caracteres',
        })

  const route = useRoute()
  const idConsulta = route.params.id
  const consulta = ref(null)

  const respuesta = ref('')
  const respondida = ref(false)

  function loadConsulta() {
    consulta.value = consultaStore.getConsulta(idConsulta)
    if (consulta.value.respuesta != null)
      respondida.value = true
  }

  async function responderConsulta() {
    if (!reglas.value.limite(respuesta.value) === true) {
      alert("La respuesta no debe superar los 10.000 caracteres")
      return
    }

    let body = { mensaje: respuesta.value }
    let response = await api.patch("consultas/" + idConsulta, body)

    if (response.status != 204) {
      console.log("Ha habido un error al intentar responder la consulta")
    }
    consultaStore.responderConsulta(consulta.value.id, respuesta.value)
    respondida.value = true
  }

  loadConsulta()
</script>

<template>
  <v-container>
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
      <p>Tu respuesta</p>
      <v-container v-if="!respondida">
        <v-textarea
          v-model="respuesta"
          label="Respuesta"
          :rules="[reglas.necesario, reglas.limite]"
          auto-grow
          counter
        />
        <v-btn 
          prepend-icon="mdi-send-variant"
          @click="responderConsulta()"  
        >
          Enviar
        </v-btn>
      </v-container>
      <v-container v-else>
        <v-textarea
          v-model="consulta.respuesta.mensaje"
          label="Respuesta"
          auto-grow
          disabled
        />
      </v-container>
    </v-container>
  </v-container>
</template>