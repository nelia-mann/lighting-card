import { html, LitElement } from 'lit';
import { tempGradient, hsGradient } from './color-util.js';
import { mdiBrightness6, mdiMagicStaff, mdiCreationOutline } from '@mdi/js';
import styles from './light-control.styles.js';
import './light-icon.js';
import './slider.js';
import './color-wheel.js';
import './theme-select.js';


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
        <div class="onoff icon" @click=${() => this.handleLightService('toggle', null, null)}>
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

    selectIcon() {
        return html`<div
                class="select icon ${this.isSelected("select")}"
                @click=${() => this.onSelect("select")}
            >
                <ha-svg-icon .path=${mdiCreationOutline}></ha-svg-icon>
            </div>
        `
    }

    onSelect(result) {
        this._control = result;
    }

    isSelected(string) {
        return (this._control === string);
    }

    handleLightService(service, key, value) {
        const entityId = this._light.entity_id;
        let data = { entity_id: entityId }
        if (key) {
            data[key] = value;
        }
        this.callService('light', service, data)
    }

    handleSelect(event) {
        const entityId = this._light.attributes.select.entity_id;
        const data = {
            entity_id: entityId,
            option: event.detail
        }
        this.callService('select', 'select_option', data)
    }

    brightnessBar() {
        if (this.isSelected('brightness')) {
            return html`<slider-bar
                ._light=${this._light}
                @change=${(e) => this.handleLightService('turn_on', 'brightness', e.detail)}
                ._max=${255}
                ._min=${0}
                ._startValue=${this._light.attributes.brightness}
                ._type=${'brightness'}
            ></slider-bar>`
        }
    }

    ctBar() {
        if (this.isSelected('ct')) {
            return html`<slider-bar
                ._light=${this._light}
                @change=${(e) => this.handleLightService('turn_on', 'color_temp_kelvin', e.detail)}
                ._max=${this._light.attributes.max_color_temp_kelvin}
                ._min=${this._light.attributes.min_color_temp_kelvin}
                ._startValue=${this._light.attributes.color_temp_kelvin}
                ._type=${'ct'}
            ></slider-bar>`
        }
    }

    colorWheel() {
        if (this.isSelected('hs')) {
            return html`<color-wheel
                ._light = ${this._light}
                @change = ${(e) => this.handleLightService('turn_on', 'hs_color', e.detail)}
            ></color-wheel>`
        }
    }

    themeSelect() {
        if (this.isSelected('select')) {
            return html`<theme-select
                ._light = ${this._light}
                @change = ${this.handleSelect}
            ></theme-select>
            `
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
                ${(this.isAttribute('select')) ? (this.selectIcon()) : ``}
            </div>
            ${this.brightnessBar()}
            ${this.ctBar()}
            ${this.colorWheel()}
            ${this.themeSelect()}
        `
    }

}

customElements.define("light-control", LightControl);