<script setup>
  import { ref } from 'vue'
  
  const drawer = ref(false)

</script>

<template>
  <v-app-bar>
    <h1>Nombre app</h1>
    <v-spacer />
    <v-btn icon="mdi-magnify" />
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    />
  </v-app-bar>
  <v-navigation-drawer 
    v-model="drawer" 
    temporary 
    location="right"
  >
    <v-list-item>
      <router-link to="/perfil">
        <v-btn prepend-icon="mdi-account">Mi cuenta</v-btn>
      </router-link>
    </v-list-item>
    
    <v-divider />

    <v-list density="compact" nav>
      <v-list-item>
        <v-btn prepend-icon="mdi-account-group-outline">Mis pacientes</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-folder">Estudios</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-list-box-outline">Seguimientos</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-chat-question">Mis consultas</v-btn>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item>
        <v-btn prepend-icon="mdi-bell">Alertas</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-folder">Estudios</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-list-box-outline">Rellenar seguimiento</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-medication">Mis tratamientos</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-chat-question">Consultas</v-btn>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item>
        <v-btn prepend-icon="mdi-cog">Configuración</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn prepend-icon="mdi-information">Información</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
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