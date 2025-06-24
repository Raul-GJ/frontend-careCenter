<script setup>
  import { ref } from 'vue'
  import { modificarUsuario } from '@/services/apiUsuarios'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useMedicoStore } from '@/stores/medicoStore'
  import { useEspecialistaStore } from '@/stores/especialistaStore'
  import { useLoadingStore } from '@/stores/loadingStore'

  const loadingStore = useLoadingStore()
  const usuarioStore = useUsuarioStore()
  const medicoStore = useMedicoStore()
  const especialistaStore = useEspecialistaStore()

  const idUsuario = usuarioStore.getId()
  const usuario = ref(null)
  const medico = ref(null)
  const especialistas = ref([])
  
  const editarPerfil = ref(false)

  const datosPrevios = ref({})

  function comenzarEdicion() {
    datosPrevios.value = JSON.parse(JSON.stringify(usuario.value))
    editarPerfil.value = true
  }

  function cancelarEdicion() {
    Object.assign(usuario.value, datosPrevios.value)
    editarPerfil.value = false
  }

  async function editarUsuario() {
    loadingStore.start()
    let body = { 
      nombre: usuario.value.nombre,
      email: usuario.value.email,
      telefono: usuario.value.telefono
    }
    let response = await modificarUsuario(idUsuario, body)
    if (response.status != 204) {
      console.log("Error al modificar el usuario ")
    }
    usuarioStore.loadUsuario()
    editarPerfil.value = false
    loadingStore.stop()
  }

  async function loadUsuario() {
    loadingStore.start()
    usuario.value = await usuarioStore.getUsuario()
    medico.value = await medicoStore.getMedico(usuario.value.medicoCabecera)
    for (let id of usuario.value.especialistas) {
      let especialista = await especialistaStore.getEspecialista(id)
      especialistas.value.push(especialista)
    }
    console.log(usuario.value)
    loadingStore.stop()
  }

  loadUsuario()
</script>

