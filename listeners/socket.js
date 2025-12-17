const { Server } = require("socket.io");

let io;
let serverAwake = false;

const socketListener = (server, options) => {
  io = new Server(server, options);

  serverAwake = true;
  io.on("connection", (socket) => {
    // listen here if there is emit from client
    if (serverAwake) {
      socket.emit("server-awake-notification", {
        is_server_sleep: false,
      });
    }
  });
};

const socketEmiter = (uniqueName, data) => {
  if (!io) return;
  io.emit(uniqueName, data);
};

module.exports = {
  socketListener,
  socketEmiter,
};
