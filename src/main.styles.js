import { css } from 'lit';

export default css`
    ha-card {
        font-family: "Roboto", "Noto", sans-serif;
        font-weight: 400;
        padding: 3%;
        margin: 0px;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }

    .button-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 24%;
        margin: 0px;
        padding: 0px;
    }

    .button {
        border-radius: 12px;
        height: 100%;
        width: 22%;
        padding: 0px;
        border-width: 0px;
    }

    h1 {
        font-weight: 600;
        font-size: 100%;
        margin: 0px;
        padding: 0px;
    }

    p {
        padding: 0px;
        margin: 0px;
        font-weight: 400;
        font-size: 100%;
    }

    @media (prefers-color-scheme: dark) {
        ha-card {
            color: #ffffff;
        }

        .button {
            color: #ffffff;
        }
    }
`;