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
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    h1 {
        font-weight: 400;
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

    .content-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
    }

    .modal-content {
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: center;
    }

    brightness-bar {
        position: relative;
        border: solid 1px #e5e5e5;
        margin-left: 20px;
        height: 200px;
        width: 30px;
        border-radius: 12px;
    }
`;