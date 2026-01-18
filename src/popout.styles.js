import { css } from 'lit';

export default css`
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