<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.from === currentUserId ? 'sent' : 'received']"
      >
        <p>{{ msg }}</p>
        <!-- <span class="timestamp">{{ formatTime(msg.timestamp) }}</span> -->
      </div>
    </div>

    <div class="chat-input">
      <input
        type="text"
        v-model="message"
        placeholder="Type a message"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWindow',
  data() {
    return {
      socket: null,
      message: '',
      messages: [],
      currentUserId: null, // your own user ID
      recipientId: '', // the person you're chatting with
    };
  },
  created() {

    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjQ1MDEwZTM4ZDkwODY4MzBhMzU2MCIsImlhdCI6MTc0NzIxMDI3NCwiZXhwIjoxNzQ3Mjk2Njc0fQ.i2PQNnHvqX0ldzWL9MT4CDIBMe5ri-XZ8MLY0JwKC6M");
    localStorage.setItem("userId", "vaibhav");
    const token = localStorage.getItem('token');
    this.currentUserId = localStorage.getItem('userId'); // store this at login
    this.recipientId = 'TARGET_USER_ID'; // replace with dynamic ID in real app

    this.socket = new WebSocket(`ws://localhost:5002?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };
    this.socket.onmessage = (event) => {
      const msg = event.data;
      if(msg.type == 'init'){
        const receiverId = message.receiverId;
        console.log('Receiver ID:', receiverId);
      }
    };
    this.socket.addEventListener("open", () => {
      console.log("We are connected");
    });
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }, beforeUnmount() {
    // Close WebSocket before the component is destroyed
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket closed');
    }
  },
  methods: {
    sendMessage() {
      if (!this.message.trim()) return;

      const msgData = {
        type:'chat',
        to: this.recipientId,
        content: this.message,
        timestamp: new Date().toISOString()
      };

      this.socket.send(JSON.stringify(msgData));
      this.message = '';
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  font-family: sans-serif;
}

.chat-messages {
  border: 1px solid #ccc;
  padding: 1rem;
  height: 400px;
  overflow-y: auto;
  background: #f9f9f9;
  margin-bottom: 1rem;
}

.message {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  max-width: 75%;
}

.sent {
  background-color: #dcf8c6;
  margin-left: auto;
  text-align: right;
}

.received {
  background-color: #fff;
  text-align: left;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
}

input[type='text'] {
  flex-grow: 1;
  padding: 0.5rem;
}
</style>
