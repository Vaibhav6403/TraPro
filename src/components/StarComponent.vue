<template>
  <div class="star-rating">
<i
  v-for="n in maxStars"
  :key="n"
  :class="n <= internalRating ? 'fa-solid fa-star' : 'fa-regular fa-star'"
  :style="{
        color: '#FFD43B',
        cursor: 'pointer',
        fontSize: '24px',
        marginRight: '5px',
      }"
  @click="updateRating(n)"
></i>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";

const props = defineProps({
  maxStars: {
    type: Number,
    default: 5,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:rating"]);

const internalRating = ref(props.rating);

// Watch for prop updates from parent
watch(
  () => props.rating,
  (newVal) => {
    internalRating.value = newVal;
  }
);

// Emit changes on click (you’ll do this in your star click handler)
function updateRating(value) {
  internalRating.value = value;
  emit("update:rating", value);
}
</script>

<style scoped>
/* Optional hover effect */
.star-rating i:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>