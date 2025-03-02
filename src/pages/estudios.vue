<script setup>
  import { ref } from 'vue'

  const estudios = ref([
    {id: '1', titulo: 'Estudio 1', descripcion: 'abcde'},
    {id: '2', titulo: 'Estudio 2', descripcion: 'asfwdas'},
    {id: '3', titulo: 'Estudio 3', descripcion: 'tfsda'},
    {id: '4', titulo: 'Estudio 4', descripcion: 'Hola'},
  ])
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
        <tr v-for="estudio in estudios" :key="estudio.id">
          <td>{{ estudio.id }}</td>
          <td>{{ estudio.titulo }}</td>
          <td>{{ estudio.descripcion }}</td>
          <td>
            <v-btn icon="mdi-text-box-edit" title="Editar estudio" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>