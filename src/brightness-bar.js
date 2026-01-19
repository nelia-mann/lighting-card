import { html, LitElement } from 'lit';
import styles from './brightness.styles.js';



export class BrightnessBar extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
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

    render() {
        return html`
            <input
                type="range"
                id="brightness"
                max="255"
                min="0"
                value="${this._light.attributes.brightness}"
                @change="${this.handleOnChange}"
            ></input>
        `
    }

}

customElements.define("brightness-bar", BrightnessBar);