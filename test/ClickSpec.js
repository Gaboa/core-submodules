import * as PIXI from 'pixi.js';
import Pointer from '../markup/helpers/MockPointer';

describe('click behavior', () => {
    it('should call mousedown handler', function () {

        const stage = new PIXI.Container();
        const graphics = new PIXI.Graphics();
        const pointer = new Pointer(stage);
        let eventSpy = chai.spy();
        let documentSpy = chai.spy();

        stage.addChild(graphics);
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(0, 0, 50, 50);
        graphics.interactive = true;
        graphics.on('mousedown', eventSpy);
        document.addEventListener('mousedown', documentSpy);

        let someEvent = document.createEvent('MouseEvent');

        someEvent.initMouseEvent(
            'mousedown',
            true,
            false,
            window,
            null,
            10, 10, 10, 10,
            false, false, false, false, 0, null
        );

        console.log(someEvent);

        document.dispatchEvent(someEvent);

        expect(documentSpy).to.have.been.called.once;

        // pointer.mousedown(0, 0);

        // let someEvent = new MouseEvent('mousedown', {
        //     clientX: 10,
        //     clientY: 10,
        //     preventDefault: () => {}
        // });

        // console.log(someEvent.isTrusted);

        // expect(eventSpy).to.have.been.called.once;
    });
});
