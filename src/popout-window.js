import { html, LitElement } from 'lit';
import { mdiCloseCircleOutline } from '@mdi/js';
import styles from './popout.styles.js';
import './light-inner.js';
import './brightness-bar.js'

export class PopoutWindow extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _light: { state: true },
            _bLight: { state: true }
        }
    }

    constructor() {
        super();
        this._bLight = null;
    }

    static styles = styles;

    lights() {
        const lights = this._light.members;
        let result = html``;
        if (lights) {
            result = lights.map((light) => {
                return html`
                    <light-inner
                        id=${light}
                        ._light=${light}
                        .callService=${this.callService}
                        @bSelected=${() => this.bSelected(light)}
                        ._isBSelected=${this.isBSelected(light)}
                    ></light-inner>
                    `
                })
        }
        return result;
    }

    brightnessBar() {
        let result = html``;
        if (this._bLight) {
            result = html`<brightness-bar
                    ._light=${this._bLight}
                    .callService=${this.callService}
                ></brightness-bar>`
        }
        return result;
    }

    isBSelected(light) {
        return (this._bLight === light)
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
                <div class="modal-content">
                    <light-inner
                        ._light=${this._light}
                        .callService=${this.callService}
                        @bSelected=${() => this.bSelected(this._light)}
                        ._isBSelected=${this.isBSelected(this._light)}
                    ></light-inner>
                    ${this.lights()}
                </div>
                ${this.brightnessBar()}
            </div>
        </dialog>
        `;
    }

    bSelected(light) {
        if (this._bLight === light) {
            this._bLight = null;
        } else {
            this._bLight = light;
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