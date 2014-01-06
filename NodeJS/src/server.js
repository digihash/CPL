(function() {
  var Battlefield, Configuration, Tank, app, battlefield, client_js_handler, configuration, fs, generate_handler, handlers, http, io, socket;

  fs = require("fs");

  http = require("http");

  socket = require("socket.io");

  require("./lib");

  Configuration = require("./configuration").Configuration;

  Battlefield = require("./battlefield").Battlefield;

  Tank = require("./tank").Tank;

  handlers = [
    {
      name: "/",
      handler: function(req, res) {
        return fs.readFile("client.html", function(err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200);
          return res.end(data);
        });
      }
    }, {
      name: "/client.js",
      handler: function(req, res) {
        return fs.readFile("client.js", function(err, data) {
          if (err) {
            throw err;
          }
          res.setHeader("Content-Type", "application/javascript");
          res.writeHead(200);
          return res.end(data);
        });
      }
    }, {
      name: "/lib.js",
      handler: function(req, res) {
        return fs.readFile("lib.js", function(err, data) {
          if (err) {
            throw err;
          }
          res.setHeader("Content-Type", "application/javascript");
          res.writeHead(200);
          return res.end(data);
        });
      }
    }
  ];

  client_js_handler = function(req, res) {
    return fs.readFile("client.js", function(err, data) {
      if (err) {
        throw err;
      }
      res.writeHead(200);
      return res.end(data);
    });
  };

  generate_handler = function(handlers) {
    return function(req, res) {
      var entry;
      entry = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          entry = handlers[_i];
          if (entry.name === req.url) {
            _results.push(entry);
          }
        }
        return _results;
      })())[0];
      if (entry) {
        return entry.handler(req, res);
      } else {
        res.writeHead(404);
        return res.end("file not found");
      }
    };
  };

  app = http.createServer(generate_handler(handlers));

  io = socket.listen(app, {
    log: false
  });

  console.log("[+] Creating a new default configuration");

  configuration = new Configuration();

  console.log("[+] Initializing a new battlefield");

  battlefield = new Battlefield(configuration);

  console.log("[+] Waiting for new players/tanks");

  io.sockets.on("connection", function(socket) {
    return new Tank(socket, battlefield);
  });


  console.log("[+] Listening on http://localhost:" + configuration.port);

  app.listen(configuration.port);

}).call(this);
