import { html, LitElement } from 'lit';
import styles from './wheel.styles.js';
import { hsGradient } from './color-util.js';



export class ColorWheel extends LitElement {

    _SCALE = 150;
    _box;

    static get properties() {
        return {
            _light: { state: true },
            _hue: { state: true },
            _saturation: { state: true },
            _isDown: { state: true },
        }
    }

    constructor() {
        super();
        this._isDown = false;
    }

    firstUpdated() {
        this._box = this.renderRoot.querySelector('.wheel-background');
        this.initializeValues();
    }

    static styles = styles;

    initializeValues() {
        const hs_values = this._light.attributes.hs_color;
        if (hs_values) {
            this._hue = hs_values[0];
            this._saturation = hs_values[1];
        }
        else {
            this._hue = 0;
            this._saturation = 0;
        }
    }

    getXY() {
        const angle = this._hue * 2 * Math.PI / 360;
        const relX = this._saturation * Math.sin(angle) / 2;
        const relY = this._saturation * Math.cos(angle) / 2;
        const X = 50 + relX;
        const Y = 50 - relY;
        return [X, Y]
    }

    getColor() {
        return `hsl(${this._hue}, ${this._saturation}%, ${100 - this._saturation / 2}%)`
    }

    render() {
        const XY = this.getXY();
        return html`
            <div class="wheel-background"
                style="
                    --grad: ${hsGradient(20)};
                    --top: ${XY[1]}%;
                    --left: ${XY[0]}%;
                    --color: ${this.getColor()};
                    --scale: ${this._SCALE}px;"
                @pointerdown=${this.down}
                @pointerup=${this.up}
                @pointermove=${this.move}
            >
                <div class="dot"
                ></div>
            </div>
        `
    }

    down(e) {
        this._isDown = true;
        this.move(e);
    }

    up() {
        this._isDown = false;
        const hs_color = [this._hue, this._saturation];
        this.dispatchEvent(new CustomEvent('change', { detail: hs_color }));
    }

    move(e) {
        if (this._isDown) {
            const rect = this._box.getBoundingClientRect();
            let x = (100 * (e.clientX - rect.left) / this._SCALE) - 50;
            let y = 50 - (100 * (e.clientY - rect.top) / this._SCALE);
            let saturation = 2 * Math.sqrt(x ** 2 + y ** 2)
            let hue = 360 * Math.atan2(x, y) / (2 * Math.PI);
            (hue < 0) && (hue = 360 + hue);
            if (saturation < 100) {
                this._hue = hue;
                this._saturation = saturation;
            } else {
                this.up();
            }
        }
    }

}

customElements.define("color-wheel", ColorWheel);