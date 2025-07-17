<template>
  <div class="floating-buttons-container">
    <div class="glass-panel">
      <button
        v-if="canGoBack"
        class="circular-button back-button"
        @click="handleBackClick"
      >
        ↑
      </button>

      <button
        v-for="number in visibleNumbers"
        :key="number"
        class="circular-button"
        @click="handleButtonClick(number)"
        :class="number==activeIndex ? 'active': ''"
      >
        {{ number }}
      </button>

      <button
        v-if="hasMoreButtons"
        class="circular-button dots-button"
        @click="handleDotsClick"
      >
        ...
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  numbers: {
    type: Array,
    default: () => Array.from({ length: 20 }, (_, i) => i + 1)
  },
  maxVisible: {
    type: Number,
    default: 5
  },
  activeIndex: {
    type: Number,
    default: null
  }
})

// Emit
const emit = defineEmits(['button-click'])

const currentPage = ref(0)
const buttonsPerPage = props.maxVisible

// Computed properties
const visibleNumbers = computed(() => {
  const startIndex = currentPage.value * buttonsPerPage
  const endIndex = startIndex + buttonsPerPage
  return props.numbers.slice(startIndex, endIndex)
})

const canGoBack = computed(() => currentPage.value > 0)

const hasMoreButtons = computed(() => {
  return props.numbers.length > (currentPage.value + 1) * buttonsPerPage
})

// Event handlers
const handleButtonClick = (number) => {
  emit('button-click', number)
}

const handleBackClick = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const handleDotsClick = () => {
  const totalPages = Math.ceil(props.numbers.length / buttonsPerPage)
  currentPage.value = (currentPage.value + 1) % totalPages
}
</script>

<style scoped>
/* -- styles unchanged -- */
.floating-buttons-container {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  pointer-events: none;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  min-width: 70px;
  align-items: center;
}

.circular-button {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.circular-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.circular-button:active {
  transform: scale(0.95);
}

.back-button {
  background: rgba(255, 107, 107, 0.3);
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  transform: rotate(0deg);
}

.back-button:hover {
  background: rgba(255, 107, 107, 0.5);
  transform: scale(1.05) rotate(0deg);
}

.dots-button {
  background: rgba(74, 144, 226, 0.3);
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
}

.dots-button:hover {
  background: rgba(74, 144, 226, 0.5);
}

.circular-button.active {
  background: rgba(34, 197, 94, 0.6);
  color: white;
  border: 2px solid white;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .floating-buttons-container {
    right: 15px;
  }

  .glass-panel {
    padding: 12px;
    gap: 10px;
  }

  .circular-button {
    width: 48px;
    height: 48px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .floating-buttons-container {
    right: 10px;
  }

  .glass-panel {
    padding: 10px;
    gap: 8px;
  }

  .circular-button {
    width: 44px;
    height: 44px;
    font-size: 13px;
  }
}

@media (prefers-color-scheme: dark) {
  .glass-panel {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .circular-button {
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .circular-button:hover {
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>
