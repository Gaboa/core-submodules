import * as PIXI from 'pixi.js';
import Animation from '../markup/components/animation/animation';

describe('Animation class', () => {
    let animation;

    function prepareTextureForAnimation(name) {
        PIXI.utils.TextureCache[`${name}.png`] = {};
        PIXI.utils.TextureCache[`${name}.png`].textures = [];
        PIXI.utils.TextureCache[`${name}.png`].textures[0] = {};
        PIXI.utils.TextureCache[`${name}.png`].textures[0].texture = new PIXI.RenderTexture.create(50, 60);
    }

    before(() => {
        prepareTextureForAnimation('test_1');
        prepareTextureForAnimation('test_2');
        prepareTextureForAnimation('next_1');
        prepareTextureForAnimation('next_2');

        animation = new Animation([
            { name: 'test', length: 2 },
            { name: 'next', length: 2 }
        ], 0.2);
    });

    it('should have two animations', () => {
        expect(animation.animations).to.have.lengthOf(2);
    });

    it('should play first animations', () => {
        expect(animation.currentAnimation).to.be.equal('test');
        expect(animation.animations[0].animation.playing).to.be.ok;
        expect(animation.animations[0].animation.visible).to.be.ok;
        expect(animation.animations[1].animation.visible).to.be.not.ok;
    });

    it('should play another animation', () => {
        animation.play('next');
        expect(animation.currentAnimation).to.be.equal('next');
        expect(animation.animations[1].animation.playing).to.be.ok;
        expect(animation.animations[1].animation.visible).to.be.ok;
        expect(animation.animations[0].animation.visible).to.be.not.ok;
    });

});
