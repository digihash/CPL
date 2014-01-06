(function() {
  var Battlefield, Configuration, Tank, Tile, assert, dummySocket, _ref;

  assert = require("assert");

  require("../src/lib");

  Configuration = require("../src/configuration").Configuration;

  Tank = require("../src/tank").Tank;

  _ref = require("../src/battlefield"), Battlefield = _ref.Battlefield, Tile = _ref.Tile;

  dummySocket = {
    on: function() {}
  };

  describe("Configuration", function() {
    it("should describe a minimal game setting", function() {
      var c;
      c = new Configuration();
      assert.notEqual(0, c.width);
      assert.notEqual(0, c.height);
      assert.notEqual(0, c.rocketRadius);
      return assert.notEqual(0, c.scope);
    });
    return it("should describe be configurable", function() {
      var c;
      c = new Configuration(20, 10);
      c.rocketRadius = 5;
      c.scope = 3;
      assert.equal(20, c.width);
      assert.equal(10, c.height);
      assert.equal(5, c.rocketRadius);
      return assert.equal(3, c.scope);
    });
  });

  describe("Battlefield", function() {
    it("should implement correct API", function() {
      var b, c;
      c = new Configuration(3, 3);
      b = new Battlefield(c);
      assert.equal(b.configuration, c);
      assert.equal(b.field.length, 3);
      assert.equal(b.field[0].length, 3);
      assert.equal(b.field[0][0], Tile.WALL);
      assert.equal(b.field[0][1], Tile.WALL);
      assert.equal(b.field[0][2], Tile.WALL);
      assert.equal(b.field[1][0], Tile.WALL);
      assert.equal(b.field[1][1], Tile.FREE);
      assert.equal(b.field[1][2], Tile.WALL);
      assert.equal(b.field[2][0], Tile.WALL);
      assert.equal(b.field[2][1], Tile.WALL);
      return assert.equal(b.field[2][2], Tile.WALL);
    });
    it("should allow field processors", function() {
      var b, c, p;
      p = function(config, field) {
        var i, j, _i, _ref1, _results;
        _results = [];
        for (i = _i = 0, _ref1 = config.width; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          _results.push((function() {
              var _j, _ref2, _results1;
              _results1 = [];
              for (j = _j = 0, _ref2 = config.height; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; j = 0 <= _ref2 ? ++_j : --_j) {
                _results1.push(field[i][j] = 1);
            }
          return _results1;
          })());
        }
        return _results;
      };
      c = new Configuration(2, 2);
      b = new Battlefield(c, [p]);
      return assert.deepEqual(b.field, [[1, 1], [1, 1]]);
    });
    it("should generate valid random tank positions", function() {
      var b, c, i, p1, p2, _i, _results;
      c = new Configuration(3, 4);
      b = new Battlefield(c);
      p1 = [0, 0];
      _results = [];
      for (i = _i = 0; _i <= 20; i = ++_i) {
        p2 = b.randomPosition();
        assert.notEqual(p1, p2);
        _results.push(assert.equal(b.field[p2[0]][p2[1]], Tile.FREE));
      }
      return _results;
    });
    it("should be able to create tank", function() {
      var t;
      t = new Tank(dummySocket, {});
      assert.notEqual(t, null);
      return assert.deepEqual(t.position, [0, 0]);
    });
    it("should allow new tanks", function() {
      var b, c, p, t;
      c = new Configuration(3, 4);
      b = new Battlefield(c);
      t = new Tank(dummySocket, b);
      p = t.position = [1, 1];
      b.addTank(t);
      return assert.equal(b.field[p[0]][p[1]], Tile.TANK);
    });
    it("should allow the removal of tanks", function() {
      var b, c, p, t;
      c = new Configuration(10, 10);
      b = new Battlefield(c);
      t = new Tank(dummySocket, b);
      p = t.position = [1, 1];
      b.addTank(t);
      b.removeTank(t);
      assert.equal(b.field[p[0]][p[1]], Tile.FREE);
      t = new Tank(dummySocket, b);
      p = t.position = [2, 2];
      assert.equal(b.field[p[0]][p[1]], Tile.FREE);
      b.removeTank(t);
      return assert.equal(b.field[p[0]][p[1]], Tile.FREE);
    });
    it("should move tanks south", function() {
      var b, c, col, origCol, origRow, row, t, _ref1, _ref2;
      c = new Configuration(3, 4);
      b = new Battlefield(c, []);
      t = new Tank(dummySocket, b);
      _ref1 = t.position, origRow = _ref1[0], origCol = _ref1[1];
      b.addTank(t);
      _ref2 = b.moveTank(t, "SOUTH"), row = _ref2[0], col = _ref2[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      return assert.equal(b.field[row][col], Tile.TANK);
    });
    it("should move tanks north", function() {
      var b, c, col, origCol, origRow, row, t, _ref1, _ref2;
      c = new Configuration(3, 4);
      b = new Battlefield(c, []);
      t = new Tank(dummySocket, b);
      _ref1 = t.position, origRow = _ref1[0], origCol = _ref1[1];
      b.addTank(t);
      _ref2 = b.moveTank(t, "NORTH"), row = _ref2[0], col = _ref2[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      return assert.equal(b.field[row][col], Tile.TANK);
    });
    it("should move tanks east", function() {
      var b, c, col, origCol, origRow, row, t, _ref1, _ref2;
      c = new Configuration(3, 4);
      b = new Battlefield(c, []);
      t = new Tank(dummySocket, b);
      _ref1 = t.position, origRow = _ref1[0], origCol = _ref1[1];
      b.addTank(t);
      _ref2 = b.moveTank(t, "EAST"), row = _ref2[0], col = _ref2[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      return assert.equal(b.field[row][col], Tile.TANK);
    });
    it("should move tanks west", function() {
      var b, c, col, origCol, origRow, row, t, _ref1, _ref2;
      c = new Configuration(3, 4);
      b = new Battlefield(c, []);
      t = new Tank(dummySocket, b);
      _ref1 = t.position, origRow = _ref1[0], origCol = _ref1[1];
      b.addTank(t);
      _ref2 = b.moveTank(t, "WEST"), row = _ref2[0], col = _ref2[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      return assert.equal(b.field[row][col], Tile.TANK);
    });
    it("should move tanks *-west", function() {
      var b, c, col, origCol, origRow, row, t, _ref1, _ref2, _ref3;
      c = new Configuration(10, 10);
      b = new Battlefield(c, []);
      t = new Tank(dummySocket, b);
      _ref1 = t.position, origRow = _ref1[0], origCol = _ref1[1];
      b.addTank(t);
      _ref2 = b.moveTank(t, "NORTH-WEST"), row = _ref2[0], col = _ref2[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      assert.equal(b.field[row][col], Tile.TANK);
      _ref3 = b.moveTank(t, "SOUTH-WEST"), row = _ref3[0], col = _ref3[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      return assert.equal(b.field[row][col], Tile.TANK);
    });
    it("should move tanks *-east", function() {
      var b, c, col, origCol, origRow, row, t, _ref1, _ref2, _ref3;
      c = new Configuration(10, 10);
      b = new Battlefield(c, []);
      t = new Tank(dummySocket, b);
      _ref1 = t.position, origRow = _ref1[0], origCol = _ref1[1];
      b.addTank(t);
      _ref2 = b.moveTank(t, "NORTH-EAST"), row = _ref2[0], col = _ref2[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      assert.equal(b.field[row][col], Tile.TANK);
      _ref3 = b.moveTank(t, "SOUTH-EAST"), row = _ref3[0], col = _ref3[1];
      assert.equal(t.position[0], row);
      assert.equal(t.position[1], col);
      if (row !== origRow || col !== origCol) {
        assert.equal(b.field[origRow][origCol], Tile.FREE);
      }
      return assert.equal(b.field[row][col], Tile.TANK);
    });
    it("shouldn't move tanks on top of each other", function() {
      var b, c, t1, t1pos, t2, t2pos;
      c = new Configuration(3, 4);
      b = new Battlefield(c, []);
      t1 = new Tank(dummySocket, b);
      t1pos = t1.position = [1, 1];
      b.addTank(t1);
      t2 = new Tank(dummySocket, b);
      t2pos = t2.position = [2, 1];
      b.addTank(t2);
      b.moveTank(t1, "SOUTH");
      assert.deepEqual(t1.position, t1pos);
      assert.deepEqual(t2.position, t2pos);
      assert.equal(b.field[t1pos[0]][t1pos[1]], Tile.TANK);
      return assert.equal(b.field[t2pos[0]][t2pos[1]], Tile.TANK);
    });
    it("should return failure for incorrect scope", function() {
      var b, c;
      c = new Configuration(1, 1);
      b = new Battlefield(c, []);
      return assert.throws(function() {
        return b.scope([5, 5]);
      });
    });
    it("should return 0 for scope of 1x1", function() {
      var b, c;
      c = new Configuration(1, 1);
      b = new Battlefield(c, []);
      return assert.deepEqual(b.scope([0, 0]), [[0]]);
    });
    it("should return the correct scope (1)", function() {
      var b, c;
      c = new Configuration(3, 3);
      c.scope = 1;
      b = new Battlefield(c, []);
      return assert.deepEqual(b.scope([1, 1]), [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    });
    it("should return the correct scope (2)", function() {
      var b, c;
      c = new Configuration(5, 5);
      b = new Battlefield(c);
      c.scope = 1;
      assert.deepEqual(b.scope([2, 2]), [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
      c.scope = 2;
      assert.deepEqual(b.scope([2, 2]), [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]);
      c.scope = 3;
      return assert.deepEqual(b.scope([2, 2]), [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]);
    });
    it("should return partial scope for sidewall positions", function() {
      var b, c;
      c = new Configuration(5, 5);
      b = new Battlefield(c);
      c.scope = 1;
      assert.deepEqual(b.scope([3, 4]), [[0, 1], [0, 1], [1, 1]]);
      c.scope = 2;
      assert.deepEqual(b.scope([3, 4]), [[0, 0, 1], [0, 0, 1], [0, 0, 1], [1, 1, 1]]);
      c.scope = 3;
      return assert.deepEqual(b.scope([3, 4]), [[1, 1, 1, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [1, 1, 1, 1]]);
    });
    it("should return the updated scope after moving", function() {
      var b, c, t1, t2, t3;
      c = new Configuration(9, 9);
      b = new Battlefield(c);
      c.scope = 1;
      t1 = new Tank(dummySocket, b);
      t1.position = [2, 2];
      b.addTank(t1);
      t2 = new Tank(dummySocket, b);
      t2.position = [2, 4];
      b.addTank(t2);
      t3 = new Tank(dummySocket, b);
      t3.position = [2, 6];
      b.addTank(t3);
      assert.deepEqual(b.scope(t1.position), [[0, 0, 0], [0, 2, 0], [0, 0, 0]]);
      assert.deepEqual(b.scope(t2.position), [[0, 0, 0], [0, 2, 0], [0, 0, 0]]);
      assert.deepEqual(b.scope(t3.position), [[0, 0, 0], [0, 2, 0], [0, 0, 0]]);
      assert.deepEqual(b.tanksInScope(t1), []);
      assert.deepEqual(b.tanksInScope(t2), []);
      assert.deepEqual(b.tanksInScope(t3), []);
      b.moveTank(t2, "EAST");
      assert.deepEqual(b.tanksInScope(t1), []);
      assert.deepEqual(b.tanksInScope(t2)[0].position, t3.position);
      return assert.deepEqual(b.tanksInScope(t3)[0].position, t2.position);
    });
    it("should return tanks within a certain scope", function() {
      var b, c, res, t1, t2, t3;
      c = new Configuration(6, 6);
      c.scope = 2;
      b = new Battlefield(c);
      t1 = new Tank(dummySocket, b);
      t1.position = [1, 1];
      b.addTank(t1);
      t2 = new Tank(dummySocket, b);
      t2.position = [3, 3];
      b.addTank(t2);
      t3 = new Tank(dummySocket, b);
      t3.position = [4, 4];
      b.addTank(t3);
      res = b.tanksInScope(t1);
      assert.equal(res.length, 1);
      assert.deepEqual(res[0].position, [3, 3]);
      res = b.tanksInScope(t2);
      assert.equal(res.length, 2);
      assert.deepEqual(res[0].position, [1, 1]);
      assert.deepEqual(res[1].position, [4, 4]);
      res = b.tanksInScope(t3);
      assert.equal(res.length, 1);
      assert.deepEqual(res[0].position, [3, 3]);
      c.scope = 6;
      res = b.tanksInScope(t1);
      assert.equal(res.length, 2);
      assert.deepEqual(res[0].position, [3, 3]);
      assert.deepEqual(res[1].position, [4, 4]);
      c.scope = 1;
      res = b.tanksInScope(t1);
      return assert.equal(res.length, 0);
    });
    it("should return tanks within the the rocket radius", function() {
      var b, c, res, t1, t2, t3;
      c = new Configuration(6, 6);
      c.scope = 3;
      c.rocketRadius = 3;
      b = new Battlefield(c);
      t1 = new Tank(dummySocket, b);
      t1.position = [1, 1];
      b.addTank(t1);
      t2 = new Tank(dummySocket, b);
      t2.position = [4, 1];
      b.addTank(t2);
      res = b.tanksInRocketScope(t1);
      assert.equal(res.length, 1);
      assert.deepEqual(res[0].position, t2.position);
      c.rocketRadius = 2;
      res = b.tanksInRocketScope(t1);
      assert.equal(res.length, 0);
      t3 = new Tank(dummySocket, b);
      t3.position = [4, 3];
      b.addTank(t3);
      res = b.tanksInRocketScope(t1);
      assert.equal(res.length, 0);
      res = b.tanksInRocketScope(t3);
      assert.equal(res.length, 1);
      return assert.deepEqual(res[0].position, t2.position);
    });
    it("should return tanks within a rocket's scope, taking walls into account", function() {
      var add_obstacle, b, c, res, t1, t2, t3;
      add_obstacle = function(config, field) {
        return field[2][2] = Tile.WALL;
      };
      c = new Configuration(6, 6);
      c.rocketRadius = 6;
      b = new Battlefield(c, [add_obstacle]);
      t1 = new Tank(dummySocket, b);
      t1.position = [1, 1];
      b.addTank(t1);
      t2 = new Tank(dummySocket, b);
      t2.position = [3, 3];
      b.addTank(t2);
      t3 = new Tank(dummySocket, b);
      t3.position = [2, 3];
      b.addTank(t3);
      res = b.tanksInRocketScope(t1);
      assert.equal(res.length, 0);
      res = b.tanksInRocketScope(t2);
      assert.equal(res.length, 1);
      assert.deepEqual(res[0].position, t3.position);
      res = b.tanksInRocketScope(t3);
      assert.equal(res.length, 1);
      return assert.deepEqual(res[0].position, t2.position);
    });
    it("shouldn't destroy tanks secured by walls", function() {
      var add_obstacle, b, c, res, t1, t2, t3;
      add_obstacle = function(config, field) {
        return field[2][2] = Tile.WALL;
      };
      c = new Configuration(6, 6);
      c.rocketRadius = 6;
      b = new Battlefield(c, [add_obstacle]);
      t1 = new Tank(dummySocket, b);
      t1.position = [1, 1];
      b.addTank(t1);
      t2 = new Tank(dummySocket, b);
      t2.position = [3, 3];
      b.addTank(t2);
      t3 = new Tank(dummySocket, b);
      t3.position = [2, 3];
      b.addTank(t3);
      res = b.shootTank(t1, t2);
      assert.equal(res, false);
      res = b.shootTank(t1, t3);
      assert.equal(res, false);
      res = b.shootTank(t2, t3);
      return assert.equal(res, true);
    });
    it("should return the type of tile for a radar beam", function() {
      var b, c, t1, t2;
      c = new Configuration(6, 6);
      b = new Battlefield(c);
      t1 = new Tank(dummySocket, b);
      t1.position = [2, 2];
      b.addTank(t1);
      t2 = new Tank(dummySocket, b);
      t2.position = [4, 2];
      b.addTank(t2);
      assert.equal(b.shootRadarBeam(t1, 0), Tile.TANK);
      assert.equal(b.shootRadarBeam(t1, 45), Tile.WALL);
      assert.equal(b.shootRadarBeam(t1, 90), Tile.WALL);
      assert.equal(b.shootRadarBeam(t2, 180), Tile.TANK);
      return assert.equal(b.shootRadarBeam(t2, 270), Tile.WALL);
    });
    return it("should return the free type for unbounded radar beams", function() {
      var b, c, t1;
      c = new Configuration(6, 6);
      b = new Battlefield(c, []);
      t1 = new Tank(dummySocket, b);
      t1.position = [2, 2];
      b.addTank(t1);
      assert.equal(b.shootRadarBeam(t1, 0), Tile.FREE);
      assert.equal(b.shootRadarBeam(t1, 22), Tile.FREE);
      assert.equal(b.shootRadarBeam(t1, 45), Tile.FREE);
      assert.equal(b.shootRadarBeam(t1, 90), Tile.FREE);
      assert.equal(b.shootRadarBeam(t1, 180), Tile.FREE);
      return assert.equal(b.shootRadarBeam(t1, 270), Tile.FREE);
    });
  });

  describe("Tank", function() {
    it("should have a socket", function() {
      var t;
      t = new Tank(dummySocket, {});
      assert.notEqual(t.socket, void 0);
      return assert.equal(typeof t.socket.on, "function");
    });
    return it("should respond to all possible network apis from client", function() {
      var apis, b, c, socket, t;
      apis = ["register", "move", "shoot", "beam", "disconnect"];
      socket = {
        on: function(t) {
          return apis.splice(apis.indexOf(t), 1);
        }
      };
      c = new Configuration(6, 6);
      b = new Battlefield(c);
      t = new Tank(socket, b);
      return assert.deepEqual(apis, [], "" + (apis.join(', ')) + " not implemented");
    });
  });

  describe("Student Remarks", function() {
    it("moveTank is called towards an illegal tile", function() {
      var b, c, nextPos, origPos, t;
      c = new Configuration(3, 3);
      b = new Battlefield(c);
      origPos = [1, 1];
      t = new Tank(dummySocket, b);
      t.position = origPos;
      b.addTank(t);
      nextPos = b.moveTank(t, "NORTH");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "WEST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "NORTH-WEST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "NORTH-EAST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "SOUTH");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "EAST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "SOUTH-WEST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "SOUTH-EAST");
      return assert.deepEqual(origPos, nextPos);
    });
    it("moveTank is called towards an illegal tile (2)", function() {
      var b, c, nextPos, origPos, t;
      c = new Configuration(1, 1);
      b = new Battlefield(c, []);
      origPos = [0, 0];
      t = new Tank(dummySocket, b);
      t.position = origPos;
      b.addTank(t);
      nextPos = b.moveTank(t, "NORTH");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "WEST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "NORTH-WEST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "NORTH-EAST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "SOUTH");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "EAST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "SOUTH-WEST");
      assert.deepEqual(origPos, nextPos);
      nextPos = b.moveTank(t, "SOUTH-EAST");
      return assert.deepEqual(origPos, nextPos);
    });
    return it("default mutator must add a wall around the battlefield", function() {
      var b, c;
      c = new Configuration(3, 3);
      b = new Battlefield(c);
      assert.equal(b.field[0][0], Tile.WALL);
      assert.equal(b.field[0][1], Tile.WALL);
      assert.equal(b.field[0][2], Tile.WALL);
      assert.equal(b.field[1][0], Tile.WALL);
      assert.equal(b.field[1][1], Tile.FREE);
      assert.equal(b.field[1][2], Tile.WALL);
      assert.equal(b.field[2][0], Tile.WALL);
      assert.equal(b.field[2][1], Tile.WALL);
      return assert.equal(b.field[2][2], Tile.WALL);
    });
  });

}).call(this);
