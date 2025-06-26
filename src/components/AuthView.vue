<template>
  <div class="main-banner d-flex justify-content-end align-items-center vh-100 position-relative">
    <!-- Floating icons on the white gradient part -->
    <img src="../assets/monument.png" class="floating-icon icon-2" alt="Monument" />
    <img src="../assets/statue-of-liberty.png" class="floating-icon icon-3" alt="Statue" />
    <img src="../assets/tower.png" class="floating-icon icon-4" alt="Tower" />
    <img src="../assets/airplane.png" class="floating-icon icon-plane"/>
    <img src="../assets/wavyline1.png" class="floating-icon icon-line"/>

    <!-- The form -->
    <component :is="currentComponent" />
  </div>
</template>



<script setup>
import { reactive,ref,watchEffect } from "vue";
import axios from "axios"
import LoginForm from "./LoginForm.vue"
import RegisterForm from "./RegisterForm.vue"
import { useRoute } from 'vue-router'


const currentComponent = ref(RegisterForm)
const route = useRoute()


watchEffect(() => {

  if (route.path === '/register') {
    currentComponent.value = RegisterForm
  } else if (route.path === '/login') {
    currentComponent.value = LoginForm
  } else {
    currentComponent.value = RegisterForm 
  }
})
</script>
<style scoped>
.main-banner {
  background-image: linear-gradient(
      109deg,
      rgba(0, 0, 0, 0) 56%,
      rgba(255, 255, 255, 1) 0%
    ),
    url("../assets/background.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}


/* Floating icons over the background gradient */
.floating-icon {
  position: absolute;
  object-fit: contain;
  opacity: 0.9;
  z-index: 1;
  transition: transform 0.3s ease;
}

.floating-icon:hover {
  transform: scale(1.15);
}

/* Individual icon positions & sizes */

.icon-2 {
  bottom: 1%;
    right: 34%;
    width: 171px;
}

.icon-3 {
      bottom: 2%;
    right: 10%;
    width: 144px;
}

.icon-4 {
      bottom: 1%;
    right: 5%;
    width: 144px;
}
.icon-plane{
    top: 31%;
    right: 29%;
    width: 110px;
}
.icon-line{
      top: 10%;
    right: 18%;
    width: 180px;
    transform: rotateX(4deg);
}

/* Form box styling */

</style>