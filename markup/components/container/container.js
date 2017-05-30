export default class Container extends PIXI.Container {
    constructor(parent) {
        super();
        if (parent) {
            parent.addChild(this);
        }
    }
    addListeners() {
        this.children.forEach((child) => child.addListeners && child.addListeners());
    }
    updateView() {
        this.children.forEach((child) => child.updateView && child.updateView());
    }
    pause() {
        this.children.forEach((child) => child.pause && child.pause());
    }
    resume() {
        this.children.forEach((child) => child.resume && child.resume());
    }
    destroy() {
        this.removeChildren();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}
