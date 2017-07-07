import Sprite from '../sprite/sprite';
import Rx from 'rxjs';

export default class Button extends Sprite {
    constructor({
        container,
        texture,
        x,
        y,
        anchor,
        isHover = true
    }) {
        super({ texture, x, y, container, anchor });

        this.textureName     = texture.split('.')[0];
        this.normalTexture   = PIXI.utils.TextureCache[texture];
        this.hoverTexture    = PIXI.utils.TextureCache[`${this.textureName}_hover.png`];
        this.tapTexture      = PIXI.utils.TextureCache[`${this.textureName}_tap.png`];
        this.disabledTexture = PIXI.utils.TextureCache[`${this.textureName}_disabled.png`]
                            || PIXI.utils.TextureCache[`${this.textureName}_off.png`];

        this.enabled = true;
        this.isHover = isHover;

        this.addStreams();
    }

    addStreams() {
        this.interactive = true;
        this.buttonMode = true;

        this.over$  = Rx.Observable.fromEvent(this, 'pointerover');
        this.out$   = Rx.Observable.fromEvent(this, 'pointerout');
        this.click$ = Rx.Observable.fromEvent(this, 'pointerdown');
        this.up$    = Rx.Observable.fromEvent(this, 'pointerup');

        if (this.isHover) {
            this.over$
                .filter(event => this.enabled)
                .subscribe(next => this.hover());
            this.out$
                .filter(event => this.enabled)
                .subscribe(next => this.normal());
        }

        this.click$ = this.click$
            .filter(event => this.enabled);
        this.click$
            .subscribe(next => this.tap(1));

        this.up$ = this.up$
            .filter(event => this.enabled);
        this.up$
            .subscribe(next => this.hover());
    }

    normal() {
        this.texture = this.normalTexture;
    }

    hover() {
        if (this.hoverTexture) {
            this.texture = this.hoverTexture;
        }
    }

    tap(number) {
        game.audio.playEffect('click_1');
        if (this.tapTexture) {
            this.texture = this.tapTexture;
        }
    }

    disable() {
        this.enabled = false;
        this.tween = TweenMax.to(this, 0.3, { alpha: 0.4 });
    }

    enable() {
        this.enabled = true;
        this.tween = TweenMax.to(this, 0.3, { alpha: 1 });
    }
}
