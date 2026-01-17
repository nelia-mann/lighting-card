import { html, LitElement, css } from 'lit';
import { mdiCloseCircleOutline } from '@mdi/js';

export class PopoutWindow extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: {type: String}
        }
    }

    static styles = css`
        dialog {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            /* Backdrop styling using ::backdrop pseudo-element */
        }

        dialog[open] {
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
        }

        dialog::backdrop {
            background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px;
            margin-top: -10px;
            background: none;
            padding-top: none;
            padding-bottom: none;
            height: 40px;
        }

        .close-button {
            background: none;
            font-size: 15px;
            padding: none;
            cursor: pointer;
            margin-left: 20px;
            margin-right: -30px;
            border: none;
        }

        .modal-content {
            width: 100%;
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: center;
        }

    `;

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
                <!-- Content is passed via <slot> -->
                <slot></slot>
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
        // Sync property if closed via the native Esc key
        if (this.opened) {
        this.opened = false;
        }
    }

}

customElements.define("popout-window", PopoutWindow);