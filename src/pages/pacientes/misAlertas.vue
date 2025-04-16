<script setup>
  import { computed, ref } from 'vue'
  import axios from 'axios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useAlertaStore } from '@/stores/alertaStore'
  import { storeToRefs } from 'pinia'

  const usuarioStore = useUsuarioStore()

  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const alertaStore = useAlertaStore()
  const { alertas } = storeToRefs(alertaStore)

  const urlApi = usuarioStore.getUrlApi()
  const urlAlertas = urlApi + "alertas/"
  const urlPacientes = urlApi + "usuarios/pacientes/"
  const idPaciente = usuarioStore.getId()

  const paciente = ref(null)

  // const alertas = ref([
    // {id: '1', asunto: 'Alerta 1', mensaje: 'bla bla bla 1', fecha: '25/03/2025', repetitiva: true},
    // {id: '2', asunto: 'Alerta 2', mensaje: 'bla bla bla 2', fecha: '28/01/2025', repetitiva: true},  
    // {id: '3', asunto: 'Alerta 3', mensaje: 'bla bla bla 3', fecha: '01/04/2025', repetitiva: false},
    // {id: '4', asunto: 'Alerta 4', mensaje: 'bla bla bla 4', fecha: '02/01/2025', repetitiva: false},
  // ])

  const alertasFuturas = computed(() => {
    return alertas.value.filter((c) => crearFecha(c.fecha).getTime() >= new Date().getTime())
  })

  const alertasPasadas = computed(() => {
    return alertas.value.filter((c) => crearFecha(c.fecha).getTime() < new Date().getTime())
  })

  function crearFecha(fechaString) {
    alert(fechaString)
    let partes = fechaString.split("T");
    let date = partes[0].split("-")
    let time = partes[1].split(":")

    return new Date(Date.UTC(date[0], date[1], date[2], time[0], time[1]));
  }

  function leerAlerta(alerta) {
    alert(alerta.mensaje)
  }

  async function loadAlertas() {
    let lista = paciente.value.alertas
    
    for (let id of lista) {
      if (!alertaStore.getAlerta(id)) {
        let response = await axios.get(urlAlertas + id)
        let newAlerta = response.data
        newAlerta.id = id
        alertaStore.addAlerta(newAlerta)
      }
    }
  }
  
  async function loadPaciente() {
    let response = await axios.get(urlPacientes + idPaciente)
    paciente.value = response.data
    loadAlertas()
  }

  loadPaciente()
</script>

<template>
  <v-container>
    <p>Próximas alertas</p>
    <v-table 
      height="200" 
      fixed-header
    >
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
        <tr v-for="alerta in alertasFuturas" :key="alerta.id" >
          <td>{{ alerta.id }}</td>
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver alerta" @click="leerAlerta(alerta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Alertas pasadas</p>
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
        <tr v-for="alerta in alertasPasadas" :key="alerta.id" >
          <td>{{ alerta.id }}</td>
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver alerta" @click="leerAlerta(alerta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>