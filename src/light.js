import { html, LitElement } from 'lit';
import './light-icon.js';
import './popout-window.js';
import styles from './light.styles.js';
import sharedStyles from './shared-styles.js';

export class LightComponent extends LitElement {

    _holding = false;
    _HOLD_DURATION = 500;
    _structure;

    static get properties() {
        return {
            _lightBundle: { state: true },
            isModalOpen: { type: Boolean },
            _states: { state: true }
        }
    }

    constructor() {
        super();
        this.isModalOpen = false;
    }

    static styles = [sharedStyles, styles];

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

    hasOptions() {
        let valid = false;
        !!(this._lightBundle.theme) && (valid = true);
        !(this._lightBundle.state.attributes['hs_color'] === undefined) && (valid = true);
        !(this._lightBundle.state.attributes['color_temp_kelvin'] === undefined) && (valid = true);
        !(this._lightBundle.state.attributes['brightness'] === undefined) && (valid = true);
        !!(this._lightBundle.members) && (valid = true);
        return valid;
    }

    popoutWindow() {
        if (this.hasOptions()) {
            const name = this._lightBundle.state.attributes.friendly_name;
            return html`
                <popout-window
                    title="${name}"
                    ?opened="${this.isModalOpen}"
                    @modal-closed="${this.handleModalClosed}"
                    ._lightBundle=${this._lightBundle}
                    .callService="${this.callService}"
                ></popout-window>
            `
        }
    }

    render() {
        console.log(this._states);
        console.log(this._structure);
        const name = this._lightBundle.state.attributes.friendly_name;
        return html`
            <div class="light-element sub-info" @pointerup=${this.onUp} @pointerdown=${this.onDown}>
                <div class="icons">
                    ${this.icons()}
                </div>
                ${name}
            </div>
            ${this.popoutWindow()}
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