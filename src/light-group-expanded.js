import { html, LitElement, css } from 'lit';

export class LightGroupExpanded extends LitElement {

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            title: {type: String}
        }
    }

    static styles = css`
        dialog {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        /* Backdrop styling using ::backdrop pseudo-element */
        }

        dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        }

        .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        }
    `;

    render() {
        return html`
        <dialog @close="${this._handleClose}">
            <div class="modal-header">
                <h2>${this.title}</h2>
                <button class="close-button" @click="${this.closeModal}" aria-label="Close modal">
                    &times;
                </button>
            </div>
            <div class="modal-content">
                <!-- Content is passed via <slot> -->
                <slot> Ping </slot>
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

customElements.define("light-group-expanded", LightGroupExpanded);