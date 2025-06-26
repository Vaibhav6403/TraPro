import { ref } from 'vue';

// Shared socket + state
const socket = ref(null);
const isConnected = ref(false);
const messages = ref([]);
export const tripMessages = ref({})

// Connect to WebSocket
export function connectSocket(jwtToken) {
    socket.value = new WebSocket(`ws://localhost:5002?token=${jwtToken}`);

    socket.value.onopen = () => {
        isConnected.value = true;
        console.log('WebSocket connected');
    };

    socket.value.onclose = () => {
        isConnected.value = false;
        console.log('WebSocket disconnected');
    };
}

// Subscribe to a trip
export function subscribeToTrip(tripId) {
    debugger
    if (socket.value?.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify({
            type: 'subscribe',
            tripId
        }));
    } else {
        console.warn('WebSocket not connected');
    }
}

// Send a chat message
// export function sendMessage(tripId, content) {
//     if (socket.value?.readyState === WebSocket.OPEN) {
//         socket.value.send(JSON.stringify({
//             type: 'chat',
//             tripId,
//             content
//         }));
//     } else {
//         console.warn('WebSocket not connected');
//     }
// }

// Register message listener
export function registerMessageHandler() {
    if (!socket.value) return;

    socket.value.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case 'chat':
                const tripId = data.tripId;
                if (!tripMessages.value[tripId]) {
                    tripMessages.value[tripId] = [];
                }
                debugger
                tripMessages.value[tripId].push(data);
                break;
            case 'subscribed':
                console.log(`Subscribed to trip: ${data.tripId}`);
                break;
            case 'error':
                console.error(data.message);
                break;
            default:
                console.warn('Unknown message type:', data);
        }
    };
}

// Export shared reactive refs if needed
export { socket, isConnected, messages };
