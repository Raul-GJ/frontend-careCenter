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
    return seguimiento.formulario 
      && seguimiento.formulario.respuestas.length === 0
      && new Date(seguimiento.formulario.fecha) < new Date()
      && new Date(seguimiento.formulario.plazo) > new Date()
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
          <th>Id</th>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="seguimiento in seguimientos"
          :key="seguimiento.id"
        >
          <td>{{ seguimiento.id }}</td>
          <td>{{ seguimiento.formulario.plantilla }}</td>
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