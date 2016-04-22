var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y,
                   800, 629);
};

Background.prototype.update = function () {
};



function KyloRen(game, spritesheet1, spritesheet2) {
	//Animation(Sheet, frameW, frameH, sheetW, frameDur, frames, loop, scale)
	this.animation0 = new Animation(spritesheet1, 282, 196, 5, 0.65, 2, true, 1.2);
	this.animation1 = new Animation(spritesheet1, 282, 196, 5, 0.07, 17, false, 1.2);
	this.animation2 = new Animation(spritesheet2, 470, 232, 5, 0.07, 16, false, 1.2);
	this.animation3 = new Animation(spritesheet2, 470, 232, 5, 0.07, 18, false, 1.2);
	this.speed = 0;
	this.game = game;
	this.ctx = game.ctx;
	this.attack = false;
	Entity.call(this, game, -10, 420);
}

KyloRen.prototype = new Entity();
KyloRen.prototype.constructor = KyloRen;

KyloRen.prototype.update = function () {
	
//	if (this.animation1.currentFrame() > 16) {
//		this.y = 138;
//	}
		
	//this.x += this.game.clockTick * this.speed;
	//if (this.x > 800) this.x = -230;
	Entity.prototype.update.call(this);
}

KyloRen.prototype.draw = function () {
	//console.log(this.animation1.isDone());
	if (!this.attack) {
		this.animation0.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	} else {
		this.animation1.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

		if (this.animation1.currentFrame() > 16) {
			this.animation2.drawFrame(this.game.clockTick, this.ctx, this.x, this.y - 42);
		}
		if (this.animation2.currentFrame() > 16) {
			this.animation3.drawFrame(this.game.clockTick, this.ctx, this.x + 170, this.y - 42);
		}
		if (this.animation3.currentFrame() == 3) {
			if (this.game.particle.animation.isDone()) {
				this.game.particle.animation.elapsedTime = 0;
			}
			this.game.particle.hit = true;
		}
		if (this.animation3.currentFrame() == 7) {
			if (this.game.particle.animation.isDone()) {
				this.game.particle.animation.elapsedTime = 0;
			}
		}
		if (this.animation3.isDone()) {
			// reset animations, turn bb-8 on.
			this.game.particle.hit = false;
			this.game.kyloren.attack = false;
			this.animation0.elapsedTime = 0;
			this.animation1.elapsedTime = 0;
			this.animation2.elapsedTime = 0;
			this.animation3.elapsedTime = 0;
			this.x = -10;
			this.y = 420;
			this.game.rey.animation.elapsedTime = 0;
			this.game.rey.animation2.elapsedTime = 0;
			this.game.bb8.active = true;
		}
	}
	Entity.prototype.draw.call(this);
}



function Rey(game, spritesheet) {
	//Animation(Sheet, frameW, frameH, sheetW, frameDur, frames, loop, scale)
	this.animation = new Animation(spritesheet, 300, 300, 7, 0.07, 43, false, 1.2);
	this.animation2 = new Animation(spritesheet, 300, 300, 7, 0.07, 43, true, 1.2);
	this.speed = 0;
	this.game = game;
	this.ctx = game.ctx;
	Entity.call(this, game, 430, 330);
}

Rey.prototype = new Entity();
Rey.prototype.constructor = Rey;

Rey.prototype.update = function () {
	if (this.animation2.currentFrame() < 19
			|| this.animation2.currentFrame() > 41) {
		//console.log(this.animation2.currentFrame());
		this.animation2.elapsedTime = 36 * this.animation2.frameDuration;
	}
	if (this.animation.currentFrame() == 25) {
		this.game.kyloren.attack = true;
	}
	Entity.prototype.update.call(this);
}

Rey.prototype.draw = function () {
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	if (this.animation.currentFrame() > 42) {
		this.animation2.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	}
	Entity.prototype.draw.call(this);
}



function Snow(game, image, speedx, speedy) {
	this.image = image
	this.game = game;
	this.speedx = speedx;
	this.speedy = speedy;
	Entity.call(this, game, 100, 100);
}

Snow.prototype = new Entity();
Snow.prototype.constructor = Snow;

Snow.prototype.update = function () {
	this.x -= this.speedx;
	this.y += this.speedy;
	if (this.x < 0) {
		this.x = 800;
	} else if (this.x > 800) {
		this.x = 0;
	}
	if (this.y > 629) {
		this.y = 0;
	}
	Entity.prototype.update.call(this);
}

Snow.prototype.draw = function () {
	// south east
	this.game.ctx.drawImage(this.image, this.x, this.y);
	// south west
	this.game.ctx.drawImage(this.image, this.x - 800, this.y);
	// north east
	this.game.ctx.drawImage(this.image, this.x, this.y - 629);
	// north west
	this.game.ctx.drawImage(this.image, this.x - 800, this.y - 629);

}


function Particle(game, spritesheet) {
	this.animation = new Animation(spritesheet, 96, 96, 5, 0.02, 15, false, 2.2);
	this.speed = 0;
	this.game = game;
	this.ctx = game.ctx;
	this.hit = false;
	Entity.call(this, game, 514, 385);
}

Particle.prototype = new Entity();
Particle.prototype.constructor = Particle;

Particle.prototype.update = function () {
	Entity.prototype.update.call(this);
}

Particle.prototype.draw = function () {
	if (this.hit) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

	}
}


function BB8(game, spritesheet) {
	this.animation = new Animation(spritesheet, 150, 150, 4, 0.08, 16, true, 1.3);
	this.speed = 2.3;
	this.game = game;
	this.ctx = game.ctx;
	this.active = false;
	Entity.call(this, game, 850, 428);
}

BB8.prototype = new Entity();
BB8.prototype.constructor = BB8;

BB8.prototype.update = function () {
	if (this.active) {
		this.x -= this.speed;
	}
	if (this.x < -300) {
		this.x = 850;
	}
	Entity.prototype.update.call(this);
}

BB8.prototype.draw = function () {
	if (this.active) {
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

	}
}


AM.queueDownload("./img/particle.png");
AM.queueDownload("./img/starwarsforest.jpg");
AM.queueDownload("./img/treeforeground.png");
AM.queueDownload("./img/snow.png");

AM.queueDownload("./img/kylorendraw.png");
AM.queueDownload("./img/kylorenattack.png");
AM.queueDownload("./img/rey_left.png");
AM.queueDownload("./img/bb8.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    
    gameEngine.kyloren = new KyloRen(gameEngine, AM.getAsset("./img/kylorendraw.png"), AM.getAsset("./img/kylorenattack.png"));
    gameEngine.rey = new Rey(gameEngine, AM.getAsset("./img/rey_left.png"));
    gameEngine.particle = new Particle(gameEngine, AM.getAsset("./img/particle.png"));
    gameEngine.bb8 = new BB8(gameEngine, AM.getAsset("./img/bb8.png"));
    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/starwarsforest.jpg")));
    gameEngine.addEntity(new Snow(gameEngine, AM.getAsset("./img/snow.png"), .2, .6));
    
    gameEngine.addEntity(gameEngine.bb8);
    gameEngine.addEntity(gameEngine.rey);
    gameEngine.addEntity(gameEngine.kyloren);
    gameEngine.addEntity(gameEngine.particle);
    
    gameEngine.addEntity(new Snow(gameEngine, AM.getAsset("./img/snow.png"), .7, 1.2));
    
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/treeforeground.png")));

    
    console.log("All Done!");
});