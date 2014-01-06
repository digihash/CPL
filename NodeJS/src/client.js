(function() {
	var BrowserGUI, Canvas, ConsoleGUI, ImageStore, Tank;
	var socket;

	if(typeof window === 'undefined') {
		consoleIO = require("socket.io");
		socket = consoleIO.connect("127.0.0.1:8080");
	} else {
		socket = io.connect("127.0.0.1:8080");
	}



	ImageStore = (function() {
		function ImageStore() {}

		ImageStore.prototype.Tank = new Image();
		ImageStore.prototype.Tank.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAACeUlEQVRIS7VVPYuaQRDe1STi3ZkExA8IXpFCFI5IIHCRCFcIIWKCAQUlRdKYlGmCkJyYk4CFBAtLmxQpzquPBH+AbUAOS5vcLwj+AJnM7Lu7t755PzyIwrDr7sw8O/PMvMMBgF3jF0BdMnAy4sY57a3/BPAfJYC+SDjKDq2bOD9AxfvS8IY0vonrY7k3fZBjUzAG7wjMlKjU6BVtb7vYK5CgJwDnHFgX80jyDeUM5RzllyWRSAT9ixcrP3w8HisuIJVKueafF4tFYKea0H9eLwgk0CvSr/bH1gPsAOolvNfrvWOvUWksX00vd5MPePfGuH+P+7fWf9cIEGAiAFR63NYvqEMA9ihe4Nl3dwCK4OdGAATcYDAcDomLR8QHcvBRATpFYBH0EuXAJ//q1RnUO2Qwn89/SLJ3JfGiJ9aqKBwOr+ca28Q3TRSFBfDJrCa1X2sST4B974gQ4Kl0SsUSVOWr67dcLgNr25ycyAiO5OpWSc8sO6MnVKOJFO0MBgNgrzzS4QcggWOxGIHcNT4Xt1gulwMB4NQw1zwjAKyii9Fo9EdzMJvN7uTzeeh2u0Ki0Sg0Go2NpVAoQKlUEratVgvq9TpF8UDxwZLJpHZOSs1mE7LZLCQSCd+oqtUqZDKZNftarQYYwaUmWQGk02lot9saYJMoTIB4PC6ACIDSvVgs9imKbUXwG52HBABy8GQLHNzTHGyhii6RgwsEoOkXoj54LgkJUifL/S7Ng9VqRd+TeKfTgel0+pnuJpPJ136/T3p7y+UyVKlUlE1A9sGe9JHFVTSa6jraqxFIZw8dOpPOaYzRTDZt7bNY+/SbyeY4tOs63ZmPFfp/AVNzm39hMrAAAAAAAElFTkSuQmCC";
		ImageStore.prototype.Wall = new Image();
		ImageStore.prototype.Wall.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAB3RJTUUH1wMVAhsj6101zAAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAABmJLR0QA/wD/AP+gvaeTAAAB80lEQVR4nLVWvS9EQRBfm+ciCk5xoRUiEVFdJf4IdAoUCp2KP0EriutUOp2PgkJE5bO4KBQqlUqucBHN8bwz8Xs31uzbd/ueu8lkszszu7+ZuZl5p86Xxi92Nj1ZKbU+2ZPJXh9Xn6LqkQ+rFh3ubvvba5WLyC1Py5wA/hj5ATwxcgLMlceIvTCoKjyZ6i3TFbbvMvnXO0lcV8x8SBUFIpgBbDnHfroydbY8YdonXiHO9iMvrG3gt7WJXk9UZQAQ/RzfL88LiagrL4CUWjQhYSbiaA/QF77bJa+bXwKj8tiEjfTGVb/+/ZH+WtsA/k37qzOuaX5Q2QJjb/YH5OwjtKYKmzgowqC0YAXTHsfLxRGwqz/wFu+FiuwDxFErlHg16bl/tPRRIzmtppwljfuTqKUauNuzMxRXEaxpBQ9Pz17f3LKReJ0xAMNu2f79psjMElZzMLBEpIgGBueTWYycwPYLG6puGgzYJEZg2g+GbzgWogar6kExjiDTfM/x/egyub4HWf8vuez1y8MVZZlWbHh48f8llicehb2t1epveSWWWj0YQlFyu7j6xtZqFL76KXb7AiTF8FW1uqE3Cs0r6fmn61r0i7hDR3qRIqANrQAjS47J9kaQ5hcT3cGjnzpuF4BBYtvzIDCPHfgepNun57AD9A38b6ugtg+q/wAAAABJRU5ErkJggg==";

		return ImageStore;

	})();

	Canvas = (function() {
		function Canvas(element) {
			this.element = element;
			this.width = this.element.width;
			this.height = this.element.height;
			this.context = this.element.getContext("2d");
		}

		Canvas.prototype.setBackground = function(color) {
			this.backgroundColor = color;
			this.context.fillStyle = color;
			return this.context.fillRect(0, 0, this.width, this.height);
		};

		Canvas.prototype.transform = function(_arg) {
			var c, r;
			r = _arg[0], c = _arg[1];
			return [c, r];
		};

		Canvas.prototype.drawLine = function(r1, c1, r2, c2, color) {
			var x1, x2, y1, y2, _ref, _ref1;
			_ref = this.transform([r1, c1]), x1 = _ref[0], y1 = _ref[1];
			_ref1 = this.transform([r2, c2]), x2 = _ref1[0], y2 = _ref1[1];
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.strokeStyle = color;
			return this.context.stroke();
		};

		Canvas.prototype.drawPixel = function(r, c, w, h, color) {
			var x, y, _ref;
			if (color === null) {
				color = this.backgroundColor;
			}
			_ref = this.transform([r, c]), x = _ref[0], y = _ref[1];
			this.context.fillStyle = color;
			return this.context.fillRect(x, y, w, h);
		};

		Canvas.prototype.drawImage = function(img, r, c, w, h) {
			var x, y, _ref;
			if (w === null) {
				w = img.width;
			}
			if (h === null) {
				h = img.height;
			}
			_ref = this.transform([r, c]), x = _ref[0], y = _ref[1];
			return this.context.drawImage(img, x, y, w, h);
		};

		return Canvas;

	})();

}).call(this);
