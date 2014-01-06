(function(){
	var Tank = function(socket, battlefield) {
		if(typeof socket != "undefined") {
			this.socket = socket;
			this.battlefield = battlefield;
			this.position = [0,0];

			socket.on("register", function(data) {
				this.name = data.name;
			});

			socket.on("move", function(data) {
				this.position = battlefield.moveTank(this, data.direction);
			});

			socket.on("shoot", function(data) {
				// shoot tank
			});

			socket.on("beam", function(data) {
				// send beam
			});

			socket.on("disconnect", function(data) {
				// disconnect tank
			});
		}
	};

	module.exports.Tank = Tank;
}).call(this);