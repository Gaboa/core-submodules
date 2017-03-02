export default class Container extends PIXI.Container {
    constructor(parent) {
        super();
        if (parent) {
            parent.addChild(this);
        }
    }
    addHandlers() {
        this.children.forEach((child) => child.addHandlers());
    }
    addLogic() {
        this.children.forEach((child) => child.addLogic());
    }
    pause() {
        this.children.forEach((child) => child.pause());
    }
    resume() {
        this.children.forEach((child) => child.resume());
    }
    destroy() {
        this.removeChildren();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}
