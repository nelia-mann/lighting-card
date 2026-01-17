import { html, LitElement, css } from 'lit';

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
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        }

        dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        margin: 20px;
        }

        .close-button {
        background: none;
        border: 1px solid rgb(0, 0, 0);
        border-radius: 50%;
        cursor: pointer;
        margin-left: 20px;
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
        console.log("clicked closed")
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