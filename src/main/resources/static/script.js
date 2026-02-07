const joinCard = document.querySelector(".join-card");
const usernameInput = document.querySelector(".join-card input");
const joinButton = document.getElementById("join-button");

const connectingText = document.getElementById("connecting-text");

const chatBox = document.querySelector(".chat-box");
const usernameEl = document.querySelector(".username");
const onlineCountEl = document.querySelector(".online-count");
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

function onConnect() {
  stompClient.subscribe("/topic/public", onReceive);
  stompClient.send(
    "/app/chat.addUser",
    {},
    JSON.stringify({ sender: username, type: "JOIN" }),
  );

  updateOnlineCount();
}

function onReceive(payload) {
  const message = JSON.parse(payload.body);
  if (message.sender === username) {
    return;
  }

  if (message.type === "JOIN") {
    addJoinedMessageToList(message.sender);
    updateOnlineCount();
    return;
  }

  if (message.type === "LEAVE") {
    addDisconnectMessageToList(message.sender);
    updateOnlineCount();
    return;
  }

  addMessageToList(message, false);
}

function sendMessage(message) {
  stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
}

function onError() {}

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

function addDisconnectMessageToList(username) {
  // create li, assign class of disconnect-message
  const li = document.createElement("li");
  li.classList.add("disconnect-message");

  // create span element for username and assign class of disconnected-username, append to li
  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = username;
  usernameSpan.classList.add("disconnected-username");
  li.appendChild(usernameSpan);

  // create span element and add text "left the chat", append to li
  const span = document.createElement("span");
  span.textContent = " left the chat";
  li.appendChild(span);

  // append li to chat messages list
  chatMessagesList.appendChild(li);
}

function addJoinedMessageToList(username) {
  // create li, assign class of join-message
  const li = document.createElement("li");
  li.classList.add("join-message");

  // create span element for username and assign class of joined-username, append to li
  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = username;
  usernameSpan.classList.add("joined-username");
  li.appendChild(usernameSpan);

  // create span element and add text "joined the chat", append to li
  const span = document.createElement("span");
  span.textContent = " joined the chat";
  li.appendChild(span);

  // append li to chat messages list
  chatMessagesList.appendChild(li);
}

async function updateOnlineCount() {
  const res = await fetch("http://localhost:8080/ws/connections");
  const count = await res.text();
  onlineCountEl.textContent = count;
}
