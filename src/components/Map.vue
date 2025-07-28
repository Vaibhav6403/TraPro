<template>
  <div>
    <div>
      <div class="navbar">
        <div class="navbar-pri">
          <div class="navbar-content">
            <div class="search-section">
              <SearchBarPlaces @placeSend="setLocationFromSearch" />
            </div>

            <div class="filters-section">
              <div class="filters-container">
                <!-- Always visible filters (first 3) -->
                <div class="visible-filters">
                  <div
                    v-for="(filter, index) in visibleFilters"
                    :key="index"
                    @click="filterLocations(filter)"
                    class="nav-filter"
                  >
                    <i :class="filter.icon" class="filter-icon"></i>
                    <span class="filter-label">{{ filter.label }}</span>
                    <span
                      v-if="appliedFilterCheck(filter.label)"
                      class="applied-filter-dot"
                    >
                      {{ appliedFilterCheck(filter.label) }}
                    </span>
                  </div>
                </div>

                <!-- More filters button -->
                <div
                  v-if="hiddenFilters.length > 0"
                  class="more-filters-btn"
                  @click="toggleFilters"
                >
                  <i class="fa-solid fa-ellipsis-h"></i>
                </div>

                <!-- Hidden filters (collapsible) -->
                <div class="hidden-filters" :class="{ show: showAllFilters }">
                  <div
                    v-for="(filter, index) in hiddenFilters"
                    :key="index + 3"
                    @click="filterLocations(filter)"
                    class="nav-filter"
                  >
                    <i :class="filter.icon" class="filter-icon"></i>
                    <span class="filter-label">{{ filter.label }}</span>
                    <span
                      v-if="appliedFilterCheck(filter.label)"
                      class="applied-filter-dot"
                    >
                      {{ appliedFilterCheck(filter.label) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Clear all button -->
              <div class="clear-all-btn" @click="clearAllFilters">
                <i class="fa-solid fa-xmark"></i>
                <span>Clear All</span>
              </div>
            </div>

            <!-- Social mode toggle -->
            <div class="social-toggle">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  @change="socialModeChange"
                  :checked="socialmode"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault">
                  Social Mode
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-profile">
          <!-- Friends search section -->
          <div class="friends-search-section">
            <div
              class="search-friends-container"
              :class="{ expanded: searchFriends }"
            >
              <template v-if="searchFriends">
                <SearchBar :userFriends="userFriends" />
              </template>
            </div>
            <div class="friends-toggle-btn" @click="toggleSearchFriends">
              <i
                class="fa-solid fa-user-group"
                :class="{ 'active-icon': searchFriends }"
              ></i>
            </div>
          </div>

          <!-- Notification bell -->
          <div class="notification-section">
            <div class="notification-bell">
              <i
                class="fa-solid fa-bell pe-auto"
                @click="showNotification(true)"
              ></i>
              <span
                v-if="friendRequestsCheck()"
                class="notification-dot"
              ></span>
            </div>

            <!-- Friend requests dropdown -->
            <div
              class="friend-requests-dropdown"
              v-if="friendRequestsCheck() && showNotificationDropdown"
            >
              <div
                class="dropdown-header d-flex justify-content-between align-items-center"
              >
                <span>Friend Requests</span>
                <i
                  class="fa-solid fa-xmark"
                  @click="showNotification(false)"
                ></i>
              </div>
              <div
                v-for="(friend, index) in friendRequests"
                :key="index"
                class="friend-request-item"
              >
                <div class="friend-info">
                  <span class="friend-name">{{ friend }}</span>
                </div>
                <button class="accept-btn" @click="acceptFriendRequest(friend)">
                  Accept
                </button>
              </div>
            </div>
          </div>

          <!-- Trip button -->
          <div class="trip-btn-container">
            <button class="btn trip-btn" @click="showCreateTripModal">
              <i class="fa-solid fa-bicycle"></i>
              <span class="trip-btn-text">Trip</span>
            </button>
          </div>

          <!-- Profile section -->
          <div class="profile-section" ref="profileRef">
            <div class="profile-icon" @click="profileOpen">
              <div class="profile-icon-circle">
                <img src="../assets/boy.png" alt="Profile" />
              </div>
              <div class="profile-arrow">
                <i
                  class="fa-solid"
                  :class="isProfileOpen ? 'fa-angle-up' : 'fa-angle-down'"
                ></i>
              </div>

              <!-- Profile dropdown -->
              <div v-if="isProfileOpen" class="profile-floating-div">
                <div class="profile-menu-item" @click="goToProfile">
                  <i class="fa-solid fa-user"></i>
                  <span>Edit Profile</span>
                </div>
                <div class="profile-menu-item" @click="logOut">
                  <i class="fa-solid fa-power-off"></i>
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-container d-flex">
      <!-- Improved Sidebar -->
      <div class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <div class="sidebar-content" v-if="!isSidebarCollapsed">
          <!-- Filter Options -->
          <div class="sidebar-section" v-if="selectedFilter">
            <div class="section-header">
              <h6>
                <i class="fas fa-filter me-2"></i>{{ selectedFilter }} Options
              </h6>
            </div>
            <div class="filter-options">
              <div
                class="filter-option"
                v-for="(option, index) in getFilterOptions(selectedFilter)"
                :key="index"
              >
                <input
                  type="checkbox"
                  :id="option"
                  :value="option"
                  v-model="appliedFilters[selectedFilter]"
                  class="form-check-input"
                  @change="applyFilters()"
                />
                <label :for="option" class="filter-label">{{ option }}</label>
              </div>
            </div>
          </div>

          <!-- Location Detail -->
          <div class="sidebar-section location-detail" v-else-if="viewMoreInfo">
            <div class="section-header">
              <h6>{{ selectedLocation.name }}</h6>
              <button
                @click="isEditing = !isEditing"
                class="btn btn-sm btn-outline-primary edit-btn"
              >
                <i :class="isEditing ? 'fas fa-times' : 'fas fa-edit'"></i>
                {{ isEditing ? "Cancel" : "Edit" }}
              </button>
            </div>

            <div
              class="location-image-container"
              v-if="selectedLocation?.image"
            >
              <img
                :src="selectedLocation.image.url"
                alt="Location Image"
                class="location-image"
              />
            </div>

            <div class="location-info">
              <!-- Location Name -->
              <div class="form-group mb-3">
                <div>Location Name</div>
                <div v-if="!isEditing">{{ selectedLocation.name || "—" }}</div>
                <input
                  v-else
                  v-model="selectedLocation.name"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Location Name"
                  required
                />
              </div>

              <!-- Experience Type -->
              <div class="form-group mb-3">
                <div>Experience Type</div>
                <div v-if="!isEditing">
                  {{ selectedLocation.experienceType || "—" }}
                </div>
                <select
                  v-else
                  v-model="selectedLocation.experienceType"
                  class="form-select form-select-sm"
                  required
                >
                  <option
                    v-for="option in locationData.experienceOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- Preference -->
              <div class="form-group mb-3">
                <div>Preference</div>
                <div v-if="!isEditing">
                  {{ selectedLocation.preference || "—" }}
                </div>
                <select
                  v-else
                  v-model="selectedLocation.preference"
                  class="form-select form-select-sm"
                >
                  <option
                    v-for="option in locationData.preferenceOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- Mood -->
              <div class="form-group mb-3">
                <div>Mood</div>
                <div v-if="!isEditing">
                  {{ selectedLocation.moodBased || "—" }}
                </div>
                <select
                  v-else
                  v-model="selectedLocation.moodBased"
                  class="form-select form-select-sm"
                >
                  <option
                    v-for="option in locationData.moodOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- Time of Day -->
              <div class="form-group mb-3">
                <div>Best Time to Visit</div>
                <div v-if="!isEditing">
                  {{ selectedLocation.timeOfDay || "—" }}
                </div>
                <select
                  v-else
                  v-model="selectedLocation.timeOfDay"
                  class="form-select form-select-sm"
                >
                  <option
                    v-for="option in locationData.timeOfDayOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- Transport -->
              <div class="form-group mb-3">
                <div>Mode of Transport</div>
                <div v-if="!isEditing">
                  {{ selectedLocation.modeOfTransport || "—" }}
                </div>
                <select
                  v-else
                  v-model="selectedLocation.modeOfTransport"
                  class="form-select form-select-sm"
                >
                  <option
                    v-for="option in locationData.modeOfTransportOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- Recommendation -->
              <div class="form-group mb-3">
                <div>Recommendation</div>
                <div v-if="!isEditing">
                  {{ selectedLocation.recommendation || "—" }}
                </div>
                <select
                  v-else
                  v-model="selectedLocation.recommendation"
                  class="form-select form-select-sm"
                >
                  <option
                    v-for="option in locationData.recommendationOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- Price -->
              <div class="form-group mb-3">
                <div class="info-label">Price Range</div>
                <div v-if="!isEditing">{{ selectedLocation.price || "—" }}</div>
                <input
                  v-else
                  v-model="selectedLocation.price"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Price"
                />
              </div>

              <div class="mt-2 mb-2">
                <StarComponent
                  :maxStars="5"
                  @update:rating="selectedRating = $event"
                  :rating="selectedLocation.rating"
                />
              </div>

              <!-- Comments -->
              <div class="form-group mb-3">
                <div>Comments</div>
                <div v-if="!isEditing">
                  {{ selectedLocation.comments || "—" }}
                </div>
                <input
                  v-else
                  v-model="selectedLocation.comments"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Comments"
                />
              </div>

              <!-- youtube video -->
              <div
                class="form-group mb-3"
                v-if="
                  selectedLocation.youtubeLinks &&
                  selectedLocation.youtubeLinks.length > 0
                "
              >
                <div class="info-label">
                  <i class="fab fa-youtube me-2 text-danger"></i>Related Videos
                </div>

                <div v-if="!isEditing" class="youtube-gallery">
                  <div
                    v-for="(link, index) in selectedLocation.youtubeLinks"
                    :key="index"
                    class="youtube-gallery-item"
                    @click="openYouTubeVideo(link)"
                  >
                    <div class="youtube-thumbnail-small">
                      <img
                        :src="getYouTubeThumbnail(link)"
                        :alt="`Video ${index + 1}`"
                      />
                      <div class="play-overlay-small">
                        <i class="fas fa-play"></i>
                      </div>
                    </div>
                    <span class="video-label">Video {{ index + 1 }}</span>
                  </div>

                  <!-- View all videos button if more than 3 -->
                  <button
                    v-if="selectedLocation.youtubeLinks.length > 3"
                    class="btn btn-sm btn-outline-primary mt-2 w-100"
                    @click="showAllVideos = !showAllVideos"
                  >
                    <i class="fas fa-video me-2"></i>
                    {{
                      showAllVideos
                        ? "Show Less"
                        : `View All ${selectedLocation.youtubeLinks.length} Videos`
                    }}
                  </button>
                </div>

                <!-- Edit mode remains similar but with better styling -->
                <div v-else class="youtube-edit-mode">
                  <!-- Your existing edit mode code but with improved styling -->
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <button v-if="isEditing" class="accept-btn" @click="editLocation">
              <i class="fas fa-save me-2"></i>Save Changes
            </button>
          </div>

          <!-- Trips List -->
          <div class="sidebar-section trips-section" v-else>
            <div class="section-header">
              <h6><i class="fas fa-route me-2"></i>Your Trips</h6>
            </div>
            <div class="trips-list">
              <div
                class="trip-card"
                v-for="(trip, index) in trips"
                :key="index"
              >
                <div class="trip-selection" v-if="isAddLocationToTrip">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :value="trip._id"
                    v-model="selectedTripIds"
                    @change="onTripSelectionChange(trip._id)"
                  />
                </div>
                <div class="trip-image" v-else>
                  <img
                    :src="trip.image.url"
                    v-if="trip?.image"
                    alt="Trip Image"
                  />
                  <div class="trip-placeholder" v-else>
                    <i class="fas fa-image"></i>
                  </div>
                </div>
                <div class="trip-info">
                  <h6 class="trip-name">{{ trip.name }}</h6>
                </div>
                <div class="trip-actions">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="getTrip(trip._id)"
                    title="View Trip"
                  >
                    <i class="fas fa-map-location-dot"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="openTripChat(trip)"
                    title="Open Chat"
                  >
                    <i class="fas fa-comments"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="shareTrip(trip)"
                    title="Share Trip"
                  >
                    <i class="fa-solid fa-share-nodes"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="add-to-trips-section" v-if="isAddLocationToTrip">
              <button
                class="btn btn-primary w-100"
                @click="addLocationsToTrip"
                :disabled="selectedTripIds.length === 0"
              >
                <i class="fas fa-plus me-2"></i>
                Add to Selected Trips ({{ selectedTripIds.length }})
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar Toggle -->
        <div class="sidebar-toggle" @click="toggleSidebar">
          <i
            :class="
              isSidebarCollapsed
                ? 'fas fa-chevron-right'
                : 'fas fa-chevron-left'
            "
          ></i>
        </div>
      </div>
      <div class="main-content-container">
        <PopOver
          :selectedLocation="selectedLocation"
          :windowSize="windowSize"
          :popoverPosition="popoverPosition"
          @toggle-info-display="viewLocationInfo"
          @close-info-display="closeLocationInfo"
          @add-location-trip="addLocationToTrip"
        />
        <div v-if="selectedTrip" class="chat-container">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-title">
              <div class="trip-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  ></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h5 class="chat-name">{{ selectedTrip.name }}</h5>
                <span class="chat-subtitle">Trip Chat</span>
              </div>
            </div>
            <button
              class="close-btn"
              @click="closeChat"
              aria-label="Close chat"
            >
              <svg
                width="20"
                height="20"
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

          <!-- Chat Messages -->
          <div class="chat-messages" ref="chatMessages">
            <div
              v-for="(msg, i) in tripMessages[selectedTrip._id]"
              :key="i"
              class="message-wrapper"
              :class="{
                'own-message': msg.senderName == locationData.username,
              }"
            >
              <div class="message-bubble">
                <div class="message-header">
                  <span class="sender-name">{{ msg.senderName }}</span>
                  <span class="message-time">{{
                    formatTime(msg.timestamp)
                  }}</span>
                </div>
                <div class="message-content">{{ msg.content }}</div>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-if="
                !tripMessages[selectedTrip._id] ||
                tripMessages[selectedTrip._id].length === 0
              "
              class="empty-state"
            >
              <div class="empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  ></path>
                </svg>
              </div>
              <p class="empty-text">No messages yet</p>
              <p class="empty-subtext">
                Start the conversation about your trip!
              </p>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="chat-input-container">
            <div class="input-wrapper">
              <input
                v-model="chatInput"
                @keyup.enter="sendMessage"
                placeholder="Type a message..."
                class="chat-input"
                :disabled="isLoading"
              />
              <button
                @click="sendMessage"
                class="send-btn"
                :disabled="!chatInput.trim() || isLoading"
                aria-label="Send message"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              </button>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="typing-indicator">
              <span>Someone is typing</span>
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <MapComponent @onMountCall="updateMapOnChange" />
        </div>

        <!-- Add Location Modal -->
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  <i class="fas fa-map-marker-alt me-2"></i>Add New Location
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addLocation">
                  <!-- Location Name -->
                  <div class="form-group mb-3">
                    <div class="input-wrapper">
                      <input
                        type="text"
                        id="name"
                        v-model="locationData.name"
                        class="form-control"
                        placeholder=" "
                        required
                      />
                      <label for="name" class="floating-label">
                        <i class="fas fa-location-dot me-2"></i>Location Name
                      </label>
                    </div>
                  </div>

                  <!-- Two Column Layout -->
                  <div class="row">
                    <div class="col-md-6">
                      <!-- <div class="form-group mb-3">

                        <select
                          id="locationType"
                          v-model="locationData.locationType"
                          class="form-select"
                          required
                        >
                          <option
                            v-for="option in locationData.locationOptions"
                            :key="option"
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div> -->

                      <!-- Experience Type -->
                      <div class="form-group mb-3">
                        <select
                          id="experienceType"
                          v-model="locationData.experienceType"
                          class="form-select"
                          required
                        >
                          <option value="" disabled selected hidden>
                            Experience Type
                          </option>
                          <option
                            v-for="option in locationData.experienceOptions"
                            :key="option"
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div>

                      <!-- Preference -->
                      <div class="form-group mb-3">
                        <select
                          id="preference"
                          v-model="locationData.preference"
                          class="form-select"
                        >
                          <option value="" disabled selected hidden>
                            Preference
                          </option>
                          <option
                            v-for="option in locationData.preferenceOptions"
                            :key="option"
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div>

                      <!-- Mood-based -->
                      <div class="form-group mb-3">
                        <select
                          id="moodBased"
                          v-model="locationData.moodBased"
                          class="form-select"
                        >
                          <option value="" disabled selected hidden>
                            Mood
                          </option>
                          <option
                            v-for="option in locationData.moodOptions"
                            :key="option"
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <!-- Time of Day -->
                      <div class="form-group mb-3">
                        <select
                          id="timeOfDay"
                          v-model="locationData.timeOfDay"
                          class="form-select"
                        >
                          <option value="" disabled selected hidden>
                            Best Time to Visit
                          </option>
                          <option
                            v-for="option in locationData.timeOfDayOptions"
                            :key="option"
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div>

                      <!-- Mode of Transport -->
                      <div class="form-group mb-3">
                        <select
                          id="modeOfTransport"
                          v-model="locationData.modeOfTransport"
                          class="form-select"
                        >
                          <option value="" disabled selected hidden>
                            Transportation
                          </option>
                          <option
                            v-for="option in locationData.modeOfTransportOptions"
                            :key="option"
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div>

                      <!-- Recommendation -->
                      <div class="form-group mb-3">
                        <select
                          id="recommended"
                          v-model="locationData.recommendation"
                          class="form-select"
                        >
                          <option value="" disabled selected hidden>
                            Recommendation
                          </option>
                          <option
                            v-for="option in locationData.recommendationOptions"
                            :key="option"
                            :value="option"
                          >
                            {{ option }}
                          </option>
                        </select>
                      </div>

                      <!-- Price -->
                      <div class="form-group mb-3">
                        <!-- <div class="input-wrapper"> -->
                        <input
                          type="text"
                          id="price"
                          v-model="locationData.price"
                          class="form-control"
                          placeholder=" "
                        />
                        <label for="price" class="floating-label">
                          <i class="fas fa-dollar-sign me-2"></i>Price Range
                        </label>
                        <!-- </div> -->
                      </div>
                    </div>
                  </div>

                  <!-- Rating -->
                  <div class="mt-2 mb-2">
                    <StarComponent
                      :maxStars="5"
                      @update:rating="selectedRating = $event"
                    />
                  </div>

                  <!-- Comments -->
                  <div class="form-group mb-3 mt-3">
                    <!-- <div class="input-wrapper"> -->
                    <input
                      type="text"
                      id="price"
                      v-model="locationData.comments"
                      class="form-control"
                      placeholder=" "
                    />
                    <label for="price" class="floating-label">
                      <i class="fa-solid fa-comment me-2"></i>Comments
                    </label>
                    <!-- </div> -->
                  </div>

                  <!-- Image Upload -->
                  <div class="form-group mb-3">
                    <label class="form-label">
                      <i class="fas fa-camera me-2"></i>Add Images
                    </label>
                    <div class="file-upload-wrapper">
                      <input
                        type="file"
                        @change="handleFileChange"
                        accept="image/*"
                        class="file-input"
                        id="imageUpload"
                        required
                      />
                      <label for="imageUpload" class="file-upload-label">
                        <i class="fas fa-cloud-upload-alt me-2"></i>
                        Choose Image or Drag & Drop
                      </label>
                    </div>
                  </div>

                  <!-- Youtube Link -->
                  <div class="form-group mb-3">
                    <label class="form-label">
                      <i class="fab fa-youtube me-2 text-danger"></i>Related
                      Videos
                    </label>

                    <!-- Single input with add button for new links -->
                    <div class="youtube-input-section mb-3 mt-5">
                      <div class="input-group-youtube input-group">
                        <span class="input-group-text">
                          <i class="fab fa-youtube text-danger"></i>
                        </span>
                        <input
                          type="url"
                          v-model="newYouTubeLink"
                          class="form-control"
                          placeholder="Paste YouTube URL here..."
                          @keyup.enter="addYouTubeLink"
                        />
                        <button
                          type="button"
                          class="btn btn-primary"
                          @click="addYouTubeLink"
                          :disabled="!isValidYouTubeUrl(newYouTubeLink)"
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                      <small class="form-text text-muted mt-1">
                        <i class="fas fa-info-circle me-1"></i>
                        Add YouTube videos that showcase this location
                      </small>
                    </div>

                    <!-- Display added links with thumbnails -->
                    <div
                      v-if="locationData.youtubeLinks.length > 0"
                      class="youtube-preview-grid"
                    >
                      <div
                        v-for="(link, index) in locationData.youtubeLinks"
                        :key="index"
                        class="youtube-preview-card"
                      >
                        <div class="youtube-thumbnail">
                          <img
                            :src="getYouTubeThumbnail(link)"
                            :alt="`Video ${index + 1}`"
                            class="thumbnail-img"
                          />
                          <div class="play-overlay">
                            <i class="fas fa-play"></i>
                          </div>
                        </div>
                        <div class="youtube-info">
                          <small class="youtube-title"
                            >Video {{ index + 1 }}</small
                          >
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-danger remove-btn"
                            @click="removeYouTubeLink(index)"
                            title="Remove video"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  <i class="fas fa-times me-2"></i>Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="addLocation()"
                >
                  <i class="fas fa-plus me-2"></i>Add Location
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
                <h5 class="modal-title" id="createTripLabel">
                  <i class="fas fa-route me-2"></i>Create New Trip
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="createTrip">
                  <!-- Trip Name -->
                  <div class="form-group mb-4">
                    <div class="input-wrapper">
                      <input
                        type="text"
                        class="form-control"
                        v-model="tripData.name"
                        placeholder=" "
                        id="tripName"
                        required
                      />
                      <label for="tripName" class="floating-label">
                        <i class="fas fa-map me-2"></i>Trip Name
                      </label>
                    </div>
                  </div>

                  <!-- Select Members -->
                  <div class="form-group mb-4">
                    <!-- <label class="form-label mb-3">
                      <i class="fas fa-users me-2"></i>Select Travel Companions
                    </label> -->
                    <div class="members-grid">
                      <div
                        class="member-card"
                        v-for="friend in userFriends"
                        :key="friend"
                        :class="{ selected: tripData.members.includes(friend) }"
                        @click="toggleMember(friend)"
                      >
                        <div class="member-avatar">
                          <i class="fas fa-user"></i>
                        </div>
                        <span class="member-name">{{ friend }}</span>
                        <div class="member-checkbox">
                          <input
                            type="checkbox"
                            :value="friend"
                            v-model="tripData.members"
                            class="form-check-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="social-toggle">
                    <div
                      class="form-check form-switch d-flex align-items-center"
                    >
                      <input
                        class="form-check-input me-2"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        v-model="privateTrip"
                      />
                      <label for="flexSwitchCheckDefault"> Private Trip </label>
                    </div>
                  </div>

                  <!-- Group Image -->
                  <div class="form-group mb-4">
                    <!-- <label class="form-label">
                      <i class="fas fa-image me-2"></i>Group Image
                    </label> -->
                    <div class="file-upload-wrapper">
                      <input
                        type="file"
                        @change="handleTripFileChange"
                        accept="image/*"
                        class="file-input"
                        id="tripImageUpload"
                        required
                      />
                      <label for="tripImageUpload" class="file-upload-label">
                        <i class="fas fa-cloud-upload-alt me-2"></i>
                        Choose Group Image
                      </label>
                    </div>
                  </div>

                  <!-- Group Chat Preview -->
                  <div class="form-group mb-3">
                    <label class="form-label">
                      <i class="fas fa-comments me-2"></i>Group Chat
                    </label>
                    <div class="chat-preview">
                      <div class="chat-placeholder">
                        <i class="fas fa-comment-dots"></i>
                        <p>Chat will be available after trip creation</p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="fas fa-times me-2"></i>Cancel
                </button>
                <button class="btn btn-primary" @click="createTrip">
                  <i class="fas fa-plus me-2"></i>Create Trip
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="shareTripModal"
          tabindex="-1"
          aria-labelledby="shareTripModal"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="createTripLabel">
                  <i class="fas fa-route me-2"></i>Share Trip
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input :value="shareUrl" readonly style="width: 100%" />
              </div>

              <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="fas fa-times me-2"></i>Cancel
                </button>
                <button class="btn btn-primary" @click="copyLink">
                  <i class="fa-solid fa-copy"></i>Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Clock Buttons -->
        <div class="social-clock" v-if="!selectedTrip">
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
            <!-- <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"
          ></path>
        </svg> -->
            <i class="fa-solid fa-plus p-2"></i>
          </button>
        </div>
      </div>
      <div v-if="tripLocations.length" class="exit-trip-button">
        <button
          @click="exitTripView"
          class="btn exit-btn"
          title="Exit Trip View"
        >
          <i class="fas fa-times"></i>
          <span>Exit Trip</span>
        </button>
      </div>
    </div>
    <NumberComponent
      v-if="tripLocations.length"
      :numbers="tripLocations.map((_, index) => index + 1)"
      :active-index="selectedIndex"
      :max-visible="7"
      @button-click="flyToLocation"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, onUnmounted, computed, nextTick } from "vue";
