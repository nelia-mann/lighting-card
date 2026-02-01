import { html, LitElement } from 'lit';
import './light-icon.js';
import './popout-window.js';
import styles from './light.styles.js';

export class LightComponent extends LitElement {

    _holding = false;
    _HOLD_DURATION = 500;

    static get properties() {
        return {
            _lightBundle: { state: true },
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
        const lightBundles = this._lightBundle.members;
        if (lightBundles) {
            result = Object.values(lightBundles).map((lightBundle) => {
                return html`
                    <light-icon ._lightBundle=${lightBundle}></light-icon>
                `
            })
        }
        else {
            result = html`
                <light-icon ._lightBundle=${this._lightBundle}></light-icon>
            `
        }
        return result;
    }

    render() {
        const name = this._lightBundle.state.attributes.friendly_name;
        return html`
            <div class="light-element" @pointerup=${this.onUp} @pointerdown=${this.onDown}>
                <div class="icons">
                    ${this.icons()}
                </div>
                ${name}
            </div>
            <popout-window
                title="${name}"
                ?opened="${this.isModalOpen}"
                @modal-closed="${this.handleModalClosed}"
                ._lightBundle=${this._lightBundle}
                .callService="${this.callService}"
            ></popout-window>
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
        const entityId = this._lightBundle.state.entity_id;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

}

customElements.define("light-component", LightComponent);