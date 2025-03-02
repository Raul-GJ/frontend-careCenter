<script setup>
  import { computed, ref } from 'vue'

  const consultas = ref([
    {id: '1', asunto: 'Pregunta 1', mensaje: 'bla bla bla 1', fecha: '25/02/2025', leida: true},
    {id: '2', asunto: 'Pregunta 2', mensaje: 'bla bla bla 2', fecha: '28/02/2025', leida: true},  
    {id: '3', asunto: 'Pregunta 3', mensaje: 'bla bla bla 3', fecha: '01/03/2025', leida: false},
    {id: '4', asunto: 'Pregunta 4', mensaje: 'bla bla bla 4', fecha: '02/03/2025', leida: false},
  ])

  const consultasSinLeer = computed(() => {
    return consultas.value.filter((c) => !c.leida)
  })

  const consultasLeidas = computed(() => {
    return consultas.value.filter((c) => c.leida)
  })

  function leerConsulta(consulta) {
    alert(consulta.mensaje)
  }
</script>

<template>
  <v-container>
    <p>Consultas sin leer</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
          <th>
            Titulo
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
        <tr v-for="consulta in consultasSinLeer" :key="consulta.id" >
          <td>{{ consulta.id }}</td>
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver consulta" @click="leerConsulta(consulta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Consultas leídas</p>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
          <th>
            Titulo
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
        <tr v-for="consulta in consultasLeidas" :key="consulta.id" >
          <td>{{ consulta.id }}</td>
          <td>{{ consulta.asunto }}</td>
          <td>{{ consulta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver consulta" @click="leerConsulta(consulta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>