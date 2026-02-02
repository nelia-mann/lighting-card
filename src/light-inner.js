import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import './light-icon.js';
import styles from './light.styles.js';
import sharedStyles from './shared-styles.js';
import { SELECTEDLIGHT, rgba } from './color-util.js';

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

    getStyles() {
        let styles = {};
        if (this._isSelected) {
            styles['outline'] = 'solid ' + rgba(SELECTEDLIGHT, 1);
            styles['outline-offset'] = '-4px'
        }
        return styles;
    }

    render() {
        const name = this._lightBundle.state.attributes.friendly_name;
        return html`
            <div  class="light-element"
                style="${styleMap(this.getStyles())}"
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