export default class Pointer {
    constructor(game) {
        this.stage = game.stage;
        this.renderer = game.renderer;
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

    addEvent({
        name,
        x,
        y
    }) {
        let event = document.createEvent('MouseEvent');

        event.initMouseEvent(
            name,
            true,
            false,
            window,
            null,
            x, y, x, y,
            false, false, false, false, 0, null
        );

        return event;
    }

    mousemove(x, y) {
        let event = this.addEvent({
            name: 'mousemove',
            x,
            y
        });

        this.setPosition(x, y);
        this.render();

        this.interaction.onPointerMove(event);
        this.renderer.view.dispatchEvent(event);
    }

    mouseover(x, y) {
        let event = this.addEvent({
            name: 'mouseover',
            x,
            y
        });

        this.setPosition(x, y);
        this.render();

        this.interaction.onPointerOver(event);
        this.renderer.view.dispatchEvent(event);
    }

    mouseout(x, y) {
        let event = this.addEvent({
            name: 'mouseout',
            x,
            y
        });

        this.setPosition(x, y);
        this.render();

        this.interaction.onPointerOut(event);
        this.renderer.view.dispatchEvent(event);
    }

    mousedown(x, y) {
        let event = this.addEvent({
            name: 'mousedown',
            x,
            y
        });

        this.setPosition(x, y);
        this.interaction.onPointerDown(event);
        this.render();

        this.renderer.view.dispatchEvent(event);
    }

    mouseup(x, y) {
        let event = this.addEvent({
            name: 'mouseup',
            x,
            y
        });

        this.setPosition(x, y);
        this.render();
        this.interaction.onPointerUp(event);

        this.renderer.view.dispatchEvent(event);
    }


    click(x, y) {
        this.mousedown(x, y);
        this.mouseup(x, y);
    }

}
