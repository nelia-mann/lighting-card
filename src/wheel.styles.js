import { css } from 'lit';

export default css`

    .wheel-background {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--scale);
        height: var(--scale);
        border-radius: 50%;
        border: solid 1px #e5e5e5;
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
        border: solid 2px #e5e5e5;
    }

`;