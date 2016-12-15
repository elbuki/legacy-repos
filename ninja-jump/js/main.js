var GAME = GAME || (function() {
	document.title = 'Ninja jump';
	var FPS = 30;
	var pageStyle = document.querySelectorAll('*');
	var htmlBodyStyle = document.querySelectorAll('html, body');
	var canvas = document.createElement('canvas');
	var spriteSheet = document.createElement('img');
	var ctx = canvas.getContext('2d');
	var player;
	var platforms = [];
	var keys = [];

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	spriteSheet.src = 'res/sprite.png';
	htmlBodyStyle[0].style.width = '100%';
	htmlBodyStyle[0].style.height = '100%';
	htmlBodyStyle[1].style.width = '100%';
	htmlBodyStyle[1].style.height = '100%';
	htmlBodyStyle[1].style.margin = 0;
	canvas.style.display = 'block';
	player = new Player({
		context: ctx,
		spriteSheetWidth: 280,
		spriteSheetHeight: 40,
		spriteSheet: spriteSheet,
		numberOfFrames: 7,
		ticksPerFrame: 20
	});
	
	window.addEventListener("keydown", function(e) {
		keys[e.keyCode] = true;
	});
	window.addEventListener("keyup", function(e) {
		keys[e.keyCode] = false;
	});

	document.body.appendChild(canvas);

	setInterval(function() {
		update();
		render();
	}, 1000 / FPS);

	function update() {
		if(keys[65]) {
			player.x -= 5;
			player.direction = 1;			
		}
		if(keys[68]) {
			player.x += 5;
			player.direction = 0;
		} 
		if(keys[87]) {
			player.jump();
		}
		player.update();
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		player.render();
	}
})();