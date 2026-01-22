import { html, LitElement } from 'lit';
import { mdiCloseCircleOutline, mdiImageFilterHdrOutline } from '@mdi/js';
import styles from './popout.styles.js';
import './light-inner.js';
import './brightness-bar.js'

export class PopoutWindow extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _light: { state: true },
            _bLightId: { state: true },
            ctLightId: { state: true }
        }
    }

    constructor() {
        super();
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

    getBLight() {
        if (this._bLightId === this._light.entity_id) {
            return this._light;
        }
        else {
            const lights = this._light.members;
            let result;
            lights.forEach((light) => {
                if (this._bLightId === light.entity_id) {
                    result = light;
                }
            })
            return result;
        }
    }

    brightnessBar() {
        let result = html``;
        if (this._bLightId) {
            result = html`<brightness-bar
                    ._light=${this.getBLight()}
                    .callService=${this.callService}
                ></brightness-bar>`
        }
        return result;
    }

    isBSelected(light) {
        return (this._bLightId === light.entity_id);
    }

    isCtSelected(light) {
        return (this._ctLightId === light.entity_id);
    }

    render() {
        // console.log(this._bLight)
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
        if (this._bLightId === light.entity_id) {
            this._bLightId = null;
        } else {
            this._bLightId = light.entity_id;
            this._ctLightId = null;
        }
    }

    ctSelected(light) {
        if (this._ctLightId === light.entity_id) {
            this._ctLightId = null;
        } else {
            this._ctLightId = light.entity_id;
            this._bLightId = null;
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