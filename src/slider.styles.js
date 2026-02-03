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
        height: 100%;
        margin: 5px;
        width: 30px;
        padding-top: 6%;
    }

    .inner-slider {
        position: relative;
        height: 89%;
        width: 100%;
        border-top: solid 2px rgba(0, 0, 0, .2);
        border-bottom: solid 2px rgba(0, 0, 0, .2);
    }

    .actual-slider {
        position: absolute;
        opacity: 0;
        top: 0;
        left: 0;
        width: 100%;
        writing-mode: vertical-lr;
        direction: rtl;
        height: 100%;
    }

    .shown-slider {
        position: absolute;
        top: 0%;
        left: 0%;
        width: 100%;
        height: 100%;
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



    .bottom-box {
        position: absolute;
        bottom: 5%;
    }

    .bottom-value {
        margin-bottom: -10px;
    }

    .top-box {
        position: absolute;
        bottom: 94%;
    }

    .top-value {
        margin-bottom: -10px;
    }

    .current-box {
        position: absolute;
        bottom: var(--height);
        left: 0px;
    }

    .current-value {
        margin-bottom: -10px;
    }

`;