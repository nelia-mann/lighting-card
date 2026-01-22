import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './panel.styles';
import { mdiBrightness6 } from '@mdi/js';

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

    getTempRed(temp) {
        let red;
        if (temp <= 6600) {
            red = 255;
        } else {
            red = (temp / 100) - 60;
            red = Math.round(329.698727446 * (red ** (-0.1332047592)));
        }
        (red < 0) && (red = 0);
        (red > 255) && (red = 255);
        return red;
    }

    getTempGreen(temp) {
        let green;
        if (temp <= 6600) {
            green = temp / 100;
            green = Math.round((99.4708025861) * Math.log(green) - 161.1195681661);
        } else {
            green = (temp / 100) - 60;
            green = Math.round(288.1221695283 * (green ** (-0.0755148492)));
        }
        (green < 0) && (green = 0);
        (green > 255) && (green = 255);
        return green;
    }

    getTempBlue(temp) {
        let blue;
        if (temp > 6600) {
            blue = 255;
        } else {
            if (temp <= 1900) {
                blue = 0;
            } else {
                blue = (temp / 100) - 10;
                blue = Math.round(138.5177312231 * Math.log(blue) - 305.0447927307);
            }
        }
        (blue < 0) && (blue = 0);
        (blue > 255) && (blue = 255);
        return blue;
    }

    getTempColor(temp) {
        return `rgb(${this.getTempRed(temp)}, ${this.getTempGreen(temp)}, ${this.getTempBlue(temp)})`
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

    gradient() {
        const minTemp = 1500;
        const maxTemp = 9000;
        const min = this.getTempColor(minTemp);
        const max = this.getTempColor(maxTemp);
        const steps = 10;
        let output = `linear-gradient(to top`
        for (let step = 0; step <= steps; step++) {
            const result = this.getTempColor((minTemp * (steps - step) + maxTemp * step) / steps);
            const percent = Math.round(step * 100 / steps);
            output = output + `, ` + result + ` ${percent}%`;
        }
        output = output + `)`;
        return output;
    }

    ctIcon() {
        return html`<div class="ct-icon" style="--grad: ${this.gradient()};"></div>`
    }

    hsIcon() {
        return html`<div class="hs-icon"> HS </div>`
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