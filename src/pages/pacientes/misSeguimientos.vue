<script setup>
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { storeToRefs } from 'pinia'

  const seguimientoStore = useSeguimientoStore()
  const { seguimientos } = storeToRefs(seguimientoStore)

  seguimientoStore.loadSeguimientos()
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
        <tr v-for="seguimiento in seguimientos" :key="seguimiento.id">
          <td>{{ seguimiento.id }}</td>
          <td>{{ seguimiento.formulario.plantilla }}</td>
          <td>{{ seguimiento.fecha }}</td>
          <td>
            <v-btn icon="mdi-folder-open" title="Ver seguimiento" @click="verSeguimiento(seguimiento)"/>
            <v-btn icon="mdi-text-box-edit" title="Rellenar seguimiento" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>