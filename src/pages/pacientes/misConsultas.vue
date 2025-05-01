<script setup>
  import { computed } from 'vue'
  import { useConsultaStore } from '@/stores/consultaStore'
  import { storeToRefs } from 'pinia'

  const consultaStore = useConsultaStore()
  const { consultas } = storeToRefs(consultaStore)

  const consultasSinRespuesta = computed(() => {
    return consultas.value.filter((c) => c.respuesta == '')
  })

  const consultasRespondidas = computed(() => {
    return consultas.value.filter((c) => !c.respuesta == '')
  })

  function leerConsulta(consulta) {
    alert(consulta.mensaje)
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
            Id
          </th>
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
          <td>{{ consulta.id }}</td>
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fechaEnvio }}</td>
          <td>{{ consulta.sanitario }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver consulta" @click="leerConsulta(consulta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Consultas respondidas</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
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
          <td>{{ consulta.id }}</td>
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fechaEnvio }}</td>
          <td>{{ consulta.fechaRespuesta }}</td>
          <td>{{ consulta.sanitario }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver consulta" @click="leerConsulta(consulta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>