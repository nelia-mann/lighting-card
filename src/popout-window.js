import { html, LitElement } from 'lit';
import { mdiCloseCircleOutline } from '@mdi/js';
import styles from './popout.styles.js';
import './light-inner.js';
import './brightness-bar.js';
import './light-control.js';

export class PopoutWindow extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: { type: String },
            _light: { state: true },
            _lightId: { state: true },
        }
    }

    constructor() {
        super();
    }

    static styles = styles;

    innerLight(light) {
        return html`
            <light-inner
                id=${light}
                ._light=${light}
                ._isSelected=${this.isSelected(light)}
                @select=${() => this.select(light)}
            ></light-inner>
        `
    }

    lights() {
        const lights = this._light.members;
        let result = html``;
        if (lights) {
            result = lights.map((light) => {
                return this.innerLight(light)
                })
        }
        return result;
    }

    lightControl() {
        if (this.selectedLight()) {
            return html`
                <light-control
                    ._light = ${this.selectedLight()}
                    .callService=${this.callService}
                ></light-control>
            `
        }
    }

    render() {
        this.defaultSelect();
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
                    ${this.innerLight(this._light)}
                    ${this.lights()}
                </div>
                ${this.lightControl()}
            </div>
        </dialog>
        `;
    }

    defaultSelect() {
        if (!(this._lightId)) {
            this._lightId = this._light.entity_id;
        }
    }

    select(light) {
        this._lightId = light.entity_id;
    }

    isSelected(light) {
        return (this._lightId === light.entity_id);
    }

    selectedLight() {
        if (this._lightId === this._light.entity_id) {
            return this._light;
        } else if (this._light.members) {
            let result;
            this._light.members.forEach((light) => {
                if (this._lightId === light.entity_id) {
                    result = light;
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