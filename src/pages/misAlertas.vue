<script setup>
  import { computed } from 'vue'
  import { useAlertaStore } from '@/stores/alertaStore'
  import { storeToRefs } from 'pinia'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const alertaStore = useAlertaStore()
  const { alertas } = storeToRefs(alertaStore)

  const alertasSinLeer = computed(() => {
    return alertas.value.filter((c) => !c.leida)
  })

  const alertasLeidas = computed(() => {
    return alertas.value.filter((c) => c.leida)
  })

  async function loadAlertas() {
    loadingStore.start()
    await alertaStore.loadAlertas()
    loadingStore.stop()
  }
  
  loadAlertas()
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
          v-for="alerta in alertasSinLeer"
          :key="alerta.id"
        >
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <router-link
              :to="`/leerAlerta/${alerta.id}`"
              class="text-decoration-none"
            >
              <v-btn
                icon="mdi-folder-open"
                title="Ver alerta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <p>Alertas leidas</p>
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
          v-for="alerta in alertasLeidas"
          :key="alerta.id"
        >
          <td>{{ alerta.asunto }}</td>
          <td>{{ alerta.fecha }}</td>
          <td>
            <router-link
              :to="`/leerAlerta/${alerta.id}`"
              class="text-decoration-none"
            >
              <v-btn
                icon="mdi-folder-open"
                title="Ver alerta"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>