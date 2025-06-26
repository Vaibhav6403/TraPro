<template>
  <div>
  <div class="p-4 form-box" style="width: 350px; margin-right: 5vw">
    <h4 class="mb-4 text-center fs-2">Welcome Back!</h4>
    <div class="form-group">
      <input
        type="text"
        placeholder=" "
        id="username"
        v-model="form.username"
      />
      <label for="username">Username</label>
    </div>
    <div class="form-group">
      <input
        type="password"
        placeholder=" "
        id="password"
        v-model="form.password"
      />
      <label for="password">Password</label>
    </div>
    <button class="btn btn-primary w-100" type="submit" @click.prevent="login">
      Submit
    </button>
  </div>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import axios from "axios"
import { useRouter } from 'vue-router'
import Navbar from "./Navbar.vue";

const router = useRouter()
    const form = reactive({
        username:'',
        password:''
    })

    const login = async ()=>{
        let request = {
            username:form.username,
            password:form.password
        }
        try{
                    let response = await axios.post('http://localhost:5002/api/user/login',request)
                    if(response.status == 200){
                    localStorage.setItem("token",response.data.token)
                    localStorage.setItem("username",response.data.user.username)
                    localStorage.setItem("userId",response.data.user.id)
                        router.push('/dashboard')
                    }
        }
        catch(error){
            console.error(error);
        }

    }

</script>
<style scoped>
.form-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  z-index: 2;
  position: relative;
}
.form-container {
  max-width: 500px;
  width: 100%;
  padding: 50px 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.form-container h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  color: #333;
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
.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.submit-button:hover {
  background-color: #0056b3;
}
</style>