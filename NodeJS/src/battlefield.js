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
	};

	Battlefield.prototype.tanksInRocketScope = function(tank) {
		var heightMax = ((tank.position[0] + this.configuration.rocketRadius) < this.configuration.height) ? tank.position[0]+this.configuration.rocketRadius : this.configuration.height-1;
		var heightMin = ((tank.position[0] - this.configuration.rocketRadius) >= 0) ? tank.position[0] - this.configuration.rocketRadius : 0;
		var widthMax = ((tank.position[1] + this.configuration.rocketRadius) < this.configuration.width) ? tank.position[1] + this.configuration.rocketRadius : this.configuration.width-1;
		var widthMin = ((tank.position[1] - this.configuration.rocketRadius) >= 0) ? tank.position[1] - this.configuration.rocketRadius : 0;

		var toReturnTanks = [];
		var i, j;
		for (i = heightMin; i <= heightMax; i++)
			for (j = widthMin; j <= widthMax; j++)
				if( !(tank.position[0] === i && tank.position[1] === j))
					if( (Math.sqrt(Math.pow(tank.position[0] - i, 2) + Math.pow(tank.position[1] - j, 2)) <= this.configuration.rocketRadius) && this.field[i][j] === Tile.TANK)
						if (!isWallsInBetween(getCellsInBetween(tank.position[1], tank.position[0], j, i, this.field), this.field)) // als er geen muren tussen deze twee posities staan.
							for (var x = 0; x < this.tanks.length; x++)
								if(this.tanks[x].position[0] === i && this.tanks[x].position[1] === j)
									toReturnTanks.push(this.tanks[x]);
		return toReturnTanks;
	};

	var getCellsInBetween = function(x1, y1, x2, y2, field) {
		var i;               // loop counter
		var ystep, xstep;    // the step on y and x axis
		var error;           // the error accumulated during the increment
		var errorprev;       // *vision the previous value of the error variable
		var y = y1, x = x1;  // the line points
		var ddy, ddx;        // compulsory variables: the double values of dy and dx
		var dx = x2 - x1;
		var dy = y2 - y1;

		var positions = [];

		// NB the last point can't be here, because of its previous positions.push([which has to be verified)
		if (dy < 0) {
			ystep = -1;
			dy = -dy;
		} else
			ystep = 1;

		if (dx < 0) {
			xstep = -1;
			dx = -dx;
		} else
			xstep = 1;

		ddy = 2 * dy;  // work with double values for full precision
		ddx = 2 * dx;

		if (ddx >= ddy) {  // first octant (0 <= slope <= 1)
			// compulsory initialization (even for errorprev, needed when dx==dy)
			errorprev = error = dx;  // start in the middle of the square

			for (i=0 ; i < dx ; i++) {  // do not use the first positions.push([already done)
				x += xstep;
				error += ddy;
				if (error > ddx) {  // increment y if AFTER the middle ( > )
					y += ystep;
					error -= ddx;
					// three cases (octant == right->right-top for directions below):
					if (error + errorprev < ddx)  // bottom square also
						positions.push([y-ystep, x]);
					else if (error + errorprev > ddx)  // left square also
						positions.push([y, x-xstep]);
					else {  // corner: bottom and left squares also
						positions.push([y-ystep, x]);
						positions.push([y, x-xstep]);
					}
				}
				positions.push([y, x]);
				errorprev = error;
			}
		} else {  // the same as above
			errorprev = error = dy;
			for (i=0 ; i < dy ; i++) {
				y += ystep;
				error += ddx;
				if (error > ddy){
					x += xstep;
					error -= ddy;
					if (error + errorprev < ddy)
						positions.push([y, x-xstep]);
					else if (error + errorprev > ddy)
						positions.push([y-ystep, x]);
					else {
						positions.push([y, x-xstep]);
						positions.push([y-ystep, x]);
					}
				}
				positions.push([y, x]);
				errorprev = error;
			}
		}
		return positions;
		// assert ((y == y2) && (x == x2));  // the last positions.push([y2,x2) has to be the same with the last point of the algorithm
	};

	var isWallsInBetween = function(positions, field) {
		for (var i = 0; i < positions.length; i++) {
    		if(field[positions[i][0]][positions[i][1]] === Tile.WALL)
				return true;
		}
		return false;
	};

	Battlefield.prototype.shootTank = function(t1, t2) {
		var tanksInRocketScope = this.tanksInRocketScope(t1);
		for (var i = 0; i < tanksInRocketScope.length; i++) {
			if(tanksInRocketScope[i] === t2)
				return true;
		};
		return false;
	};

	Battlefield.prototype.shootRadarBeam = function(tank, degree) {
		var rico = Math.tan(degree * (Math.PI/180));
		var b = tank.position[0] - rico*tank.position[1];
		var pos2 = [];
		if(degree >= 0 && degree < 90) {
			if(degree == 0) {
				pos2 = [this.configuration.height-1, tank.position[1]];
			} else if(degree == 45) {
				pos2 = [this.configuration.height-1, this.configuration.width-1];
			}

		} else if (degree >= 90 && degree < 180) {
			if(degree == 90) {
				pos2 = [tank.position[0], this.configuration.width+1];
			}

		} else if (degree >= 180 && degree < 270) {
			if(degree == 180) {
				pos2 = [0, tank.position[1]];
			}

		} else if (degree >= 270 && degree < 360) {
			if(degree == 270) {
				pos2 = [tank.position[0], 0];
			} else if (degree == 360) {
				pos2 = [this.configuration.height-1, tank.position[1]];
			}
		}

		var positions = getCellsInBetween(tank.position[1], tank.position[0], pos2[1], pos2[0], this.field)

		for (var i = 0; i < positions.length; i++) {
    		if(this.field[positions[i][0]][positions[i][1]] === Tile.WALL) {
				return Tile.WALL;
    		} else if(this.field[positions[i][0]][positions[i][1]] === Tile.TANK) {
    			return Tile.TANK;
    		}
		}
		return Tile.FREE
	};

	module.exports.Battlefield = Battlefield;
	module.exports.Tile = Tile;

}).call(this);