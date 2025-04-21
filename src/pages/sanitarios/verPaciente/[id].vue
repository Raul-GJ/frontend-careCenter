<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'

  const usuarioStore = useUsuarioStore()

  const route = useRoute()
  const idPaciente = route.params.id

  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const urlApi = usuarioStore.getUrlApi()
  const urlPacientes = urlApi + "usuarios/pacientes/"
  const paciente = ref(null)

  const nombrePaciente = ref('')
  const emailPaciente = ref('')
  const telefonoPaciente = ref('')

  async function loadPaciente() {
    let response = await axios.get(urlPacientes + idPaciente)
    console.log(JSON.stringify(response.data))
    paciente.value = response.data
    nombrePaciente.value = paciente.value.nombre
    emailPaciente.value = paciente.value.email
    telefonoPaciente.value = paciente.value.telefono
  }

  loadPaciente()
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar image="@/assets/avatar-perfil-por-defecto.png" size="250"/>
        <v-container>
          <v-text-field
            v-model="nombrePaciente"
            variant="solo"
            disabled
          />
          <v-text-field
            v-model="emailPaciente"
            variant="solo"
            disabled
          />
          <v-text-field
            v-model="telefonoPaciente"
            variant="solo"
            disabled
          />
        </v-container>
      </v-col>
      <v-col>
        <p>Otra Información de interés</p>
      </v-col>
    </v-row>
  </v-container>
</template>


