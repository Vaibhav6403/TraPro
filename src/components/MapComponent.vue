<template>
    <div id="map" @mousemove="handleMouseMove" ref="mapContainer"></div>
</template>
<script setup>
import { onMounted, ref, reactive, onUnmounted } from "vue";
import axios from "axios";

const emit = defineEmits(['onMountCall'])
const mouseX = ref(0);
const mouseY = ref(0);
const mapContainer = ref(null);

onMounted(()=>{
    emit('onMountCall')
}) 
function handleMouseMove(e) {
  const rect = mapContainer.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;


}

</script>

<style scoped>

</style>
