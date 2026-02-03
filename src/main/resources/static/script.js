const joinCard = document.querySelector(".join-card");
const usernameInput = document.querySelector(".join-card input");
const joinButton = document.getElementById("join-button");

const connectingText = document.getElementById("connecting-text");

const chatBox = document.querySelector(".chat-box");
const usernameEl = document.querySelector(".username");
const chatMessagesList = document.querySelector(".chat-messages-list");
const sendMessageInputField = document.querySelector(".message-box input");
const sendMessageButton = document.querySelector(".message-box button");

let username = "";

let stompClient = null;

joinButton.addEventListener("click", () => {
  joinCard.classList.add("hidden");
  connectingText.classList.remove("hidden");

  username = usernameInput.value;
  usernameEl.textContent = username;

  const socket = new SockJS("/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, onConnect, onError);

  setTimeout(() => {
    chatBox.classList.remove("hidden");
    connectingText.classList.add("hidden");
  }, 3000);
});

sendMessageButton.addEventListener("click", () => {
  const message = {
    sender: username,
    content: sendMessageInputField.value,
    type: "CHAT",
  };
  sendMessage(message);
  addMessageToList(message, true);
  sendMessageInputField.value = "";
});

function addMessageToList(message, isMe) {
  // create li
  const li = document.createElement("li");

  // assign class to li
  li.classList.add(isMe ? "right" : "left");

  // sender
  const p = document.createElement("p");
  p.textContent = isMe ? "You" : message.sender;
  p.classList.add("sender", isMe ? "align-right" : "align-left");

  // create span and assign class - chat-message
  const span = document.createElement("span");
  span.classList.add("chat-message");

  // textContent of span
  span.textContent = message.content;

  // append to li
  li.appendChild(p);
  li.appendChild(span);

  // append li to chat messages list
  chatMessagesList.appendChild(li);
}

function onConnect() {
  stompClient.subscribe("/topic/public", onReceive);
  stompClient.send(
    "/app/chat.addUser",
    {},
    JSON.stringify({ sender: username, type: "JOIN" }),
  );
}

function onReceive(payload) {
  const message = JSON.parse(payload.body);
  if (message.sender === username) {
    return;
  }
  if (message.type === "JOIN") {
    return; // TODO: Join in html
  }
  addMessageToList(message, false);
}

function sendMessage(message) {
  stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
}

function onError() {}
