const WebSocket = require("ws");

class MyServer {
  constructor() {
    this.connectedClients = [];
    this.webSocketServer = new WebSocket.Server({ port: 8000 });

    this.webSocketServer.on("connection", this.handleConnection.bind(this));
  }

  sendMessageToAll(message) {
    this.connectedClients.forEach((client) => {
      client.send(message);
    });
  }

  handleMessage(client, message) {
    const receivedMessage = JSON.parse(message);
    if ("login" in receivedMessage) {
      client.username = receivedMessage.name;
    }
    const formattedMessage = this.prepareMessage(receivedMessage);
    this.sendMessageToAll(formattedMessage);
  }

  handleConnection(client) {
    console.log(`New client connected -> ${client}`);
    this.connectedClients.push(client);

    client.on("message", (message) => {
      this.handleMessage(client, message);
    });

    client.on("close", () => {
      console.log(
        `${client._socket.remoteAddress}:${client._socket.remotePort} closed`
      );
      const message = { content: `${client.username} has been disconnected` };
      this.connectedClients = this.connectedClients.filter((c) => c !== client);
      this.sendMessageToAll(JSON.stringify(message));
    });
  }

  getMessageContent(message) {
    return JSON.parse(message);
  }

  prepareMessage(messageObject) {
    let message = {};
    const { name, body, login } = messageObject;
    if (login) {
      message = { content: `${name} has been connected` };
    } else if (body) {
      message = { content: `${name}: ${body}` };
    }
    return JSON.stringify(message);
  }
}

new MyServer();
