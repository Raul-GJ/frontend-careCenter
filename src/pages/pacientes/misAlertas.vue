<script setup>
  import { computed } from 'vue'
  import { useAlertaStore } from '@/stores/alertaStore'
  import { storeToRefs } from 'pinia'

  const alertaStore = useAlertaStore()
  const { alertas } = storeToRefs(alertaStore)

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

  alertaStore.loadAlertas()
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