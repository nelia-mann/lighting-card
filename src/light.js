import { html, LitElement } from 'lit';
import './light-icon.js';
import './popout-window.js';
import styles from './panel.styles';

export class LightComponent extends LitElement {

    _holding = false;
    _HOLD_DURATION = 500;

    static get properties() {
        return {
            _light: { state: true },
            isModalOpen: { type: Boolean }
        }
    }

    constructor() {
        super();
        this.isModalOpen = false;
    }

    getStyle() {
        let result;
        if (this._light.state === "off") {
            result = `
                color: #44739e;
            `
        } else {
            result = `
                color: #ffc107;;
            `
        }
        return result;
    }

    // pull styles
    static styles = styles;

    render() {
        const name = this._light.attributes.friendly_name;
        return html`
            <div  class="light-element" @pointerup=${this.onUp} @pointerdown=${this.onDown}>
                <light-icon ._light=${this._light}></light-icon>
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