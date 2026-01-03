import { html, LitElement } from 'lit';
import styles from './panel.styles.js';
import './light.js';

export class PanelComponent extends LitElement {

    static get properties() {
        return {
            _lights: { state: true },
        }
    }

    constructor() {
        super();
    }

    static styles = styles;

    lightDisplays() {
        return Object.entries(this._lights).map(([key, value]) => {
            return html`
                <light-component ._light=${value} ._key=${key}>
                </light-component>
            `
        });
    }

    render() {
        return html`
            <div class="panel">
                ${this.lightDisplays()}
            </div>
        `
    }

}

customElements.define("panel-component", PanelComponent);