(function() {
	require("./lib");

	var Tile = (function() {
		function Tile() {}
		Tile.FREE = 0;
		Tile.WALL = 1;
		Tile.TANK = 2;

		return Tile;
	})();

	var directions = {
		NORTH: "NORTH",
		NORTH_EAST: "NORTH-EAST",
		EAST: "EAST",
		SOUTH_EAST: "SOUTH-EAST",
		SOUTH: "SOUTH",
		SOUTH_WEST: "SOUTH-WEST",
		WEST: "WEST",
		NORTH_WEST: "NORTH-WEST"
	};

	var Battlefield = function(config, fieldprocessors) {
		this.configuration = config;
		this.field = Math.matrix(config.height, config.width, Tile.FREE);

		if (typeof fieldprocessors === "undefined") {
			add_wall_around_field(this.configuration, this.field);
		}
		else {
			parse_fieldprocessors(this.configuration, this.field, fieldprocessors);
		}

		this.tanks = [];
	};

	var add_wall_around_field = function(config, field) {
		for (var i = 0; i < config.height; i++)
			for (var j = 0; j < config.width; j++)
				if(i===0 || i === (config.height-1) || j === 0 || j === (config.width-1))
					field[i][j] = Tile.WALL;
	};

	var parse_fieldprocessors = function(config, field, fieldprocessors) {
		for (var i = 0; i < fieldprocessors.length; i++) {
			fieldprocessors[i](config, field);
		}
	};

	Battlefield.prototype.randomPosition = function() {
		var poswidth, posheight;
		do {
			poswidth = Math.randomInt(0, this.configuration.width-1);
			posheight = Math.randomInt(0, this.configuration.height-1);
		}
		while(this.field[posheight][poswidth] != Tile.FREE);

		return [posheight, poswidth];
	};

	Battlefield.prototype.addTank = function(tank) {
		this.tanks.push(tank);
		this.field[tank.position[0]][tank.position[1]] = Tile.TANK;
	};

	Battlefield.prototype.removeTank = function(tank) {
		var index = this.tanks.indexOf(tank);
		if (index > -1) {
			this.tanks.splice(index, 1);
		}
		this.field[tank.position[0]][tank.position[1]] = Tile.FREE;
	};

	Battlefield.prototype.moveTank = function(tank, dir) {
		var newPos = (function() {
			switch(dir) {
				case directions.NORTH:
					return [tank.position[0]-1, tank.position[1]];
				case directions.NORTH_EAST:
					return [tank.position[0]-1, tank.position[1]+1];
				case directions.EAST:
					return [tank.position[0], tank.position[1]+1];
				case directions.SOUTH_EAST:
					return [tank.position[0]+1, tank.position[1]+1];
				case directions.SOUTH:
					return [tank.position[0]+1, tank.position[1]];
				case directions.SOUTH_WEST:
					return [tank.position[0]+1, tank.position[1]-1];
				case directions.WEST:
					return [tank.position[0], tank.position[1]-1];
				case directions.NORTH_WEST:
					return [tank.position[0]-1, tank.position[1]-1];
				default:
					return [-1, -1];
			}
		})();

		if( (newPos[0] >= 0 && newPos[1] >= 0) && (newPos[0] < this.configuration.height && newPos[1] < this.configuration.width) && this.field[newPos[0]][newPos[1]] === Tile.FREE) {
			this.field[tank.position[0]][tank.position[1]] = Tile.FREE;
			tank.position = newPos;
			this.field[newPos[0]][newPos[1]] = Tile.TANK;
		}
		return tank.position;
	};

	Battlefield.prototype.scope = function(pos) {
		if(this.configuration.height === 1 && this.configuration.width === 1 && pos[0] === 0 && pos[1] === 0)
			return [[0]];

		if(this.configuration.height <= pos[0] || this.configuration.width <= pos[1])
			throw "incorrect scope";

		var heightMax = ((pos[0] + this.configuration.scope) < this.configuration.height) ? pos[0]+this.configuration.scope : this.configuration.height-1;
		var heightMin = ((pos[0] - this.configuration.scope) >= 0) ? pos[0] - this.configuration.scope : 0;
		var widthMax = ((pos[1] + this.configuration.scope) < this.configuration.width) ? pos[1] + this.configuration.scope : this.configuration.width-1;
		var widthMin = ((pos[1] - this.configuration.scope) >= 0) ? pos[1] - this.configuration.scope : 0;

		var newScope = [];
		var i, j, x, y;
		for (i = heightMin, x = 0; i <= heightMax; i++, x++) {
			newScope[x] = [];
			for (j = widthMin, y = 0; j <= widthMax; j++, y++) {
				newScope[x][y] = this.field[i][j];
			}
		}
		return newScope;

	};

	Battlefield.prototype.tanksInScope = function(tank) {
		var heightMax = ((tank.position[0] + this.configuration.scope) < this.configuration.height) ? tank.position[0]+this.configuration.scope : this.configuration.height-1;
		var heightMin = ((tank.position[0] - this.configuration.scope) >= 0) ? tank.position[0] - this.configuration.scope : 0;
		var widthMax = ((tank.position[1] + this.configuration.scope) < this.configuration.width) ? tank.position[1] + this.configuration.scope : this.configuration.width-1;
		var widthMin = ((tank.position[1] - this.configuration.scope) >= 0) ? tank.position[1] - this.configuration.scope : 0;

		var toReturnTanks = [];
		var i, j;
		for (i = heightMin; i <= heightMax; i++) {
			for (j = widthMin; j <= widthMax; j++) {
				if( !(tank.position[0] === i && tank.position[1] === j) && this.field[i][j] === Tile.TANK) {
					for (var x = 0; x < this.tanks.length; x++) {
						if(this.tanks[x].position[0] === i && this.tanks[x].position[1] === j) {
							toReturnTanks.push(this.tanks[x]);
						}
					}
				}
			}
		}
		return toReturnTanks;
	}

	module.exports.Battlefield = Battlefield;
	module.exports.Tile = Tile;

}).call(this);
