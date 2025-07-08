<script setup>
  import { ref, computed } from 'vue';
  import { useSesionStore } from '@/stores/sesionStore';
  import { useSeguimientoStore } from '@/stores/seguimientoStore';
  import { useUsuarioStore } from '@/stores/usuarioStore';
  import { usePlantillaStore } from '@/stores/plantillaStore';
  import { storeToRefs } from 'pinia';
  import { useLoadingStore } from '@/stores/loadingStore';
  const loadingStore = useLoadingStore()

  const sesionStore = useSesionStore()
  const seguimientoStore = useSeguimientoStore()
  const usuarioStore = useUsuarioStore()
  const plantillaStore = usePlantillaStore()

  const usuario = ref(null)
  const seguimientos = ref([])
  const pacientes = ref([])
  const plantillas = storeToRefs(plantillaStore)
  const pacientesAgregados = ref([])
  const idSeguimientos = ref([])

  const pacientesRestantes = computed(() => {
    pacientes.value
    return pacientes.value.filter((p) => !pacientesAgregados.value.includes(p))
  })

  const agregarSeguimientoValue = ref(false)
  const agregarPacienteValue = ref(false)

  const cont = ref(0)
  const fechaActual = ref(new Date())

  const motivo = ref('')
  const fecha = ref(fechaActual.value)
  const plazo = ref(fechaActual.value)
  const plantilla = ref(null)

  function agregarSeguimiento() {
    let seguimiento = { 
      id: cont.value, 
      motivo: motivo.value, 
      fecha: fecha.value, 
      plazo: plazo.value, 
      plantilla: plantilla.value
    }
    seguimientos.value.push(seguimiento)
    cont.value++
    motivo.value = ''
    fecha.value = null
    plazo.value = null
    plantilla.value = null
    agregarSeguimientoValue.value = false
  }

  function agregarPaciente(paciente) {
    pacientesAgregados.value.push(paciente)
    agregarPacienteValue.value = false
  }

  async function publicarSeguimientos() {
    loadingStore.start()
    // Crear los seguimientos
    for (let seguimiento of seguimientos.value) {
      let body = {  
        motivo: seguimiento.motivo, 
        fecha: seguimiento.fecha, 
        plazo: seguimiento.plazo, 
        plantilla: seguimiento.plantilla.id
      }
      let id = await seguimientoStore.crearSeguimiento(body)

      idSeguimientos.value.push(id)
    }

    // Agregar los seguimientos a los pacientes
    for (let paciente of pacientesAgregados.value) {
      console.log(JSON.stringify(idSeguimientos.value))
      await usuarioStore.agregarSeguimientosPaciente(paciente.id, idSeguimientos.value)
    }
    alert("Seguimientos creados correctamente")
    motivo.value = ''
    fecha.value = null
    plazo.value = null
    plantilla.value = null
    pacientesAgregados.value = []
    seguimientos.value = []
    loadingStore.stop()
  }

  async function load() {
    loadingStore.start()
    usuario.value = await sesionStore.getUsuario()
    for (const idPaciente of usuario.value.pacientes) {
      const paciente = await usuarioStore.getUsuario(idPaciente)
      pacientes.value.push(paciente)
    }
    await plantillaStore.loadPlantillas()
    loadingStore.stop()
  }

  load()
</script>

<template>
  <v-container>
    <v-form>
      <v-list>
        <p>Pacientes:</p>
        <v-list-item 
          v-for="paciente in pacientesAgregados"
          :key="paciente.id"
        >
          <p>Nombre: {{ paciente.nombre }} {{ paciente.apellidos }}</p>
        </v-list-item>
      </v-list>

      <v-btn 
        prepend-icon="mdi-plus-outline" 
        @click="agregarPacienteValue = !agregarPacienteValue"
      >
        Agregar pacientes
      </v-btn>

      <v-container v-if="agregarPacienteValue">
        <v-table>
          <thead>
            <tr>
              <th>
                Nombre
              </th>
              <th>
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="paciente in pacientesRestantes"
              :key="paciente.id"
            >
              <td>Nombre: {{ paciente.nombre }} {{ paciente.apellidos }}</td>
              <td>
                <v-btn 
                  icon="mdi-plus" 
                  title="Agregar paciente"
                  @click="agregarPaciente(paciente)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-container>
      <v-list>
        <p>Seguimientos</p>
        <v-list-item 
          v-for="seguimiento in seguimientos"
          :key="seguimiento.id"
        >
          <p>Motivo: {{ seguimiento.motivo }}</p>
          <p>Fecha: {{ seguimiento.fecha }}</p>
          <p>Plazo: {{ seguimiento.plazo }}</p>
          <p>Plantilla: {{ seguimiento.plantilla.nombre }}</p>
        </v-list-item>
      </v-list>

      <v-btn 
        prepend-icon="mdi-plus-outline" 
        @click="agregarSeguimientoValue = !agregarSeguimientoValue"
      >
        Agregar seguimiento
      </v-btn>

      <v-container v-if="agregarSeguimientoValue">
        <v-text-field 
          v-model="motivo" 
          label="Motivo"
        />
        
        <v-text-field 
          v-model="fecha" 
          label="Fecha"
          type="datetime-local"
          :min="fechaActual.toISOString().slice(0, 16)"
        />

        <v-text-field 
          v-model="plazo" 
          label="Plazo"
          type="datetime-local"
          :min="fecha"
        />

        <v-select
          v-model="plantilla"
          label="Seleccionar formulario"
          item-title="nombre"
          :items="plantillas.plantillas.value"
          return-object
        />
        
        <v-btn 
          prepend-icon="mdi-plus-outline" 
          @click="agregarSeguimiento()"
        >
          Agregar seguimiento
        </v-btn>
      </v-container>
      <v-btn 
        prepend-icon="mdi-content-save" 
        @click="publicarSeguimientos()"
      >
        Guardar
      </v-btn>
    </v-form>
  </v-container>
</template>