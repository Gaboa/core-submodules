import * as PIXI from 'pixi.js';
import Game from '../markup/components/game/game';
import Sprite from '../markup/components/sprite/sprite';

describe('test Sprite class', () => {
    let game, sprite, param;

    before(() => {
        game = new Game(500, 500);

        let texture = new PIXI.RenderTexture.create(50, 60);
        PIXI.utils.TextureCache['test'] = texture;
    })

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
        })
        it('sprite height', () => {
            expect(param.height).to.be.equal(60);
        })
        it('sprite width', () => {
            expect(param.width).to.be.equal(50);
        })
        it('sprite anchor x', () => {
            expect(sprite.anchor.x).to.be.equal(0.5);
        })
        it('sprite acnhor y', () => {
            expect(sprite.anchor.y).to.be.equal(0.5);
        })

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
        })
        it('sprite height', () => {
            expect(param.height).to.be.equal(60);
        })
        it('sprite width', () => {
            expect(param.width).to.be.equal(50);
        })
        it('sprite anchor x', () => {
            expect(sprite.anchor.x).to.be.equal(0);
        })
        it('sprite acnhor y', () => {
            expect(sprite.anchor.y).to.be.equal(0);
        })

        it('should be added to container', () => {
            expect(game.stage.children[0]).to.be.an('object');
        });

        it('should be destroyed', () => {
            sprite.destroy();
            expect(game.stage.children[0]).not.to.be.an('object');
        });
    });

});
