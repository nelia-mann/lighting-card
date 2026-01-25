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

    render() {
        return html`
            <div class="wheel-background" style="--grad: ${hsGradient(20)}"></div>
        `
    }

}

customElements.define("color-wheel", ColorWheel);