import { css } from 'lit';

export default css`

    .wheel-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: solid 1px #e5e5e5;
        background-image: radial-gradient(circle at center, white 0%, transparent 100%), var(--grad);
    }

`;