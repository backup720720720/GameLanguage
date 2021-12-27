const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const random_hex = () => Math.floor(Math.random() * 16777215).toString(16);

class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new V2(this.x, this.y);
    }
}

V2.UP = 0;
V2.DOWN = 1;
let id = 0;

class Particle extends V2 {
    constructor(x, y, canvas) {
        super(x, y);
        this.id = id++;
        this.canvas = canvas;
        this.size = random(2, 7);
        this.velocity = new V2(random(-50, 50) / 10, random(-50, 0) / 10);
        this.way = V2.UP;
        this.velocity_limit = random(2, 15);
        this.start = this.clone();
        this.alive = true;
        this.color = "#" + random_hex();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += this.way === V2.UP ? -0.01 : 0.02;
        if (this.start.y - this.y > this.velocity_limit && this.way === V2.UP) {
            this.way = V2.DOWN;
        }
        if (this.y > this.canvas.height) this.kill();
    }

    kill() {
        this.alive = false;
    }
}

const setup_canvas_particle = c => {
    /*** @type {Particle[]} */
    const particles = [];
    const canvas = document.getElementById(c);
    canvas._particle = true;
    let interval = setInterval(() => {
        const cnv = document.getElementById(c);
        if (!cnv) return clearInterval(interval);
        cnv.width = window.innerWidth * 58.7 / 100;
        cnv.height = window.innerHeight * 44 / 100;
        /*** @type {CanvasRenderingContext2D} */
        const ctx = cnv.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.filter(i => i.alive).forEach(particle => {
            particle.update();
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });
    });
    canvas.addEventListener("mousemove", ev => {
        if(!mouse_down) return;
        for(let i = 0; i < 3; i++) {
            const particle = new Particle(ev.offsetX, ev.offsetY, canvas);
            particles.push(particle);
        }
    });
}

let mouse_down = false;
addEventListener("mousedown", () => mouse_down = true);
addEventListener("mouseup", () => mouse_down = false);