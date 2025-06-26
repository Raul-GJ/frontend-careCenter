<script setup>
  import { computed, onMounted } from 'vue'
  import { useConsultaStore } from '@/stores/consultaStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  import { storeToRefs } from 'pinia'
  const loadingStore = useLoadingStore()
  const consultaStore = useConsultaStore()
  const { consultas } = storeToRefs(consultaStore)

  const consultasSinResponder = computed(() => {
    return consultas.value.filter((c) => c.respuesta == null)
  })

  const consultasRespondidas = computed(() => {
    return consultas.value.filter((c) => c.respuesta != null)
  })

  async function loadConsultas() {
    loadingStore.start()
    await consultaStore.loadConsultas()
    loadingStore.stop()
  }

  onMounted(() => {
    loadConsultas()
  })
</script>

<template>
  <v-container v-if="!loadingStore.loading">
    <p>Consultas sin responder</p>
    <v-table
      height="200"
      fixed-header
    >
      <thead>
        <tr>
          <th>
            Asunto
          </th>
          <th>
            Fecha
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="consulta in consultasSinResponder"
          :key="consulta.id"
        >
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fecha }}</td>
          <td>
            <router-link :to="`/sanitarios/verConsulta/${consulta.id}`">
              <v-btn 
                icon="mdi-folder-open" 
                title="Abrir consulta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Consultas respondidas</p>
    <v-table
      height="200"
      fixed-header
    >
      <thead>
        <tr>
          <th>
            Asunto
          </th>
          <th>
            Fecha
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="consulta in consultasRespondidas"
          :key="consulta.id"
        >
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fecha }}</td>
          <td>
            <router-link :to="`./verConsulta/${consulta.id}`">
              <v-btn 
                icon="mdi-folder-open" 
                title="Abrir consulta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>