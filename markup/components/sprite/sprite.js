export default class Sprite extends PIXI.Sprite {
    constructor({
        texture,
        x = 0,
        y = 0,
        container,
        anchor = 0.5
    }) {
        super(PIXI.utils.TextureCache[texture]);
        this.x = x;
        this.y = y;
        this.anchor.x = anchor;
        this.anchor.y = anchor;
        container.addChild(this);
        this.handlers();
    }
    handlers() {}
    update() {}
    destroy() {
        this.parent.removeChild(this);
    }
}
