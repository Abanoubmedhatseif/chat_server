const userNameDisplay = document.getElementById("userNameDisplay");
const messageArea = document.getElementById("messageArea");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let userName = prompt("Enter your name to join the chat:");
userName = userName.charAt(0).toUpperCase() + userName.slice(1);
userNameDisplay.innerHTML = `You're logged in as ${userName}`;

const webSocket = new WebSocket("ws://localhost:8000");

webSocket.onopen = () => {
  const data = {
    name: userName,
    login: true,
  };

  webSocket.send(JSON.stringify(data));
};

webSocket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  const messageElement = document.createElement("div");

  messageElement.innerHTML = `<h4>${message.content}</h4>`;
  messageArea.appendChild(messageElement);
};

webSocket.onerror = () => {
  messageArea.innerHTML += `<h4 class="text-danger">Error in connection</h4>`;
};

sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  const data = {
    name: userName,
    body: message,
  };
  webSocket.send(JSON.stringify(data));
  messageInput.value = "";
});

messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const message = messageInput.value;
    if (message) {
      const data = {
        name: userName,
        body: message,
      };
      webSocket.send(JSON.stringify(data));
      messageInput.value = "";
    }
  }
});
