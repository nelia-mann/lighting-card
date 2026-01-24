import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './panel.styles';

export class LightComponent extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
            _isSelected: {state: true}
        }
    }

    constructor() {
        super();
        this._isSelected = false;
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
                <div  class="light-element ${this._isSelected}" @click=${this.onClick}>
                    ${this.icons()}
                    ${name}
                </div>
            </div>
        `
    }

    onClick() {
        this.dispatchEvent(new CustomEvent('select'));
    }

}

customElements.define("light-inner", LightComponent);