import { html, LitElement } from 'lit';
import { mdiCloseCircleOutline } from '@mdi/js';
import styles from './popout.styles.js';
import './light-inner.js';
import './slider.js';
import './light-control.js';

export class PopoutWindow extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _lightBundle: { state: true },
            _lightId: { state: true },
        }
    }

    constructor() {
        super();
    }

    firstUpdated() {
        this.defaultSelect();
    }

    static styles = styles;

    innerLight(lightBundle) {
        if (lightBundle) {
            return html`
                <light-inner
                    id=${lightBundle.state.entity_id}
                    ._lightBundle=${lightBundle}
                    ._isSelected=${this.isSelected(lightBundle)}
                    @select=${() => this.select(lightBundle)}
                ></light-inner>
            `
        }
    }

    lights() {
        const lightBundles = this._lightBundle.members;
        let result = html``;
        if (lightBundles) {
            result = Object.values(lightBundles).map((lightBundle) => {
                return this.innerLight(lightBundle)
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
        return html`
        <dialog @close="${this._handleClose}">
            <div class="modal-header">
                <h1>${this.title}</h1>
                <button class="close-button" @click="${this.closeModal}" aria-label="Close modal">
                    <ha-svg-icon .path=${mdiCloseCircleOutline}"></ha-svg-icon>
                </button>
            </div>
            <div class="content-row">
                <div class="select-lights">
                    ${this.innerLight(this._lightBundle)}
                    ${this.lights()}
                </div>
                ${this.lightControl()}
            </div>
        </dialog>
        `;
    }

    defaultSelect() {
        if (!(this._lightId)) {
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