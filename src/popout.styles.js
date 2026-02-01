import { css } from 'lit';

export default css`
    dialog {
        padding: 20px;
        border: none;
    }

    dialog[open] {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
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
        width: 100%;
    }

    .close-button {
        font-size: 15px;
        border: none;
        background: none;
    }

    .content-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
    }

    .select-lights {
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: center;
    }

    light-control {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
    }

`;