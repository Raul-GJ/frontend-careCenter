<script setup>
  import { computed } from 'vue'
  import { useConsultaStore } from '@/stores/consultaStore'
  import { storeToRefs } from 'pinia'

  const consultaStore = useConsultaStore()
  const { consultas } = storeToRefs(consultaStore)

  const consultasSinRespuesta = computed(() => {
    return consultas.value.filter((c) => c.respuesta == null)
  })

  const consultasRespondidas = computed(() => {
    return consultas.value.filter((c) => c.respuesta != null)
  })

  function formatoFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  consultaStore.loadConsultas()
</script>

<template>
  <v-container>
    <router-link to="./escribirConsulta">
      <v-btn prepend-icon="mdi-plus-circle">
        Nueva consulta
      </v-btn>
    </router-link>
    <p>Consultas sin responder</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Asunto
          </th>
          <th>
            Fecha de envío
          </th>
          <th>
            Receptor
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="consulta in consultasSinRespuesta" :key="consulta.id" >
          <td>{{ consulta.asunto }}</td>
          <td>{{ formatoFecha(consulta.fecha) }}</td>
          <td>{{ consulta.receptor.nombre }}</td>
          <td>
            <router-link :to="`./verConsulta/${consulta.id}`">
              <v-btn 
                icon="mdi-folder-open" 
                title="Ver consulta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Consultas respondidas</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Asunto
          </th>
          <th>
            Fecha de envío
          </th>
          <th>
            Fecha de respuesta
          </th>
          <th>
            Receptor
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="consulta in consultasRespondidas" :key="consulta.id" >
          <td>{{ consulta.asunto }}</td>
          <td>{{ formatoFecha(consulta.fecha) }}</td>
          <td>{{ formatoFecha(consulta.respuesta.fecha) }}</td>
          <td>{{ consulta.receptor.nombre }}</td>
          <td>
            <router-link :to="`./verConsulta/${consulta.id}`">
              <v-btn 
                icon="mdi-folder-open" 
                title="Ver consulta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>