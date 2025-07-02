<template>
  <div>
    <div>
      <div class="navbar">
        <div class="navbar-pri">
          <ul>
            <SearchBarPlaces @placeSend="setLocationFromSearch"/>
            <li
              @click="filterLocations(filter)"
              v-for="(filter, index) in filters"
              :key="index"
              class="nav-filter me-2"
            >
              <i :class="filter.icon" class="me-1"></i> {{ filter.label }}
              <span v-if="appliedFilterCheck(filter.label)" class="applied-filter-dot">
                {{ appliedFilterCheck(filter.label) }}
              </span>
            </li>
            <div class="d-flex align-items-center me-2">
              <i class="fa-solid fa-xmark me-1" @click="clearAllFilters"></i>
              Clear All
            </div>
            <div class="form-check form-switch ms-2">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                @change="socialModeChange"
                :checked="socialmode"
              />
              <label class="form-check-label" for="flexSwitchCheckDefault"
                >Social Mode</label
              >
            </div>
            <!-- <button @click="logOut">LogOut</button> -->
          </ul>
        </div>
        <div class="navbar-profile">
          <div class="navbar-search d-flex justify-content-center align-items-center">
            <template v-if="searchFriends">
            <SearchBar :userFriends="userFriends" />
            </template>
            <div >
              <i class="fa-solid fa-user-group me-3"  @click="toggleSearchFriends" :class="{ 'active-icon': searchFriends }"></i>
            </div>
          </div>
          <div class="notification-bell me-2">
            <i class="fa-solid fa-bell"></i>
            <span v-if="friendRequestsCheck()" class="notification-dot"></span>
          </div>
          <ul
            class="list-group position-absolute w-100 z-3 mt-1"
            v-if="friendRequestsCheck()"
          >
            <li
              v-for="(friend, index) in friendRequests"
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{{ friend }}</span>
              <button
                class="btn btn-sm btn-primary"
                @click="acceptFriendRequest(friend)"
              >
                Accept Request
              </button>
            </li>
          </ul>
          <button class="btn trip-btn me-2" @click="showCreateTripModal">
            <i class="fa-solid fa-bicycle"></i>
          </button>
          <div
            class="profile-icon d-flex align-items-center"
            @click="profileOpen"
          >
            <div class="profile-icon-circle me-2">
              <img src="../assets/boy.png" />
            </div>
            <div v-if="!isProfileOpen">
              <i class="fa-solid fa-angle-down"></i>
            </div>
            <div v-else>
              <i class="fa-solid fa-angle-up"></i>
            </div>
            <div v-if="isProfileOpen" class="profile-floating-div">
              <div>
                <i class="fa-solid fa-user me-1"></i>
                Edit Profile
              </div>
              <div @click="logOut">
                <i class="fa-solid fa-power-off me-1"></i>
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-container d-flex">
      <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <div class="trip-div" v-if="!isSidebarCollapsed">
          <ul v-if="selectedFilter">
            <li class="mb-2 fw-bold">{{ selectedFilter }} Options</li>
            <li
              v-for="(option, index) in getFilterOptions(selectedFilter)"
              :key="index"
            >
              <input
                type="checkbox"
                :id="option"
                :value="option"
                v-model="appliedFilters[selectedFilter]"
                class="me-2"
                @change="applyFilters()"
              />
              <label :for="option">{{ option }}</label>
            </li>
          </ul>
          <div v-else-if="viewMoreInfo" class="location-detail">
            <div
              class="detail-header d-flex justify-content-between align-items-center"
            >
              <h4>{{ selectedLocation.name }}</h4>
              <button @click="isEditing = !isEditing" class="edit-btn">
                {{ isEditing ? "Cancel" : "Edit" }}
              </button>
            </div>

            <img
              v-if="selectedLocation?.image"
              :src="selectedLocation.image.url"
              alt="Location Image"
              class="location-image"
            />

            <div class="location-info mt-3">
              <div
                class="info-group"
                v-for="(label, key) in infoLabels"
                :key="key"
              >
                <strong>{{ label }}:</strong>
                <span v-if="!isEditing">{{
                  selectedLocation[key] || "—"
                }}</span>
                <input
                  v-else
                  v-model="selectedLocation[key]"
                  :placeholder="label"
                  class="form-control mt-1"
                />
              </div>
            </div>

            <button
              v-if="isEditing"
              class="save-btn mt-3"
              @click="editLocation"
            >
              Save Changes
            </button>
          </div>
          <ul v-else>
            <li
              v-for="(trip, index) in trips"
              :key="index"
            >
              <div class="d-flex align-items-center justify-content-around">
                <div class="trip-profile" v-if="!isAddLocationToTrip">
                  <img :src="trip.image.url" v-if="trip?.image" />
                </div>
                <div v-else>
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :value="trip._id"
                    v-model="selectedTripIds"
                    @change="onTripSelectionChange(trip._id)"
                  />
                </div>
                <div>
                  {{ trip.name }}
                </div>
                <div class="d-flex justify-content-around align-items-center">
                  <div class="sidebar-buttons me-2" @click="getTrip(trip._id)"><i class="fa-solid fa-map-location-dot"></i></div>
                  <div class="sidebar-buttons"  @click="openTripChat(trip)"><i class="fa-solid fa-comments"></i></div>
                </div>
              </div>
            </li>
            <div v-if="isAddLocationToTrip" @click="addLocationsToTrip"><button>Add Location To Trips</button></div>
          </ul>
        </div>
        <div class="arrow-div" @click="toggleSidebar">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
        <div
          class="arrow-div"
          @click="toggleSidebar"
          v-if="!isSidebarCollapsed"
        >
          <i class="fa-solid fa-arrow-left"></i>
        </div>
      </div>
      <div class="main-content-container">
        <div
          v-if="selectedLocation"
          class="custom-popover"
          :style="{
            top: popoverPosition.y + 'px',
            left: popoverPosition.x + 'px',
          }"
        >
          <h3>{{ selectedLocation.value }}</h3>
          <img
            :src="selectedLocation.image.url"
            alt="Location Image"
            class="card-img"
            v-if="selectedLocation?.image"
          />
          <p class="mt-2">Time to Visit: {{ selectedLocation.timeOfDay }}</p>
          <p>Expense: {{ selectedLocation.price }}</p>
          <button @click="closeLocationInfo">Close</button>
          <button @click="viewLocationInfo">View More</button>
          <button @click="addLocationToTrip"><i class="fa-solid fa-location-dot"></i></button>
        </div>
        <div v-if="!selectedTrip">
          <div id="map"></div>
        </div>
        <div v-else class="chat-container">
          <h5>Chat: {{ selectedTrip.name }}</h5>
          <span>Close</span>
          <div class="chat-box">
            <div
              v-for="(msg, i) in tripMessages[selectedTrip._id]"
              :key="i"
              class="chat-message"
            >
              <strong>{{ msg.senderName }}:</strong> {{ msg.content }}
            </div>
          </div>
          <input
            v-model="chatInput"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
          />
        </div>

        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Location</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <input
                    type="text"
                    placeholder=" "
                    id="name"
                    v-model="locationData.name"
                  />
                  <label for="username">Name</label>
                </div>
                <div class="form-group">
                  <label for="locationType" class="select-label"
                    >Location Type</label
                  >
                  <select id="locationType" v-model="locationData.locationType">
                    <option disabled value="">Select Location Type</option>
                    <option
                      v-for="option in locationData.locationOptions"
                      :key="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="experienceType" class="select-label"
                    >Experience Type</label
                  >
                  <select
                    id="experienceType"
                    v-model="locationData.experienceType"
                  >
                    <option disabled value="">Select experience</option>
                    <option
                      v-for="option in locationData.experienceOptions"
                      :key="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>

                <!-- Preference -->
                <div class="form-group">
                  <label for="preference" class="select-label"
                    >Preference</label
                  >
                  <select id="preference" v-model="locationData.preference">
                    <option disabled value="">Select preference</option>
                    <option
                      v-for="option in locationData.preferenceOptions"
                      :key="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>

                <!-- Mood-based -->
                <div class="form-group">
                  <label for="moodBased" class="select-label">Mood-based</label>
                  <select id="moodBased" v-model="locationData.moodBased">
                    <option disabled value="">Select mood</option>
                    <option
                      v-for="option in locationData.moodOptions"
                      :key="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>

                <!-- Time of Day -->
                <div class="form-group">
                  <label for="timeOfDay" class="select-label"
                    >Time of Day</label
                  >
                  <select id="timeOfDay" v-model="locationData.timeOfDay">
                    <option disabled value="">Select time</option>
                    <option
                      v-for="option in locationData.timeOfDayOptions"
                      :key="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="timeOfDay" class="select-label"
                    >Suitable Mode of Transport</label
                  >
                  <select
                    id="modeOfTransport"
                    v-model="locationData.modeOfTransport"
                  >
                    <option disabled value="">Select Mode of Transport</option>
                    <option
                      v-for="option in locationData.modeOfTransportOptions"
                      :key="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="timeOfDay" class="select-label"
                    >Add images:</label
                  >
                  <input
                    type="file"
                    @change="handleFileChange"
                    accept="image/*"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="visited" class="select-label"
                    >Recommendation:</label
                  >
                  <select
                    id="recommended"
                    v-model="locationData.recommendation"
                  >
                    <option disabled value="">Select Recommendation</option>
                    <option
                      v-for="option in locationData.recommendationOptions"
                      :key="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    placeholder=" "
                    id="price"
                    v-model="locationData.price"
                  />
                  <label for="price">Price</label>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="addLocation()"
                >
                  Add Location
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Trip Modal -->
        <div
          class="modal fade"
          id="createTripModal"
          tabindex="-1"
          aria-labelledby="createTripLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="createTripLabel">Create a Trip</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input
                  type="text"
                  class="form-control mb-3"
                  v-model="tripData.name"
                  placeholder="Trip Name"
                />

                <label>Select Members:</label>
                <div
                  class="form-check"
                  v-for="friend in userFriends"
                  :key="friend"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :value="friend"
                    v-model="tripData.members"
                  />
                  <label class="form-check-label">{{ friend }}</label>
                </div>
                <div class="form-group">
                  <label for="timeOfDay" class="select-label"
                    >Group Image</label
                  >
                  <input
                    type="file"
                    @change="handleTripFileChange"
                    accept="image/*"
                    required
                  />
                </div>

                <!-- Placeholder for chat -->
                <div class="mt-3">
                  <label>Group Chat (Coming Soon)</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    disabled
                    placeholder="Chat will be enabled after trip creation..."
                  ></textarea>
                </div>
              </div>

              <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button class="btn btn-primary" @click="createTrip">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Clock Buttons -->
        <div class="social-clock">
          <div class="social-clock__list" :class="{ open: isMenuOpen }">
            <button
              class="social-clock__button twitter"
              title="Pointer"
              @click="togglePointer('click')"
            >
              <i class="fa-solid fa-arrow-pointer"></i>
            </button>
            <button
              class="social-clock__button github"
              title="Location"
              @click="togglePointer('current')"
            >
              <i class="fa-solid fa-location-crosshairs"></i>
            </button>
          </div>

          <button
            class="social-clock__trigger add-button"
            @click="toggleMenu"
            aria-label="Toggle Menu"
          >
            <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"
          ></path>
        </svg> -->
            <i class="fa-solid fa-plus p-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, onUnmounted } from "vue";
