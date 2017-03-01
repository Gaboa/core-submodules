import Sprite from '../sprite/sprite';

export default class Button extends Sprite {
    constructor({
        texture,
        x,
        y,
        container,
        anchor,
        onClick
    }) {
        super({ texture, x, y, container, anchor });

        this.textureName = texture.split('.')[0];
        this.normalTexture = PIXI.utils.TextureCache[texture];
        this.hoverTexture = PIXI.utils.TextureCache[`${this.textureName}_hover`];
        this.onClick = onClick;

        this.isPressed = false;
        this.isOver = false;

        this.addHandlers();
    }
    addHandlers() {
        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerover', () => {
            this.isOver = true;
        });
        this.on('pointerout', () => {
            this.isOver = false;
        });
        this.on('pointerup', () => {
            this.isPressed = true;
        });
    }
    addLogic() {
        if (this.isOver) {
            if (this.texture !== this.hoverTexture) {
                this.texture = this.hoverTexture;
            }
        } else {
            if (this.texture !== this.normalTexture) {
                this.texture = this.normalTexture;
            }
        }
        if (this.isPressed) {
            if (typeof this.onClick === 'function') {
                this.onClick();
            }
            this.isPressed = false;
        }
    }
}
