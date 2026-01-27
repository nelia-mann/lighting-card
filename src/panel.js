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

    soloLightDisplays() {
        return Object.values(this._lights.solo).map((light) => {
            return html`
                <light-component
                    id=${light.entity_id}
                    ._light=${light}
                    .callService=${this.callService}
                    ></light-component>
            `
        });
    }

    groupLightDisplays() {
        return Object.values(this._lights.groups).map((light) => {
            return html`
                <light-component
                    id=${light.entity_id}
                    ._light=${light}
                    .callService=${this.callService}
                ></light-component>
            `
        });
    }

    render() {
        return html`
            <div class="panel">
                ${this.soloLightDisplays()}
                ${this.groupLightDisplays()}
            </div>
        `
    }

}

customElements.define("panel-component", PanelComponent);