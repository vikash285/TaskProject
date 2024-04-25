const token = localStorage.getItem("token");

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling", "flashsocket"],
});
socket.on("connection", () => {
  console.log(socket.id);
});
socket.on("get-reply", () => {
  getReply();
});

const reply = document.getElementById("send");
reply.addEventListener("click", async (event) => {
  try {
    event.preventDefault();
    const reply = document.getElementById("message").value;
    await axios.post(
      "http://localhost:3000/post/replyToPost?pId=1",
      {
        reply,
      },
      { headers: { Authorization: token } }
    );
    document.getElementById("message").value = "";
    socket.emit("send-reply");
  } catch (err) {
    document.body.innerHTML = `<div style="color:red">${err}</div>`;
  }
});

async function getReply() {
  try {
    const res = await axios.get(
      "http://localhost:3000/postSection/postSection?pId=1",
      { headers: { Authorization: token } }
    );
    console.log(res);
    document.getElementById("title").innerHTML = res.data.post.title;
    document.getElementById("content").innerHTML = res.data.post.content;
    document.getElementById("reply").innerHTML = "";
    for (let i = 0; i < res.data.arr.length; i++) {
      showReply(res.data.arr[i]);
    }
  } catch (err) {
    document.body.innerHTML = `<div style="color:red">${err}</div>`;
  }
}

function showReply(chat) {
  try {
    const parentNode = document.getElementById("reply");
    const childnode = `<div>${chat.user}:${chat.reply}</div>`;
    parentNode.innerHTML += childnode;
  } catch (err) {
    document.body.innerHTML = `<div style="color:red">${err}</div>`;
  }
}
