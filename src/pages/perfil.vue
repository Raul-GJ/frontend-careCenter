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
  <v-container v-if="!loadingStore.loading">
    <v-row>
      <v-col>
        <v-avatar 
          image="@/assets/avatar-perfil-por-defecto.png" 
          size="250"
        />
        <v-container>
          <v-text-field
            v-model="usuario.nombre"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-model="usuario.apellidos"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-model="usuario.email"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-model="usuario.telefono"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-model="usuario.fechaNacimiento"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-model="usuario.sexo"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-model="usuario.direccion"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-model="usuario.dni"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-if="usuario.tipo === 'PACIENTE'"
            v-model="usuario.nss"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-if="usuario.tipo === 'MEDICO' || usuario.tipo === 'ESPECIALISTA'"
            v-model="usuario.ncol"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-if="usuario.tipo === 'MEDICO' || usuario.tipo === 'ESPECIALISTA'"
            v-model="usuario.centroDeSalud"
            variant="solo"
            :disabled="!editarPerfil"
          />
          <v-text-field
            v-if="usuario.tipo === 'ESPECIALISTA'"
            v-model="usuario.especialidad"
            variant="solo"
            :disabled="!editarPerfil"
          />
        </v-container>
        <v-btn 
          v-if="!editarPerfil"
          append-icon="mdi-pencil-outline"
          @click="comenzarEdicion()"
        >
          Editar perfil
        </v-btn>
        <v-btn 
          v-if="editarPerfil"  
          append-icon="mdi-close-thick"
          @click="cancelarEdicion()"
        >
          Cancelar
        </v-btn>
        <v-btn 
          v-if="editarPerfil"  
          append-icon="mdi-check-bold"
          @click="editarUsuario()"
        >
          Confirmar
        </v-btn>
      </v-col>
      <v-col>
        <p>Otra Información de interés</p>
        <v-container v-if="usuario.tipo === 'PACIENTE'">
          <v-list>
            <v-list-item>
              <v-list-item-title>Médico de cabecera</v-list-item-title>
              <v-list-item-subtitle v-if="medico">
                {{ medico.nombre }} {{ medico.apellidos }} ({{ medico.email }})
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                No asignado
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Especialistas</v-list-item-title>
              <v-list-item-subtitle>
                <ul>
                  <li v-for="especialista in especialistas" :key="especialista.id">
                    {{ especialista.nombre }} {{ especialista.apellidos }} ({{ especialista.email }})
                  </li>
                  <li v-if="especialistas.length === 0">No hay especialistas asignados</li>
                </ul>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Alergias</v-list-item-title>
              <v-list-item-subtitle>
                <ul>
                  <li v-for="alergia in usuario.alergias || []" :key="alergia">{{ alergia }}</li>
                  <li v-if="!usuario.alergias || usuario.alergias.length === 0">Ninguna</li>
                </ul>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Tratamientos</v-list-item-title>
              <v-list-item-subtitle>
                <ul>
                  <li v-for="tratamiento in usuario.tratamientos || []" :key="tratamiento">{{ tratamiento }}</li>
                  <li v-if="!usuario.tratamientos || usuario.tratamientos.length === 0">Ninguno</li>
                </ul>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Notas</v-list-item-title>
              <v-list-item-subtitle>
                <v-table v-if="usuario.notas && usuario.notas.length > 0">
                  <thead>
                    <tr>
                      <th>Asunto</th>
                      <th>Sanitario</th>
                      <th>Privado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="nota in usuario.notas" :key="nota.id">
                      <td>{{ nota.asunto }}</td>
                      <td>{{ nota.sanitario }}</td>
                      <td>
                        <v-chip :color="nota.privado ? 'green' : 'red'" text-color="white">
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
      </v-col>
    </v-row>
  </v-container>
</template>