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
        border: solid 1px #e5e5e5;
        border-radius: 50%;
        padding: 5px;
    }

    .brightness-icon.true {
        outline: solid rgb(0,0,0);
    }

    .light-element {
        border: solid 1px #e5e5e5;
        width: 210px;
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