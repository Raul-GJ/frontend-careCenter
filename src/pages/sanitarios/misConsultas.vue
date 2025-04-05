<script setup>
  import { computed, ref } from 'vue'
  import axios from 'axios'
  import { storeToRefs } from 'pinia'
  import { consultaStore } from '../../stores/consultaStore'

  const urlApi = "http://localhost:8080/salud/api/"
  const urlConsultas = urlApi + "consultas/"
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = "67f0e0995b95213262208374"

  const especialista = ref(null)
  
  const cStore = consultaStore()
  const { consultas } = storeToRefs(cStore)

  async function loadConsultas() {
    let lista = especialista.value.consultas
    for (let id of lista) {
      if (!cStore.getConsulta(id)) {
        let response2 = await axios.get(urlConsultas + id)
        let newConsulta = response2.data
        newConsulta.id = id
        cStore.addConsulta(newConsulta)
      }
    }
  }

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    especialista.value = response.data
    loadConsultas()
  }

  loadEspecialista()

  const consultasSinResponder = computed(() => {
    return consultas.value.filter((c) => c.respuesta == null)
  })

  const consultasRespondidas = computed(() => {
    return consultas.value.filter((c) => c.respuesta != null)
  })

  function leerConsulta(consulta) {
    alert(consulta.mensaje)
    if (consulta.respuesta != null)
      alert(consulta.respuesta.mensaje)
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
            Fecha
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="consulta in consultasSinResponder" :key="consulta.id" >
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
        <tr v-for="consulta in consultasRespondidas" :key="consulta.id" >
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