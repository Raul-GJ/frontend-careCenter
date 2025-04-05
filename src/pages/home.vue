<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useAppStore } from '../stores/app'

  const appStore = useAppStore()

  const urlApi = appStore.getUrlApi()
  const urlEspecialistas = urlApi + "usuarios/especialistas/"
  const idEspecialista = "67f0e0995b95213262208374"

  const drawer = ref(false)

  async function loadEspecialista() {
    let response = await axios.get(urlEspecialistas + idEspecialista)
    appStore.setUsuario(response.data)
  }

  loadEspecialista()

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
        <router-link to="/sanitarios/misPacientes">
          <v-btn prepend-icon="mdi-account-group-outline">Mis pacientes</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/estudios">
          <v-btn prepend-icon="mdi-folder">Estudios</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/seguimientos">
          <v-btn prepend-icon="mdi-list-box-outline">Seguimientos</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/misConsultas">
          <v-btn prepend-icon="mdi-chat-question">Mis consultas</v-btn>
        </router-link>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item>
        <router-link to="/pacientes/misAlertas">
          <v-btn prepend-icon="mdi-bell">Mis alertas</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/pacientes/misEstudios">
          <v-btn prepend-icon="mdi-folder">Mis estudios</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/pacientes/rellenarSeguimiento">
          <v-btn prepend-icon="mdi-list-box-outline">Rellenar seguimiento</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/pacientes/consultas">
          <v-btn prepend-icon="mdi-chat-question">Consultas</v-btn>
        </router-link>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item>
        <router-link to="/configuracion">
          <v-btn prepend-icon="mdi-cog">Configuración</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/informacion">
          <v-btn prepend-icon="mdi-information">Información</v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/ayuda">
          <v-btn prepend-icon="mdi-help-circle">Ayuda</v-btn>
        </router-link>
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