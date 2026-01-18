import { html, LitElement } from 'lit';
import './light-icon.js';
import './popout-window.js';
import './light-inner.js';
import styles from './panel.styles.js';

export class LightComponent extends LitElement {

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

    static styles = styles;

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

    lights() {
        const lights = this._light.members;
        let result = html``;
        if (lights) {
            result = lights.map((light) => {
                return html`
                    <light-inner
                        ._light=${light}
                        .callService=${this.callService}
                    ></light-inner>
                    `
                })
        }
        return result;
    }

    render() {
        const name = this._light.attributes.friendly_name;
        return html`
            <div class="light-element" @pointerup=${this.onUp} @pointerdown=${this.onDown}>
                ${this.icons()}
                ${name}
            </div>
            <popout-window
                title="${name}"
                ?opened="${this.isModalOpen}"
                @modal-closed="${this.handleModalClosed}"
            >
                <light-inner
                    ._light=${this._light}
                    .callService=${this.callService}
                ></light-inner>
                ${this.lights()}
            </popout-window>
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

customElements.define("light-component", LightComponent);