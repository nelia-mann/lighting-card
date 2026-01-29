import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './light.styles';

export class LightComponent extends LitElement {

    static get properties() {
        return {
            _lightBundle: { state: true },
            _isSelected: {state: true}
        }
    }

    constructor() {
        super();
        this._isSelected = false;
    }

    static styles = styles;

    render() {
        const name = this._lightBundle.state.attributes.friendly_name;
        return html`
            <div  class="light-element ${this._isSelected}" @click=${this.onClick}>
                <light-icon ._lightBundle=${this._lightBundle} ></light-icon>
                ${name}
            </div>
        `
    }

    onClick() {
        this.dispatchEvent(new CustomEvent('select'));
    }

}

customElements.define("light-inner", LightComponent);