import { html, LitElement } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { mdiCloseCircleOutline } from '@mdi/js';
import styles from './popout.styles.js';
import sharedStyles from './shared-styles.js';
import './light-control.js';
import { getColor } from './light-util.js';

export class PopoutWindow extends LitElement {

    _structure;
    _theme;
    _lightId;
    _entityIds = [];
    _initialized = false;

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _selectedId: { state: true },
            _states: { state: true },
            _changedEntityIds: { state: true },
        }
    }

    update(changedProps) {
        super.update(changedProps);
        this._initialized = true;
    }

    hasRelevantChanges() {
        return this._entityIds.some((entityId) => (this._changedEntityIds.has(entityId)))
    }

    shouldUpdate(changedProps) {
        return (!this._initialized
            || this.hasRelevantChanges()
            || changedProps.has("opened")
            || changedProps.has("_selectedId"))
    }

    firstUpdated() {
        this._selectedId = this._lightId;
    }

    // Lifecycle method to open/close the native dialog
    updated(changedProperties) {
        if (changedProperties.has('opened')) {
        const dialog = this.shadowRoot.querySelector('dialog');
        if (this.opened) {
            dialog.showModal(); // Opens the dialog modally, disabling content behind it
        } else {
            dialog.close();
        }
        }
    }

    static styles = [sharedStyles, styles];

    getStyles(lightState) {
        let styles = {};
        if (this.isSelected(lightState)) {
            styles['outline'] = 'solid ' + getColor(lightState);
            styles['outline-offset'] = '-4px'
        }
        return styles;
    }

    header(isMember) {
        let result;
        if (isMember) {
            result = 'sub-info';
        } else {
            result = 'small-heading';
        }
        return result;
    }

    innerLight(lightId, isMember) {
        const lightState = this._states[lightId];
        if (lightState) {
            const name = lightState.attributes.friendly_name;
            const isGroup = this.isGroup(lightId);
            return html`
                <div
                    class="light-inner outlined ${this.header(isMember)}"
                    style=${styleMap(this.getStyles(lightState))}
                    id=${lightState.entity_id}
                    @click=${() => this.select(lightState)}
                >
                    <div class="icons">
                        <light-icon ._state=${lightState} ._isGroup=${isGroup}></light-icon>
                    </div>
                    ${name}
                </div>
            `
        }
    }

    isGroup(entityId) {
        const lightIds = Object.keys(this._structure);
        if (this._lightId != entityId) {
            return false;
        } else {
            return (lightIds.length > 0);
        }
    }

    lights() {
        const memberIds = Object.keys(this._structure);
        return repeat(memberIds, (memberId) => memberId, (memberId) => this.innerLight(memberId, true))
    }

    lightControl() {
        const lightState = this.selectedLightState();
        const entityIds = this.selectedLightEntityIds();
        if (lightState) {
            return html`
                <light-control
                    id = ${lightState.entity_id}
                    ._lightState = ${{ ...lightState }}
                    ._entityIds = ${entityIds}
                    ._changedEntityIds = ${this._changedEntityIds}
                    ._themeState = ${{...this.selectedThemeState()}}
                    .callService=${this.callService}
                ></light-control>
            `
        }
    }

    render() {
        if (this._initialized) {
            return html`
                <dialog class="outlined" @close="${this._handleClose}">
                    <div class="modal-header">
                        <div></div>
                        <div class="large-heading">${this.title}</div>
                        <button class="close-button" @click="${this.closeModal}" aria-label="Close modal">
                            <ha-svg-icon .path=${mdiCloseCircleOutline}"></ha-svg-icon>
                        </button>
                    </div>
                    <div class="content-row">
                        <div class="select-lights">
                            ${this.innerLight(this._lightId, false)}
                            ${this.lights()}
                        </div>
                        ${this.lightControl()}
                    </div>
                </dialog>
                `;
        }
    }

    select(lightState) {
        this._selectedId = lightState.entity_id;
    }

    isSelected(lightState) {
        return (this._selectedId === lightState.entity_id);
    }

    selectedLightState() {
        return this._states[this._selectedId];
    }

    selectedLightEntityIds() {
        let entityIds;
        if (this._selectedId === this._lightId) {
            entityIds = [this._lightId];
            const themeId = this._theme;
            (themeId) && entityIds.push(themeId);
        } else {
            entityIds = this._structure[this._selectedId].entityIds;
        }
        return entityIds;
    }

    selectedThemeState() {
        let themeId;
        if (this._selectedId === this._lightId) {
            themeId = this._theme;
        } else {
            themeId = this._structure[this._selectedId].theme;
        }
        if (themeId) {
            return this._states[themeId];
        }
    }

    closeModal() {
        this.opened = false;
        // Optional: dispatch a custom event when closing from inside the modal
        this.dispatchEvent(new CustomEvent('modal-closed'));
    }

    _handleClose() {
        if (this.opened) {
            this.closeModal();
        }
    }

}

customElements.define("popout-window", PopoutWindow);