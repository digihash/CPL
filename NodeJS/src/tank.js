(function(){
	var Tank = function(socket, battlefield) {
		this.socket = socket;
		this.battlefield = battlefield;
		this.position = [0,0];
	};

	module.exports.Tank = Tank;
}).call(this);