import maplibregl, { FormatExpression } from "maplibre-gl";
import markerImage from "../assets/mapmarker.png";
import crossmapmarker from "../assets/crossmapmarker.png";
import mapMarkerStar from "../assets/mapMarkerStar.png";
import locationPin from "../assets/location-pin.png";
import { Modal } from "bootstrap";
import axios from "axios";
import { useRouter } from "vue-router";
import {
  socket,
  connectSocket,
  subscribeToTrip,
  registerMessageHandler,
  isConnected,
  messages,
  tripMessages,
} from "../webSocket";
import Navbar from "./Navbar.vue";
import SearchBar from "./SearchBar.vue";
import SearchBarPlaces from "./SearchBarPlaces.vue";
const modalInstance = ref(null);
const map = ref(null);
const isMenuOpen = ref(false);
const locations = ref([]);
const pointerMode = ref("current");
const socialmode = ref(false);
const userFriends = ref([]);
const friendRequests = ref([]);
const router = useRouter();
const coordinatesCurr = reactive({
  lat: 0,
  lon: 0,
});
const locationData = reactive({
  name: "",
  latitude: "",
  longitude: "",
  experienceType: "",
  preference: "",
  moodBased: "",
  timeOfDay: "",
  maxTime: "",
  price: "",
  persons: "",
  username: "",
  modeOfTransport: "",
  recommendation: "",
  locationType: "",
  experienceOptions: [
    "Must-visit",
    "Scenic",
    "Hidden Gem",
    "Budget Friendly",
    "Lively",
    "Peaceful",
    "Aesthetic",
  ],
  preferenceOptions: ["Family", "Date", "Friends", "Solo", "Group Trips"],
  moodOptions: ["Romantic", "Chill", "Adventurous", "Unique", "Trending"],
  timeOfDayOptions: [
    "Best at Sunrise",
    "Best at Sunset",
    "Night View",
    "Day Activity",
  ],
  modeOfTransportOptions: ["Walk", "Bicycle", "Bike", "Car", "Bus"],
  recommendationOptions: ["Visited", "Recommended", "Not to visit"],
  locationTypeOptions: [
    "Hotel",
    "Restaurant",
    "Cafe",
    "Bar / Pub",
    "Attraction",
    "Shopping",
    "Transportation",
    "Park",
    "Museum",
    "Service",
    "Theatre",
    "Gas Station / Convenience Store",
    "Hospital",
  ],
  selectedFile: null,
});
const markers = reactive([]);
const isShowTripModal = ref(false);
const filters = reactive([
  { label: "Spot Highlights", icon: "fa-regular fa-star" },
  { label: "Preference", icon: "fa-solid fa-check" },
  { label: "Mood", icon: "fa-regular fa-face-smile" },
  { label: "Time", icon: "fa-solid fa-hourglass" },
  { label: "Price", icon: "fa-regular fa-money-bill-1" },
  { label: "Transport", icon: "fa-solid fa-car" },
  { label: "location", icon: "fa-solid fa-location-crosshairs" },
]);
const selectedLocation = ref("");
const popoverPosition = ref({ x: 0, y: 0 });
const userInfo = reactive({
  username: "",
  token: "",
});
const tripData = reactive({
  name: "",
  members: [],
  selectedFile: null,
});
const isProfileOpen = ref(false);
const trips = ref([]);
const isSidebarCollapsed = ref(true);
const selectedTrip = ref(null);
const chatInput = ref("");
const selectedFilter = ref("");
const appliedFilters = reactive({
  Mood: [],
  Preference: [],
  Transport: [],
  "Spot Highlights": [],
  Time: [],
  location: [],
  Price: [],
});
const viewMoreInfo = ref(false);
const isEditing = ref(false);
const infoLabels = {
  experienceType: "Experience Type",
  modeOfTransport: "Transport",
  moodBased: "Mood",
  preference: "Preference",
  timeOfDay: "Time to Visit",
  price: "Expense",
  recommendation: "Recommendation",
};
const searchFriends = ref(false);
const isAddLocationToTrip = ref(false);
const selectedTripIds= ref([]);



