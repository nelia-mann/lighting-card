import { css } from 'lit';

export default css`

    .values {
        width: 35px;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-end;
        justify-content: space-between;
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
        width: 25px;
        writing-mode: vertical-lr;
        direction: rtl;
        height: var(--height);
    }

    .shown-slider {
        position: absolute;
        top: 0;
        left: 0;
        width: 25px;
        height: var(--total);
        border: solid 1px #e5e5e5;
        border-radius: 12px;
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

    .bottom-value {
        margin-bottom: -5px;
    }

    .top-value {
        margin-top: -2px;
    }

    .current-box {
        position: absolute;
        bottom: var(--height);
        left: 35px;
    }

    .current-value {
        margin-bottom: -10px;
    }

`;