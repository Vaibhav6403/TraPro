<template>
  <div class="wrapper position-relative me-2" ref="searchWrapper">
    <form  class="search-form form" >
      <input
        type="search"
        v-model="searchQuery"
        class="search-field"
        placeholder="Type Place Name..."
      />
      <button type="submit" class="search-submit button" @click.prevent="onSearchInput">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>

    <ul
      v-if="searchPlaceResults.length"
      class="list-group position-absolute w-100 z-3 mt-1"
    >
      <li
        v-for="location in searchPlaceResults"
        :key="location.place_id"
        class="list-group-item d-flex justify-content-between align-items-center"
        @click="selectPlace(location)"
      >
        {{location.display_name}}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive, onUnmounted } from "vue";
import axios from "axios";
const searchQuery = ref("");
const searchPlaceResults = ref([]);
const searchWrapper = ref(null);
const emit = defineEmits(["placeSend"]);


onMounted(()=>{
    // debugger
    // console.log(userFriends);
    document.addEventListener('click', handleClickOutside);
})
onUnmounted(()=>{
    document.removeEventListener('click', handleClickOutside);
})

const onSearchInput = async () => {
  if (!searchQuery.value) {
    searchPlaceResults.value = [];
    return;
  }
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: searchQuery.value,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
    })
    searchPlaceResults.value = res.data;
  } catch (e) {
    console.error(e);
  }
}

const selectPlace = async (place) =>{
    debugger
    emit("placeSend",place);
}

const handleClickOutside = (event) => {
  if (
    searchWrapper.value &&
    !searchWrapper.value.contains(event.target)
  ) {
    searchPlaceResults.value = []; // hide the list
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
.list-group-item{
    cursor:pointer;
}
</style>
