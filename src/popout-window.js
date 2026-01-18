import { html, LitElement, css } from 'lit';
import { mdiCloseCircleOutline } from '@mdi/js';
import styles from './popout.styles.js';
import './light-inner.js';

export class PopoutWindow extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _light: { state: true }
        }
    }

    static styles = styles;

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
        return html`
        <dialog @close="${this._handleClose}">
            <div class="modal-header">
                <h1>${this.title}</h1>
                <button class="close-button" @click="${this.closeModal}" aria-label="Close modal">
                    <ha-svg-icon .path=${mdiCloseCircleOutline}"></ha-svg-icon>
                </button>
            </div>
            <div class="modal-content">
                <light-inner
                    ._light=${this._light}
                    .callService=${this.callService}
                ></light-inner>
                ${this.lights()}
            </div>
        </dialog>
        `;
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