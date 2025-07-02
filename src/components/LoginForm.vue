<template>
  <div class="login-container">
    <div class="form-box">
      <!-- Enhanced Title with Travel Theme -->
      <div class="title-section">
        <h1 class="main-title">
          <!-- <span class="title-icon">✈️</span> -->
          <span class="title-text">
            <span class="title-large">T</span>ravel 
            <span class="title-diary">Diary</span>
          </span>
        </h1>
        <h2 class="welcome-title">
          <span class="welcome-large">W</span>elcome Back
        </h2>
        <p class="subtitle">Continue your journey</p>
      </div>

      <!-- Form Section -->
      <form class="login-form" @submit.prevent="login">
        <div class="form-group">
          <input
            type="text"
            placeholder=" "
            id="username"
            v-model="form.username"
            class="form-input"
            required
          />
          <label for="username" class="form-label">Username</label>
          <div class="input-border"></div>
        </div>
        
        <div class="form-group">
          <input
            type="password"
            placeholder=" "
            id="password"
            v-model="form.password"
            class="form-input"
            required
          />
          <label for="password" class="form-label">Password</label>
          <div class="input-border"></div>
        </div>

        <button class="login-btn" type="submit">
          <span class="btn-text">Login</span>
          <span class="btn-icon">→</span>
        </button>
      </form>

      <!-- Additional Links -->
      <!-- <div class="form-footer">
        <a href="#" class="forgot-link">Forgot Password?</a>
        <p class="signup-text">
          New here? <router-link to="/register" class="signup-link">Create Account</router-link>
        </p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axios from "axios"
import { useRouter } from 'vue-router'

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
.login-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 8rem;
  min-height: 100vh;
  width: 100%;
}

.form-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem 2.5rem;
  width: 420px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 20px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.form-box:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 12px 25px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Title Section */
.title-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.title-icon {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

.title-text {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1;
}

.title-large {
  font-size: 4rem;
  color: #3498db;
  text-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

.title-diary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: #34495e;
  line-height: 1.1;
}

.welcome-large {
  font-size: 3rem;
  color: #e74c3c;
  text-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  font-weight: 400;
}

/* Form Styling */
.login-form {
  margin-bottom: 2rem;
}

.form-group {
  position: relative;
  margin-bottom: 2rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #3498db;
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
}

.form-label {
  position: absolute;
  left: 1.2rem;
  top: 1rem;
  font-size: 1rem;
  color: #95a5a6;
  transition: all 0.3s ease;
  pointer-events: none;
  background: transparent;
  padding: 0;
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  top: -0.5rem;
  left: 1rem;
  font-size: 0.85rem;
  color: #3498db;
  background: rgba(255, 255, 255, 0.9);
  padding: 0 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 1px;
}

.form-input:focus ~ .input-border {
  width: 100%;
}

/* Button Styling */
.login-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
  background: linear-gradient(135deg, #2980b9, #3498db);
}

.login-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.login-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* Footer Links */
.form-footer {
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;
}

.forgot-link {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

.signup-text {
  margin: 1rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.signup-link {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #c0392b;
  text-decoration: underline;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
    justify-content: center;
  }
  
  .form-box {
    width: 100%;
    max-width: 400px;
    padding: 2rem 1.5rem;
  }
  
  .title-text {
    font-size: 2.2rem;
  }
  
  .title-large {
    font-size: 3rem;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .welcome-large {
    font-size: 2.4rem;
  }
}

@media (max-width: 480px) {
  .form-box {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
  
  .title-text {
    font-size: 1.8rem;
  }
  
  .title-large {
    font-size: 2.5rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .welcome-large {
    font-size: 2rem;
  }
}
</style>