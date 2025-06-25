<script setup>
  import { ref } from 'vue'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  import HomeCard from '@/components/HomeCard.vue'
  const loadingStore = useLoadingStore()

  const usuarioStore = useUsuarioStore()
  const usuario = ref(null)

  async function loadUsuario() {
    loadingStore.start()
    await usuarioStore.loadUsuario()
    usuario.value = await usuarioStore.getUsuario()
    console.log(usuario.value)
    loadingStore.stop()
  }

  loadUsuario()

  // Definición de las tarjetas para cada tipo de usuario
  const cardsPaciente = [
    {
      to: '/misAlertas',
      icon: 'mdi-bell-alert',
      color: 'error',
      title: 'Tus alertas',
      desc: 'Revisa tus alertas y notificaciones importantes.'
    },
    {
      to: '/pacietes/misSeguimientos',
      icon: 'mdi-account-heart',
      color: 'primary',
      title: 'Tus seguimientos',
      desc: 'Consulta y gestiona tus seguimientos médicos activos.'
    },
    {
      to: '/pacientes/misConsultas',
      icon: 'mdi-stethoscope',
      color: 'success',
      title: 'Tus consultas',
      desc: 'Consulta el historial de tus consultas médicas.'
    },
    {
      to: '/pacientes/escribirConsulta',
      icon: 'mdi-pencil',
      color: 'secondary',
      title: 'Escribir consulta',
      desc: 'Redacta una nueva consulta para tus profesionales.'
    }
  ]

  const cardsMedico = [
    {
      to: '/misAlertas',
      icon: 'mdi-bell-alert',
      color: 'error',
      title: 'Mis alertas',
      desc: 'Gestiona y revisa tus alertas médicas.'
    },
    {
      to: '/medicos/misConsultas',
      icon: 'mdi-stethoscope',
      color: 'success',
      title: 'Mis consultas',
      desc: 'Consulta y responde a las consultas de tus pacientes.'
    },
    {
      to: '/medicos/misPacientes',
      icon: 'mdi-account-group',
      color: 'primary',
      title: 'Mis pacientes',
      desc: 'Gestiona y consulta la información de tus pacientes.'
    },
    {
      to: '/medicos/agregarAlertas',
      icon: 'mdi-bell-plus',
      color: 'secondary',
      title: 'Agregar alertas',
      desc: 'Crea nuevas alertas para tus pacientes.'
    }
  ]

  const cardsEspecialista = [
    {
      to: '/misAlertas',
      icon: 'mdi-bell-alert',
      color: 'error',
      title: 'Mis alertas',
      desc: 'Gestiona y revisa tus alertas médicas.'
    },
    {
      to: '/especialistas/misConsultas',
      icon: 'mdi-stethoscope',
      color: 'success',
      title: 'Mis consultas',
      desc: 'Consulta y responde a las consultas de tus pacientes.'
    },
    {
      to: '/especialistas/misEstudios',
      icon: 'mdi-file-document-edit',
      color: 'primary',
      title: 'Mis estudios',
      desc: 'Gestiona y consulta tus estudios médicos.'
    },
    {
      to: '/especialistas/misPlantillas',
      icon: 'mdi-file-table-box-multiple',
      color: 'secondary',
      title: 'Mis plantillas',
      desc: 'Crea y administra tus plantillas de estudios.'
    }
  ]
</script>

<template>
  <v-container
    v-if="!loadingStore.loading"
    class="fill-height d-flex align-center justify-center home-container"
  >
    <v-row
      justify="center"
      align="center"
      class="w-100"
    >
      <v-col
        cols="12"
        md="8"
        lg="6"
      >
        <v-card
          class="pa-8 home-card"
          elevation="10"
        >
          <v-row
            align="center"
            class="mb-4"
          >
            <v-col cols="auto">
              <v-avatar size="64">
                <v-img src="@/assets/avatar-perfil-por-defecto.png" />
              </v-avatar>
            </v-col>
            <v-col>
              <h2
                class="mb-0 font-weight-bold home-title"
              >
                Hola{{ usuario && usuario.nombre ? `, ${usuario.nombre}` : '' }} 👋
              </h2>
              <div
                class="text-body-1 home-subtitle"
              >
                Bienvenido a tu espacio personal en <b>CareCenter</b>
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-row>
            <template v-if="usuario && usuario.tipo === 'PACIENTE'">
              <HomeCard
                v-for="card in cardsPaciente"
                :key="card.to"
                v-bind="card"
              />
            </template>
            <template v-else-if="usuario && usuario.tipo === 'MEDICO'">
              <HomeCard
                v-for="card in cardsMedico"
                :key="card.to"
                v-bind="card"
              />
            </template>
            <template v-else-if="usuario && usuario.tipo === 'ESPECIALISTA'">
              <HomeCard
                v-for="card in cardsEspecialista"
                :key="card.to"
                v-bind="card"
              />
            </template>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
}
.home-card {
  border-radius: 24px;
}
.home-title {
  color: #1976d2;
}
.home-subtitle {
  color: #555;
}
</style>