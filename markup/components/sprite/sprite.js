export default class Sprite extends PIXI.Sprite {
    constructor({
        texture,
        x = 0,
        y = 0,
        container = game.stage,
        anchor = 0.5
    }) {
        super(texture);
        this.x = x;
        this.y = y;
        this.anchor.x = anchor;
        this.anchor.y = anchor;
        container.addChild(this);
    }
    handlers() {
        this.interactive = true;
    }
    update() {

    }
    destroy() {
        this.parent.removeChild(this);
    }
}
