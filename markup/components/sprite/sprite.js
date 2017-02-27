export default class Sprite extends PIXI.Sprite {
    constructor({
        texture,
        container,
        x = 0,
        y = 0,
        anchor = 0.5
    }) {
        super(PIXI.utils.TextureCache[texture]);

        this.x = x;
        this.y = y;
        this.anchor.x = anchor;
        this.anchor.y = anchor;

        if (!texture) {
            throw new Error('Texture parameter is undefined!');
        }
        if (container) {
            container.addChild(this);
        }

        this.handlers();
    }
    handlers() {}
    update() {
        if (this.paused) return;
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
    }
    destroy() {
        this.parent.removeChild(this);
    }
}