<template>
  <v-container
    v-if="!loadingStore.loading"
    class="perfil-bg fill-height d-flex align-center justify-center"
  >
    <v-row
      class="perfil-row"
      align="start"
      justify="center"
    >
      <v-col
        cols="12"
        md="4"
        class="perfil-col"
      >
        <v-card
          class="pa-8 perfil-card perfil-card-scroll"
          elevation="8"
        >
          <div class="d-flex flex-column align-center mb-6">
            <v-avatar 
              image="@/assets/avatar-perfil-por-defecto.png" 
              size="150"
              class="perfil-avatar mb-4"
            />
            <h2 class="perfil-title mb-2">
              {{ usuario.nombre }} {{ usuario.apellidos }}
            </h2>
            <span class="perfil-subtitle">{{ usuario.email }}</span>
          </div>
          <v-container class="pa-0">
            <v-text-field
              v-model="usuario.nombre"
              variant="solo"
              :disabled="!editarPerfil"
              label="Nombre"
              class="perfil-field"
            />
            <v-text-field
              v-model="usuario.apellidos"
              variant="solo"
              :disabled="!editarPerfil"
              label="Apellidos"
              class="perfil-field"
            />
            <v-text-field
              v-model="usuario.email"
              variant="solo"
              :disabled="!editarPerfil"
              label="Email"
              class="perfil-field"
            />
            <v-text-field
              v-model="usuario.telefono"
              variant="solo"
              :disabled="!editarPerfil"
              label="Teléfono"
              class="perfil-field"
            />
            <v-text-field
              v-model="usuario.fechaNacimiento"
              variant="solo"
              :disabled="!editarPerfil"
              label="Fecha de nacimiento"
              class="perfil-field"
            />
            <v-text-field
              v-model="usuario.sexo"
              variant="solo"
              :disabled="!editarPerfil"
              label="Sexo"
              class="perfil-field"
            />
            <v-text-field
              v-model="usuario.direccion"
              variant="solo"
              :disabled="!editarPerfil"
              label="Dirección"
              class="perfil-field"
            />
            <v-text-field
              v-model="usuario.dni"
              variant="solo"
              :disabled="!editarPerfil"
              label="DNI"
              class="perfil-field"
            />
            <v-text-field
              v-if="usuario.tipo === 'PACIENTE'"
              v-model="usuario.nss"
              variant="solo"
              :disabled="!editarPerfil"
              label="NSS"
              class="perfil-field"
            />
            <v-text-field
              v-if="usuario.tipo === 'MEDICO' || usuario.tipo === 'ESPECIALISTA'"
              v-model="usuario.ncol"
              variant="solo"
              :disabled="!editarPerfil"
              label="Nº Colegiado"
              class="perfil-field"
            />
            <v-text-field
              v-if="usuario.tipo === 'MEDICO' || usuario.tipo === 'ESPECIALISTA'"
              v-model="usuario.centroDeSalud"
              variant="solo"
              :disabled="!editarPerfil"
              label="Centro de Salud"
              class="perfil-field"
            />
            <v-text-field
              v-if="usuario.tipo === 'ESPECIALISTA'"
              v-model="usuario.especialidad"
              variant="solo"
              :disabled="!editarPerfil"
              label="Especialidad"
              class="perfil-field"
            />
          </v-container>
          <div class="perfil-btns mt-6">
            <v-btn 
              v-if="!editarPerfil"
              append-icon="mdi-pencil-outline"
              color="primary"
              class="mr-2"
              @click="comenzarEdicion()"
            >
              Editar perfil
            </v-btn>
            <v-btn 
              v-if="editarPerfil"  
              append-icon="mdi-close-thick"
              color="error"
              class="mr-2"
              @click="cancelarEdicion()"
            >
              Cancelar
            </v-btn>
            <v-btn 
              v-if="editarPerfil"  
              append-icon="mdi-check-bold"
              color="success"
              @click="editarUsuario()"
            >
              Confirmar
            </v-btn>
          </div>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
        class="perfil-col"
      >
        <v-card
          class="pa-8 perfil-card"
          elevation="4"
        >
          <h3 class="perfil-section-title mb-6">
            Otra información de interés
          </h3>
          <v-container
            v-if="usuario.tipo === 'PACIENTE'"
            class="pa-0"
          >
            <v-list>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  Médico de cabecera
                </v-list-item-title>
                <v-list-item-subtitle v-if="medico">
                  {{ medico.nombre }} {{ medico.apellidos }}
                  <router-link :to="`/pacientes/verMedico/${medico.id}`">
                    <v-btn icon size="small" class="ml-2" title="Ver medico">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </router-link>
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  No asignado
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  Especialistas
                </v-list-item-title>
                <v-list-item-subtitle>
                  <ul class="perfil-list">
                    <li
                      v-for="especialista in especialistas"
                      :key="especialista.id"
                      class="d-flex align-center"
                    >
                      <span>{{ especialista.nombre }} {{ especialista.apellidos }}</span>
                      <router-link :to="`/pacientes/verEspecialista/${especialista.id}`">
                        <v-btn icon size="small" class="ml-2" title="Ver especialista">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </router-link>
                    </li>
                    <li v-if="especialistas.length === 0">
                      No hay especialistas asignados
                    </li>
                  </ul>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  Alergias
                </v-list-item-title>
                <v-list-item-subtitle>
                  <ul class="perfil-list">
                    <li
                      v-for="alergia in usuario.alergias || []"
                      :key="alergia"
                    >
                      {{ alergia }}
                    </li>
                    <li v-if="!usuario.alergias || usuario.alergias.length === 0">
                      Ninguna
                    </li>
                  </ul>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  Tratamientos
                </v-list-item-title>
                <v-list-item-subtitle>
                  <ul class="perfil-list">
                    <li
                      v-for="tratamiento in usuario.tratamientos || []"
                      :key="tratamiento"
                    >
                      {{ tratamiento }}
                    </li>
                    <li v-if="!usuario.tratamientos || usuario.tratamientos.length === 0">
                      Ninguno
                    </li>
                  </ul>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  Notas
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-table
                    v-if="usuario.notas && usuario.notas.length > 0"
                    class="perfil-table"
                  >
                    <thead>
                      <tr>
                        <th>Asunto</th>
                        <th>Sanitario</th>
                        <th>Privado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="nota in usuario.notas"
                        :key="nota.id"
                      >
                        <td>{{ nota.asunto }}</td>
                        <td>{{ nota.sanitario }}</td>
                        <td>
                          <v-chip
                            :color="nota.privado ? 'green' : 'red'"
                            text-color="white"
                          >
                            {{ nota.privado ? "Privada" : "Pública" }}
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <span v-else>No hay notas</span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.perfil-bg {
  background: transparent;
  min-height: 100vh;
}
.perfil-row {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
.perfil-col {
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 24px;
}
.perfil-card {
  width: 100%;
  border-radius: 24px;
  min-height: 100%;
}
.perfil-card-scroll {
  max-height: 600px;
  overflow-y: auto;
}
.perfil-avatar {
  border: 4px solid #1976d2;
}
.perfil-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
}
.perfil-subtitle {
  color: #888;
  font-size: 1.1rem;
}
.perfil-field {
  margin-bottom: 12px;
}
.perfil-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.perfil-section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1565c0;
  text-align: left;
}
.perfil-list {
  padding-left: 1.2em;
  margin: 0;
}
.perfil-table {
  margin-top: 8px;
}
@media (max-width: 960px) {
  .perfil-row {
    flex-direction: column;
    max-width: 100%;
  }
  .perfil-col {
    margin-bottom: 16px;
  }
  .perfil-card {
    padding: 24px !important;
    max-width: 100%;
  }
  .perfil-card-scroll {
    max-height: 400px;
  }
}
</style>