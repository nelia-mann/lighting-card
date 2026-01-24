import { css } from 'lit';

export default css`

    .slider {
        position: absolute;
        opacity: 0;
        top: 0;
        left: 0;
        width: 25px;
        writing-mode: vertical-lr;
        direction: rtl;
        height: 150px;
    }

    .shown-slider {
        position: absolute;
        top: 0;
        left: 0;
        width: 25px;
        height: 150px;
        border: solid 1px #e5e5e5;
        border-radius: 12px;
        background: linear-gradient(to top, rgb(255, 193, 7) var(--height), rgb(255, 193, 7, .1) var(--height));
    }


`;