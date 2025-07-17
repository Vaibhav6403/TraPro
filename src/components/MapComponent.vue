<template>
    <div id="map"></div>
</template>
<script setup>
import { onMounted, ref, reactive, onUnmounted } from "vue";
import axios from "axios";

const emit = defineEmits(['onMountCall'])

onMounted(()=>{
    emit('onMountCall')
}) 

</script>

<style scoped>

</style>
