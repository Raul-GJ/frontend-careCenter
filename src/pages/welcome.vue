<script setup>

</script>

<template>
  <v-container>
    <header>
      <v-app-bar>
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
          <v-btn>Login</v-btn>
        </router-link>
        <router-link to="/auth/registro">
          <v-btn>Registro</v-btn>
        </router-link>
      </v-app-bar>
    </header>
    <main>
      <h2>Bienvenido!</h2>
      <section>
        <article>
          <p>Esta es la página de bienvenida de la aplicación</p>
        </article>
      </section>
    </main>
  </v-container>
</template>