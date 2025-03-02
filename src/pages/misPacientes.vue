<script setup>
  import { ref } from 'vue'

  const pacientes = ref([{id: '1', nombre: 'Juan'}, {id: '2', nombre: 'Paco'},{id: '3', nombre: 'Pepe'}, {id: '4', nombre: 'Manolo'}])
</script>

<template>
  <v-container>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
          <th>
            Nombre
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="paciente in pacientes" :key="paciente.id">
          <td>{{ paciente.id }}</td>
          <td>{{ paciente.nombre }}</td>
          <td>
            <v-btn icon="mdi-folder-plus" title="Añadir a estudio" />
            <v-btn icon="mdi-bell-plus" title="Añadir alerta" />
            <v-btn icon="mdi-list-box-outline" title="Ver seguimiento" />
            <v-btn icon="mdi-text-box-edit" title="Modificar datos clinicos" />
            <v-btn icon="mdi-medication" title="Ver tratamientos"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>