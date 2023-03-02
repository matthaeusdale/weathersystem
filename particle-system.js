// Create canvas context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

class ParticleSystem {
	constructor(context) {
		this.context = context;
		this.mode = 'snow';
		this.particles = [];
		this.running = false;
	}

	play() {
		if (!this.running) {
			this.running = true;
			requestAnimationFrame(this.loop.bind(this));
		}
	}

	pause() {
		this.running = false;
	}

	switchMode(mode) {
		this.mode = mode;
		this.particles = [];
	}

	loop() {
		// Clear canvas
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

		// Add particles
		if (this.mode === 'snow') {
			this.particles.push(new Snowflake());
		} else if (this.mode === 'rain') {
			this.particles.push(new Raindrop());
            this.particles.push(new Raindrop());
            this.particles.push(new Raindrop());
		}

		// Update particles
		for (let i = 0; i < this.particles.length; i++) {
			const particle = this.particles[i];
			particle.update();

			// Remove particles that are off-screen
			if (particle.y > this.context.canvas.height) {
                if (particle instanceof Raindrop){
                    this.particles.push(new Splash(particle.x));
                    this.particles.push(new Splash(particle.x));
                    this.particles.push(new Splash(particle.x));
                }
				this.particles.splice(i, 1);
				i--;
			}
		}
        console.log(this.particles.length);

		if (this.running) {
			requestAnimationFrame(this.loop.bind(this));
		}
	}
}

class Snowflake {
	constructor() {
		this.x = Math.random() * (context.canvas.width + 100) - 50;
		this.y = -10;
		this.speed = Math.random() * 1 + 1;
		this.radius = Math.random() * 2 + 1;
        this.offset = Math.random() * 100
	}

	update() {
		this.y += this.speed;
		this.x += Math.sin(((this.y/5) + this.offset) / 20) * this.radius ;

		this.draw();
	}

	draw() {
		const context = canvas.getContext('2d');
		context.fillStyle = 'white';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.fill();
	}
}

class Raindrop {
	constructor() {
		this.x = Math.random() * context.canvas.width;
		this.y = -10;
		this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 7 + (this.radius * 7);
	}

	update() {
		this.y += this.speed;

		this.draw();
	}

	draw() {
		const context = canvas.getContext('2d');
		context.fillStyle = 'blue';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.fill();
	}
}

class Splash {
	constructor(x) {
		this.x = x
        this.xspeed = Math.random() * 10 - 5;
		this.y = context.canvas.height;
		this.radius = Math.random() * 2 + .5;
        this.yspeed = - (Math.random() * 5 + (this.radius * 5));
        this.yaccel = 1;
	}

	update() {
		this.y += this.yspeed;
        this.yspeed += this.yaccel;
        this.x += this.xspeed;
		this.draw();
	}

	draw() {
		const context = canvas.getContext('2d');
		context.fillStyle = 'blue';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.fill();
	}
}


// Set up particle system
const particleSystem = new ParticleSystem(context);

// Set up buttons
const playButton = document.getElementById('play');
playButton.addEventListener('click', () => {
	particleSystem.play();
});

const pauseButton = document.getElementById('pause');
pauseButton.addEventListener('click', () => {
	particleSystem.pause();
});

const snowButton = document.getElementById('snow');
snowButton.addEventListener('click', () => {
	particleSystem.switchMode('snow');
});

const rainButton = document.getElementById('rain');
rainButton.addEventListener('click', () => {
	particleSystem.switchMode('rain');
});

// Start simulation
particleSystem.play();
