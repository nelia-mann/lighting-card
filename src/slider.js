import { html, LitElement } from 'lit';
import styles from './slider.styles.js';
import { tempGradient } from './color-util.js';



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

    static styles = styles;

    handleOnChange(e) {
        const value = e.target.value;
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

    getHeight() {
        return 100 * (this.getValue() - this._min) / (this._max - this._min)
    }

    getTempGradient() {
        const minTemp = this._min;
        const maxTemp = this._max;
        const steps = 10;
        return tempGradient(minTemp, maxTemp, steps);
    }

    render() {
        return html`
            <div
                class="shown-slider ${this._type}"
                style="--height: ${this.getHeight()}%; --grad: ${this.getTempGradient()};"
            >
                <div class="shown-level" style="--height: ${this.getHeight()}%"></div>
            </div>

            <input
                class="slider"
                type="range"
                max=${this._max}
                min=${this._min}
                value="${this.getValue()}"
                @input="${this.handleOnInput}"
                @change="${this.handleOnChange}"
            ></input>
        `
    }

}

customElements.define("slider-bar", SliderBar);