import { css } from 'lit';

export default css`

    .select-panel {
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-items: center;
        border: solid 1px #e5e5e5;
        border-radius: 12px;
        margin-left: 15px;
        width: 550px;
        height: 280px;
    }

    .option {
        border: solid 1px #e5e5e5;
        border-radius: 6px;
        padding: px;
        margin: 3px;
        width: 100px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .option.true {
        outline: solid rgb(255, 193, 7);
        outline-offset: -3px;
    }

    .option:hover {
        background: rgba(255, 193, 7, .1);
    }

`;