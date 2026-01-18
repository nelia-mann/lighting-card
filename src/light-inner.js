import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './panel.styles';
import { mdiBrightness6 } from '@mdi/js';

export class LightComponent extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
        }
    }

    constructor() {
        super();
    }

    isBrightness() {
        const result = this._light.attributes.brightness;
        return (!(result === undefined))
    }

    brightnessIcon() {
        let icon = html``;
        if (this.isBrightness()) {
            icon = html`
                <div class="brightness-icon">
                    <ha-svg-icon .path=${mdiBrightness6} ></ha-svg-icon>
                </div>
            `
        }
        return icon;
    }

    // pull styles
    static styles = styles;

    render() {
        const name = this._light.attributes.friendly_name;
        return html`
            <div class="light-row">
                <div  class="light-element" @click=${this.onClick}>
                    <light-icon ._light=${this._light}></light-icon>
                    ${name}
                </div>
                ${this.brightnessIcon()}
            </div>
        `
    }

    onClick() {
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

}

customElements.define("light-inner", LightComponent);