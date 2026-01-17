import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './panel.styles';

export class LightGroupInner extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
        }
    }

    constructor() {
        super();
        this.isModalOpen = false;
    }

    static styles = styles;

    icons() {
        const lights = this._light.members;
        return lights.map((light) => {
            return html`
                <light-icon ._light=${light}></light-icon>
            `
        })
    }

    render() {
        const name = this._light.attributes.friendly_name;
        return html`
            <div @click=${this.onClick}>
                ${this.icons()}
                ${name}
            </div>
        `
    }

    onClick() {
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

}

customElements.define("light-group-inner", LightGroupInner);