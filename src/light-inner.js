import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './light.styles.js';
import sharedStyles from './shared-styles.js';

export class LightComponent extends LitElement {

    static get properties() {
        return {
            _lightBundle: { state: true },
            _isSelected: { state: true },
            _isMember: { state: true}
        }
    }

    constructor() {
        super();
        this._isSelected = false;
    }

    static styles = [sharedStyles, styles];

    getMember() {
        let result = '';
        (this._isMember) && (result = 'member');
        return result;
    }

    render() {
        const name = this._lightBundle.state.attributes.friendly_name;
        return html`
            <div  class="light-element
                    ${this._isSelected}
                    ${this.getMember()}
                    outlined"
                @click=${this.onClick}
            >
                <div class="icons">
                    <light-icon ._lightBundle=${this._lightBundle} ></light-icon>
                </div>
                ${name}
            </div>
        `
    }

    onClick() {
        this.dispatchEvent(new CustomEvent('select'));
    }

}

customElements.define("light-inner", LightComponent);