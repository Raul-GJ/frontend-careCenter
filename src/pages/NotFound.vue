<script setup>
  const token = localStorage.getItem('token')
</script>
<template>
  <v-container class="text-center py-16">
    <h1 class="text-h2 mb-4">
      404 - Página no encontrada
    </h1>
    <p>La ruta a la que intentas acceder no existe.</p>
    <router-link
      v-if="token"
      to="/home"
    >
      <v-btn
        color="primary"
        class="mt-4"
      >
        Volver al inicio
      </v-btn>
    </router-link>
    <router-link
      v-else
      to="/"
    >
      <v-btn
        color="primary"
        class="mt-4"
      >
        Volver al inicio
      </v-btn>
    </router-link>
  </v-container>
</template>
