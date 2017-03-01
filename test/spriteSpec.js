import * as PIXI from 'pixi.js';
import Game from '../markup/components/game/game';
import Sprite from '../markup/components/sprite/sprite';

describe('test Sprite class', () => {
    let game, sprite, param;

    before(() => {
        game = new Game(500, 500);

        let texture = new PIXI.RenderTexture.create(50, 60);
        PIXI.utils.TextureCache['test'] = texture;
    });

    describe('test with default params', () => {
        before(() => {
            sprite = new Sprite({
                texture: 'test',
                container: game.stage
            });

            param = sprite.getBounds();
        });

        it('sprite x', () => {
            expect(param.x).to.be.equal(-25);
        });

        it('sprite y', () => {
            expect(param.y).to.be.equal(-30);
        });

        it('sprite height', () => {
            expect(param.height).to.be.equal(60);
        });

        it('sprite width', () => {
            expect(param.width).to.be.equal(50);
        });

        it('sprite anchor x', () => {
            expect(sprite.anchor.x).to.be.equal(0.5);
        });

        it('sprite acnhor y', () => {
            expect(sprite.anchor.y).to.be.equal(0.5);
        });

        it('should be added to container', () => {
            expect(game.stage.children).to.not.be.empty;
        });

        it('should be destroyed', () => {
            sprite.destroy();
            expect(game.stage.children).to.be.empty;
        });

    });

    describe('test with custom params', () => {
        before(() => {
            sprite = new Sprite({
                texture: 'test',
                container: game.stage,
                x: 5,
                y: 7,
                anchor: 0
            });
            param = sprite.getBounds();
        });

        it('sprite x', () => {
            expect(param.x).to.be.equal(5);
        });

        it('sprite y', () => {
            expect(param.y).to.be.equal(7);
        });

        it('sprite height', () => {
            expect(param.height).to.be.equal(60);
        });

        it('sprite width', () => {
            expect(param.width).to.be.equal(50);
        });

        it('sprite anchor x', () => {
            expect(sprite.anchor.x).to.be.equal(0);
        });

        it('sprite acnhor y', () => {
            expect(sprite.anchor.y).to.be.equal(0);
        });

        it('should be added to container', () => {
            expect(game.stage.children).to.not.be.empty;
        });

        it('should be destroyed', () => {
            sprite.destroy();
            expect(game.stage.children).to.be.empty;
        });
    });

    describe('Sprite with wrong params', () => {

        function createWrongSprite(type) {
            switch (type) {
                case 1:
                    return new Sprite({});
                case 2:
                    return new Sprite({
                        texture: { name: 'someName' }
                    });
                case 3:
                    return new Sprite({
                        texture: 'blablabla',
                        container: game.stage
                    });
                case 4:
                    return new Sprite({
                        texture: 'test',
                        container: 'someContainer'
                    });
                case 5:
                    return new Sprite({
                        texture: 'test',
                        container: game.stage,
                        x: '0',
                        y: 5
                    });
                case 6:
                    return new Sprite({
                        texture: 'test',
                        container: game.stage,
                        x: 0,
                        y: 5,
                        anchor: 2
                    });
                default:
            }
        }

        it('should be exception when it has no texture', () => {
            try {
                createWrongSprite(1);
            } catch (error) {
                expect(error.message).to.be.equal('Parameter "texture" is required!');
            }
        });

        it('should be exception when texture param is not a string', () => {
            try {
                createWrongSprite(2);
            } catch (error) {
                expect(error.message).to.be.equal('Parameter "texture" must be a string key to your texture in TextureCache!');
            }
        });

        it('should be exception when we have no such texture in cache', () => {
            try {
                createWrongSprite(3);
            } catch (error) {
                expect(error.message).to.be.equal('We have no such texture in TextureCache!');
            }
        });

        it('should be exception when it has wrong container param', () => {
            try {
                createWrongSprite(4);
            } catch (error) {
                expect(error.message).to.be.equal('Parameter "container" must be an object with field "children"!');
            }
        });

        it('should be exception when it has wrong coords params', () => {
            try {
                createWrongSprite(5);
            } catch (error) {
                expect(error.message).to.be.equal('Parameter "x", "y", "anchor" must be a numbers!');
            }
        });

        it('should be exception when it has wrong anchor param', () => {
            try {
                createWrongSprite(6);
            } catch (error) {
                expect(error.message).to.be.equal('Parameter "anchor" must be a number in edges: 0 <= "anchor" <= 1!');
            }
        });

    });

    describe('Sprite methods', () => {

        before(() => {
            sprite = new Sprite({
                texture: 'test',
                container: game.stage,
                x: 5,
                y: 7,
                anchor: 0
            });
        });

        it('pause method', () => {
            sprite.pause();
            expect(sprite.paused).to.be.ok;
        });

        it('update method', () => {
            sprite.pause();
            expect(sprite.update()).to.be.equal(false);
            sprite.resume();
            expect(sprite.update()).to.be.an('undefined');
        });

        it('resume method', () => {
            sprite.resume();
            expect(sprite.paused).to.be.not.ok;
        });

    });

});
