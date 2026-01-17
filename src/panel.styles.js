import { css } from 'lit';

export default css`

    light-component {
        border: solid 1px #e5e5e5;
        border-radius: 12px;
        height: 25px;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin: 10px;
        display: flex;
        flex-flow: row nowrap;
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