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

    static styles = styles;

    render() {
        const name = this._light.attributes.friendly_name;
        return html`
            <div class="light-row">
                <div  class="light-element ${this._isSelected}" @click=${this.onClick}>
                    <light-icon ._light=${this._light}></light-icon>
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