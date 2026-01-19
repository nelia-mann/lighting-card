import { css } from 'lit';

export default css`

    input[type="range"] {
        position: absolute;
        top: 5%;
        left: 0%;
        writing-mode: vertical-lr;
        direction: rtl;
        height: 95%;
        opacity: 0;
    }

    .background-bar {
        position: absolute;
        top: 5%;
        left: 0%;
        width: 100%;
        height: 95%;
        border-radius: 12px;
    }

    .filled {
        height: var(--height);
        background-color: rgb(255, 193, 7);
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .empty {
        height: var(--depth);
        background-color: none;
        border-radius: 12px;
    }


`;