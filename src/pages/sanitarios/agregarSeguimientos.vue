<script setup>
  import { ref, computed } from 'vue';
  import { usePacienteStore } from '@/stores/pacienteStore';
  import { usePlantillaStore } from '@/stores/plantillaStore';
  import { storeToRefs } from 'pinia';
  import { crearSeguimiento } from '@/services/apiSeguimientos';
  import { agregarSeguimientosPaciente } from '@/services/apiUsuarios';
  import { useLoadingStore } from '@/stores/loadingStore';
  const loadingStore = useLoadingStore()

  const pacienteStore = usePacienteStore()
  const plantillaStore = usePlantillaStore()

  const seguimientos = ref([])
  const pacientes = storeToRefs(pacienteStore)
  const plantillas = storeToRefs(plantillaStore)
  const pacientesAgregados = ref([])
  const idSeguimientos = ref([])

  const pacientesRestantes = computed(() => {
    pacientes.pacientes.value
    return pacientes.pacientes.value.filter((p) => !pacientesAgregados.value.includes(p))
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
      let response = await crearSeguimiento(body)
      if (!response.status == 201) {
        console.log("No se ha podido crear el seguimiento " + JSON.stringify(seguimiento))
        loadingStore.stop()
        return
      }

      let location = response.headers.get("location")
      let idSeguimiento = location.split("/")[6]
      idSeguimientos.value.push(idSeguimiento)
    }

    // Agregar los seguimientos a los pacientes
    for (let paciente of pacientesAgregados.value) {
      console.log(JSON.stringify(idSeguimientos.value))
      let response = await agregarSeguimientosPaciente(paciente.id, idSeguimientos.value)
      if (!response.status == 204) {
        console.log("No se ha podido agregar el seguimiento al usuario con id" + paciente.id)
        loadingStore.stop()
        return
      }
    }
    loadingStore.stop()
  }

  async function load() {
    loadingStore.start()
    await pacienteStore.loadPacientes()
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
          <p>Id: {{ paciente.id }}</p>
          <p>Nombre: {{ paciente.nombre }}</p>
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
                Id
              </th>
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
              <td>Id: {{ paciente.id }}</td>
              <td>Id: {{ paciente.nombre }}</td>
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
          <p>Id: {{ seguimiento.id }}</p>
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
        
        <v-date-picker 
          v-model="fecha"
          :min="fechaActual"
          color="primary"
          show-adjacent-months
          title="Seleccionar fecha"
        />

        <v-date-picker 
          v-model="plazo"
          :min="fecha"
          color="primary"
          show-adjacent-months
          title="Seleccionar plazo"
        />

        <v-select
          v-model="plantilla"
          label="Seleccionar plantilla"
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