(function(){
	var configuration = function(width, height) {
		this.width;
		if (typeof width != "undefined") this.width = width;
		this.height;
		if (typeof height != "undefined") this.height = height;

		this.rocketRadius;
		this.scope;
	};

	module.exports.Configuration = configuration;
}).call(this);