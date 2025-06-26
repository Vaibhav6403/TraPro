<template>
  <div class="wrapper position-relative me-2" ref="searchWrapper">
    <form @submit.prevent="searchUsers" class="search-form form">
      <input
        type="search"
        v-model="searchQuery"
        class="search-field"
        placeholder="Type a username..."
      />
      <button type="submit" class="search-submit button">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>

    <ul
      v-if="searchResults.length"
      class="list-group position-absolute w-100 z-3 mt-1"
    >
      <li
        v-for="user in searchResults"
        :key="user.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>{{ user.username }}</span>
        <button
          v-if="isFriendCheck(user.username)"
          class="btn btn-sm btn-primary"
          @click="addFriend(user.username)"
        >
          Add Friend
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive, onUnmounted } from "vue";
import axios from "axios";
const searchQuery = ref("");
const searchResults = ref([]);
const searchWrapper = ref(null);
const {userFriends} = defineProps({
  userFriends: []
});

onMounted(()=>{
    // debugger
    console.log(userFriends);
    document.addEventListener('click', handleClickOutside);
})
onUnmounted(()=>{
    document.removeEventListener('click', handleClickOutside);
})

const handleClickOutside = (event) => {
  if (
    searchWrapper.value &&
    !searchWrapper.value.contains(event.target)
  ) {
    searchResults.value = []; // hide the list
  }
};

const searchUsers = async () => {
  try {
    let request = {
      username: searchQuery.value,
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/search-friends",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // debugger;
    searchResults.value = response.data.friends;
    // console.log(response.data.friends);
    // searchResults.length = 0; // clear it first
    // response.data.friends.forEach((friend) => {
    //   searchResults.push(friend)}
    // );
    console.log(searchResults.value.length);
  } catch (error) {}
};

const isFriendCheck = (username) => {
  // debugger;
  return !userFriends.includes(username);
};
const addFriend = async (friendUsername) => {
  try {
    let request = {
      username: locationData.username,
      friendUsername: friendUsername,
    };
    let response = await axios.post(
      "http://localhost:5002/api/user/add-friend",
      request,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("user added", response);
  } catch (error) {
    console.error("the error in add friends is", error);
  }
};

</script>
<style scoped>


input[type="search"] {
  -webkit-appearance: none !important;
  background-clip: padding-box;
  background-color: white;
  vertical-align: middle;
  border-radius: 0.50rem;
  border: 1px solid #e0e0e5;
  font-size: 1rem;
  width: 100%;
  line-height: 2;
  padding: 0.375rem 1.25rem;
  -webkit-transition: border-color 0.2s;
  -moz-transition: border-color 0.2s;
  transition: border-color 0.2s;

  border-radius: 25px;
}

input[type="search"]:focus {
  /* transition: all 0.5s;
  box-shadow: 0 0 40px #f9d442b9;
  border-color: #f9d342; */
  outline: none;
}

form.search-form {
  display: flex;
  justify-content: center;
    position: relative;
}

label {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  align-self: center;
  margin-bottom: 0;
}

.search-field {
  margin-bottom: 0;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  align-self: center;
  height: 30px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.search-submit {
  height: 30px;
  margin: 0;
  padding: 0.5rem 1.3rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  font-family: "Font Awesome 5 Free";
  font-size: 1rem;
}

.screen-reader-text {
  clip: rect(1px, 1px, 1px, 1px);
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
}

.button {
  display: inline-block;
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1.15;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  background: #e4e827;
  color: #292826;
  border: 1px solid transparent;
  vertical-align: middle;
  text-shadow: none;
  position: absolute;
    right: 0;
    border-radius: 25px;
}

.button:hover,
.button:active,
.button:focus {
  cursor: pointer;
  background: #e4e827;
  color: #292826;
  outline: 0;
}
.search-dropdown,
.list-group.position-absolute {
  max-height: 300px;
  overflow-y: auto;
  background: white;
  z-index: 1050;
  border: 1px solid #ccc;
  top: 25px;
}
</style>
