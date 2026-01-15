import { html, LitElement } from 'lit';
import './light-icon.js';
import './light-group-expanded.js';
// import styles from './light.styles';

export class LightGroupComponent extends LitElement {

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
                <light-group-expanded
                    title="My Modal Title"
                    ?opened="${this.isModalOpen}"
                    @modal-closed="${this.handleModalClosed}"
                ></light-group-expanded>
            </div>
        `
    }

    onDown() {
        this._down = new Date().valueOf();
    }

    onUp() {
        const elapsed = new Date().valueOf() - this._down;
        if (elapsed > 1000) {
            this.onHold();
        }
        else {
            this.onClick();
        }
    }

    onHold() {
        this.isModalOpen = true;
    }

    closeModalFromContent() {
        this.isModalOpen = false;
    }

    handleModalClosed() {
        // Handle the custom event if needed
        console.log('Modal was closed.');
    }

    onClick() {
        console.log("clicked");
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

}

customElements.define("light-group-component", LightGroupComponent);