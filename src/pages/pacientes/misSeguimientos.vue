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
            <v-btn
              icon="mdi-folder-open"
              title="Ver seguimiento"
              @click="verSeguimiento(seguimiento)"
            />
            <router-link :to="`./rellenarSeguimiento/${seguimiento.id}`">
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