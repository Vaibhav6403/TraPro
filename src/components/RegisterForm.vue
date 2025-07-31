<template>
  <div class="register-container">
    <div class="form-box">
      <!-- Enhanced Title with Travel Theme -->
      <div class="title-section">
        <h1 class="main-title">
          <span class="title-text">
            <span class="title-large">T</span>ravel 
            <span class="title-diary">Diary</span>
          </span>
        </h1>
        <p class="subtitle">Start your journey today</p>
      </div>

      <!-- Form Section -->
      <form class="register-form" @submit.prevent="submit">
        <div class="form-group">
          <input
            type="text"
            placeholder=" "
            id="firstname"
            v-model="form.firstname"
            class="form-input"
            required
          />
          <label for="firstname" class="form-label">First Name</label>
          <div class="input-border"></div>
        </div>

        <div class="form-group">
          <input
            type="text"
            placeholder=" "
            id="lastname"
            v-model="form.lastname"
            class="form-input"
            required
          />
          <label for="lastname" class="form-label">Last Name</label>
          <div class="input-border"></div>
        </div>

        <div class="form-group">
          <input
            type="email"
            placeholder=" "
            id="email"
            v-model="form.email"
            class="form-input"
            required
          />
          <label for="email" class="form-label">Email Address</label>
          <div class="input-border"></div>
        </div>
        
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

        <button class="register-btn" type="submit">
          <span class="btn-text">Create Account</span>
          <span class="btn-icon">→</span>
        </button>
        
        <div class="login-section">
          <div class="login-text">Already have an account?</div>
          <span @click="()=>router.push('/login')" class="login-link">Sign In</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from 'vue-router'
import axios from "axios"

const router = useRouter();
let form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  username: '',
  password: ''
})

const submit = async () => {
  let request = {
    firstname: form.firstname,
    lastname: form.lastname,
    email: form.email,
    username: form.username,
    password: form.password
  }
  try {
    const response = await axios.post(`http://${import.meta.env.VITE_API_URL}/api/user/register`, request)
    console.log("response", response)
    toast.success('Registration Successful');
    router.push('/login')
  }
  catch (error) {
    toast.error(
      error.response?.data?.message ,
      {
        position: 'top-right',
        autoClose: 4000,
      }
    )
    console.error(error)
  }
}
</script>

<style scoped>
.register-container {
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
  padding: 1.0rem 1.0rem;
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
  margin-bottom: 2rem;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
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
.register-form {
  margin-bottom: 2rem;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 0.7rem 0.5rem;
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
.register-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
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
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
  background: linear-gradient(135deg, #c0392b, #e74c3c);
}

.register-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.register-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* Login Section */
.login-section {
  text-align: center;
  padding: 0 0;
  border-top: 1px solid rgba(221, 221, 221, 0.5);
  margin-top: 10px;
}

.login-text {
  margin: 1rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.login-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  cursor: pointer;
}

.login-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-container {
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