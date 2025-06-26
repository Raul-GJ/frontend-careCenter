<script setup>
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { storeToRefs } from 'pinia'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const seguimientoStore = useSeguimientoStore()
  const { seguimientos } = storeToRefs(seguimientoStore)

  async function loadSeguimientos() {
    loadingStore.start()
    await seguimientoStore.loadSeguimientos()
    loadingStore.stop()
  }

  function isRellenable(seguimiento) {
    if (!seguimiento.formulario) return false
    const respuestasVacias = !seguimiento.formulario.respuestas || seguimiento.formulario.respuestas.length === 0
    const ahora = new Date()
    const fechaInicio = new Date(seguimiento.fecha)
    const fechaFin = new Date(seguimiento.plazo)
    return respuestasVacias && ahora >= fechaInicio && ahora <= fechaFin
  }

  loadSeguimientos()
</script>

<template>
  <v-container>
    <h1>Mis seguimientos</h1>
    <v-table
      height="200" 
      fixed-header
    >
      <thead>
        <tr>
          <th>Motivo</th>
          <th>Fecha</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="seguimiento in seguimientos"
          :key="seguimiento.id"
        >
          <td>{{ seguimiento.motivo }}</td>
          <td>{{ seguimiento.fecha }}</td>
          <td>
            <router-link :to="`/verSeguimiento/${seguimiento.id}`">
              <v-btn
                icon="mdi-folder-open"
                title="Ver seguimiento"
              />
            </router-link>

            
            <router-link 
              v-if="isRellenable(seguimiento)"
              :to="`./rellenarSeguimiento/${seguimiento.id}`"
            >
              <v-btn 
                icon="mdi-text-box-edit" 
                title="Rellenar seguimiento"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>