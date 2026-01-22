import { css } from 'lit';

export default css`

    light-component {
    }

    light-inner {
    }

    .light-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }

    .brightness-icon {
        margin-left: 10px;
        width: 30px;
        height: 30px;
        border: solid 1px #e5e5e5;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .brightness-icon.true {
        outline: solid rgb(255, 193, 7);
        outline-offset: -4px;
    }

    .ct-icon {
        margin-left: 10px;
        width: 30px;
        height: 30px;
        border: solid 1px #e5e5e5;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--grad);
    }

    .hs-icon {
        margin-left: 10px;
        width: 30px;
        height: 30px;
        border: solid 1px #e5e5e5;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .light-element {
        border: solid 1px #e5e5e5;
        width: 215px;
        border-radius: 12px;
        height: 21px;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin: 7px;
    }

    light-group-component {
        border: solid 1px #e5e5e5;
        border-radius: 12px;
        height: 25px;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin: 10px;
    }

    light-group-inner {
        border: solid 1px #e5e5e5;
        border-radius: 12px;
        height: 25px;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin: 10px;
    }

    .panel {
        width: 100%;
        height: 82%;
        display: flex;
        flex-flow: row wrap;
    }

    .light-element {
        touch-action: none;
    }
`;