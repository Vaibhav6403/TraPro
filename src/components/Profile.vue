<template>
  <div class="profile-container">
    <!-- Header with Return Button -->
    <div class="header">
      <button @click="returnToMain" class="return-btn">
        ← Return to Main Page
      </button>
      <h1 class="page-title">Profile Settings</h1>
    </div>

    <!-- Section Switcher / Tab System -->
    <div class="tab-switcher">
      <button
        @click="activeSection = 'profile'"
        :class="['tab-btn', { active: activeSection === 'profile' }]"
      >
        Profile
      </button>
      <button
        @click="activeSection = 'achievements'"
        :class="['tab-btn', { active: activeSection === 'achievements' }]"
      >
        Achievements
      </button>
    </div>

    <!-- Profile Section -->
    <div v-if="activeSection === 'profile'" class="section profile-section">
      <!-- Profile Picture Section (Custom Design Implementation) -->
      <div class="profile-header-section">
        <!-- Colorful Abstract Background -->
        <div class="profile-header-bg">
          <!-- Profile Content Overlay with Glassmorphism -->
          <div class="profile-content">
            <!-- Profile Picture Container -->
            <div class="profile-pic-container">
              <div class="profile-pic-circle">
                <img
                  v-if="profileData.avatar"
                  :src="profileData.avatar"
                  alt="Profile Picture"
                  class="profile-image"
                />
                <div v-else class="default-profile-avatar">
                  <span class="profile-initials">{{ getInitials() }}</span>
                </div>
              </div>

              <!-- Upload Actions (Hidden input) -->
              <input
                type="file"
                ref="avatarInput"
                @change="handleAvatarUpload"
                accept="image/*"
                style="display: none"
              />

              <!-- Edit Button Overlay -->
              <button
                @click="$refs.avatarInput.click()"
                class="edit-profile-btn"
              >
                <span class="edit-icon">📷</span>
              </button>
            </div>

            <!-- Profile Stats -->
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-number">{{
                  profileData.friends || "1.25k"
                }}</span>
                <span class="stat-label">Followers</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{
                  profileData.following || "455"
                }}</span>
                <span class="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Name and Info -->
        <div class="profile-info">
          <div class="profile-name-section">
            <h1 class="profile-name">
              {{ profileData.firstName }} {{ profileData.lastName }}
              <span class="verification-badge">✓</span>
            </h1>
            <p class="profile-username">@{{ profileData.username }}</p>
          </div>

          <!-- Profile Actions -->
          <div class="profile-actions">
            <button
              v-if="profileData.avatar"
              @click="removeAvatar"
              class="remove-avatar-btn"
            >
              Remove Picture
            </button>
          </div>
        </div>
      </div>

      <!-- Personal Details Section -->
      <div class="personal-details-section">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="section-title">Personal Details</h2>
        </div>
        <div class="form-grid">
          <!-- Username -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="profileData.username"
              :disabled="!editMode"
              class="form-input"
            />
          </div>

          <!-- First Name -->
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              v-model="profileData.firstName"
              :disabled="!editMode"
              class="form-input"
            />
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              v-model="profileData.lastName"
              :disabled="!editMode"
              class="form-input"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="profileData.email"
              :disabled="!editMode"
              class="form-input"
            />
          </div>
          <button @click="toggleEdit('firstName')" class="edit-btn">
            {{ editMode ? "Save" : "Edit"  }}
          </button>

          <!-- Password -->
          <div class="form-group">
            <label for="password">Reset Email</label>
            <input
              :type="'text'"
              id="password"
              v-model="profileData.email"
              readonly
              class="form-input"
            />
            <div class="password-actions">
              <button @click="sendResetEmail" class="toggle-password">
                {{ "Reset Password" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Marker Upload Section -->
      <div class="marker-upload-section">
        <h2 class="section-title">Custom Markers</h2>

        <!-- Marker Type Dropdown -->
        <div class="form-group">
          <label for="markerType">Marker Type</label>
          <select
            id="markerType"
            v-model="selectedMarkerType"
            class="form-select"
          >
            <option value="recommended">Recommended</option>
            <option value="visited">Visited</option>
            <option value="not-to-visit">Not to Visit</option>
          </select>
        </div>

        <!-- Marker Image Upload -->
        <div class="form-group">
          <label>Marker Image</label>
          <div class="marker-upload-area">
            <input
              type="file"
              ref="markerInput"
              @change="handleMarkerUpload"
              accept="image/*"
              style="display: none"
            />

            <!-- Show uploaded marker preview -->
            <div v-if="uploadedMarker" class="marker-preview">
              <img
                :src="uploadedMarkerPreview"
                alt="Custom Marker"
                class="marker-image"
              />
              <p class="marker-type-label">{{ selectedMarkerType }} marker</p>
            </div>

            <!-- Upload button -->
            <button
              @click="$refs.markerInput.click()"
              class="upload-marker-btn"
            >
              {{ uploadedMarker ? "Change Marker" : "Upload Marker" }}
            </button>

            <button
              v-if="uploadedMarker"
              @click="removeMarker"
              class="remove-marker-btn"
            >
              Remove Marker
            </button>
          </div>
        </div>

        <div class="save-marker-section">
          <button
            @click="saveMarker"
            :disabled="!uploadedMarker"
            class="save-marker-btn"
          >
            Save Custom Marker
          </button>
        </div>
      </div>
    </div>

    <!-- Achievements Section (Empty for now) -->
    <div
      v-else-if="activeSection === 'achievements'"
      class="section achievements-section"
    >
      <h2 class="section-title">Achievements</h2>
      <div class="empty-state">
        <p>Achievements section coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// Active section state (profile or achievements)
const activeSection = ref("profile");


// Show password toggle

// Selected marker type
const selectedMarkerType = ref("recommended");

// Uploaded marker image
const uploadedMarker = ref(null);
const uploadedMarkerPreview = ref(null);

// Profile data - using reactive for nested object reactivity
const profileData = reactive({
  username: "fredymercury",
  firstName: "Fredy",
  lastName: "Mercury",
  email: "fredy@example.com",
  password: "password123",
  avatar: null,
  friends: "1.25k",
});

onMounted(() => {
  const username = localStorage.getItem("username");
  getUserData();
});

const getUserData = async () => {
  try {
    let request = {
      username: localStorage.getItem("username"),
    };
    debugger;
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/get-user-profile`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    profileData.username = response.data.user.username;
    profileData.firstName = response.data.user.firstname;
    profileData.lastName = response.data.user.lastname;
    profileData.email = response.data.user.email;
    profileData.password = response.data.user.password;
    profileData.friends = response.data.user.friends.length;
    profileData.avatar = response.data.user.image.url;
  } catch (error) {
    console.error("the error in fetching data is", error);
  }
};
const sendResetEmail = async () => {
  try {
    let request = {
      email: profileData.email,
    };
    debugger;
    const response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/reset-user-password`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    profileData.username = response.data.user.username;
    profileData.firstName = response.data.user.firstname;
    profileData.lastName = response.data.user.lastname;
    profileData.email = response.data.user.email;
  } catch (error) {
    console.error("the error in reset password is", error);
  }
};

// Edit mode for each field
const editMode = ref(false);

// Function to toggle edit mode for specific fields
const toggleEdit = async() => {
  if(editMode.value){
    try{
      let request = {
        userId:localStorage.getItem('userId'),
        username: profileData.username,
        firstname:profileData.firstName,
        lastname:profileData.lastName,
        email:profileData.email
      };
      const response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/edit-user-details`,
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }
  catch(error){
    console.error("the error in edit data is", error);
  }
}
editMode.value = !editMode.value;
};

// Handle avatar upload
const handleAvatarUpload = async (event) => {
  try {
    debugger;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("username", localStorage.getItem("username"));
    formData.append("image", file);

    let response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/edit-user-avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    profileData.avatar = response.data.user.image.url;
  } catch (error) {
    console.error("the error in uploading image is", error);
  }
};

// Remove avatar
const removeAvatar = () => {
  profileData.avatar = null;
};

// Get user initials for default avatar
const getInitials = () => {
  const first = profileData.firstName.charAt(0).toUpperCase();
  const last = profileData.lastName.charAt(0).toUpperCase();
  return first + last;
};

// Handle marker upload
const handleMarkerUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedMarker.value = file;

    // Optional: show preview if needed
    uploadedMarkerPreview.value = URL.createObjectURL(file);
  }
};

// Remove marker
const removeMarker = () => {
  uploadedMarker.value = null;
};

// Save custom marker
const saveMarker = async() => {
  if (!uploadedMarker.value || !selectedMarkerType.value) {
    alert("Please select both a marker type and an image.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("username", localStorage.getItem("username"));
    formData.append("label", selectedMarkerType.value);
    formData.append("image", uploadedMarker.value);

    const response = await axios.post(
      `http://${import.meta.env.VITE_API_URL}/api/user/add-marker`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Marker uploaded:", response.data);
    alert(`Custom ${selectedMarkerType.value} marker saved successfully!`);
    
    // Reset uploaded marker
    uploadedMarker.value = null;

  } catch (error) {
    console.error("Error uploading marker:", error);
    alert("Failed to upload marker.");
  }
};

// Return to main page function
const returnToMain = () => {
  console.log("Returning to main page...");
  // Here you would typically use router.push() or emit an event
  // For demo purposes, we'll just log it
  alert("Returning to main page...");
  router.push("/dashboard");
};
</script>

<style scoped>
/* Container and Layout */
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
  font-family: "Arial", sans-serif;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.return-btn {
  background-color: #2a2a2a;
  color: #ffffff;
  border: 2px solid #e4e827;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.return-btn:hover {
  background-color: #e4e827;
  color: #000000;
}

.page-title {
  color: #e4e827;
  font-size: 28px;
  margin: 0;
  font-weight: 600;
}

/* Tab Switcher */
.tab-switcher {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #333333;
}

.tab-btn {
  background: none;
  border: none;
  color: #cccccc;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #e4e827;
}

.tab-btn.active {
  color: #e4e827;
  border-bottom-color: #e4e827;
}

/* Sections */
.section {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  color: #e4e827;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 1px solid #333333;
  padding-bottom: 10px;
}

/* Profile Header Section - Custom Design */
.profile-header-section {
  margin-bottom: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(228, 232, 39, 0.1);
  width: 100%;
}

.profile-header-bg {
  position: relative;
  height: 200px;
  width: 100%;
  background: linear-gradient(
    135deg,
    rgba(135, 206, 235, 0.8) 0%,
    rgba(255, 228, 181, 0.8) 25%,
    rgba(221, 160, 221, 0.8) 50%,
    rgba(152, 251, 152, 0.8) 75%,
    rgba(240, 230, 140, 0.8) 100%
  );
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-content {
  position: relative;
  z-index: 10;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.profile-pic-container {
  position: relative;
  margin-right: 30px;
  flex-shrink: 0;
}

.profile-pic-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.9);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-profile-avatar {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(228, 232, 39, 0.9),
    rgba(240, 240, 80, 0.9)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.profile-initials {
  color: #000000;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.edit-profile-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.edit-profile-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.edit-icon {
  font-size: 14px;
}

.profile-stats {
  display: flex;
  gap: 40px;
  margin-left: auto;
  margin-right: 30px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 2px;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-transform: capitalize;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.profile-info {
  background: rgba(42, 42, 42, 0.95);
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-name-section {
  flex-grow: 1;
}

.profile-name-section h1.profile-name {
  color: #ffffff;
  font-size: 28px;
  margin: 0 0 8px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.verification-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #1da1f2, #0d8bd9);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(29, 161, 242, 0.3);
}

.profile-username {
  color: #888888;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.profile-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.remove-avatar-btn {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.5);
  color: #ff4757;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-weight: 500;
}

.remove-avatar-btn:hover {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff4757;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.2);
}

/* Personal Details Section */
.personal-details-section {
  margin-bottom: 40px;
  padding: 25px;
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #333333;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #e4e827;
  font-weight: 500;
  font-size: 14px;
}

.form-input,
.form-select {
  background-color: #1a1a1a;
  border: 2px solid #333333;
  color: #ffffff;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #e4e827;
}

.form-input:disabled {
  background-color: #333333;
  color: #888888;
  cursor: not-allowed;
}

.edit-btn {
  background-color: transparent;
  border: 1px solid #e4e827;
  color: #e4e827;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  align-self: flex-start;
  margin-top: 5px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background-color: #e4e827;
  color: #000000;
}

.password-actions {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.toggle-password {
  background-color: transparent;
  border: 1px solid #666666;
  color: #cccccc;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.toggle-password:hover {
  border-color: #e4e827;
  color: #e4e827;
}

/* Marker Upload Section */
.marker-upload-section {
  padding: 25px;
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #333333;
  margin-bottom: 30px;
}

.marker-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px dashed #333333;
  border-radius: 8px;
  margin-top: 10px;
}

.marker-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.marker-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #333333;
}

.marker-type-label {
  font-size: 12px;
  color: #e4e827;
  font-weight: 500;
  text-transform: capitalize;
}

.upload-marker-btn,
.remove-marker-btn,
.save-marker-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #e4e827;
  background-color: transparent;
  color: #e4e827;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-marker-btn:hover,
.remove-marker-btn:hover,
.save-marker-btn:hover {
  background-color: #e4e827;
  color: #000000;
}

.save-marker-btn:disabled {
  border-color: #666666;
  color: #666666;
  cursor: not-allowed;
}

.save-marker-btn:disabled:hover {
  background-color: transparent;
  color: #666666;
}

.save-marker-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* Achievements Section */
.achievements-section {
  padding: 25px;
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #333333;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #888888;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .tab-switcher {
    flex-direction: column;
  }

  .tab-btn {
    padding: 12px 20px;
  }

  .form-grid {
    gap: 20px;
  }

  .password-actions {
    flex-direction: column;
    gap: 8px;
  }

  /* Profile Header Mobile Responsiveness */
  .profile-header-bg {
    height: 160px;
  }

  .profile-content {
    flex-direction: column;
    padding: 15px 20px;
    text-align: center;
  }

  .profile-pic-container {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .profile-pic-circle {
    width: 80px;
    height: 80px;
  }

  .profile-initials {
    font-size: 24px;
  }

  .profile-stats {
    gap: 20px;
    margin: 0;
  }

  .stat-number {
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  .profile-info {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .profile-name {
    font-size: 24px !important;
  }
}
</style>