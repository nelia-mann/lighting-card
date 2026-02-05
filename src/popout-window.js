import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { mdiCloseCircleOutline } from '@mdi/js';
import styles from './popout.styles.js';
import sharedStyles from './shared-styles.js';
import './light-control.js';
import { getColor } from './light-util.js';

export class PopoutWindow extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _lightBundle: { state: true },
            _lightId: { state: true },
        }
    }

    static styles = [sharedStyles, styles];

    getStyles(lightBundle) {
        let styles = {};
        if (this.isSelected(lightBundle)) {
            styles['outline'] = 'solid ' + getColor(lightBundle);
            styles['outline-offset'] = '-4px'
        }
        return styles;
    }

    header(isMember) {
        let result;
        (!isMember) && (result = 'small-heading');
        return result;
    }

    innerLight(lightBundle, isMember) {
        if (lightBundle) {
            const name = lightBundle.state.attributes.friendly_name;
            return html`
                <div
                    class="light-inner outlined ${this.header(isMember)}"
                    style=${styleMap(this.getStyles(lightBundle))}
                    id=${lightBundle.state.entity_id}
                    @click=${() => this.select(lightBundle)}
                >
                    <div class="icons">
                        <light-icon ._lightBundle=${lightBundle} ></light-icon>
                    </div>
                    ${name}
                </div>
            `
        }
    }

    lights() {
        const lightBundles = this._lightBundle.members;
        let result = html``;
        if (lightBundles) {
            result = Object.values(lightBundles).map((lightBundle) => {
                return this.innerLight(lightBundle, true)
                })
        }
        return result;
    }

    lightControl() {
        if (this.selectedLight()) {
            return html`
                <light-control
                    ._lightBundle = ${this.selectedLight()}
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
                    ${this.innerLight(this._lightBundle, false)}
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
        if (!this.possibleIds().includes(this._lightId)) {
            this._lightId = this._lightBundle.state.entity_id;
        }
    }

    select(lightBundle) {
        this._lightId = lightBundle.state.entity_id;
    }

    isSelected(lightBundle) {
        return (this._lightId === lightBundle.state.entity_id);
    }

    selectedLight() {
        if (this._lightId === this._lightBundle.state.entity_id) {
            return this._lightBundle;
        } else if (this._lightBundle.members) {
            let result;
            Object.values(this._lightBundle.members).forEach((lightBundle) => {
                if (this._lightId === lightBundle.state.entity_id) {
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