onMounted(() => {
  getUserLocation();
  let userId = localStorage.getItem("username");
  userInfo.token = localStorage.getItem("token");
  locationData.username = userId;
  getLocations();
  getUserFriends();
  getFriendRequests();
  getTrips();
  connectSocket(userInfo.token);
  setTimeout(() => {
    trips.value.forEach((trip) => {
      subscribeToTrip(trip._id);
    });
  }, 500);
  registerMessageHandler();
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// General Functions
const toggleSidebar = () => {
  debugger;
  if (!isSidebarCollapsed.value && viewMoreInfo.value)
    viewMoreInfo.value = !viewMoreInfo.value;
  isSidebarCollapsed.value = !isSidebarCollapsed.value;

  setTimeout(() => {
    map.value.resize();
  }, 300);
};
const profileOpen = () => {
  isProfileOpen.value = !isProfileOpen.value;
};
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
function togglePointer(value) {
  pointerMode.value = value;
  if (pointerMode.value == "current") {
    const modalEl = document.getElementById("exampleModal");
    modalInstance.value = new Modal(modalEl);
    locationData.latitude = coordinatesCurr.lat;
    locationData.longitude = coordinatesCurr.lon;
    modalInstance.value.show();
  }
}
const toggleSearchFriends = () => {
  searchFriends.value = !searchFriends.value;
};
function initMap(centerCoords) {
  if (map.value) {
    map.value.remove();
  }

  map.value = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm-layer",
          type: "raster",
          source: "osm",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
    center: centerCoords,
    zoom: 13,
  });
  map.value.on("click", (e) => {
    if (pointerMode.value == "click") {
      const clickedLngLat = e.lngLat;
      console.log("The clicked lat long is", clickedLngLat);
      const modalEl = document.getElementById("exampleModal");
      modalInstance.value = new Modal(modalEl);
      locationData.latitude = clickedLngLat.lat;
      locationData.longitude = clickedLngLat.lng;
      modalInstance.value.show();
      pointerMode.value = "";
    }
  });

  const markerEl = document.createElement("img");
  markerEl.src = markerImage;
  markerEl.style.width = "30px";
  markerEl.style.height = "30px";

  new maplibregl.Marker({ element: markerEl })
    .setLngLat(centerCoords)
    .setPopup(new maplibregl.Popup().setText("You are here"))
    .addTo(map.value);

  //   map.value.on("move", () => {
  //     debugger
  //   if (selectedLocation.value) {
  //     const [lng, lat] = selectedLocation.value.location.coordinates;
  //     const point = map.value.project([lng, lat]);
  //     popoverPosition.value = { x: point.x, y: point.y };
  //   }
  // });
}
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
const socialModeChange = debounce(async () => {
  debugger;
  socialmode.value = !socialmode.value;
  if (socialmode.value) {
    try {
      let request = {
        username: locationData.username,
      };
      let response = await axios.post(
        "http://localhost:5002/api/user/get-friends-location",
        request,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      createMarkers(response?.data?.locations);
    } catch (error) {}
  } else {
    getLocations();
  }
}, 300);
const logOut = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  router.push("/login");
};
const handleFileChange = (event) => {
  locationData.selectedFile = event.target.files[0];
};

