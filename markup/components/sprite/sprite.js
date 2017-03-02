export default class Sprite extends PIXI.Sprite {
    constructor({
        texture,
        container,
        x = 0,
        y = 0,
        anchor = 0.5
    }) {
        super(PIXI.utils.TextureCache[texture]);

        this.checkInputParams({ texture, container, x, y, anchor });

        this.x = x;
        this.y = y;
        this.anchor.x = anchor;
        this.anchor.y = anchor;

        if (container) {
            container.addChild(this);
        }
    }
    addHandlers() {}
    addLogic() {
        if (this.paused) return false;
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
    checkInputParams({ texture, container, x, y, anchor }) {
        if (typeof texture === 'undefined') {
            throw new Error('Parameter "texture" is required!');
        }
        if (typeof texture !== 'string') {
            throw new Error('Parameter "texture" must be a string key to your texture in TextureCache!');
        }
        if (typeof PIXI.utils.TextureCache[texture] === 'undefined') {
            throw new Error('We have no such texture in TextureCache!');
        }
        if (typeof container !== 'object' || typeof container.children !== 'object') {
            throw new Error('Parameter "container" must be an object with field "children"!');
        }
        if (typeof x !== 'number') {
            throw new Error('Parameter "x", "y", "anchor" must be a numbers!');
        }
        if (anchor < 0 || anchor > 1) {
            throw new Error('Parameter "anchor" must be a number in edges: 0 <= "anchor" <= 1!');
        }
    }
}
