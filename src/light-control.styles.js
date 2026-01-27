import { css } from 'lit';

export default css`

    .control-column {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: center;
        border: solid 1px #e5e5e5;
        border-radius: 12px;
        margin-left: 10px;
    }

    .icon {
        width: 30px;
        height: 30px;
        border: solid 1px #e5e5e5;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
    }

    .icon.onoff {
    }

    .icon.brightness {
        background: rgba(255, 193, 7, .2);∂
    }

    .icon.true {
        outline: solid rgb(0,0,0);
        outline-offset: -3px;
    }

    .icon.ct {
        overflow: hidden;
        background: var(--grad);
    }

    .icon.hs {
        overflow: hidden;
        background-image: radial-gradient(circle at center, white 0%, transparent 100%), var(--grad);
    }

    .icon.select {
        background: rgba(255, 193, 7, .2);
    }


    slider-bar {
        position: relative;
        width: 25px;
        height: 150px;
        border: none;
        margin-left: 20px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    color-wheel {
        position: relative;
        width: 150px;
        height: 150px;
        border: none;
        margin-left: 20px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

`;