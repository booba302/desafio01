window.addEventListener("load", (e) => {
  const username = localStorage.getItem("username");
  if (username) {
    $("#chat").removeClass("hidden");
    $("#joinChat").addClass("hidden");
  }
});

document.getElementById("joinBtn").addEventListener("click", (e) => {
  const username = document.getElementById("username").value;
  if (!username) username = "Guest";
  localStorage.setItem("username", username);
  document.getElementById("chat").classList.remove("hidden");
  document.getElementById("joinChat").classList.add("hidden");
});

function createMessage(msg) {
  return `<div class="chat-message">
        <div class="flex items-end">
            <div
            class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start"
            >
            <span class="brand-color">${msg.user}</span>
            <div>
                <span
                class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
                >${msg.message}</span>
            </div>
            </div>
        </div>
        </div>`;
}

function createOwnMessage(msg) {
  return `<div class="chat-message">
        <div class="flex items-end justify-end">
            <div
            class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end"
            >
            <div>
                <span
                class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white"
                >${msg}</span>
            </div>
            </div>
        </div>
        </div>`;
}

const socket = io();
socket.on("allMessages", (messages) => {
  const user = localStorage.getItem("username");
  const addMessage = messages.map((msg) =>
    msg.user == user ? createOwnMessage(msg.message) : createMessage(msg)
  );
  $("#messages").html(addMessage.join(" "));
});

socket.on("getMsg", (messages) => {
  const user = localStorage.getItem("username");
  const addMessage = messages.map((msg) =>
    msg.user == user ? createOwnMessage(msg.message) : createMessage(msg)
  );
  $("#messages").html(addMessage.join(" "));
});

document.getElementById("sendMsg").addEventListener("click", (e) => {
  const user = localStorage.getItem("username");
  const message = document.getElementById("message").value;
  socket.emit("sendMsg", { user, message });
  $("#messages").append(createOwnMessage(message));
  document.getElementById("message").value = "";
});

document.getElementById("message").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const user = localStorage.getItem("username");
    const message = document.getElementById("message").value;
    socket.emit("sendMsg", { user, message });
    $("#messages").append(createOwnMessage(message));
    document.getElementById("message").value = "";
  }
});
