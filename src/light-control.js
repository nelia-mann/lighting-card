import { html, LitElement } from 'lit';
import { tempGradient, hsGradient } from './color-util.js';
import { mdiBrightness6 } from '@mdi/js';
import styles from './light-control.styles.js';
import './light-icon.js';
import './brightness-bar.js';


export class LightControl extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
            _control: { state: true }
        }
    }

    constructor() {
        super();
    }

    getTempGradient() {
        const minTemp = 1500;
        const maxTemp = 9000;
        const steps = 10;
        return tempGradient(minTemp, maxTemp, steps);
    }

    isAttribute(attribute) {
        const result = this._light.attributes[attribute];
        return (!(result === undefined));
    }

    lightIcon() {
        return html`
        <div class="onoff icon" @click=${this.onOff}>
            <light-icon ._light=${this._light}></light-icon>
        </div>
        `
    }

    brightnessIcon() {
        return html`
                <div
                    class="brightness icon ${this.isSelected("brightness")}"
                    @click=${() => this.onSelect("brightness")}
                >
                    <ha-svg-icon .path=${mdiBrightness6}></ha-svg-icon>
                </div>
            `
    }

    ctIcon() {
        return html`<div
            class="ct icon ${this.isSelected("ct")}"
            style="--grad: ${this.getTempGradient()};"
            @click=${() => this.onSelect("ct")}
        ></div>`
    }

    hsIcon() {
        return html`<div
            class="hs icon ${this.isSelected("hs")}"
            style="--grad: ${hsGradient(10)};"
            @click=${() => this.onSelect("hs")}
        ></div>`
    }

    onSelect(result) {
        this._control = result;
    }

    isSelected(string) {
        return (this._control === string);
    }

    onOff() {
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

    brightnessBar() {
        if (this.isSelected('brightness')) {
            return html`<brightness-bar ._light=${this._light} .callService=${this.callService}></brightness-bar>`
        }
    }

    static styles = styles;

    render() {
        return html`
            <div class="control-column">
                ${this.lightIcon()}
                ${(this.isAttribute('brightness')) ? (this.brightnessIcon()) : ``}
                ${(this.isAttribute('color_temp_kelvin')) ? (this.ctIcon()) : ``}
                ${(this.isAttribute('hs_color')) ? (this.hsIcon()) : ``}
            </div>
            ${this.brightnessBar()}
        `
    }

}

customElements.define("light-control", LightControl);