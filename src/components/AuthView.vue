<template>
  <div class="main-banner">
    <!-- Enhanced floating elements -->
    <div class="floating-elements">
      <div class="floating-icon icon-plane">✈️</div>
      <div class="floating-icon icon-compass">🧭</div>
      <div class="floating-icon icon-camera">📸</div>
      <div class="floating-icon icon-map">🗺️</div>
      <div class="floating-icon icon-luggage">🧳</div>
    </div>
    
    <!-- Animated background elements -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    
    <!-- The form component -->
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { reactive, ref, watchEffect } from "vue";
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
  background: 
    linear-gradient(135deg, 
      rgba(52, 152, 219, 0.1) 0%, 
      rgba(155, 89, 182, 0.1) 50%, 
      rgba(231, 76, 60, 0.1) 100%
    ),
    url("../assets/newbackground1.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.main-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0.8) 100%
  );
  z-index: 1;
}

/* Enhanced floating elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.floating-icon {
  position: absolute;
  font-size: 3rem;
  opacity: 0.6;
  animation: floatAround 6s ease-in-out infinite;
  transition: all 0.3s ease;
  cursor: pointer;
}

.floating-icon:hover {
  transform: scale(1.2);
  opacity: 0.9;
}

.icon-plane {
 top: 15%;
    right: 32%;
  animation-delay: 0s;
}

.icon-compass {
  top: 36%;
    right: 35%;
  animation-delay: 1s;
}

.icon-camera {
  bottom: 25%;
    right: 35%;
  animation-delay: 2s;
}

.icon-map {
 top: 35%;
    right: 1%;
  animation-delay: 3s;
}

.icon-luggage {
  bottom: 15%;
    right: 2%;
  animation-delay: 4s;
}

/* Background decoration */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1));
  animation: circleFloat 8s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 70%;
  left: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 40%;
  left: 15%;
  animation-delay: 4s;
}

@keyframes floatAround {
  0%, 100% { 
    transform: translate(0, 0) rotate(0deg); 
  }
  25% { 
    transform: translate(10px, -15px) rotate(5deg); 
  }
  50% { 
    transform: translate(-5px, -25px) rotate(-3deg); 
  }
  75% { 
    transform: translate(-15px, -10px) rotate(7deg); 
  }
}

@keyframes circleFloat {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
    opacity: 0.1;
  }
  50% { 
    transform: translate(20px, -30px) scale(1.1); 
    opacity: 0.2;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-icon {
    font-size: 2rem;
  }
  
  .icon-plane {
    top: 20%;
    right: 10%;
  }
  
  .icon-compass {
    top: 70%;
    right: 5%;
  }
  
  .icon-camera {
    bottom: 30%;
    right: 15%;
  }
  
  .icon-map {
    top: 45%;
    right: 3%;
  }
  
  .icon-luggage {
    bottom: 20%;
    right: 8%;
  }
}
</style>