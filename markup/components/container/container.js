export default class Container extends PIXI.Container {
    constructor(parent) {
        super();
        if (parent) {
            parent.addChild(this);
        }
    }
    addHandlers() {
        this.children.forEach((child) => child.addHandlers && child.addHandlers());
    }
    addLogic() {
        this.children.forEach((child) => child.addLogic && child.addLogic());
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
