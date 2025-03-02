<script setup>
  import { ref } from 'vue'
  
  const nombreUsuario = ref('Raúl González')
  const correo = ref('correo_ejemplo@gmail.com')
  const telefono = ref(123456789)
  const editarPerfil = ref(false)

  function funcion () {
    alert('hola')
  }

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar image="../assets/avatar-perfil-por-defecto.png" size="250" @click="funcion"/>
        <v-container v-if="editarPerfil">
          <v-text-field
            v-model="nombreUsuario"
            variant="solo"
          />
          <v-text-field
            v-model="correo"
            variant="solo"
          />
          <v-text-field
            v-model="telefono"
            variant="solo"
          />
        </v-container>
        <v-container v-else>
          <v-text-field
            v-model="nombreUsuario"
            variant="solo"
            disabled
          />
          <v-text-field
            v-model="correo"
            variant="solo"
            disabled
          />
          <v-text-field
            v-model="telefono"
            variant="solo"
            disabled
          />
        </v-container>
        <v-btn append-icon="mdi-pencil-outline" @click="editarPerfil = !editarPerfil">Editar perfil</v-btn>
      </v-col>
      <v-col>
        <p>Otra Información de interés</p>
      </v-col>
    </v-row>
  </v-container>
</template>