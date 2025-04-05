<script setup>
  import { ref } from 'vue'

  const seguimientos = ref([
    {id: '1', titulo: 'Estudio 1', descripcion: 'abcde'},
    {id: '2', titulo: 'Estudio 2', descripcion: 'asfwdas'},
    {id: '3', titulo: 'Estudio 3', descripcion: 'tfsda'},
    {id: '4', titulo: 'Estudio 4', descripcion: 'Hola'},
  ])
</script>

<template>
  <v-container>
    <router-link to="./misPlantillas">
      <v-btn prepend-icon="mdi-list-box-outline">Mis plantillas</v-btn>
    </router-link>
    <h1>Mis seguimientos</h1>
    <v-table height="200" fixed-header>
      <thead>
        <tr>
          <th>
            Id
          </th>
          <th>
            Titulo
          </th>
          <th>
            Descripción
          </th>
          <th>
            Opciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="seguimiento in seguimientos" :key="seguimiento.id">
          <td>{{ seguimiento.id }}</td>
          <td>{{ seguimiento.titulo }}</td>
          <td>{{ seguimiento.descripcion }}</td>
          <td>
            <v-btn icon="mdi-text-box-edit" title="Editar seguimiento" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>