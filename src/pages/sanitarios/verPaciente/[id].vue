<script setup>
  import { useRoute } from 'vue-router'
  import { computed, ref } from 'vue'
  import { usePacienteStore } from '@/stores/pacienteStore'
  import { useSeguimientoStore } from '@/stores/seguimientoStore'
  import { useLoadingStore } from '@/stores/loadingStore'
  const loadingStore = useLoadingStore()

  const pacienteStore = usePacienteStore()
  const seguimientoStore = useSeguimientoStore()

  const route = useRoute()
  const idPaciente = route.params.id
  const paciente = ref(null)

  const seguimientos = ref([])

  const nombreCompleto = computed(() => {
    if (paciente.value) {
      return `${paciente.value.nombre} ${paciente.value.apellidos}`
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

  async function loadPaciente() {
    loadingStore.start()
    paciente.value = await pacienteStore.getPaciente(idPaciente)
    await loadSeguimientos()
    console.log(seguimientoStore.seguimientos)
    loadingStore.stop()
  }

  loadPaciente()
</script>

<template>
  <v-container>
    <div v-if="!loadingStore.loading">
      <v-row>
        <v-col cols="4">
          <v-avatar
            image="@/assets/avatar-perfil-por-defecto.png"
            size="250"
          />
          <v-container>
            <v-text-field
              v-model="nombreCompleto"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.email"
              variant="solo"
              disabled
            />
            <v-text-field
              v-if="paciente.telefono"
              v-model="paciente.telefono"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.fechaNacimiento"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.sexo"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.direccion"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.dni"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.nss"
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
              <tr v-for="seguimiento in seguimientos" :key="seguimiento.id">
                <td>{{ seguimiento.motivo }}</td>
                <td>{{ seguimiento.fecha }}</td>
                <td>{{ seguimiento.plazo }}</td>
                <td>
                  <span v-if="new Date(seguimiento.formulario.fecha) > new Date()">
                    <v-chip color="orange" text-color="white">Pendiente</v-chip>
                  </span>
                  <span v-else-if="seguimiento.formulario.respuestas.length > 0">
                    <v-chip color="green" text-color="white">Completado</v-chip>
                  </span>
                  <span v-else>
                    <v-chip color="red" text-color="white">No rellenado</v-chip>
                  </span>
                </td>
                <td>
                  <router-link :to="`/verSeguimiento/${seguimiento.id}`">
                    <v-btn icon="mdi-eye" title="Ver seguimiento" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </v-table>

          <p>Alergias</p>
          <v-list>
            <v-list-item v-for="alergia in paciente.alergias" :key="alergia">
              <v-list-item-content>{{ alergia }}</v-list-item-content>
            </v-list-item>
          </v-list>

          <p>Tratamientos</p>
          <v-list>
            <v-list-item v-for="tratamiento in paciente.tratamientos" :key="tratamiento">
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
              <tr v-for="nota in paciente.notas" :key="nota.id">
                <td>{{ nota.asunto }}</td>
                <td>{{ nota.sanitario }}</td>
                <td>
                  <v-chip :color="nota.privado ? 'green' : 'red'" text-color="white">
                    {{ nota.privado ? "Privada" : "Pública" }}
                  </v-chip>
                </td>
                <td>
                  <router-link :to="`./verNota/${nota.id}`">
                    <v-btn icon="mdi-eye" title="Ver nota" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>


