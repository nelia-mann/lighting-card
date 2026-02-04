import { css } from 'lit';

const _TOPMARGIN = 10;
const _BOTTOMMARGIN = 0;

export default css`

    .values {
        height: 100%;
        width: 35px;
        padding-top: ${_TOPMARGIN + 25}%;
    }

    .inner-values {
        position: relative;
        height: ${100 - _TOPMARGIN - _BOTTOMMARGIN}%;
        width: 100%;
    }

    .slider {
        height: 100%;
        width: 30px;
        margin-left: 5px;
        padding-top: ${_TOPMARGIN}%;
    }

    .inner-slider {
        position: relative;
        height: ${100 - _TOPMARGIN - _BOTTOMMARGIN}%;
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

    .shown-level {
        position: absolute;
        left: -10%;
        width: 120%;
        height: 2%;
        background: rgba(0, 0, 0, 1);
}

    .bottom-value {
        position: absolute;
        bottom: 0%;
        right: 0px;
    }

    .top-value {
        position: absolute;
        bottom: 100%;
        right: 0px;
    }

    .current-value {
        position: absolute;
        left: 5px;
    }

`;