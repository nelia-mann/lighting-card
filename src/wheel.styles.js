import { css } from 'lit';

export default css`

    .wheel {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .wheel-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-image: radial-gradient(circle at center, white 0%, transparent 100%), var(--grad);
    }

    .dot {
        position: absolute;
        top: var(--top);
        left: var(--left);
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
        border-radius: 50%;
        background: var(--color);
    }

`;