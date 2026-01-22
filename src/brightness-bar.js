import { html, LitElement } from 'lit';
import styles from './brightness.styles.js';



export class BrightnessBar extends LitElement {

    static get properties() {
        return {
            _light: { state: true},
        }
    }

    constructor() {
        super();
    }

    static styles = styles;

    handleOnInput(e) {
        const value = e.target.value;
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
            brightness: value
        }
        this.callService('light', 'turn_on', data);
    }

    getBrightness() {
        return this._light.attributes.brightness;
    }

    getHeight() {
        return 100 * this.getBrightness() / 255
    }

    render() {
        return html`
            <input
                class="slider"
                type="range"
                id="brightness"
                max="255"
                min="0"
                value="${this.getBrightness()}"
                @input="${this.handleOnInput}"
                style="--height: ${this.getHeight()}%"
            ></input>
        `
    }

}

customElements.define("brightness-bar", BrightnessBar);