import { css } from 'lit';

export default css`

    .values {
        position: relative;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-end;
        justify-content: space-between;
        width: 35px;
    }

    .slider {
        position: relative;
        height: 100%;
        margin: 5px;
    }

    .actual-slider {
        position: absolute;
        opacity: 0;
        top: var(--margin);
        left: 0;
        width: var(--width);
        writing-mode: vertical-lr;
        direction: rtl;
        height: var(--height);
    }

    .shown-slider {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--width);
        height: 100%;
        border: solid 1px #e5e5e5;
        border-radius: 10px;
    }

    .shown-slider.brightness {
        background: linear-gradient(to top, rgb(255, 193, 7) var(--height), rgba(255, 193, 7, .1) var(--height));
    }

    .shown-slider.ct {
        background: var(--grad);
    }

    .shown-level {
        position: absolute;
        bottom: var(--height);
        left: -10%;
        width: 120%;
        height: 2%;
        background: rgba(0, 0, 0, 1);
    }

    .shown-bottom {
        position: absolute;
        bottom: var(--height);
        left: 0%;
        width: 100%;
        height: 1%;
        background: rgba(0, 0, 0, .2);
    }
    .shown-top {
        position: absolute;
        bottom: var(--height);
        left: 0%;
        width: 100%;
        height: 1%;
        background: rgba(0, 0, 0, .2);
    }

    .bottom-box {
        position: absolute;
        bottom: var(--margin);
    }

    .bottom-value {
        margin-bottom: -10px;
    }

    .top-box {
        position: absolute;
        bottom: var(--margin);
    }

    .top-value {
        margin-bottom: -10px;
    }

    .current-box {
        position: absolute;
        bottom: var(--height);
        left: var(--width);
    }

    .current-value {
        margin-bottom: -10px;
    }

`;