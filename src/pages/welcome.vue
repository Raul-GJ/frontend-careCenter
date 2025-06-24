<script setup>
import HomeCard from '@/components/HomeCard.vue'

const cards = [
  {
    icon: 'mdi-account-heart',
    color: 'primary',
    title: 'Facilita el seguimiento de pacientes',
    desc: 'Gestiona y monitoriza el estado de tus pacientes de forma sencilla mediante seguimientos.'
  },
  {
    icon: 'mdi-file-document-edit',
    color: 'secondary',
    title: 'Elabora tus estudios',
    desc: 'Crea y gestiona estudios médicos junto con otros especialistas.'
  },
  {
    icon: 'mdi-stethoscope',
    color: 'success',
    title: 'Realiza consultas a tus profesionales',
    desc: 'Contacta y consulta fácilmente con tu médico de cabecera y especialistas.'
  },
  {
    icon: 'mdi-bell-alert',
    color: 'error',
    title: 'Recibe alertas médicas',
    desc: 'Mantente informado con notificaciones y alertas sobre tu salud y tratamientos.'
  }
]
</script>

<template>
  <v-container class="fill-height pa-0">
    <header>
      <v-app-bar
        flat
        color="#000"
        elevate-on-scroll
        elevation="8"
        app
        class="welcome-app-bar"
        style="position:fixed; top:0; left:0; right:0; z-index:1100; background: #000 !important; box-shadow: 0 4px 24px rgba(0,0,0,0.25);"
      >
        <div 
          class="text-decoration-none d-flex align-center"
          style="gap: 12px;"
        >
          <v-img
            src="@/assets/logo.png"
            height="40"
            width="40"
            contain
            class="ms-4"
          />
          <span class="text-h5 font-weight-bold">CareCenter</span>
        </div>
        
        <v-spacer />
        <router-link to="/auth/login">
          <v-btn
            color="primary"
            variant="flat"
            class="mx-2"
          >
            Iniciar sesión
          </v-btn>
        </router-link>
        <router-link to="/auth/registro">
          <v-btn
            color="secondary"
            variant="flat"
            class="mx-2"
          >
            Registrarse
          </v-btn>
        </router-link>
      </v-app-bar>
    </header>
    <main style="padding-top: 80px;">
      <v-row
        align="center"
        justify="center"
        style="min-height: 80vh;"
        class="ma-0 pa-0"
      >
        <v-col
          cols="12"
          md="5"
          class="d-flex"
          style="margin-bottom: 24px;"
        >
          <v-card
            class="pa-8 flex-grow-1"
            elevation="8"
            style="border-radius: 24px;"
          >
            <v-row
              justify="center"
              class="mb-4"
            >
              <v-img
                src="@/assets/logo.png"
                height="80"
                width="80"
              />
            </v-row>
            <h2
              class="text-center mb-4 font-weight-bold"
              style="color: #1976d2;"
            >
              ¡Bienvenido!
            </h2>
            <section>
              <article>
                <p class="text-center text-body-1 mb-6">
                  Bienvenido a la aplicación <b>CareCenter</b>.<br>
                  Gestiona tu salud o la de tus pacientes de manera sencilla y segura.
                </p>
                <v-row
                  justify="center"
                  class="mt-4"
                >
                  <router-link to="/auth/login">
                    <v-btn
                      color="primary"
                      class="mx-2"
                      size="large"
                    >
                      Iniciar sesión
                    </v-btn>
                  </router-link>
                  <router-link to="/auth/registro">
                    <v-btn
                      color="secondary"
                      class="mx-2"
                      size="large"
                    >
                      Registrarse
                    </v-btn>
                  </router-link>
                </v-row>
              </article>
            </section>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="5"
          class="d-flex"
          style="margin-bottom: 24px;"
        >
          <v-card
            class="pa-6 flex-grow-1"
            elevation="4"
            style="border-radius: 18px;"
          >
            <h3
              class="text-center mb-6 font-weight-bold"
              style="color: #1565c0;"
            >
              Características principales
            </h3>
            <v-row>
              <HomeCard
                v-for="card in cards"
                :key="card.title"
                :icon="card.icon"
                :color="card.color"
                :title="card.title"
                :desc="card.desc"
              />
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </main>
  </v-container>
</template>

<style scoped>
.welcome-app-bar {
  border-bottom: 1px solid #222;
}
@media (max-width: 960px) {
  .v-col {
    margin-left: auto !important;
    margin-right: auto !important;
  }
}
</style>