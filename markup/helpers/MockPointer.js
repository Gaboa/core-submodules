export default class MockPointer {
    constructor(stage, width, height) {
        this.stage = stage;
        this.renderer = new PIXI.CanvasRenderer(width || 100, height || 100);
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
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            preventDefault: sinon.stub(),
        });

        this.setPosition(x, y);
        this.render();
        // mouseOverRenderer state should be correct, so mouse position to view rect
        const rect = new PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height);

        if (rect.contains(x, y)) {
            if (!this.interaction.mouseOverRenderer) {
                this.interaction.onPointerOver(new MouseEvent('mouseover', {
                    clientX: x,
                    clientY: y,
                    preventDefault: sinon.stub(),
                }));
            }
            this.interaction.onPointerMove(mouseEvent);
        } else {
            this.interaction.onPointerOut(new MouseEvent('mouseout', {
                clientX: x,
                clientY: y,
                preventDefault: sinon.stub(),
            }));
        }
    }

    click(x, y) {
        this.mousedown(x, y);
        this.mouseup(x, y);
    }

    mousedown(x, y) {
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: x,
            clientY: y,
            preventDefault: sinon.stub(),
        });

        this.setPosition(x, y);
        this.render();
        this.interaction.onPointerDown(mouseEvent);
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
