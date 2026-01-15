import { html, LitElement } from 'lit';
import './light-icon.js';
import './light-group-expanded.js';
// import styles from './light.styles';

export class LightGroupComponent extends LitElement {

    _holding = false;
    _HOLD_DURATION = 500;

    static get properties() {
        return {
            _light: { state: true },
            isModalOpen: { type: Boolean},
        }
    }

    constructor() {
        super();
        this.isModalOpen = false;
    }

    // static styles = styles;

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
            <div @pointerup=${this.onUp} @pointerdown=${this.onDown}>
                ${this.icons()}
                ${name}
            </div>
            <light-group-expanded
                title="My Modal Title"
                ?opened="${this.isModalOpen}"
                @modal-closed="${this.handleModalClosed}"
            ></light-group-expanded>
        `
    }

    onDown() {
        this._holding = true;
        setTimeout(() => { this.onHold() }, this._HOLD_DURATION);
    }

    onUp() {
        this._holding = false;
    }

    onHold() {
        if (this._holding) {
            this.isModalOpen = true;
        }
        else {
            this.onClick();
        }
    }

    handleModalClosed() {
        this.isModalOpen = false;
    }

    onClick() {
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

}

customElements.define("light-group-component", LightGroupComponent);