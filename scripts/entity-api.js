// noinspection JSUnusedGlobalSymbols

let __uuid = 0;

const _rotate = (angle, x, y, width, height) => {
    ctx.translate((x + (width / 2)), (y + (height / 2)));
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-(x + (width / 2)), -(y + (height / 2)));
};

Object.prototype.cloneObject = function () {
    const model = new this["constructor"](0, 0);
    const {...obj} = this;
    Array.from(Object.entries(obj)).forEach(i => model[i[0]] = i[1]);
    return model;
}

function __loadImage(url, width, height) {
    let image = new Image(width, height);
    const promise = new Promise((res) => image.onload = () => res(image));
    image.src = url;
    return promise;
}

/*** @type {Object<number, Model>} */
const _models = {};

class Model {
    /**
     * @param {string} name
     * @param {Entity} entity
     */
    constructor(name, entity) {
        this.entity = entity;
        this.pixels = [];
        this.uuid = __uuid++;
        entity.setModel(name, this);
        _models[this.uuid] = this;
    }

    check_pixels() {
    }

    render() {
        this.check_pixels();
    }
}

class ImageModel extends Model {
    constructor(name, entity) {
        super(name, entity);
        this.image = null;
    }

    setImage(urlOrImage) {
        if (urlOrImage instanceof Image) {
            this.image = urlOrImage;
            if (this.entity.isAlive()) this.render();
            return;
        }
        __loadImage(urlOrImage, this.entity.width, this.entity.height).then(r => this.setImage(r));
    }

    check_pixels() {
        if (!this.last_check || (this.last_check[0] === this.entity.width && this.last_check[1] === this.entity.height)) return;
        if (!this.image || this.last_image === this.image) return;
        this.last_check = [this.entity.width, this.entity.height];
        this.last_image = this.image;
        const c = document.createElement("canvas");
        c.width = this.entity.width;
        c.height = this.entity.height;
        const ct = c.getContext("2d");
        ct.drawImage(this.image, canvas.width, canvas.height);
        this.pixels = Array.from(ct.getImageData(0, 0, canvas.width, canvas.height).data).map(i => i === 0 ? 0 : 1);
        document.remove(c);
    }

    render() {
        if (this.image) ctx.drawImage(this.image, this.entity.x, this.entity.y, this.entity.width, this.entity.height);
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(x, y) {
        if (x instanceof Vector2) return this.add(x.x, x.y);
        this.x += x;
        this.y += y;
    }

    subtract(x, y) {
        if (x instanceof Vector2) return this.subtract(x.x, x.y);
        this.x -= x;
        this.y -= y;
    }

    multiply(x, y) {
        if (x instanceof Vector2) return this.multiply(x.x, x.y);
        this.x *= x;
        this.y *= y;
    }

    divide(x, y) {
        if (x instanceof Vector2) return this.divide(x.x, x.y);
        this.x /= x;
        this.y /= y;
    }

    distance(vector2) {
        return Math.sqrt(Math.pow(vector2.x - this.x, 2) + Math.pow(vector2.y - this.y, 2));
    }

    equals(vector2) {
        return vector2.x === this.x && vector2.y === this.y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}

class VisionVector2 extends Vector2 {
    constructor(x, y, angle) {
        super(x, y);
        this.angle = angle;
    }

    turn_to(vector2) {
        this.angle = Math.atan2(vector2.y - this.y, vector2.x - this.x) / Math.PI * 180;
        if (this.angle < 0) this.angle += 360.0;
    }

    direction_to(vector2) {
        let angle = Math.atan2(vector2.y - this.y, vector2.x - this.x) / Math.PI * 180;
        if (angle < 0) angle += 360.0;
        return angle;
    }

    direction() {
        return new Vector2(-Math.sin(this.angle * Math.PI / 180) - (Math.PI / 2), -Math.cos(this.angle * Math.PI / 180) - (Math.PI / 2));
    }
}

class Entity extends VisionVector2 {
    constructor(x, y, angle = 0, width = 10, height = 10) {
        super(x, y, angle);
        this.models = {};
        this.model_index = null;
        this.width = width;
        this.height = height;
        this.priority = 9;
        this.alive = true;
        this.uuid = __uuid++;
        entities.push(this);
    }

    isAlive() {
        return this.alive && entities.some(i => i === this);
    }

    update() {
        if (this.getSelectedModel()) this.getSelectedModel().render();
    }

    getSelectedModel() {
        if (!this.model_index && Object.keys(this.models).length > 0) this.model_index = Object.keys(this.models)[0];
        return this.models[this.model_index];
    }

    setModel(name, model) {
        this.models[name] = model;
    }

    selectModel(name) {
        this.model_index = name;
    }

    kill() {
        this.alive = false;
    }
}