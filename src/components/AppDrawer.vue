<script setup>
import { computed } from 'vue'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const drawer = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const usuarioStore = useUsuarioStore()
const usuario = computed(() => usuarioStore.getUsuario())
const tipoUsuario = computed(() => usuario.value?.tipo)
const router = useRouter()

function cerrarSesion() {
  usuarioStore.logout()
  router.push('/')
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
  >
    <v-list-item>
      <router-link to="/perfil" :replace="false">
        <v-btn prepend-icon="mdi-account">
          Mi cuenta
        </v-btn>
      </router-link>
    </v-list-item>

    <v-divider />

    <v-list 
      v-if="tipoUsuario == 'ESPECIALISTA' || tipoUsuario == 'MEDICO'" 
      density="compact" 
      nav
    >
      <v-list-item>
        <router-link to="/sanitarios/misPacientes" :replace="false">
          <v-btn prepend-icon="mdi-account-group-outline">
            Mis pacientes
          </v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/misEstudios" :replace="false">
          <v-btn prepend-icon="mdi-folder">
            Mis estudios
          </v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/misPlantillas">
          <v-btn prepend-icon="mdi-list-box-outline">
            Mis plantillas
          </v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/misConsultas">
          <v-btn prepend-icon="mdi-chat-question">
            Mis consultas
          </v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/agregarAlertas">
          <v-btn prepend-icon="mdi-bell">
            Crear alertas
          </v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/sanitarios/agregarSeguimientos">
          <v-btn prepend-icon="mdi-list-box-outline">
            Crear seguimientos
          </v-btn>
        </router-link>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list 
      v-if="tipoUsuario == 'PACIENTE'" 
      density="compact" 
      nav
    >
      <v-list-item>
        <router-link to="/pacientes/misAlertas">
          <v-btn prepend-icon="mdi-bell">
            Mis alertas
          </v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/pacientes/misSeguimientos">
          <v-btn prepend-icon="mdi-list-box-outline">
            Mis seguimientos
          </v-btn>
        </router-link>
      </v-list-item>
      <v-list-item>
        <router-link to="/pacientes/misConsultas">
          <v-btn prepend-icon="mdi-chat-question">
            Mis consultas
          </v-btn>
        </router-link>
      </v-list-item>
    </v-list>
    <template #append>
      <v-list
        density="compact"
        nav
      >
        <v-list-item>
          <router-link to="/configuracion">
            <v-btn prepend-icon="mdi-cog">
              Configuración
            </v-btn>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/informacion">
            <v-btn prepend-icon="mdi-information">
              Información
            </v-btn>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/ayuda">
            <v-btn prepend-icon="mdi-help-circle">
              Ayuda
            </v-btn>
          </router-link>
        </v-list-item>
        <v-list-item>
          <v-btn
            class="text-red-lighten-1"
            prepend-icon="mdi-logout"
            @click="cerrarSesion"
          >
            Cerrar sesión
          </v-btn>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
