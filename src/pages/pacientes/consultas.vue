<script setup>
  import { computed, ref } from 'vue'

  const consultas = ref([
    {id: '1', asunto: 'Pregunta 1', mensaje: 'bla bla bla 1', fechaEnvio: '25/02/2025', fechaRespuesta: '26/02/2025', sanitario: 'Manolo', respuesta: 'Si'},
    {id: '2', asunto: 'Pregunta 2', mensaje: 'bla bla bla 2', fechaEnvio: '28/02/2025', fechaRespuesta: '', sanitario: 'Pepe', respuesta: ''},  
    {id: '3', asunto: 'Pregunta 3', mensaje: 'bla bla bla 3', fechaEnvio: '01/03/2025', fechaRespuesta: '03/03/2025', sanitario: 'Manolo', respuesta: 'No'},
    {id: '4', asunto: 'Pregunta 4', mensaje: 'bla bla bla 4', fechaEnvio: '02/03/2025', fechaRespuesta: '02/03/2025', sanitario: 'Sofía', respuesta: 'Hola'},
  ])

  const consultasSinRespuesta = computed(() => {
    return consultas.value.filter((c) => c.respuesta == '')
  })

  const consultasRespondidas = computed(() => {
    return consultas.value.filter((c) => !c.respuesta == '')
  })

  function leerConsulta(consulta) {
    alert(consulta.mensaje)
  }
</script>

<template>
  <v-container>
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