import { css } from 'lit';

export default css`

    .option {
        padding: 0px;
        margin: 4px;
        width: 100px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }

    .option.true {
        outline: solid rgb(255, 193, 7);
        outline-offset: -3px;
    }

    .option:hover {
        background: rgba(255, 193, 7, .1);
    }

`;