import maplibregl, { FormatExpression } from "maplibre-gl";
import markerImage from "../assets/mapmarker.png";
import crossmapmarker from "../assets/crossmapmarker.png";
import mapMarkerStar from "../assets/mapMarkerStar.png";
import locationPin from "../assets/location-pin.png";
import { Modal } from "bootstrap";
import axios from "axios";
import { useRouter } from "vue-router";
import NumberComponent from "./NumberComponent.vue";
import { createMarkers } from "../repos/MainFunctions";
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
import MapComponent from "./MapComponent.vue";
import SearchBarPlaces from "./SearchBarPlaces.vue";
import StarComponent from "./StarComponent.vue";
import { toast } from "vue3-toastify";
import PopOver from "./PopOver.vue";
const modalInstance = ref(null);
const map = ref(null);
const isMenuOpen = ref(false);
const locations = ref([]);
const pointerMode = ref("current");
const socialmode = ref(false);
const privateTrip = ref(false);
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
    "Experience Type",
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
  comments: "",
  rating: "",
  youtubeLinks: [],
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
const selectedTripIds = ref([]);
const showAllFilters = ref(false);
const profileRef = ref(null);
const tripLocations = ref([]);
const selectedIndex = ref(null);
const visibleFilters = computed(() => filters.slice(0, 3));
const hiddenFilters = computed(() => filters.slice(3));
const showNotificationDropdown = ref(true);
const selectedRating = ref(0);
const shareUrl = ref("");
const windowSize = ref({ width: 0, height: 0 });
const markersUrl = ref([]);
const newYouTubeLink = ref("");

