<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { storeToRefs } from 'pinia'
  import { usePacienteStore } from '@/stores/pacienteStore'
  
  const usuarioStore = useUsuarioStore()
  
  const especialista = ref(null)

  const urlApi = usuarioStore.getUrlApi()
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = usuarioStore.getId()

  const pacienteStore = usePacienteStore()
  const { pacientes } = storeToRefs(pacienteStore)

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
    pacienteStore.loadPacientes()
  }

  loadEspecialista()

</script>

<template>
  <v-container>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
          <th>
            Nombre
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="paciente in pacientes" :key="paciente.id">
          <td>{{ paciente.id }}</td>
          <td>{{ paciente.nombre }}</td>
          <td>
            <v-btn icon="mdi-folder-plus" title="Añadir a estudio" />
            <v-btn icon="mdi-bell-plus" title="Añadir alerta" />
            <v-btn icon="mdi-text-box-plus" title="Añadir seguimiento" />
            <router-link :to="`./verPaciente/${paciente.id}`">
              <v-btn 
                icon="mdi-list-box-outline" 
                title="Ver datos"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>