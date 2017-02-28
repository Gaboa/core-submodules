import * as PIXI from 'pixi.js';
import Game from '../markup/components/game/game';
import Pointer from '../markup/helpers/Pointer';

describe('Mouse events', () => {

    let game, pointer, shape;

    before(() => {

        game = new Game(200, 200);
        pointer = new Pointer(game);

        shape = new PIXI.Graphics();
        shape.beginFill(0xFFF0FF);
        shape.drawRect(0, 0, 100, 100);
        shape.interactive = true;
        game.stage.addChild(shape);

        pointer.interaction.mouseOverRenderer = true;

    });

    it('should call mousedown handler', function () {

        let mouseDownSpy = chai.spy();
        shape.on('mousedown', mouseDownSpy);
        pointer.mousedown(40, 40);
        expect(mouseDownSpy).to.have.been.called.once;

    });

    it('should call mouseup handler', function () {

        let mouseUpSpy = chai.spy();
        shape.on('mouseup', mouseUpSpy);
        pointer.mouseup(40, 40);
        expect(mouseUpSpy).to.have.been.called.once;

    });

    it('should call click handler', function () {

        let clickSpy = chai.spy();
        shape.on('click', clickSpy);
        pointer.click(40, 40);
        expect(clickSpy).to.have.been.called.once;

    });

    it('should call mousemove handler', function () {

        let mouseMoveSpy = chai.spy();
        shape.on('mousemove', mouseMoveSpy);
        pointer.mousemove(40, 40);
        expect(mouseMoveSpy).to.have.been.called.once;

    });

    it('should call mouseover handler', function () {

        let mouseOverSpy = chai.spy();
        shape.on('mouseover', mouseOverSpy);
        pointer.mousemove(40, 40);
        pointer.mouseover(43, 43);
        pointer.mousemove(43, 43);
        pointer.mouseover(43, 43);
        expect(mouseOverSpy).to.have.been.called;

    });

    it('should call mouseout handler', function () {

        let mouseOutSpy = chai.spy();
        shape.on('mouseout', mouseOutSpy);
        pointer.mousemove(40, 40);
        pointer.mouseout(40, 40);
        expect(mouseOutSpy).to.have.been.called.once;

    });

});
