import { html, LitElement } from 'lit';
import { tempGradient, hsGradient } from './color-util.js';
import { mdiBrightness6, mdiCreationOutline } from '@mdi/js';
import styles from './light-control.styles.js';
import sharedStyles from './shared-styles.js';
import './light-icon.js';
import './slider.js';
import './color-wheel.js';
import './theme-select.js';


export class LightControl extends LitElement {

    static get properties() {
        return {
            _lightBundle: { state: true },
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

    isOption(property) {
        let valid;
        if (property === "theme") {
            let theme = this._lightBundle.theme;
            valid = !!theme;
        } else {
            let attribute = this._lightBundle.state.attributes[property];
            valid = !(attribute === undefined);
        }
        return valid;
    }

    lightIcon() {
        return html`
        <div class="onoff icon outlined" @click=${() => this.handleLightService('toggle', null, null)}>
            <light-icon ._lightBundle = ${this._lightBundle}></light-icon>
        </div>
        `
    }

    brightnessIcon() {
        return html`
                <div
                    class="brightness icon ${this.isSelected("brightness")} outlined"
                    @click=${() => this.onSelect("brightness")}
                >
                    <ha-svg-icon .path=${mdiBrightness6}></ha-svg-icon>
                </div>
            `
    }

    ctIcon() {
        return html`<div
            class="ct icon ${this.isSelected("ct")} outlined"
            style="--grad: ${this.getTempGradient()};"
            @click=${() => this.onSelect("ct")}
        ></div>`
    }

    hsIcon() {
        return html`<div
            class="hs icon ${this.isSelected("hs")} outlined"
            style="--grad: ${hsGradient(10)};"
            @click=${() => this.onSelect("hs")}
        ></div>`
    }

    selectIcon() {
        return html`<div
                class="select icon ${this.isSelected("select")} outlined"
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
        const entityId = this._lightBundle.state.entity_id;
        let data = { entity_id: entityId }
        if (key) {
            data[key] = value;
        }
        this.callService('light', service, data)
    }

    handleSelect(event) {
        const entityId = this._lightBundle.theme.entity_id;
        const data = {
            entity_id: entityId,
            option: event.detail
        }
        this.callService('select', 'select_option', data)
    }

    brightnessBar() {
        if (this.isSelected('brightness')) {
            return html`<slider-bar
                class="outlined"
                ._light=${this._lightBundle.state}
                @change=${(e) => this.handleLightService('turn_on', 'brightness', e.detail)}
                ._max=${100}
                ._min=${0}
                ._startValue=${this._lightBundle.state.attributes.brightness * 100 / 255}
                ._type=${'brightness'}
            ></slider-bar>`
        }
    }

    ctBar() {
        if (this.isSelected('ct')) {
            return html`<slider-bar
                class="outlined"
                ._light=${this._lightBundle.state}
                @change=${(e) => this.handleLightService('turn_on', 'color_temp_kelvin', e.detail)}
                ._max=${this._lightBundle.state.attributes.max_color_temp_kelvin}
                ._min=${this._lightBundle.state.attributes.min_color_temp_kelvin}
                ._startValue=${this._lightBundle.state.attributes.color_temp_kelvin}
                ._type=${'ct'}
            ></slider-bar>`
        }
    }

    colorWheel() {
        if (this.isSelected('hs')) {
            return html`<color-wheel
                class="outlined"
                ._light = ${this._lightBundle.state}
                @change = ${(e) => this.handleLightService('turn_on', 'hs_color', e.detail)}
            ></color-wheel>`
        }
    }

    themeSelect() {
        if (this.isSelected('select')) {
            if (this._lightBundle.theme) {
                return html`<theme-select
                    class="outlined"
                    ._theme = ${this._lightBundle.theme}
                    @change = ${this.handleSelect}
                ></theme-select>
                `
            }
        }
    }

    static styles = [sharedStyles, styles];

    render() {
        return html`
            <div class="control-column outlined">
                ${this.lightIcon()}
                ${(this.isOption('brightness')) ? (this.brightnessIcon()) : ``}
                ${(this.isOption('color_temp_kelvin')) ? (this.ctIcon()) : ``}
                ${(this.isOption('hs_color')) ? (this.hsIcon()) : ``}
                ${(this.isOption('theme')) ? (this.selectIcon()) : ``}
            </div>
            ${this.brightnessBar()}
            ${this.ctBar()}
            ${this.colorWheel()}
            ${this.themeSelect()}
        `
    }

}

customElements.define("light-control", LightControl);