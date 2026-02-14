import { html, LitElement } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import './light-icon.js';
import './popout-window.js';
import styles from './light.styles.js';
import sharedStyles from './shared-styles.js';

export class LightComponent extends LitElement {

    _holding = false;
    _HOLD_DURATION = 500;
    _structure = {};
    _theme;
    _lightId;
    _entityIds = [];
    _initialized = false;

    static get properties() {
        return {
            isModalOpen: { type: Boolean },
            _states: { state: true },
            _changedEntityIds: { state: true }
        }
    }

    constructor() {
        super();
        this.isModalOpen = false;
    }

    update(changedProps) {
        super.update(changedProps);
        this._initialized = true;
    }

    hasRelevantChanges() {
        return this._entityIds.some((entityId) => (this._changedEntityIds.has(entityId)))
    }

    shouldUpdate(changedProps) {
        return (!this._initialized || this.hasRelevantChanges() || changedProps.has("isModalOpen"))
    }

    static styles = [sharedStyles, styles];

    icons() {
        let result;
        let lightIds = Object.keys(this._structure);
        (lightIds.length === 0) && (lightIds = [this._lightId])
        let lightState;
        result = repeat(lightIds, (lightId) => lightId, (lightId) => {
            lightState = this._states[lightId];
            return html`<light-icon ._state=${lightState} ._isGroup=${false}></light-icon>`
        })
        return result;
    }

    hasOptions() {
        let valid = false;
        const state = this._states[this._lightId];
        const lightIds = Object.keys(this._structure);
        !!(this._structure.theme) && (valid = true);
        !(state.attributes['hs_color'] === undefined) && (valid = true);
        !(state.attributes['color_temp_kelvin'] === undefined) && (valid = true);
        !(state.attributes['brightness'] === undefined) && (valid = true);
        (lightIds.length > 0) && (valid = true);
        return valid;
    }

    popoutWindow() {
        if (this.hasOptions()) {
            const name = this._states[this._lightId].attributes.friendly_name;
            return html`
                <popout-window
                    title="${name}"
                    ?opened="${this.isModalOpen}"
                    @modal-closed="${this.handleModalClosed}"
                    ._states = ${this._states}
                    ._lightId = ${this._lightId}
                    ._structure = ${this._structure}
                    ._theme = ${this._theme}
                    ._changedEntityIds = ${this._changedEntityIds}
                    ._entityIds = ${this._entityIds}
                    .callService="${this.callService}"
                ></popout-window>
            `
        }
    }

    render() {
        const name = this._states[this._lightId].attributes.friendly_name;
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
        const entityId = this._lightId;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

}

customElements.define("light-component", LightComponent);