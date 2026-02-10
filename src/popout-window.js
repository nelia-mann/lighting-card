import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { mdiCloseCircleOutline } from '@mdi/js';
import styles from './popout.styles.js';
import sharedStyles from './shared-styles.js';
import './light-control.js';
import { getColor } from './light-util.js';

export class PopoutWindow extends LitElement {

    _structure;
    _lightId;

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _lightBundle: { state: true },
            _selectedId: { state: true },
            _states: { state: true }
        }
    }

    static styles = [sharedStyles, styles];

    getStyles(lightBundle) {
        let styles = {};
        if (this.isSelected(lightBundle)) {
            styles['outline'] = 'solid ' + getColor(lightBundle.state);
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

    innerLight(lightBundle, lightId, isMember) {
        if (lightBundle) {
            const lightState = this._states[lightId];
            const name = lightState.attributes.friendly_name;
            const isGroup = this.isGroup(lightId);
            return html`
                <div
                    class="light-inner outlined ${this.header(isMember)}"
                    style=${styleMap(this.getStyles(lightBundle))}
                    id=${lightState.entity_id}
                    @click=${() => this.select(lightBundle)}
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
        if (this._lightId != entityId) {
            return false;
        } else {
            return !!this._structure.members;
        }
    }

    lights() {
        const memberIds = this._structure.members;
        const lightBundles = this._lightBundle.members;
        if (memberIds) {
            return Object.keys(memberIds).map((memberId) => {
                const lightBundle = lightBundles[memberId];
                return this.innerLight(lightBundle, memberId, true)
            })
        }
    }

    lightControl() {
        if (this.selectedLight()) {
            return html`
                <light-control
                    ._lightState = ${this.selectedLightState()}
                    ._themeState = ${this.selectedThemeState()}
                    .callService=${this.callService}
                ></light-control>
            `
        }
    }

    render() {
        this.defaultSelect();
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
                    ${this.innerLight(this._lightBundle, this._lightId, false)}
                    ${this.lights()}
                </div>
                ${this.lightControl()}
            </div>
        </dialog>
        `;
    }

    possibleIds() {
        let ids = [this._lightBundle.state.entity_id];
        if (this._lightBundle.members) {
            Object.values(this._lightBundle.members).forEach((memberBundle) => {
                ids.push(memberBundle.state.entity_id);
            })
        }
        return ids;
    }

    defaultSelect() {
        if (!this.possibleIds().includes(this._selectedId)) {
            this._selectedId = this._lightBundle.state.entity_id;
        }
    }

    select(lightBundle) {
        this._selectedId = lightBundle.state.entity_id;
    }

    isSelected(lightBundle) {
        return (this._selectedId === lightBundle.state.entity_id);
    }

    selectedLightState() {
        return this._states[this._selectedId];
    }

    selectedThemeState() {
        let themeId;
        if (this._selectedId === this._lightId) {
            themeId = this._structure.theme;
        } else {
            themeId = this._structure.members[this._selectedId].theme;
        }
        if (themeId) {
            return this._states[themeId];
        }
    }

    selectedLight() {
        if (this._selectedId === this._lightBundle.state.entity_id) {
            return this._lightBundle;
        } else if (this._lightBundle.members) {
            let result;
            Object.values(this._lightBundle.members).forEach((lightBundle) => {
                if (this._selectedId === lightBundle.state.entity_id) {
                    result = lightBundle;
                }
            })
            return result;
        }
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