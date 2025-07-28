<template>
  <div class="personal-details-section">
    <h2 class="section-title">Reset Password</h2>
    <div class="form-grid">
      <div class="form-group">
        <label for="password">New Password</label>
        <input 
          type="password" 
          id="password" 
          class="form-input"
          v-model="password"
          placeholder="Enter new password"
        />

        <label for="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword"
          v-model="confirmPassword" 
          class="form-input"
          placeholder="Re-enter new password"
        />

        <button @click="resetPassword" class="reset-btn">
          🔒 Reset Password
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from "vue-router";
import router from '../router/router';

const password = ref('');
const confirmPassword = ref('');
const route = useRoute();
const token = route.params.token;

const resetPassword = async ()=>{
    try{
    let request={
      password:confirmPassword.value
    }
    debugger
    const response = await axios.post(`http://${import.meta.env.VITE_API_URL}/api/user/reset-user-password/${token}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
    if(response){
        router.push('/profile')
    }
    
  }
  catch(error){
    console.error('the error in reset password is',error)
  }
}
</script>

<style scoped>
.personal-details-section {
  margin-bottom: 40px;
  padding: 30px;
  background-color: #2c2c2c;
  border-radius: 12px;
  border: 1px solid #444;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.section-title {
  color: #e4e827;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group label {
  color: #e4e827;
  font-weight: 600;
  font-size: 14px;
}

.form-input {
  background-color: #1a1a1a;
  border: 2px solid #333;
  color: #ffffff;
  padding: 12px 15px;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border-color: #e4e827;
  box-shadow: 0 0 5px #e4e827aa;
  outline: none;
}

.reset-btn {
  background-color: #e4e827;
  color: #000;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.reset-btn:hover {
  background-color: #d3d525;
}
</style>
