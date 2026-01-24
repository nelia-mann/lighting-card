import { html, LitElement } from 'lit';
import styles from './brightness.styles.js';



export class BrightnessBar extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
            _brightness: {state: true}
        }
    }

    constructor() {
        super();
    }

    static styles = styles;

    handleOnChange(e) {
        const value = e.target.value;
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
            brightness: value
        }
        this.callService('light', 'turn_on', data);
    }

    handleOnInput(e) {
        const value = e.target.value;
        this._brightness = value;
    }

    getBrightness() {
        if (this._brightness) {
            return this._brightness;
        } else {
            return this._light.attributes.brightness;
        }
    }

    getHeight() {
        return 100 * this.getBrightness() / 255
    }

    render() {
        return html`
            <div class="shown-slider" style="--height: ${this.getHeight()}%"></div>
            <input
                class="slider"
                type="range"
                id="brightness"
                max="255"
                min="0"
                value="${this.getBrightness()}"
                @input="${this.handleOnInput}"
                @change="${this.handleOnChange}"
            ></input>
        `
    }

}

customElements.define("brightness-bar", BrightnessBar);