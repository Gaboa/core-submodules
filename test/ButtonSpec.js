import * as PIXI from 'pixi.js';
import Game from '../markup/components/game/game';
import Button from '../markup/components/button/button';
import Pointer from '../markup/helpers/Pointer';

describe('Button class', () => {

    let game, pointer, button;
    let texture, hoverTexture;
    let clickSpy;

    before(() => {
        game = new Game(500, 500);
        pointer = new Pointer(game);

        clickSpy = chai.spy();

        texture = new PIXI.RenderTexture.create(20, 30);
        hoverTexture = new PIXI.RenderTexture.create(50, 50);
        PIXI.utils.TextureCache['test'] = texture;
        PIXI.utils.TextureCache['test_hover'] = hoverTexture;

        button = new Button({
            texture: 'test',
            container: game.stage,
            x: 0,
            y: 0,
            onClick: clickSpy
        });

    });

    describe('Button constructor', () => {

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
            expect(bounds.x).to.be.equal(-10);
            expect(bounds.y).to.be.equal(-15);
        });

    });


    describe('Button handlers', () => {

        it('button handles click', () => {
            pointer.click(9, 10);
            expect(button.isPressed).to.be.ok;
            button.update();
            expect(clickSpy).to.have.been.called.once;
            expect(button.isPressed).to.be.not.ok;
        });

        it('button handles mouseout', () => {
            pointer.interaction.mouseOverRenderer = true;
            pointer.mousemove(0, 10);
            pointer.mouseout(0, 10);
            expect(button.isOver).to.be.not.ok;
            button.texture = null;
            button.update();
            expect(button.texture).to.be.equal(button.normalTexture);
        });

        it('button handles mouseover', () => {
            pointer.interaction.mouseOverRenderer = true;
            pointer.mousemove(0, 10);
            pointer.mouseover(0, 10);
            expect(button.isOver).to.be.ok;
            button.texture = null;
            button.update();
            expect(button.texture).to.be.equal(button.hoverTexture);
        });

    });

});
