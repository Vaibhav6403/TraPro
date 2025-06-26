<template>
    <div class="p-4 form-box" style="width: 350px; margin-right: 5vw;">
      <h4 class="mb-4 text-center fs-2">Register Now!</h4>

      <div class="form-group">
    <input type="text" placeholder=" " id="name" v-model="form.firstname">
    <label for="name">First Name</label>
  </div>
  <div class="form-group">
    <input type="text" placeholder=" " id="lastname" v-model="form.lastname">
    <label for="lastname">Last Name</label>
  </div>
  <div class="form-group">
    <input type="email" placeholder=" " id="inputField" v-model="form.email">
    <label for="inputField">Email Address</label>
  </div>
  <div class="form-group">
    <input type="text" placeholder=" " id="username" v-model="form.username">
    <label for="username">Username</label>
  </div>
  <div class="form-group">
    <input type="password" placeholder=" " id="password" v-model="form.password"> 
    <label for="password">Password</label>
  </div>

      <button class="btn btn-primary w-100" type="submit" @click.prevent="submit">Submit</button>

      
    </div>
</template>
<script setup>
import { reactive,ref } from "vue";
import { useRouter } from 'vue-router'
import axios from "axios"

const router = useRouter();
    let form =  reactive({
    firstname:'',
    lastname:'',
    email:'',
    username:'',
    password:''
  })
  const submit = async()=>{
    let request ={
      firstname:form.firstname,
      lastname:form.lastname,
      email:form.email,
      username:form.username,
      password:form.password
    }
    try{
      const response = await axios.post('http://localhost:5002/api/user/register', request)
      console.log("response",response)
      router.push('/login')
    }
    catch(error){
      console.error(error)
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
