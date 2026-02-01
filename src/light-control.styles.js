import { css } from 'lit';

export default css`

    .control-column {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: center;
        margin-left: 10px;
    }

    .icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
    }

    .icon.onoff {
    }

    .icon.brightness {
        background: rgba(255, 193, 7, .2);
    }

    .icon.true {
        outline: solid rgb(255, 193, 7);
        outline-offset: -1px;
    }

    .icon.ct {
        background: var(--grad);
    }

    .icon.hs {
        background-image: radial-gradient(circle at center, white 0%, transparent 100%), var(--grad);
    }

    .icon.select {
        background: rgba(255, 193, 7, .2);
    }


    slider-bar {
        margin-left: 20px;
        margin-right: 10px;
        width: 115px;
        height: 150px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        padding: 20px;
    }

    color-wheel {
        position: relative;
        width: 150px;
        height: 150px;
        margin-left: 20px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    theme-select {
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-items: center;
        margin-left: 15px;
        width: 450px;
        height: 360px;
        padding: 15px;
    }

`;