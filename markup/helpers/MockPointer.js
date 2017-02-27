export default class MockPointer {
    constructor(stage, width, height) {
        this.stage = stage;
        this.renderer = new PIXI.CanvasRenderer(width || 100, height || 100, { backgroundColor: 0x1099bb });
        this.renderer.sayHello = () => { /* empty */ };
        this.interaction = this.renderer.plugins.interaction;
    }

    setPosition(x, y) {
        this.renderer.plugins.interaction.mapPositionToPoint = (point) => {
            point.x = x;
            point.y = y;
        };
    }

    render() {
        this.renderer.render(this.stage);
    }

    mousemove(x, y) {
        let eventMove = document.createEvent('MouseEvent');
        let eventOver = document.createEvent('MouseEvent');
        let eventOut = document.createEvent('MouseEvent');

        eventMove.initMouseEvent(
            'mousemove',
            true,
            false,
            window,
            null,
            x, y, x, y,
            false, false, false, false, 0, null
        );

        eventOver.initMouseEvent(
            'mouseover',
            true,
            false,
            window,
            null,
            x, y, x, y,
            false, false, false, false, 0, null
        );

        eventOver.initMouseEvent(
            'mouseout',
            true,
            false,
            window,
            null,
            x, y, x, y,
            false, false, false, false, 0, null
        );

        this.setPosition(x, y);
        this.render();

        // mouseOverRenderer state should be correct, so mouse position to view rect
        const rect = new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height);

        if (rect.contains(x, y)) {
            if (!this.interaction.mouseOverRenderer) {
                this.interaction.onPointerOver(eventOver);
                this.renderer.view.dispatchEvent(eventOver);
            }
            this.interaction.onPointerMove(eventMove);
            this.renderer.view.dispatchEvent(eventMove);
        } else {
            this.interaction.onPointerOut(eventOut);
            this.renderer.view.dispatchEvent(eventOut);
        }

    }

    click(x, y) {
        this.mousedown(x, y);
        this.mouseup(x, y);
    }

    mousedown(x, y) {
        let event = document.createEvent('MouseEvent');

        event.initMouseEvent(
            'mousedown',
            true,
            false,
            window,
            null,
            x, y, x, y,
            false, false, false, false, 0, null
        );

        this.setPosition(x, y);
        this.interaction.onPointerDown(event);
        this.render();

        this.renderer.view.dispatchEvent(event);
    }

    mouseup(x, y) {
        const mouseEvent = new MouseEvent('mouseup', {
            clientX: x,
            clientY: y,
            preventDefault: sinon.stub(),
        });

        this.setPosition(x, y);
        this.render();
        this.interaction.onPointerUp(mouseEvent);
    }

    tap(x, y) {
        this.touchstart(x, y);
        this.touchend(x, y);
    }

    touchstart(x, y) {
        const touchEvent = new TouchEvent('touchstart', {
            preventDefault: sinon.stub(),
            changedTouches: [
                new Touch({ identifier: 0, target: this.renderer.view }),
            ],
        });

        this.setPosition(x, y);
        this.render();
        this.interaction.onPointerDown(touchEvent);
    }

    touchend(x, y) {
        const touchEvent = new TouchEvent('touchend', {
            preventDefault: sinon.stub(),
            changedTouches: [
                new Touch({ identifier: 0, target: this.renderer.view }),
            ],
        });

        this.setPosition(x, y);
        this.render();
        this.interaction.onPointerUp(touchEvent);
    }
}
