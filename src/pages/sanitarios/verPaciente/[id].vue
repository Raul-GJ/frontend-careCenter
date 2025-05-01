<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import { usePacienteStore } from '@/stores/pacienteStore'

  const pacienteStore = usePacienteStore()

  const route = useRoute()
  const idPaciente = route.params.id
  const paciente = ref(null)

  const nombrePaciente = ref('')
  const emailPaciente = ref('')
  const telefonoPaciente = ref('')

  function loadPaciente() {
    paciente.value = pacienteStore.getPaciente(idPaciente)
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


