<script setup>
  import { computed } from 'vue'
  import { useAlertaStore } from '@/stores/alertaStore'
  import { storeToRefs } from 'pinia'
  import { leerAlerta } from '@/services/apiAlertas'

  const alertaStore = useAlertaStore()
  const { alertas } = storeToRefs(alertaStore)

  const alertasSinLeer = computed(() => {
    return alertas.value.filter((c) => !c.leida)
  })

  const alertasLeidas = computed(() => {
    return alertas.value.filter((c) => c.leida)
  })

  async function goToLeerAlerta(alerta) {
    await leerAlerta(alerta.id)
    alertaStore.leerAlerta(alerta.id)
    window.location.href = `/pacientes/leerAlerta/${alerta.id}`
  }

  alertaStore.loadAlertas()
</script>

<template>
  <v-container>
    <p>Alertas sin leer</p>
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
        <tr v-for="alerta in alertasSinLeer" :key="alerta.id" >
          <td>{{ alerta.id }}</td>
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver alerta" @click="goToLeerAlerta(alerta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Alertas leidas</p>
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
        <tr v-for="alerta in alertasLeidas" :key="alerta.id" >
          <td>{{ alerta.id }}</td>
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver alerta" @click="goToLeerAlerta(alerta)"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>