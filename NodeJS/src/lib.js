(function() {
  /*
   * Return a random integer value between lower and upper
   */
  Math.randomInt = function(lower, upper) {
    var start;
    start = Math.random();
    return Math.floor(start * (upper - lower + 1) + lower);
  };

  /*
   * Create a new matrix where each cell has `dv` as a value
   */
  Math.matrix = function(rows, cols, dv) {
    var arr, i, j, _i, _j;
    arr = [];
    for (i = _i = 0; 0 <= rows ? _i < rows : _i > rows; i = 0 <= rows ? ++_i : --_i) {
      arr.push([]);
      arr[i].push(new Array(cols));
      for (j = _j = 0; 0 <= cols ? _j < cols : _j > cols; j = 0 <= cols ? ++_j : --_j) {
        arr[i][j] = dv;
      }
    }
    return arr;
  };

  /*
   * Add an accessor property to an object
   *
   * User.property("name", {
   *  get: function() {
   *     return this.name;
   *   },
   *   set: function(n) {
   *     this.name = n;
   *   }
   * });
   * var user = new User();
   * user.name = "beh"
   * 
   */
  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

}).call(this);
