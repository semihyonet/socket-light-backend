const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
	res.send("Hello from the server");
});
let onlinePeople = 0;

let red = 0;
let green = 0;
let blue = 0;

io.on("connection", (socket) => {
	onlinePeople += 1;
	console.log("Connected currently there are ", onlinePeople, " online.");
	socket.emit("userNum", onlinePeople);
	socket.emit("lightState", { red, green, blue });

	socket.on("toggleLight", (state) => {
		red = state.red;
		green = state.green;
		blue = state.blue;
		// console.log(state);
		socket.to("site").emit("newState", { red, green, blue });
	});
	socket.join("site");

	socket.in("site").emit("userNum", onlinePeople);
	socket.on("disconnect", () => {
		onlinePeople -= 1;
		console.log("Disconnected");
		io.to("site").emit("userNum", onlinePeople);
	});
});

http.listen(4000, () => {
	console.log("Working on 4000");
});
