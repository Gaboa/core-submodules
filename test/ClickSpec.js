import * as PIXI from 'pixi.js';
import Pointer from '../markup/helpers/MockPointer';

describe('click behavior', () => {

    let pointer, stage, graphics, someVar = 1;

    before(() => {

        stage = new PIXI.Container();
        pointer = new Pointer(stage);
        document.body.appendChild(pointer.renderer.view);

        graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFF0FF);
        graphics.drawRect(0, 0, 60, 60);
        graphics.interactive = true;
        stage.addChild(graphics);

    });

    it('should call mousedown handler', function () {

        let mouseDownSpy = chai.spy();
        graphics.on('mousedown', mouseDownSpy);
        pointer.mousedown(40, 40);
        expect(mouseDownSpy).to.have.been.called.once;

    });

    it('should call over handler', () => {

        let mouseOverSpy = chai.spy();
        graphics.on('mousemove', mouseOverSpy);
        pointer.mousemove(40, 40);
        expect(mouseOverSpy).to.have.been.called.once;

    });

});
