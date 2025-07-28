<template>
  <div class="trip-container">
    <MapComponent />

    <!-- Enhanced Professional Popover with Smart Positioning -->
    <PopOver
      :selectedLocation="selectedLocation"
      :windowSize="windowSize"
      :popoverPosition="popoverPosition"
      @toggle-info-display="toggleInfoDisplay"
      @close-info-display="closeLocationInfo"
    />

    <!-- Rounded Info Display (Top Right) -->
    <div
      v-if="selectedLocation && showInfoDisplay"
      class="info-display"
      ref="infoDisplay"
      @mousedown="mouseDown"
      :class="{ 'info-display-open': showInfoDisplay }"
    >
      <div class="info-display-header">
        <div class="info-title">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div>
            <h3>{{ selectedLocation.name }}</h3>
            <div class="location-rating">
              <div class="rating-stars">
                <svg
                  v-for="star in 5"
                  :key="star"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  :fill="
                    star <= parseInt(selectedLocation.rating)
                      ? '#fbbf24'
                      : 'none'
                  "
                  stroke="currentColor"
                  stroke-width="2"
                  class="star-icon"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  ></path>
                </svg>
                <span class="rating-text">{{ selectedLocation.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>
        <button
          @click="closeInfoDisplay"
          class="info-close-btn"
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="info-display-content">
        <!-- Quick Info Cards -->
        <div class="quick-info-grid">
          <div class="quick-info-card price-card">
            <div class="card-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path
                  d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                ></path>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-value">₹{{ selectedLocation.price }}</span>
              <span class="card-label">Entry Fee</span>
            </div>
          </div>

          <div class="quick-info-card transport-card">
            <div class="card-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"
                ></path>
                <path
                  d="M5 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM21 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
                ></path>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-value">{{
                selectedLocation.modeOfTransport
              }}</span>
              <span class="card-label">Transport</span>
            </div>
          </div>

          <div class="quick-info-card mood-card">
            <div class="card-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <div class="card-content">
              <span class="card-value">{{ selectedLocation.moodBased }}</span>
              <span class="card-label">Mood</span>
            </div>
          </div>
          
        </div>
        <div class="col-md-12 p-2">
          <div class="detail-item p-2">
            <div class="detail-icon time-icon">
              <svg
              width="14"
              height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-title">Selected Date</span>
                <VueDatePicker v-model="selectedDate"/>
              </div>
            </div>
          </div>

           <!-- Weather Section -->
        <div class="info-section" v-if="weatherData">
          <div class="section-header">
            <i class="fas fa-sun"></i>
            <span>Weather Forecast</span>
          </div>
          
          <div class="weather-card">
            <div class="weather-main">
              <div class="weather-primary">
                <div class="weather-icon">
                  <i :class="getWeatherIcon(weatherData.icon)"></i>
                </div>
                <div class="weather-temp">
                  <span class="temp-main"
                    >{{ Math.round(weatherData.temp) }}°F</span
                  >
                  <span class="temp-range"
                    >{{ Math.round(weatherData.tempmin) }}°F -
                    {{ Math.round(weatherData.tempmax) }}°F</span
                  >
                </div>
              </div>
              <div class="weather-condition">
                <div class="condition-text">{{ weatherData.conditions }}</div>
                <div class="condition-desc">
                  {{ getWeatherDescription(weatherData.icon) }}
                </div>
              </div>
            </div>

            <div class="weather-details">
              <div class="weather-detail-item">
                <div class="weather-detail-icon">
                  <i class="fas fa-tint"></i>
                </div>
                <div class="weather-detail-content">
                  <span class="weather-detail-value"
                    >{{ Math.round(weatherData.humidity) }}%</span
                  >
                  <span class="weather-detail-label">Humidity</span>
                </div>
              </div>

              <div class="weather-detail-item">
                <div class="weather-detail-icon">
                  <i class="fas fa-wind"></i>
                </div>
                <div class="weather-detail-content">
                  <span class="weather-detail-value"
                    >{{ Math.round(weatherData.windspeed) }} km/h</span
                  >
                  <span class="weather-detail-label">Wind Speed</span>
                </div>
              </div>

              <div class="weather-detail-item" v-if="weatherData.pressure">
                <div class="weather-detail-icon">
                  <i class="fas fa-thermometer-half"></i>
                </div>
                <div class="weather-detail-content">
                  <span class="weather-detail-value"
                    >{{ Math.round(weatherData.pressure) }} hPa</span
                  >
                  <span class="weather-detail-label">Pressure</span>
                </div>
              </div>

              <div class="weather-detail-item" v-if="weatherData.visibility">
                <div class="weather-detail-icon">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="weather-detail-content">
                  <span class="weather-detail-value"
                    >{{ Math.round(weatherData.visibility) }} km</span
                  >
                  <span class="weather-detail-label">Visibility</span>
                </div>
              </div>

              <div class="weather-detail-item" v-if="weatherData.uvindex">
                <div class="weather-detail-icon">
                  <i class="fas fa-sun"></i>
                </div>
                <div class="weather-detail-content">
                  <span class="weather-detail-value">{{
                    weatherData.uvindex
                  }}</span>
                  <span class="weather-detail-label">UV Index</span>
                </div>
              </div>

              <div class="weather-detail-item" v-if="weatherData.precipprob">
                <div class="weather-detail-icon">
                  <i class="fas fa-cloud-rain"></i>
                </div>
                <div class="weather-detail-content">
                  <span class="weather-detail-value"
                    >{{ Math.round(weatherData.precipprob) }}%</span
                  >
                  <span class="weather-detail-label">Rain Chance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Time and Preference Section -->
        <div class="info-section">
          <div class="section-header">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span>Visit Details</span>
          </div>
          <div class="visit-details-card">
            <div class="detail-item">
              <div class="detail-icon time-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-title">Best Time</span>
                <span class="detail-desc">{{
                  selectedLocation.timeOfDay
                }}</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-icon family-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-title">Preference</span>
                <span class="detail-desc">{{
                  selectedLocation.preference
                }}</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-icon recommendation-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4"></path>
                  <path
                    d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
                  ></path>
                  <path
                    d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
                  ></path>
                  <path
                    d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
                  ></path>
                  <path
                    d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
                  ></path>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-title">Status</span>
                <span class="detail-desc recommendation-badge">{{
                  selectedLocation.recommendation
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="info-section" v-if="selectedLocation.comments">
          <div class="section-header">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              ></path>
            </svg>
            <span>Personal Note</span>
          </div>
          <div class="comments-card">
            <div class="comment-content">
              <div class="quote-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                  ></path>
                  <path
                    d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                  ></path>
                </svg>
              </div>
              <p class="comment-text">{{ selectedLocation.comments }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Navigation Container -->
    <div class="navigation-container" v-if="tripLocations.length">
      <div class="navigation-header">
        <h4>Trip Locations</h4>
        <span class="location-count">{{ tripLocations.length }} stops</span>
      </div>
    </div>
    <NumberComponent
      :numbers="tripLocations.map((_, index) => index + 1)"
      :active-index="selectedIndex"
      :max-visible="7"
      @button-click="flyToLocation"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, nextTick, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import MapComponent from "./MapComponent.vue";
import axios from "axios";
import {
  createMarkers,
  getUserLocation,
  initMap,
  drawTripLine,
  removeTripLine,
} from "../repos/MainFunctions";
import NumberComponent from "./NumberComponent.vue";
import PopOver from "./PopOver.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs'

const route = useRoute();
const token = route.params.token;
const markers = reactive([]);
const map = ref(null);
const coordinatesCurr = reactive({
  lat: 0,
  lon: 0,
});
const tripLocations = ref([]);
const selectedIndex = ref(null);
const selectedLocation = ref("");
const mouseStart = ref(false);
const showInfoDisplay = ref(false);
const windowSize = ref({ width: 0, height: 0 });
const popoverPosition = ref({ x: 0, y: 0 });
const infoDisplay = ref(null);
const position = ref({ x: 100, y: 100 });
let offset = { x: 0, y: 0 };
const weatherData = ref(null);
const selectedDate = ref(null);

onMounted(() => {
  updateWindowSize();
  window.addEventListener("resize", updateWindowSize);
  getSharedTripData();
  getUserLocation(coordinatesCurr, map);
});
onUnmounted(() => {
  window.removeEventListener("mousemove", mouseMove);
  window.removeEventListener("mouseup", mouseUp);
});

const updateWindowSize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

watch(selectedDate, (newVal, oldVal) => {
  debugger
  const formatted = dayjs(selectedDate.value).format('YYYY-MM-DD')
  fetchWeatherData(selectedLocation.value.location.coordinates[0],selectedLocation.value.location.coordinates[1], formatted);
})

const mouseUp = () => {
  console.log("inside mouse up");
  infoDisplay.value.classList.remove("dragging");
  mouseStart.value = false;
  window.removeEventListener("mousemove", mouseMove);
  window.removeEventListener("mouseup", mouseUp);
};
const mouseDown = (event) => {
  console.log("inside mouse down");
  infoDisplay.value.classList.add("dragging");
  mouseStart.value = true;
  const rect = infoDisplay.value.getBoundingClientRect();

  offset.x = event.clientX - rect.left;
  offset.y = event.clientY - rect.top;

  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mouseup", mouseUp);
};
const mouseMove = (event) => {
  if (mouseStart.value && infoDisplay.value) {
    console.log(event.clientX);
    infoDisplay.value.style.left = event.clientX - offset.x + "px";
    infoDisplay.value.style.top = event.clientY - offset.y + "px";
  }
};

const getSharedTripData = async () => {
  try {
    let response = await axios.get(
      `http://${import.meta.env.VITE_API_URL}/api/user/shared-trip/${token}`
    );
    tripLocations.value = response.data.trip.locations;

    // Enhanced createMarkers call with position adjustment
    createMarkersWithPositioning(
      tripLocations.value,
      markers,
      map,
      selectedLocation,
      popoverPosition
    );
    drawTripLine(tripLocations.value, map);
  } catch (error) {
    console.error("Error fetching trip data:", error);
  }
};

const createMarkersWithPositioning = (
  locations,
  markers,
  map,
  selectedLocation,
  popoverPosition
) => {
  // Call your existing createMarkers function
  createMarkers(locations, markers, map, selectedLocation, popoverPosition);

  // Add smart positioning logic
  nextTick(() => {
    updateWindowSize();
  });
};
const getWeatherIcon = (apiIcon) => {
  const iconMap = {
    "clear-day": "fas fa-sun",
    "clear-night": "fas fa-moon",
    "partly-cloudy-day": "fas fa-cloud-sun",
    "partly-cloudy-night": "fas fa-cloud-moon",
    cloudy: "fas fa-cloud",
    rain: "fas fa-cloud-rain",
    snow: "fas fa-snowflake",
    wind: "fas fa-wind",
    fog: "fas fa-smog",
    thunderstorm: "fas fa-bolt",
    storm: "fas fa-cloud-bolt",
  };

  return iconMap[apiIcon] || "fas fa-cloud-sun";
};

const getWeatherDescription = (icon) => {
  const descriptions = {
    "clear-day": "Perfect Day",
    "clear-night": "Clear Night",
    "partly-cloudy-day": "Pleasant Day",
    "partly-cloudy-night": "Mild Night",
    cloudy: "Overcast",
    rain: "Rainy Day",
    snow: "Snowy",
    wind: "Windy",
    fog: "Misty",
    thunderstorm: "Stormy",
    storm: "Thunderstorm",
  };

  return descriptions[icon] || "Fair Weather";
};

const fetchWeatherData = async (lon,lat, date) => {
  debugger;
  try {
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${date}?key=J68CMNKM6B85E6CBKPW3Q32AA&elements=temp,tempmax,tempmin,humidity,windspeed,pressure,visibility,uvindex,precipprob,conditions,icon`
    );
    const data = response.data;
    weatherData.value = data.days[0]; // Get first day's data
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const flyToLocation = (index) => {
  const location = tripLocations.value[index - 1];
  selectedLocation.value = location;
  if (!location || !map.value) return;

  selectedIndex.value = index;

  const [lng, lat] = location.location.coordinates;
  map.value.flyTo({
    center: [lng, lat],
    zoom: 14,
    speed: 1.2,
    curve: 1.42,
    easing(t) {
      return t;
    },
  });
};

const closeLocationInfo = () => {
  selectedLocation.value = "";
  selectedIndex.value = null;
  showInfoDisplay.value = false;
};

const toggleInfoDisplay = async () => {
  
  showInfoDisplay.value = !showInfoDisplay.value;
};

const closeInfoDisplay = () => {
  showInfoDisplay.value = false;
};
</script>

<style scoped>
.trip-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100vh;
  border: 1px solid #e5e7eb;
  position: relative;
}

/* Enhanced Professional Popover with Smart Positioning */
.location-popover {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 90vw;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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

/* Enhanced Info Display with Better Blur */
.info-display {
  position: absolute;
  top: 20px;
  right: 10vw;
  width: 520px;
  max-width: 90vw;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  z-index: 999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  transform: translateY(-40px) scale(0.85);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
}
.info-display.dragging {
  transition: none !important;
  user-select: none;
  cursor: grabbing;
}

.info-display-open {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.info-display-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px 24px 0 0;
  gap: 16px;
  position: relative;
}

.info-display-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3) 20%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent
  );
}

.info-title {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  color: #0f172a;
  flex: 1;
}

.info-title svg {
  color: #3b82f6;
  margin-top: 3px;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2));
}

.info-title h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.location-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star-icon {
  color: #fbbf24;
  filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3));
}

.rating-text {
  font-size: 13px;
  color: #475569;
  font-weight: 600;
  margin-left: 4px;
}

.info-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.info-close-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.info-display-content {
  padding: 20px 24px 24px;
  max-height: 550px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-display-content::-webkit-scrollbar {
  width: 6px;
}

.info-display-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.info-display-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.info-display-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.quick-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.quick-info-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.quick-info-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quick-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.quick-info-card:hover::before {
  opacity: 1;
}

.price-card {
  border-left: 3px solid #10b981;
}

.transport-card {
  border-left: 3px solid #3b82f6;
}

.mood-card {
  border-left: 3px solid #f59e0b;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: #3b82f6;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.quick-info-card:hover .card-icon {
  transform: scale(1.1);
}

.price-card .card-icon {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.2),
    rgba(5, 150, 105, 0.2)
  );
  color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.transport-card .card-icon {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2),
    rgba(29, 78, 216, 0.2)
  );
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.mood-card .card-icon {
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.2),
    rgba(217, 119, 6, 0.2)
  );
  color: #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-value {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.card-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-section {
  margin-bottom: 28px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header svg {
  color: #3b82f6;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2));
}

.visit-details-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.time-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.family-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.recommendation-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.detail-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  font-weight: 500;
}

.recommendation-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.comments-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comments-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(251, 191, 36, 0.8),
    rgba(245, 158, 11, 0.8),
    rgba(251, 191, 36, 0.8)
  );
  border-radius: 20px 20px 0 0;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.comment-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.quote-icon {
  color: #f59e0b;
  opacity: 0.8;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.2));
}

.comment-text {
  font-size: 15px;
  color: #1e293b;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
  flex: 1;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Enhanced Navigation Container */
.navigation-container {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 500;
  min-width: 200px;
}

.navigation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.navigation-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.location-count {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}
/* Weather Section Styles */
.weather-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.weather-primary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
}

.weather-icon i {
  color: white;
}

.weather-temp {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.temp-main {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
}

.temp-range {
  font-size: 14px;
  color: #718096;
}

.weather-condition {
  text-align: right;
}

.condition-text {
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 4px;
}

.condition-desc {
  font-size: 12px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.weather-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.weather-detail-icon {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 12px;
}

.weather-detail-icon i {
  color: white;
}

.weather-detail-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.weather-detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.weather-detail-label {
  font-size: 10px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Weather icon color mappings for Font Awesome */
.weather-icon .fa-sun {
  color: #ffd700;
}
.weather-icon .fa-moon {
  color: #e6e6fa;
}
.weather-icon .fa-cloud-sun {
  color: #87ceeb;
}
.weather-icon .fa-cloud-moon {
  color: #b0c4de;
}
.weather-icon .fa-cloud {
  color: #d3d3d3;
}
.weather-icon .fa-cloud-rain {
  color: #4682b4;
}
.weather-icon .fa-snowflake {
  color: #f0f8ff;
}
.weather-icon .fa-wind {
  color: #87ceeb;
}
.weather-icon .fa-smog {
  color: #a9a9a9;
}
.weather-icon .fa-bolt {
  color: #ffd700;
}
.weather-icon .fa-cloud-bolt {
  color: #ffd700;
}

/* Default fallback */
.weather-icon i {
  color: white;
}

/* Custom Scrollbar */
.info-display-content::-webkit-scrollbar {
  width: 4px;
}

.info-display-content::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 2px;
}

.info-display-content::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px;
}

.info-display-content::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .info-display {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .location-popover {
    width: 300px;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    top: auto !important;
    left: auto !important;
  }

  .info-display {
    width: calc(100vw - 20px);
    right: 10px;
    top: 10px;
  }

  .navigation-container {
    left: 10px;
    top: 10px;
    padding: 12px;
    min-width: 180px;
  }
}
@media (max-width: 480px) {
  .info-display {
    width: 95vw;
    top: 10px;
    right: 10px;
    left: 10px;
    margin: 0 auto;
  }

  .quick-info-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .info-display-content {
    padding: 16px 20px 20px;
  }
}
</style>