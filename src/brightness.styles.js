import { css } from 'lit';

export default css`

    .slider {
        appearance: none;
        width: 25px;
        border: solid 1px #e5e5e5;
        border-radius: 12px;
        writing-mode: vertical-lr;
        direction: rtl;
        height: 150px;
        margin-left: 25px;
        background: linear-gradient(to top, rgb(255, 193, 7) var(--height), rgba(0, 0, 0, 0) var(--height))
    }

    .slider::-webkit-slider-thumb {
        appearance: none;
        opacity: 0;
    }

    .slider::-moz-range-thumb {
        appearance: none;
        opacity: 0;
    }


`;