onMounted(() => {
  getUserLocation();
  let userId = localStorage.getItem("username");
  userInfo.token = localStorage.getItem("token");
  locationData.username = userId;
  getMarkersUrl();
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
  updateWindowSize();
  window.addEventListener("resize", updateWindowSize);
  document.addEventListener("click", handleClickOutside);
});
const updateWindowSize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

onUnmounted(() => {
  clearInterval(intervalId);
  clearInterval(intervalIdFriends);
  window.removeEventListener("resize", updateWindowSize);
  document.removeEventListener("click", handleClickOutside);
});

// General Functions
const getMarkersUrl = async () => {
  try {
    const request = {
      username: locationData.username,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-markers`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    markersUrl.value = response.data.markers;
    console.log(response);
  } catch (error) {
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
    console.error("the error in getting markers url is", error);
  }
};
const goToProfile = () => {
  router.push("/profile");
};
const createMarkersWithPositioning = (
  locations,
  markers,
  map,
  selectedLocation,
  popoverPosition,
  markersUrl
) => {
  // Call your existing createMarkers function
  debugger;
  createMarkers(
    locations,
    markers,
    map,
    selectedLocation,
    popoverPosition,
    markersUrl
  );

  // Add smart positioning logic
  nextTick(() => {
    updateWindowSize();
  });
};
const copyLink = () => {
  navigator.clipboard.writeText(shareUrl.value);
};
const closeProfile = () => {
  isProfileOpen.value = false;
};
const handleClickOutside = (event) => {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    closeProfile();
  }
};
const showNotification = (value) => {
  showNotificationDropdown.value = value;
};

const updateMapOnChange = () => {
  getUserLocation();
  getLocations();
};
const toggleSidebar = () => {
  if (!isSidebarCollapsed.value && viewMoreInfo.value)
    viewMoreInfo.value = !viewMoreInfo.value;
  isAddLocationToTrip.value = false;
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  if (tripLocations.value != "") {
    tripLocations.value = "";
    removeTripLine();
    getLocations();
  }

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
        `http://${import.meta.env.VITE_API_URL}/api/user/get-friends-location`,
        request,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      createMarkersWithPositioning(
        response?.data?.locations,
        markers,
        map,
        selectedLocation,
        popoverPosition,
        markersUrl
      );
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
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
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${hour12}:${paddedMinutes} ${ampm}`;
};
const toggleFilters = () => {
  showAllFilters.value = !showAllFilters.value;
};
const closeChat = () => {
  selectedTrip.value = null;
};

// Trip and chat Functions

const createTrip = async () => {
  // debugger;
  try {
    tripData.members.push(locationData.username);
    const formData = new FormData();
    formData.append("createdBy", locationData.username);
    formData.append("name", tripData.name);
    formData.append("privateTrip", privateTrip.value);
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
      `http://${import.meta.env.VITE_API_URL}/api/user/create-trip`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("successfull");
  } catch (error) {
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
    console.error("the error in creating trip is", error);
  }
};
const getTrips = async () => {
  try {
    const request = {
      username: locationData.username,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-trips`,
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
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
    console.error("the error in creating trip is", error);
  }
};
const getTrip = async (tripId) => {
  try {
    const request = {
      tripId: tripId,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-trip`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
    tripLocations.value = response.data.trip.locations;
    markers.forEach((marker) => marker.remove());
    markers.length = 0;
    createMarkersWithPositioning(
      response.data.trip.locations,
      markers,
      map,
      selectedLocation,
      popoverPosition,
      markersUrl
    );
    drawTripLine(response.data.trip.locations);
  } catch (error) {
    console.error("the error in creating trip is", error);
  }
};
const flyToLocation = (index) => {
  debugger;
  const location = tripLocations.value[index - 1];
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
const drawTripLine = (locations) => {
  const coordinates = locations.map((loc) => loc.location.coordinates);

  if (map.value.getSource("tripLine")) {
    map.value.removeLayer("tripLineLayer");
    map.value.removeSource("tripLine");
  }

  map.value.addSource("tripLine", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    },
  });

  map.value.addLayer({
    id: "tripLineLayer",
    type: "line",
    source: "tripLine",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#DC143C",
      "line-width": 4,
      "line-dasharray": [2, 4],
    },
  });
};
const removeTripLine = () => {
  if (map.value.getLayer("tripLineLayer")) {
    map.value.removeLayer("tripLineLayer");
  }

  if (map.value.getSource("tripLine")) {
    map.value.removeSource("tripLine");
  }
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
  if (!isAddLocationToTrip.value) {
    selectedTrip.value = trip;
    // subscribeToTrip(trip._id);
    const request = {
      tripId: trip._id,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-trip-messages`,
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
const addLocationToTrip = async () => {
  isSidebarCollapsed.value = false;
  isAddLocationToTrip.value = true;
};
const addLocationsToTrip = async () => {
  try {
    const request = {
      tripIds: selectedTripIds.value,
      locationId: selectedLocation.value._id,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/add-location-to-trips`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("successfull");
    console.log(response);
    isSidebarCollapsed.value = true;
    isAddLocationToTrip.value = false;
  } catch (error) {
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
    console.error("the error in creating trip is", error);
    isSidebarCollapsed.value = true;
    isAddLocationToTrip.value = false;
    selectedLocation.value = "";
  }
};
const shareTrip = async (trip) => {
  debugger;
  const modalEl = document.getElementById("shareTripModal");
  const shareTripModalInstance = new Modal(modalEl);
  let request = {
    username: locationData.username,
    tripId: trip._id,
  };
  try {
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/share`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    debugger;
    if (response.status === 200) {
      const data = response.data;
      shareUrl.value = data.shareUrl;
    }
    console.log(response);
  } catch (error) {
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
    console.error("the error in accept friend request is", error);
  }
  shareTripModalInstance?.show();
};
const exitTripView = () => {
  // Clear trip locations
  tripLocations.value = [];
  
  // Reset selected index
  selectedIndex.value = null;
  
  // Remove trip line from map
  removeTripLine();
  
  // Clear existing markers
  markers.forEach((marker) => marker.remove());
  markers.length = 0;
  
  // Reload regular locations
  getLocations();
  
  // Close sidebar if it's showing trip details
  if (!isSidebarCollapsed.value && viewMoreInfo.value) {
    isSidebarCollapsed.value = true;
    viewMoreInfo.value = false;
  }
};

// Friend Functions
const acceptFriendRequest = async (friendUsername) => {
  try {
    let request = {
      username: locationData.username,
      friendUsername: friendUsername,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/accept-friend-request`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // debugger;
    if (response.status === 200) {
      toast.success("successfull");
      friendRequests.value = friendRequests.value.filter(
        (username) => username !== friendUsername
      );
    }
    console.log(response);
  } catch (error) {
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
    console.error("the error in accept friend request is", error);
  }
};
const getFriendRequests = async () => {
  try {
    let request = {
      username: locationData.username,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-friend-requests`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    friendRequests.value = response.data.friendRequestUsernames;
  } catch (error) {
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
    console.error("the error in the getting friend request is", error);
  }
};
const intervalId = setInterval(getFriendRequests, 5000);

const getUserFriends = async () => {
  try {
    let request = {
      username: locationData.username,
    };
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-friends`,
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
const intervalIdFriends = setInterval(getUserFriends, 5000);
const friendRequestsCheck = () => {
  return friendRequests.value && friendRequests.value.length > 0;
};

// Filter Functions
const filterLocations = (location) => {
  // debugger
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
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
const appliedFilterCheck = (filterLabel) => {
  return appliedFilters[filterLabel].length;
  // let count = 0;
  // appliedFilters[filterLabel].forEach((filters)=>{
  //   filters.forEach((filter)=>{
  //     if(filter == true)count++
  //   })
  // })
  // return count;
};

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
    comments: locationData.comments,
    rating: selectedRating.value,
    youtubeLinks: locationData.youtubeLinks,
  };
  for (const key in request) {
    formData.append(key, request[key]);
  }
  formData.append("image", locationData.selectedFile);
  try {
    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/add-location`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status == 201) {
      toast.success("successfull");
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
    toast.error(error.response?.data?.message, {
      position: "top-right",
      autoClose: 4000,
    });
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
      username: localStorage.getItem("username"),
    };
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-locations`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    locations.value = response.data.locations;
    createMarkersWithPositioning(
      locations.value,
      markers,
      map,
      selectedLocation,
      popoverPosition,
      markersUrl
    );

    console.log(response);
  } catch (error) {
    console.error("the error occured is", error);
  }
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
      comments: selectedLocation.value.comments,
      rating: selectedRating.value,
    };
    for (const key in request) {
      formData.append(key, request[key]);
    }
    if (selectedLocation.selectedFile) {
      formData.append("image", selectedLocation.selectedFile);
    }
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/edit-location`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    toast.success("successfull");
    locations.value = [response.data];

    console.log(response);
  } catch (error) {
    console.error("the error occured is", error);
  }
};
const setLocationFromSearch = async (place) => {
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
};
const extractYouTubeVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
const getYouTubeThumbnail = (url) => {
  const videoId = extractYouTubeVideoId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : "/placeholder-video.jpg";
};
const openYouTubeVideo = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};
const showToast = (message, type = "info") => {
  console.log(`${type.toUpperCase()}: ${message}`);
};
const isValidYouTubeUrl = (url) => {
  const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return regex.test(url);
};
const addYouTubeLink = async () => {
  if (isValidYouTubeUrl(newYouTubeLink.value)) {
    locationData.youtubeLinks.push(newYouTubeLink.value.trim());
    newYouTubeLink.value = "";
    showToast("YouTube video added successfully!", "success");
  } else {
    showToast("Invalid YouTube link.", "error");
  }
};
const removeYouTubeLink = (index) => {
  locationData.youtubeLinks.splice(index, 1);
};
</script>



<style scoped>
/* =============================================
   MAP COMPONENT SCOPED STYLES
   ============================================= */

/* Map Container */
#map {
  width: 100%;
  height: 100vh;
  border: 1px solid var(--neutral-300);
  position: relative;
}

.maplibregl-control-container {
  display: none;
}

/* =============================================
   SOCIAL CLOCK COMPONENT
   ============================================= */

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
  transition: all var(--transition-slow);
  z-index: var(--z-fixed);
}

.social-clock__list {
  height: 4.5rem;
  width: 4.5rem;
  left: calc(50% - 2.25rem);
  top: calc(50% - 2.25rem);
  position: absolute;
  pointer-events: none;
  transition: transform var(--transition-normal),
    opacity var(--transition-normal);
  opacity: 0;
  transform: scale(0);
  display: flex;
  justify-content: center;
  align-items: center;
}

.social-clock__list.open {
  pointer-events: all;
  opacity: 1;
  transform: scale(1);
}

.social-clock__button {
  background: none;
  border: none;
  border-radius: 4rem;
  box-sizing: content-box;
  cursor: pointer;
  height: 4rem;
  width: 4rem;
  left: calc(50% - 2rem);
  top: calc(50% - 2rem);
  position: absolute;
  transform-origin: 50% 50%;
  pointer-events: all;
  transition: transform var(--transition-normal);
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

.social-clock__button.twitter {
  background-color: rgba(59, 130, 246, 0.3);
  border: 2px solid rgba(59, 130, 246, 0.7);
  transition: background-color var(--transition-normal),
    border-color var(--transition-normal);
}

.social-clock__button.twitter:hover {
  background-color: var(--accent-info);
  border-color: var(--accent-info);
}

.social-clock__button.github {
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.9);
  transition: background-color var(--transition-normal),
    border-color var(--transition-normal);
}

.social-clock__button.github:hover {
  background-color: var(--neutral-black);
  border-color: var(--neutral-black);
}

.social-clock__button i {
  color: var(--neutral-white);
  font-size: var(--font-size-lg);
}

.social-clock__trigger {
  background: var(--neutral-black);
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

.social-clock__trigger i {
  color: var(--neutral-white);
  font-size: var(--font-size-xl);
  padding: var(--spacing-sm);
}

/* =============================================
   NAVBAR STYLES
   ============================================= */

.navbar {
  position: fixed;
  z-index: var(--z-fixed);
  width: 100%;
  background: linear-gradient(
    135deg,
    var(--neutral-800) 0%,
    var(--neutral-700) 100%
  );
  color: var(--neutral-white);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(10px);
}

.navbar-pri {
  flex: 1;
  margin-right: var(--spacing-lg);
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

/* Search Section */
.search-section {
  flex-shrink: 0;
}

/* Filters Section */
.filters-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.filters-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  position: relative;
}

.visible-filters {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-filter {
  background: linear-gradient(
    135deg,
    var(--primary-500) 0%,
    var(--primary-400) 100%
  );
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-2xl);
  color: var(--neutral-black);
  cursor: pointer;
  position: relative;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all var(--transition-normal);
  box-shadow: 0 2px 8px rgba(228, 232, 39, 0.3);
  border: 1px solid transparent;
}

.nav-filter:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(228, 232, 39, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-icon {
  font-size: var(--font-size-xs);
}

.filter-label {
  white-space: nowrap;
}

.more-filters-btn {
  background: rgba(228, 232, 39, 0.2);
  border: 1px solid var(--primary-500);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-2xl);
  color: var(--primary-500);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.more-filters-btn:hover {
  background: var(--primary-500);
  color: var(--neutral-black);
  transform: translateY(-2px);
}

.hidden-filters {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(29, 26, 31, 0.95);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  margin-top: var(--spacing-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(228, 232, 39, 0.3);
  z-index: var(--z-dropdown);
}

.hidden-filters.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
  color: var(--neutral-white);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.clear-all-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.applied-filter-dot {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--neutral-800);
  border-radius: var(--radius-full);
  border: 2px solid var(--primary-500);
  color: var(--primary-500);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  animation: pulse 2s infinite;
}

/* Social Toggle */
.social-toggle {
  margin-left: auto;
}

.form-switch .form-check-input {
  width: 35px;
  height: 20px;
  background-color: var(--primary-500);
  border: 2px solid var(--neutral-800);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  position: relative;
  cursor: pointer;
}

.form-switch .form-check-input::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  height: 14px;
  width: 14px;
  background-color: var(--neutral-800);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
}

.form-switch .form-check-input:checked {
  background-color: var(--neutral-800);
  border-color: var(--primary-500);
}

.form-switch .form-check-input:checked::before {
  transform: translateX(15px);
  background-color: var(--primary-500);
}

.form-check-label {
  margin-left: var(--spacing-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-50);
  font-size: var(--font-size-sm);
}

/* =============================================
   NAVBAR PROFILE SECTION
   ============================================= */

.navbar-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.friends-search-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-friends-container {
  max-width: 0;
  transition: all var(--transition-normal);
}

.search-friends-container.expanded {
  max-width: 250px;
}

.friends-toggle-btn {
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  color: var(--primary-500);
  font-size: var(--font-size-lg);
}

.friends-toggle-btn:hover {
  background: rgba(228, 232, 39, 0.1);
  transform: scale(1.1);
}

.active-icon {
  color: var(--primary-500) !important;
  transform: scale(1.2);
}

.notification-section {
  position: relative;
}

.notification-bell {
  position: relative;
  display: inline-block;
  font-size: var(--font-size-xl);
  color: var(--primary-500);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
}

.notification-bell:hover {
  background: rgba(228, 232, 39, 0.1);
  transform: scale(1.1);
}

.notification-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: var(--accent-error);
  border-radius: var(--radius-full);
  border: 2px solid var(--neutral-white);
  animation: pulse 2s infinite;
}

.friend-requests-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: var(--neutral-white);
  color: var(--neutral-800);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-modal);
  overflow: hidden;
  margin-top: var(--spacing-sm);
  border: 1px solid rgba(228, 232, 39, 0.3);
}

.dropdown-header {
  padding: var(--spacing-md);
  background: linear-gradient(
    135deg,
    var(--primary-500) 0%,
    var(--primary-400) 100%
  );
  color: var(--neutral-800);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.friend-request-item {
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--neutral-200);
  transition: background var(--transition-fast);
}

.friend-request-item:hover {
  background: var(--neutral-50);
}

.friend-request-item:last-child {
  border-bottom: none;
}

.friend-name {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}

.accept-btn {
  background: linear-gradient(
    135deg,
    var(--primary-500) 0%,
    var(--primary-400) 100%
  );
  color: var(--neutral-800);
  border: none;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-2xl);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.accept-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(228, 232, 39, 0.4);
}

.trip-btn-container {
  position: relative;
}

.trip-btn {
  background: linear-gradient(
    135deg,
    var(--primary-500) 0%,
    var(--primary-400) 100%
  );
  color: var(--neutral-800);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-2xl);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  box-shadow: 0 2px 8px rgba(228, 232, 39, 0.3);
}

.trip-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(228, 232, 39, 0.4);
}

.trip-btn-text {
  font-size: var(--font-size-sm);
}

.profile-section {
  position: relative;
}

.profile-icon {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  border-radius: var(--radius-2xl);
  transition: all var(--transition-normal);
}

.profile-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.profile-icon-circle {
  height: 40px;
  width: 40px;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 2px solid var(--primary-500);
  transition: all var(--transition-normal);
}

.profile-icon-circle:hover {
  border-color: var(--primary-400);
  transform: scale(1.05);
}

.profile-icon-circle img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.profile-arrow {
  color: var(--primary-500);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.profile-floating-div {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: var(--neutral-white);
  color: var(--neutral-800);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-modal);
  overflow: hidden;
  margin-top: var(--spacing-sm);
  border: 1px solid rgba(228, 232, 39, 0.3);
}

.profile-menu-item {
  padding: var(--spacing-md);
  cursor: pointer;
  transition: background var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.profile-menu-item:hover {
  background: var(--neutral-50);
}

.profile-menu-item i {
  width: 16px;
  color: var(--neutral-600);
}

/* =============================================
   MAIN LAYOUT
   ============================================= */

.main-container {
  display: flex;
}

.main-content-container {
  width: 100%;
  height: 100vh;
  flex: 1;
}

/* =============================================
   POPOVER STYLES
   ============================================= */

.custom-popover {
  position: absolute;
  background-color: var(--neutral-white);
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-md);
  width: 250px;
  z-index: var(--z-popover);
  font-family: var(--font-family-primary);
  transition: opacity var(--transition-normal);
}

.custom-popover h3 {
  margin-top: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-800);
}

.custom-popover .card-img {
  width: 100%;
  height: auto;
  margin-top: var(--spacing-sm);
  border-radius: var(--radius-md);
  object-fit: cover;
}

.custom-popover p {
  margin: var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.custom-popover button {
  margin-top: var(--spacing-sm);
  margin-right: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-xs);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  background-color: var(--primary-600);
  color: var(--neutral-white);
  transition: background-color var(--transition-normal);
}

.custom-popover button:hover {
  background-color: var(--primary-700);
}

/* =============================================
   CHAT CONTAINER STYLES
   ============================================= */

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--neutral-white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  border: 1px solid var(--neutral-200);
  padding-top: 4rem;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(
    135deg,
    var(--primary-600) 0%,
    var(--primary-700) 100%
  );
  color: var(--neutral-white);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.trip-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.chat-name {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.chat-subtitle {
  font-size: var(--font-size-xs);
  opacity: 0.8;
  font-weight: var(--font-weight-normal);
}

.close-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: var(--radius-full);
  color: var(--neutral-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.chat-messages {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
  background: var(--neutral-50);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--neutral-100);
  border-radius: var(--radius-sm);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--neutral-300);
  border-radius: var(--radius-sm);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--neutral-400);
}

.message-wrapper {
  display: flex;
  justify-content: flex-start;
  animation: fadeInUp 0.3s ease-out;
}

.message-wrapper.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 75%;
  background: var(--neutral-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  position: relative;
}

.own-message .message-bubble {
  background: linear-gradient(
    135deg,
    var(--primary-600) 0%,
    var(--primary-700) 100%
  );
  color: var(--neutral-white);
  border-color: transparent;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  gap: var(--spacing-sm);
}

.sender-name {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
}

.own-message .sender-name {
  color: rgba(255, 255, 255, 0.9);
}

.message-time {
  font-size: var(--font-size-xs);
  color: var(--neutral-400);
  white-space: nowrap;
}

.own-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.message-content {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--neutral-700);
  word-wrap: break-word;
}

.own-message .message-content {
  color: var(--neutral-white);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: var(--neutral-500);
}

.empty-icon {
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-text {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--neutral-700);
}

.empty-subtext {
  font-size: var(--font-size-sm);
  margin: 0;
  color: var(--neutral-400);
}

.chat-input-container {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--neutral-white);
  border-top: 1px solid var(--neutral-200);
}

.input-wrapper {
  display: flex !important;
  align-items: center !important;
  gap: var(--spacing-sm) !important;
  border-radius: var(--radius-2xl) !important;
  padding: var(--spacing-xs) var(--spacing-xs) var(--spacing-xs)
    var(--spacing-md) !important;
  border: 1px solid var(--neutral-200) !important;
  transition: all var(--transition-fast) !important;
}

.input-wrapper input {
  border: none;
}

.input-wrapper:focus-within {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(228, 232, 39, 0.1);
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-sm);
  padding: var(--spacing-md) 0;
  color: var(--neutral-700);
}

.chat-input::placeholder {
  color: var(--neutral-400);
}

.send-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(
    135deg,
    var(--primary-500) 0%,
    var(--primary-600) 100%
  );
  border: none;
  border-radius: var(--radius-full);
  color: var(--neutral-black);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(228, 232, 39, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.typing-dots {
  display: flex;
  gap: 2px;
}

.typing-dots span {
  width: 4px;
  height: 4px;
  background: var(--neutral-400);
  border-radius: var(--radius-full);
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* =============================================
   YOUTUBE STYLES
   ============================================= */

.youtube-input-section {
  background: var(--neutral-50);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-200);
}

.youtube-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.youtube-preview-card {
  background: var(--neutral-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.youtube-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.youtube-thumbnail {
  position: relative;
  width: 100%;
  height: 85px;
  overflow: hidden;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.youtube-info {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.youtube-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.youtube-gallery-item {
  cursor: pointer;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.youtube-gallery-item:hover {
  background-color: #f8f9fa;
}

.youtube-thumbnail-small {
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.youtube-thumbnail-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay-small {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-label {
  font-size: 11px;
  color: #666;
}
.input-group-youtube {
  margin-top: 2rem !important;
  width: 90% !important;
  flex-wrap: nowrap !important;
}
.exit-trip-button {
  position: fixed;
  top: 120px;
  right: 20px;
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.exit-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  font-size: 14px;
}

.exit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.exit-btn i {
  font-size: 16px;
}


/* Animations */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .navbar-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .trip-btn-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 8px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .navbar-pri {
    margin-right: 0;
    width: 100%;
  }

  .navbar-content {
    justify-content: center;
  }

  .social-toggle {
    margin-left: 0;
  }

  .search-friends-container.expanded {
    max-width: 200px;
  }

  .hidden-filters {
    left: -50px;
    right: -50px;
  }

  .friend-requests-dropdown {
    width: 260px;
  }
}
</style>
