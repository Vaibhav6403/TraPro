<template>
       <div
      v-if="selectedLocation"
      class="location-popover"
      :style="popoverStyle"
      :class="{ 'popover-mobile': isMobileView }"
    >
      <!-- Close Button -->
      <button @click="closeLocationInfo" class="close-btn" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Location Image -->
      <div class="image-container" v-if="selectedLocation?.image">
        <img
          :src="selectedLocation.image.url"
          :alt="selectedLocation.name"
          class="location-image"
        />
        <div class="image-overlay"></div>
      </div>

      <!-- Content -->
      <div class="popover-content">
        <h3 class="location-title">{{ selectedLocation.name }}</h3>
        
        <div class="location-details">
          <div class="detail-item">
            <div class="detail-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <div class="detail-content">
              <span class="detail-label">Best Time to Visit</span>
              <span class="detail-value">{{ selectedLocation.timeOfDay }}</span>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="detail-content">
              <span class="detail-label">Expected Cost</span>
              <span class="detail-value expense">{{ selectedLocation.price }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="flyToLocation(selectedIndex)" class="action-btn primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Focus Here
          </button>
          <button @click="toggleInfoDisplay" class="action-btn info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
            </svg>
            Weather & Notes
          </button>
        </div>
      </div>
    </div> 
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
 selectedLocation: {
  type: Object,
  default: null
}
,
  windowSize:{
    type:Object
  },
  popoverPosition:{
    type:Object
  }
})
const emit = defineEmits(['toggle-info-display','close-info-display'])
const closeLocationInfo = () =>{
  emit('close-info-display')
}
const toggleInfoDisplay = () =>{
  emit('toggle-info-display');
}


onMounted(()=>{
    debugger
   
})

const isMobileView = computed(() => props.windowSize.width <= 768);
const infoDisplayWidth = computed(() => isMobileView.value ? props.windowSize.width - 20 : 350);
const popoverWidth = computed(() => isMobileView.value ? Math.min(300, props.windowSize.width - 20) : 320);

// Smart positioning for popover
const popoverStyle = computed(() => {
  if (isMobileView.value) {
    return {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${popoverWidth.value}px`,
      top: 'auto'
    };
  }

  let x = props.popoverPosition.x;
  let y = props.popoverPosition.y;
  
  // Adjust for screen boundaries
  const margin = 20;
  const popoverW = popoverWidth.value;
  const popoverH = 400; // Approximate popover height
  
  // Right boundary check
  if (x + popoverW > props.windowSize.width - margin) {
    x = props.windowSize.width - popoverW - margin;
  }
  
  // Left boundary check
  if (x < margin) {
    x = margin;
  }
  
  // Bottom boundary check
  if (y + popoverH > props.windowSize.height - margin) {
    y = props.windowSize.height - popoverH - margin;
  }
  
  // Top boundary check
  if (y < margin) {
    y = margin;
  }
  
  
  
  return {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    width: `${popoverW}px`
  };
});
</script>
<style scoped>
/* Enhanced Professional Popover with Smart Positioning */
.location-popover {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 90vw;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  animation: popoverEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom center;
  position: absolute;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.location-popover.popover-mobile {
  position: fixed !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  top: auto !important;
  animation: popoverMobileEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popoverEnter {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    backdrop-filter: blur(25px);
  }
}

@keyframes popoverMobileEnter {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(100px) scale(0.9);
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    backdrop-filter: blur(25px);
  }
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
}

.image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.location-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.location-image:hover {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  pointer-events: none;
}

.popover-content {
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.location-title {
  margin: 0 0 20px 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.location-details {
  margin-bottom: 24px;
  space-y: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.detail-value.expense {
  color: #059669;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex: 1;
  justify-content: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
}

.action-btn.info {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.action-btn.info:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
}
</style>
