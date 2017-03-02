export default class Animation extends PIXI.Container {
    constructor(config, speed) {
        super();
        this.animations = [];
        config.forEach((animationConfig) => {
            let animationObj = {};
            animationObj.name = animationConfig.name;
            animationObj.animation = new PIXI.extras.AnimatedSprite(
                Animation.createArrayOfTextures(
                    animationConfig.name,
                    animationConfig.length,
                    animationConfig.prefix
                )
            );
            animationObj.animation.animationSpeed = speed;
            animationObj.animation.visible = false;

            this.animations.push(animationObj);
            this.addChild(animationObj.animation);
        });
        this.currentAnimation = this.animations[0].name;
        this.play(this.currentAnimation);
    }
    addHandlers() {}
    addLogic() {}
    play(name) {
        this.animations.forEach((animationObj) => {
            if (animationObj.name !== name) {
                if (animationObj.animation.visible || animationObj.animation.playing) {
                    animationObj.animation.visible = false;
                    animationObj.animation.stop();
                }
            } else {
                animationObj.animation.visible = true;
                animationObj.animation.play();
                this.currentAnimation = animationObj.name;
            }
        });
    }
    static createArrayOfTextures(name, length, prefix = '') {
        let result = [];
        for (let i = 1; i <= length; i++) {
            result.push(PIXI.utils.TextureCache[`${name}_${prefix}${i}.png`]);
        }
        return result;
    }
}

/* Example

let anim = new Animation([
    { name: 'po1', length: 6 },
    { name: 'po2', length: 6 },
    { name: 'po3', length: 6 },
    { name: 'po4', length: 6 },
    { name: 'po5', length: 6 },
    { name: 'po6', length: 3 }
], 0.1);

anim.play('po3');

*/
