<script setup>
import { ref } from 'vue'
import AppDrawer from '@/components/AppDrawer.vue'

const drawer = ref(false)
</script>

<template>
  <v-app-bar>
    <h1>Nombre app</h1>
    <v-spacer />
    <v-btn icon="mdi-magnify" />
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
  </v-app-bar>
  <AppDrawer v-model="drawer" />
  <v-container>
    <main>
      <h2>Hola usuario</h2>
      <section>
        <article>
          <p>Esta es la página principal de la aplicación</p>
        </article>
      </section>
    </main>
  </v-container>
</template>