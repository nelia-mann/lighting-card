import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './slider.styles.js';
import sharedStyles from './shared-styles.js';
import { tempGradient, ONLIGHT, rgba } from './color-util.js';

export class SliderBar extends LitElement {

    _max;
    _min;
    _startValue;
    _type;

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

    getStyleLevel() {
        let styles = {};
        styles['bottom'] = `${this.getHeight()}%`;
        return styles;
    }

    getStyleBG() {
        let styles = {};
        if (this._type === 'brightness') {
            let height = ` ${Math.round(this.getHeight())}%`;
            let dark = rgba(ONLIGHT, 1);
            let pale = rgba(ONLIGHT, 0.2);
            let stem = 'linear-gradient(to top, ';
            stem = stem + dark + height + ', ' + pale + height + ')';
            styles['background'] = stem;
        }
        else if (this._type === 'ct') {
            styles['background'] = this.getTempGradient();
        }
        return styles;
    }

    render() {
        return html`
            <div class="values">
                <div class="inner-values">
                    <div class="top-value"> ${this.addUnits(this._max)} </div>
                    <div class="bottom-value"> ${this.addUnits(this._min)} </div>
                </div>
            </div>
            <div class="slider outlined">
                <div class="inner-slider">
                    <div
                        class="shown-slider ${this._type}"
                        style="${styleMap(this.getStyleBG())}"
                    >
                        <div class="shown-level" style="${styleMap(this.getStyleLevel())}"></div>
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
                <div class="inner-values">
                    <div class="current-value" style="${styleMap(this.getStyleLevel())}">
                        ${this.addUnits(this.getValue())}
                    </div>
                </div>
            </div>
        `
    }

}

customElements.define("slider-bar", SliderBar);