<script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
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
              v-model="paciente.nombre"
              variant="solo"
              disabled
            />
            <v-text-field
              v-model="paciente.email"
              variant="solo"
              disabled
            />
          </v-container>
        </v-col>
        <v-col cols="8">
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
                  <span v-if="seguimiento.formulario.respuestas.length > 0">
                    <v-chip color="green" text-color="white">Completado</v-chip>
                  </span>
                  <span v-else>
                    <v-chip color="red" text-color="white">Pendiente</v-chip>
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
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>