// Trip and chat Functions
const createTrip = async () => {
  // debugger;
  try {
    tripData.members.push(locationData.username);
    const formData = new FormData();
    formData.append("createdBy", locationData.username);
    formData.append("name", tripData.name);
    tripData.members.forEach((member) => {
      formData.append("members", member);
    });
    formData.append("image", tripData.selectedFile);
    // const request = {
    //   createdBy: locationData.username,
    //   name: tripData.name,
    //   members: tripData.members,
    // };
    let response = await axios.post(
      "http://localhost:5002/api/user/create-trip",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (error) {
    console.error("the error in creating trip is", error);
  }
};
const getTrips = async () => {
  try {
    const request = {
      username: locationData.username,
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/get-trips",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
    trips.value = response.data;
  } catch (error) {
    console.error("the error in creating trip is", error);
  }
};
const getTrip = async (tripId) =>{
    try {
    const request = {
      tripId: tripId,
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/get-trip",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
    markers.forEach((marker) => marker.remove());
    markers.length = 0;
    createMarkers(response.data.trip.locations)
    drawTripLine(response.data.trip.locations); 

  } catch (error) {
    console.error("the error in creating trip is", error);
  }
}
const drawTripLine = (locations) => {
  const coordinates = locations.map(loc => loc.location.coordinates);

  if (map.value.getSource('tripLine')) {
    map.value.removeLayer('tripLineLayer');
    map.value.removeSource('tripLine');
  }

  map.value.addSource('tripLine', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    }
  });

  map.value.addLayer({
    id: 'tripLineLayer',
    type: 'line',
    source: 'tripLine',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#DC143C', 
      'line-width': 4,
      'line-dasharray': [2, 4] 
    }
  });
};
const showCreateTripModal = () => {
  // debugger;
  isShowTripModal.value = !isShowTripModal.value;

  if (isShowTripModal.value) {
    const tripmodal = document.getElementById("createTripModal");
    const tripmodalInstance = new Modal(tripmodal);
    tripmodalInstance.show();
  }
};
const handleTripFileChange = (event) => {
  tripData.selectedFile = event.target.files[0];
};
async function openTripChat(trip) {
  // debugger;
  if(!isAddLocationToTrip.value){
  selectedTrip.value = trip;
  // subscribeToTrip(trip._id);
  const request = {
    tripId: trip._id,
  };
  let response = await axios.post(
    "http://localhost:5002/api/user/get-trip-messages",
    request,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  // debugger;
  // Ensure message array exists
  if (!tripMessages.value[trip._id]) {
    tripMessages.value[trip._id] = response.data;
  }
}
}
function sendMessage() {
  if (!chatInput.value || !selectedTrip.value) return;

  const msg = {
    type: "chat",
    tripId: selectedTrip.value._id,
    content: chatInput.value,
  };

  socket.value.send(JSON.stringify(msg));
  chatInput.value = "";
}
const addLocationToTrip = async () =>{
  isSidebarCollapsed.value = false;
  isAddLocationToTrip.value = true;
}
const addLocationsToTrip = async () =>{
  try {
    const request = {
      tripIds:selectedTripIds.value,
      locationId:selectedLocation.value._id
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/add-location-to-trips",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
    isSidebarCollapsed.value = true;
    isAddLocationToTrip.value = false;
  } catch (error) {
    console.error("the error in creating trip is", error);
    isSidebarCollapsed.value = true;
    isAddLocationToTrip.value = false;
    selectedLocation.value = ''
  }
}

// Friend Functions
const acceptFriendRequest = async (friendUsername) => {
  try {
    let request = {
      username: locationData.username,
      friendUsername: friendUsername,
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/accept-friend-request",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // debugger;
    if (response.status === 200) {
      friendRequests.value = friendRequests.value.filter(
        (username) => username !== friendUsername
      );
    }
    console.log(response);
  } catch (error) {
    console.error("the error in accept friend request is", error);
  }
};
const getFriendRequests = async () => {
  try {
    let request = {
      username: locationData.username,
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/get-friend-requests",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    friendRequests.value = response.data.friendRequestUsernames;
  } catch (error) {
    console.error("the error in the getting friend request is", error);
  }
};
const intervalId = setInterval(getFriendRequests, 10000);

const getUserFriends = async () => {
  try {
    let request = {
      username: locationData.username,
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/get-friends",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    userFriends.value = response.data.userFriends.map(
      (friend) => friend.username
    );
  } catch (error) {
    console.error("the error in the get user friends is", error);
  }
};
const friendRequestsCheck = () => {
  return friendRequests.value && friendRequests.value.length > 0;
};

// Filter Functions
const filterLocations = (location) => {
  // debugger
  if (selectedFilter.value == location.label) selectedFilter.value = "";
  else {
    selectedFilter.value = location.label;
  }
};
const getFilterOptions = (filterLabel) => {
  switch (filterLabel) {
    case "Spot Highlights":
      return locationData.experienceOptions;
    case "Preference":
      return locationData.preferenceOptions;
    case "Mood":
      return locationData.moodOptions;
    case "Time":
      return locationData.timeOfDayOptions;
    case "Transport":
      return locationData.modeOfTransportOptions;
    case "Price":
      return ["Free", "Budget", "Moderate", "Expensive"];
    case "location":
      return locationData.locationTypeOptions;
    default:
      return [];
  }
};
const mapFilterKey = (filterLabel) => {
  const map = {
    "Spot Highlights": "experienceType",
    Preference: "preference",
    Mood: "moodBased",
    Time: "timeOfDay",
    Price: "price",
    Transport: "modeOfTransport",
    location: "locationType",
  };
  return map[filterLabel] || null;
};
const applyFilters = () => {
  debugger;
  markers.forEach((marker) => {
    const location = marker.location; // full location object from your data

    let isVisible = true;
    for (let filterLabel in appliedFilters) {
      const selectedValues = appliedFilters[filterLabel];
      const field = mapFilterKey(filterLabel);
      if (!field || !selectedValues.length) continue;

      const value = location[field];
      if (!selectedValues.includes(value)) {
        isVisible = false;
        break;
      }
    }

    marker.getElement().style.display = isVisible ? "block" : "none";
  });
};
const clearAllFilters = () => {
  for (const key in appliedFilters) {
    appliedFilters[key] = [];
  }
  applyFilters();
};
const appliedFilterCheck = (filterLabel) =>{
  return appliedFilters[filterLabel].length;
  // let count = 0;
  // appliedFilters[filterLabel].forEach((filters)=>{
  //   filters.forEach((filter)=>{
  //     if(filter == true)count++
  //   })
  // })
  // return count;
}

// Location Functions
const addLocation = async () => {
  const formData = new FormData();
  let request = {
    name: locationData.name,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    category: locationData.category,
    preference: locationData.preference,
    price: locationData.price,
    persons: locationData.persons,
    username: locationData.username,
    experienceType: locationData.experienceType,
    preference: locationData.preference,
    moodBased: locationData.moodBased,
    timeOfDay: locationData.timeOfDay,
    modeOfTransport: locationData.modeOfTransport,
    recommendation: locationData.recommendation,
    locationType: locationData.locationType,
  };
  for (const key in request) {
    formData.append(key, request[key]);
  }
  formData.append("image", locationData.selectedFile);
  try {
    let response = await axios.post(
      "http://localhost:5002/api/user/add-location",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status == 201) {
      console.log("response", response);
      modalInstance.value.hide();
    }
    const markerEl = document.createElement("img");
    markerEl.src = markerImage;
    markerEl.style.width = "30px";
    markerEl.style.height = "30px";

    new maplibregl.Marker({ element: markerEl })
      .setLngLat(response.data.location.coordinates)
      .addTo(map.value);
    map.value.flyTo({ center: response.data.location.coordinates, zoom: 14 });
  } catch (error) {
    console.error(error);
  }
};
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coordinatesCurr.lat = position.coords.latitude;
        coordinatesCurr.lon = position.coords.longitude;
        initMap([coordinatesCurr.lon, coordinatesCurr.lat]);
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        initMap([-0.1278, 51.5074]); // Fallback to London
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
    initMap([-0.1278, 51.5074]); // Fallback to London
  }
}
const getLocations = async () => {
  try {
    let request = {
      username: locationData.username,
    };
    const response = await axios.post(
      "http://localhost:5002/api/user/get-locations",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    locations.value = response.data.locations;
    createMarkers(locations.value);

    console.log(response);
  } catch (error) {
    console.error("the error occured is", error);
  }
};
const createMarkers = (locations) => {
  // debugger;
  markers.forEach((marker) => marker.remove());
  markers.length = 0;
  locations.forEach((location) => {
    let locationCor = location.location.coordinates;
    const markerEl = document.createElement("img");
    switch (location.recommendation) {
      case "Recommended":
        markerEl.src = mapMarkerStar;
        break;
      case "Visited":
        markerEl.src = locationPin;
        break;
      case "Not to visit":
        markerEl.src = crossmapmarker;
        break;
      default:
        markerEl.src = markerImage;
    }
    markerEl.style.width = "30px";
    markerEl.style.height = "30px";
    markerEl.dataset.id = location._id;
    let marker = new maplibregl.Marker({ element: markerEl })
      .setLngLat(locationCor)
      .addTo(map.value);
    marker.location = location;
    markerEl.addEventListener("click", () => {
      selectedLocation.value = location;

      const [lng, lat] = location.location.coordinates;
      const point = map.value.project([lng, lat]);

      popoverPosition.value = { x: point.x, y: point.y };
    });
    markers.push(marker);
  });
};
const viewLocationInfo = () => {
  isSidebarCollapsed.value = false;
  viewMoreInfo.value = true;
};
const closeLocationInfo = () => {
  selectedLocation.value = "";
  isSidebarCollapsed.value = true;
  viewMoreInfo.value = false;
};
const editLocation = async () => {
  try {
    debugger;
    const formData = new FormData();
    let request = {
      name: selectedLocation.value.name,
      userId: selectedLocation.value.User,
      latitude: selectedLocation.value.location.coordinates[1],
      longitude: selectedLocation.value.location.coordinates[0],
      category: selectedLocation.value.category,
      preference: selectedLocation.value.preference,
      price: selectedLocation.value.price,
      locationId: selectedLocation.value._id,
      experienceType: selectedLocation.value.experienceType,
      moodBased: selectedLocation.value.moodBased,
      timeOfDay: selectedLocation.value.timeOfDay,
      modeOfTransport: selectedLocation.value.modeOfTransport,
      recommendation: selectedLocation.value.recommendation,
      locationType: selectedLocation.value.locationType,
    };
    for (const key in request) {
      formData.append(key, request[key]);
    }
    if (selectedLocation.selectedFile) {
      formData.append("image", selectedLocation.selectedFile);
    }
    const response = await axios.post(
      "http://localhost:5002/api/user/edit-location",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    locations.value = [response.data];

    console.log(response);
  } catch (error) {
    console.error("the error occured is", error);
  }
};
const setLocationFromSearch = async (place) =>{
  console.log("Place from search:", place);

  const coordinates = [
    parseFloat(place.lon ?? place.location?.coordinates?.[0]),
    parseFloat(place.lat ?? place.location?.coordinates?.[1]),
  ];

  map.value.flyTo({
    center: coordinates,
    zoom: 14,
    speed: 1.5,
    curve: 1.4,
  });

}
</script>

<style scoped>
#map {
  width: 100;
  height: 100vh;
  border: 1px solid #ccc;
  position: relative;
}

.add-button {
  background-color: #007bff;
  color: white;
  font-size: 2rem;
  border-radius: 50%;
  padding: 10px;
  border: none;
  z-index: 20;
  cursor: pointer;
}

.maplibregl-control-container {
  display: none;
}

/* Social Clock Styles */
.social-clock {
  position: absolute !important;
  top: 90%;
  right: 7%;
  transform: translate(50%, -50%);
  height: 16rem;
  width: 16rem;
  border-radius: 16rem;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  z-index: 15;
}

/* List of buttons */
.social-clock__list {
  height: 4.5rem; /* 4rem button + 0.5rem padding */
  width: 4.5rem;
  left: calc(50% - 2.25rem); /* center horizontally */
  top: calc(50% - 2.25rem); /* center vertically */
  position: absolute;
  pointer-events: none;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: 0;
  transform: scale(0);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* When menu open, show buttons */
.social-clock__list.open {
  pointer-events: all;
  opacity: 1;
  transform: scale(1);
}

/* Individual buttons */
.social-clock__button {
  background: none;
  border: none;
  border-radius: 4rem;
  box-sizing: content-box;
  cursor: pointer;
  height: 4rem;
  width: 4rem;
  left: calc(50% - 2rem); /* center horizontally */
  top: calc(50% - 4rem / 2); /* center vertically */
  position: absolute;
  transform-origin: 50% 50%;
  pointer-events: all;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.social-clock__button:nth-child(1) {
  transform: rotate(-135deg) translate(5.5rem) rotate(135deg);
}

.social-clock__button:nth-child(2) {
  transform: rotate(-45deg) translate(5.5rem) rotate(45deg);
}
/* Button colors */
.social-clock__button.twitter {
  background-color: rgba(29, 161, 242, 0.3);
  border: 2px solid rgba(29, 161, 242, 0.7);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.social-clock__button.twitter:hover {
  background-color: rgba(29, 161, 242, 1);
  border-color: rgba(29, 161, 242, 1);
}

.social-clock__button.github {
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.9);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.social-clock__button.github:hover {
  background-color: rgba(0, 0, 0, 1);
  border-color: rgba(0, 0, 0, 1);
}

/* Icons inside buttons */
.social-clock__button i {
  color: #fff;
  font-size: 1.8rem;
}

/* Trigger button */
.social-clock__trigger {
  background: #000;
  border: none;
  border-radius: 4rem;
  height: 4rem;
  width: 4rem;
  z-index: 3;
  pointer-events: all;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.social-clock__trigger svg {
  fill: #fff;
  height: 60%;
  width: 60%;
}
.form-group {
  position: relative;
  margin-bottom: 20px;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}
.form-group label {
  position: absolute;
  left: 12px;
  top: 12px;
  font-size: 14px;
  color: #777;
  transition: top 0.3s ease, font-size 0.3s ease, color 0.3s ease;
}
.select-label {
  position: relative !important;
  left: 0px !important;
  top: 0px !important;
  margin-right: 5px;
}
.form-group input:focus {
  border-color: #007bff;
  outline: none;
}
.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label {
  top: -6px;
  font-size: 12px;
  color: #007bff;
  background-color: #ffffff;
  padding: 0 4px;
  border-radius: 4px;
  left: 8px;
}
.navbar {
  position: fixed;
  z-index: 500;
  width: 100%;
  background-color: #1d1a1f;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.navbar-pri {
  margin: 5px 0px;
}
.navbar-pri ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
  margin-bottom: 0;
}
.custom-popover {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: 250px;
  z-index: 1000;
  font-family: "Segoe UI", sans-serif;
  transition: opacity 0.3s ease-in-out;
}

.custom-popover h3 {
  margin-top: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.custom-popover .card-img {
  width: 100%;
  height: auto;
  margin-top: 8px;
  border-radius: 6px;
  object-fit: cover;
}

.custom-popover p {
  margin: 8px 0;
  font-size: 14px;
  color: #555;
}

.custom-popover button {
  margin-top: 10px;
  margin-right: 8px;
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #2e86de;
  color: white;
  transition: background-color 0.3s;
}

.custom-popover button:hover {
  background-color: #1b4f72;
}
.user-search {
  position: relative;
}

.notification-bell {
  position: relative;
  display: inline-block;
  font-size: 24px;
  color: #e4e827;
}

.notification-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white;
}
.applied-filter-dot{
  position: absolute;
  top: -10px;
    right: -5px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color:#1d1a1f;
  border-radius: 50%;
  border: 1px solid #e4e827;
  color: #e4e827;
}
.main-content-container {
  width: 100%;
  height: 100vh;
  flex: 1;
}
.sidebar {
  position: relative;
  width: 20vw;
  transition: width 0.3s ease;
}
.arrow-div {
  position: absolute;
  top: 200px;
  right: -20px;
  z-index: 200;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  background-color: #e4e827;
  align-items: center;
  cursor: pointer;
  border: 2px solid black;
}
.collapsed {
  width: 2vw !important;
}
.trip-div {
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  background-color: #f0f2f5;
  border-right: 1px solid #d1d7db;
  padding: 0;
  font-family: "Segoe UI", sans-serif;
  margin-top: 7vh;
}

.trip-div ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.trip-div li {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  background-color: #ffffff;
  transition: background-color 0.2s ease;
}

.trip-div li:hover {
  background-color: #ebebeb;
}

.trip-div li:active {
  background-color: #d9d9d9;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  background-color: #f8f9fa;
  border-left: 1px solid #dee2e6;
  margin-top: 30px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  margin-bottom: 1rem;
  max-height: 500px; /* or use 100% if parent is constrained */
}

.chat-message {
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background-color: #e9ecef;
  word-wrap: break-word;
}

.chat-message strong {
  color: #343a40;
  margin-right: 0.5rem;
}

.chat-container input {
  border: 1px solid #ced4da;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  width: 100%;
}
.nav-filter {
  background-color: #e4e827;
  padding: 2px 13px;
  border-radius: 15px;
  color: #1d1a1f;
  cursor: pointer;
  position: relative;
}
.navbar-profile {
  display: flex;
  align-items: center;
}
.profile-icon {
  position: relative;
  cursor: pointer;
}
.profile-floating-div {
  position: absolute;
  top: 50px;
  right: 0;
  width: 220px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  overflow-y: auto;
  max-height: 300px;
  padding: 10px 0;
  font-size: 14px;
}

.profile-floating-div > div {
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.profile-floating-div > div:hover {
  background-color: #f5f5f5;
}
.profile-icon-circle {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  overflow: hidden;
}
.profile-icon-circle img {
  height: 100%;
  width: 100%;
}
.form-switch .form-check-input {
  width: 30px;
  height: 20px;
  background-color: #e4e827;
  border: 2px solid #1d1a1f;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
  position: relative;
  cursor: pointer;
}

/* Toggle Thumb */
.form-switch .form-check-input::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  height: 15px;
  width: 15px;
  background-color: #1d1a1f;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
}

/* When switch is checked */
.form-switch .form-check-input:checked {
  background-color: #1d1a1f;
  border-color: #e4e827;
}

/* Move thumb when checked */
.form-switch .form-check-input:checked::before {
  transform: translateX(10px);
  background-color: #e4e827;
}

/* Optional: Label Styling */
.form-check-label {
  margin-left: 0px;
  font-weight: 600;
  color: #f8f9fa;
}
.nav-filter {
  font-size: 14px;
  font-weight: 500;
}
.trip-btn {
  background-color: none;
  color: #f8f9fa;
  font-size: 20px;
}
.sidebar {
}
.card-img {
  height: 100px;
  width: 100%;
}
.trip-profile img {
  height: 35px;
  width: 35px;
  border-radius: 50%;
}
.location-detail {
  padding: 20px;
  font-family: "Segoe UI", sans-serif;
  overflow-y: auto;
}

.detail-header h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.edit-btn,
.save-btn {
  background-color: #2e86de;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn:hover,
.save-btn:hover {
  background-color: #1b4f72;
}

.location-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 10px;
}

.location-info .info-group {
  margin: 10px 0;
}

.location-info input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.active-icon{
  color: #e4e827;
}
.sidebar-buttons{
  padding: 7px;
  border: 2px solid #1d1a1f;
  border-radius: 15px;
  background-color: #e4e827;
}
</style>
