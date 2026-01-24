import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './panel.styles';
import { mdiBrightness6 } from '@mdi/js';
import { tempGradient, hsGradient } from './color-util.js';

export class LightComponent extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
            _isBSelected: {state: true }
        }
    }

    constructor() {
        super();
    }

    isAttribute(attribute) {
        const result = this._light.attributes[attribute];
        return (!(result === undefined));
    }

    brightnessIcon() {
        return html`
                <div class="brightness-icon ${this._isBSelected}">
                    <ha-svg-icon .path=${mdiBrightness6} @click=${this.onSelectB}></ha-svg-icon>
                </div>
            `
    }

    getTempGradient() {
        const minTemp = 1500;
        const maxTemp = 9000;
        const steps = 10;
        return tempGradient(minTemp, maxTemp, steps);
    }

    ctIcon() {
        return html`<div class="ct-icon" style="--grad: ${this.getTempGradient()};"></div>`
    }

    hsIcon() {
        return html`<div class="hs-icon" style="--grad: ${hsGradient(10)};"></div>`
    }

    onSelectB() {
        this.dispatchEvent(new CustomEvent('bSelected'));
    }

    icons() {
        let result;
        const lights = this._light.members;
        if (lights) {
            result = lights.map((light) => {
                return html`
                    <light-icon ._light=${light}></light-icon>
                `
            })
        }
        else {
            result = html`
                <light-icon ._light=${this._light}></light-icon>
            `
        }
        return result;
    }

    // pull styles
    static styles = styles;

    render() {
        const name = this._light.attributes.friendly_name;
        return html`
            <div class="light-row">
                <div  class="light-element" @click=${this.onClick}>
                    ${this.icons()}
                    ${name}
                </div>
                ${(this.isAttribute('brightness')) ? (this.brightnessIcon()) : ``}
                ${(this.isAttribute('color_temp_kelvin')) ? (this.ctIcon()) : ``}
                ${(this.isAttribute('hs_color')) ? (this.hsIcon()) : ``}
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