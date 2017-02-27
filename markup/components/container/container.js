export default class Container extends PIXI.Container {
    constructor(parent) {
        super();
        if (parent) {
            parent.addChild(this);
        }
        this.handlers();
    }
    handlers() {}
    update() {
        this.children.forEach((child) => child.update());
    }
    pause() {
        this.children.forEach((child) => child.pause());
    }
    resume() {
        this.children.forEach((child) => child.resume());
    }
    destroy() {
        this.removeChildren();
        this.parent.removeChild(this);
    }
}
