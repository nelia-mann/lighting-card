import { html, LitElement } from 'lit';
import styles from './wheel.styles.js';
import { hsGradient } from './color-util.js';



export class ColorWheel extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
            _hue: { state: true },
            _saturation: { state: true }
        }
    }

    constructor() {
        super();
    }

    static styles = styles;

    handleOnChange(e) {
    }

    handleOnInput(e) {
    }

    getHS() {
    }

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

    render() {
        this.initializeValues();
        const XY = this.getXY();
        return html`
            <div class="wheel-background"
            style="--grad: ${hsGradient(20)}; --top: ${XY[1]}%; --left: ${XY[0]}%";
            >
                <div class="dot"></div>
            </div>
        `
    }

}

customElements.define("color-wheel", ColorWheel);