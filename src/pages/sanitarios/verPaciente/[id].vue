<script setup>
  import { useRoute } from 'vue-router'
  import { computed, ref } from 'vue'
  import { useUsuarioStore } from '@/stores/usuarioStore'
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const usuarioStore = useUsuarioStore()
  const seguimientoStore = useSeguimientoStore()

  const route = useRoute()
  const idPaciente = route.params.id
  const paciente = ref(null)

  const seguimientos = ref([])
  const sanitarios = ref({})
  const dialogNota = ref(false)
  const notaSeleccionada = ref(null)

  const nombreCompleto = computed(() => {
    if (paciente.value) {
      return `${paciente.value.nombre} ${paciente.value.apellidos}`
    }
    return ''
  })

  const fechaNacimientoConEdad = computed(() => {
    if (paciente.value && paciente.value.fechaNacimiento) {
      const fechaNac = new Date(paciente.value.fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - fechaNac.getFullYear()
      const mesActual = hoy.getMonth()
      const diaActual = hoy.getDate()
      const mesNac = fechaNac.getMonth()
      const diaNac = fechaNac.getDate()
      
      if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
        edad--
      }
      
      return `${paciente.value.fechaNacimiento} (${edad} años)`
    }
    return ''
  })

  async function loadSeguimientos() {
    for (let id of paciente.value.seguimientos) {
      let seguimiento  = await seguimientoStore.getSeguimiento(id)
      console.log(seguimiento)
      seguimientos.value.push(seguimiento)
    }
  }

  async function loadSanitarios() {
    if (paciente.value.notas) {
      for (let nota of paciente.value.notas) {
        if (nota.sanitario && !sanitarios.value[nota.sanitario]) {
          try {
            const sanitario = await usuarioStore.getUsuario(nota.sanitario)
            sanitarios.value[nota.sanitario] = sanitario
          } catch (error) {
            console.error('Error cargando sanitario:', error)
          }
        }
      }
    }
  }

  async function loadPaciente() {
    loadingStore.start()
    paciente.value = await usuarioStore.getUsuario(idPaciente)
    await loadSeguimientos()
    await loadSanitarios()
    console.log(seguimientoStore.seguimientos)
    loadingStore.stop()
  }

  function verNota(nota) {
    notaSeleccionada.value = nota
    dialogNota.value = true
  }

  function cerrarDialog() {
    dialogNota.value = false
    notaSeleccionada.value = null
  }

  loadPaciente()
</script>

<template>
  <v-container>
    <div v-if="!loadingStore.loading && paciente">
      <v-row>
        <v-col cols="4">
          <v-avatar
            image="@/assets/avatar-perfil-por-defecto.png"
            size="250"
          />
          <v-container>
            <v-text-field
              v-model="nombreCompleto"
              label="Nombre completo"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.email"
              label="Email"
              variant="solo"
              disabled
            />
            <v-text-field
              v-if="paciente.telefono"
              v-model="paciente.telefono"
              label="Teléfono"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="fechaNacimientoConEdad"
              label="Fecha de nacimiento"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.sexo"
              label="Sexo"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.direccion"
              label="Dirección"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.dni"
              label="DNI"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.nss"
              label="NSS"
              variant="solo"
              disabled
            />
          </v-container>
        </v-col>
        <v-col cols="8">
          <h2>Otra información de interés</h2>
          <p>Seguimientos</p>
          <v-table>
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Plazo</th>
                <th>Estado</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="seguimiento in seguimientos"
                :key="seguimiento.id"
              >
                <td>{{ seguimiento.motivo }}</td>
                <td>{{ seguimiento.fecha }}</td>
                <td>{{ seguimiento.plazo }}</td>
                <td>
                  <span v-if="new Date(seguimiento.formulario.fecha) > new Date()">
                    <v-chip
                      color="orange"
                      text-color="white"
                    >Pendiente</v-chip>
                  </span>
                  <span v-else-if="seguimiento.formulario.respuestas.length > 0">
                    <v-chip
                      color="green"
                      text-color="white"
                    >Completado</v-chip>
                  </span>
                  <span v-else>
                    <v-chip
                      color="red"
                      text-color="white"
                    >No rellenado</v-chip>
                  </span>
                </td>
                <td>
                  <router-link :to="`/verSeguimiento/${seguimiento.id}`">
                    <v-btn
                      icon="mdi-eye"
                      title="Ver seguimiento"
                    />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </v-table>

          <p>Alergias</p>
          <v-list>
            <v-list-item
              v-for="alergia in paciente.alergias"
              :key="alergia"
            >
              <v-list-item-content>{{ alergia }}</v-list-item-content>
            </v-list-item>
          </v-list>

          <p>Tratamientos</p>
          <v-list>
            <v-list-item
              v-for="tratamiento in paciente.tratamientos"
              :key="tratamiento"
            >
              <v-list-item-content>{{ tratamiento }}</v-list-item-content>
            </v-list-item>
          </v-list>

          <p>Notas del paciente</p>
          <v-table>
            <thead>
              <tr>
                <th>Asunto</th>
                <th>Sanitario</th>
                <th>Privado</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="nota in paciente.notas"
                :key="nota.id"
              >
                <td>{{ nota.asunto }}</td>
                <td>
                  {{ sanitarios[nota.sanitario] ? 
                      `${sanitarios[nota.sanitario].nombre} ${sanitarios[nota.sanitario].apellidos}` : 
                      'Cargando...' }}
                </td>
                <td>
                  <v-chip
                    :color="nota.privado ? 'green' : 'red'"
                    text-color="white"
                  >
                    {{ nota.privado ? "Privada" : "Pública" }}
                  </v-chip>
                </td>
                <td>
                  <v-btn
                    icon="mdi-text-box-outline"
                    title="Ver contenido"
                    class="mr-2"
                    @click="verNota(nota)"
                  />
                  <router-link :to="`./verNota/${nota.id}`">
                    <v-btn
                      icon="mdi-eye"
                      title="Ver nota"
                    />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </div>

    <!-- Dialog para mostrar contenido de la nota -->
    <v-dialog v-model="dialogNota" max-width="600px">
      <v-card v-if="notaSeleccionada">
        <v-card-title class="text-h5">
          {{ notaSeleccionada.asunto }}
        </v-card-title>
        <v-card-subtitle>
          Por: {{ sanitarios[notaSeleccionada.sanitario] ? 
                  `${sanitarios[notaSeleccionada.sanitario].nombre} ${sanitarios[notaSeleccionada.sanitario].apellidos}` : 
                  'Cargando...' }}
        </v-card-subtitle>
        <v-card-text>
          <v-chip
            :color="notaSeleccionada.privado ? 'green' : 'red'"
            text-color="white"
            class="mb-4"
          >
            {{ notaSeleccionada.privado ? "Nota Privada" : "Nota Pública" }}
          </v-chip>
          <div class="nota-contenido">
            {{ notaSeleccionada.contenido }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="cerrarDialog()">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.nota-contenido {
  white-space: pre-wrap;
  background-color: #ffffff;
  color: #333333;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  border-left: 4px solid #1976d2;
}
</style>


