import * as PIXI from 'pixi.js';
import Game from '../markup/components/game/game';
import Button from '../markup/components/button/button';

describe('Button class spec', () => {

    let game, button;

    before(() => {
        game = new Game(500, 500);

        let texture = new PIXI.RenderTexture.create(20, 30);
        let hoverTexture = new PIXI.RenderTexture.create(50, 50);
        PIXI.utils.TextureCache['test'] = texture;
        PIXI.utils.TextureCache['test_hover'] = hoverTexture;

        button = new Button({
            texture: 'test',
            container: game.stage,
            x: 100,
            y: 100
        });

    });

    it('button is an object', () => {
        expect(button).to.be.an('object');
    });

    it('button is added to default container', () => {
        expect(game.stage.children[0]).to.be.equal(button);
    });

    it('button has anchor in its center', () => {
        expect(button.anchor.x).to.be.equal(0.5);
        expect(button.anchor.y).to.be.equal(0.5);
    });

    it('button has correct bounds', () => {
        let bounds = button.getBounds();
        expect(bounds.width).to.be.equal(20);
        expect(bounds.height).to.be.equal(30);
        expect(bounds.x).to.be.equal(90);
        expect(bounds.y).to.be.equal(85);
    });

});
