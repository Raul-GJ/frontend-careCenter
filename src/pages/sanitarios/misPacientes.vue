<script setup>
  import { ref } from 'vue'
  import { useSesionStore } from '@/stores/sesionStore'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()
  
  const sesionStore = useSesionStore()
  
  const especialista = ref(null)

  const usuarioStore = useUsuarioStore()
  const pacientes = ref([])

  async function load() {
    loadingStore.start()
    especialista.value = await sesionStore.getUsuario()
    for (let idUsuario of especialista.value.pacientes) {
      const paciente = await usuarioStore.getUsuario(idUsuario)
      pacientes.value.push(paciente)
    }
    loadingStore.stop()
  }

  load()
</script>

<template>
  <v-container v-if="!loadingStore.loading && pacientes.length > 0">
    <v-table
      height="200"
      fixed-header
    >
      <thead>
        <tr>
          <th>
            Nombre
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="paciente in pacientes"
          :key="paciente.id"
        >
          <td>{{ paciente.nombre }} {{ paciente.apellidos }}</td>
          <td>
            <v-btn
              icon="mdi-folder-plus"
              title="Añadir a estudio"
            />
            <v-btn
              icon="mdi-bell-plus"
              title="Añadir alerta"
            />
            <v-btn
              icon="mdi-text-box-plus"
              title="Añadir seguimiento"
            />
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