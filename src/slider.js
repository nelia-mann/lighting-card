import { html, LitElement } from 'lit';
import styles from './slider.styles.js';
import sharedStyles from './shared-styles.js';
import { tempGradient } from './color-util.js';

export class SliderBar extends LitElement {

    _max;
    _min;
    _startValue;
    _type;
    _MB = 5;
    _MT = 6;

    static get properties() {
        return {
            _light: { state: true },
            _value: { state: true },
        }
    }

    constructor() {
        super();
    }

    static styles = [sharedStyles, styles];

    handleOnChange(e) {
        let value = e.target.value;
        (this._type === "brightness") && (value = Math.round(value * 255 / 100));
        this.dispatchEvent(new CustomEvent('change', { detail: value }))
    }

    handleOnInput(e) {
        const value = e.target.value;
        this._value = value;
    }

    getValue() {
        if (this._value) {
            return this._value;
        } else if (this._startValue) {
            return this._startValue;
        } else {
            return this._min;
        }
    }

    addUnits(value) {
        let newValue = String(Math.round(value));
        if (this._type === "brightness") {
            newValue = newValue + '%';
        } else if (this._type === "ct") {
            newValue = newValue + 'K';
        }
        return newValue;
    }

    getHeight() {
        const heightScale = (this.getValue() - this._min) / (this._max - this._min);
        return 100 * heightScale;
    }

    getTempGradient() {
        const minTemp = this._min;
        const maxTemp = this._max;
        const steps = 10;
        return tempGradient(minTemp, maxTemp, steps);
    }

    render() {
        return html`
            <div class="values">
                <div class="top-box">
                    <div class="top-value"> ${this.addUnits(this._max)} </div>
                </div>
                <div class="bottom-box">
                    <div class="bottom-value"> ${this.addUnits(this._min)} </div>
                </div>
            </div>
            <div class="slider outlined">
                <div class="inner-slider">
                    <div
                        class="shown-slider ${this._type}"
                        style="--height: ${this.getHeight()}%;
                            --grad: ${this.getTempGradient()};"
                    >
                        <div class="shown-level" style="--height: ${this.getHeight()}%"></div>
                    </div>
                    <input
                        class="actual-slider"
                        type="range"
                        max=${this._max}
                        min=${this._min}
                        value="${this.getValue()}"
                        @input="${this.handleOnInput}"
                        @change="${this.handleOnChange}"
                    ></input>
                </div>
            </div>
            <div class="values">
                <div class="current-box"
                    style="--height: ${this.getHeight()}%;">
                    <div class="current-value"> ${this.addUnits(this.getValue())} </div>
                </div>
            </div>
        `
    }

}

customElements.define("slider-bar", SliderBar);