var Player = function(options) {
	this.context = options.context;
	this.spriteSheetWidth = options.spriteSheetWidth;
	this.spriteSheetHeight = options.spriteSheetHeight;
	this.spriteSheet = options.spriteSheet;
	this.direction = 0; //0: Ground, 1: Left, 2: Right, 3. Jumping up, 4: Fall
	var numberOfFrames = options.numberOfFrames || 1;
	var ticksPerFrame = options.ticksPerFrame || 0;
	var frameIndex = 0;
	var tickCount = 0;
	var onGround = true;
	this.x = options.x || 10;
	this.y = options.y || window.innerHeight - this.spriteSheetHeight;
	var velocityY = 0;
	var gravity = 1;
	this.jump = function() {
		if(onGround) {
			velocityY = -12;
			onGround = false;
			frameIndex = 5;
		}
	}
	this.update = function() {
		velocityY += gravity;
		if(!onGround) {
			if(this.y > window.innerHeight - this.spriteSheetHeight) {
				this.y = window.innerHeight - this.spriteSheetHeight;
				velocityY = 0;				
				onGround = true;
				frameIndex = 0;
			} else {
				this.y += velocityY;
			}
		} else {
			tickCount += 1;
			if(tickCount > ticksPerFrame) {
				tickCount = 0;
				if(frameIndex < numberOfFrames - 3) {
					frameIndex += 1;
				} else {
					frameIndex = 0;
				}
			}
		}
	}
	this.render = function() {
		//this.context.fillRect(10, frameIndex * window.innerHeight - this.spriteSheetHeight, 40, 40);
		this.context.clearRect(this.x,
							this.y, 
							this.spriteSheetWidth / numberOfFrames,
							this.spriteSheetHeight + 10);
		this.context.drawImage(this.spriteSheet, 
							frameIndex * this.spriteSheetWidth / numberOfFrames,
							0,
							this.spriteSheetWidth / numberOfFrames,
							this.spriteSheetHeight,
							this.x,
							this.y,
							this.spriteSheetWidth / numberOfFrames,
							this.spriteSheetHeight);
	}
	return this;
};