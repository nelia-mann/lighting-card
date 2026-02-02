import { css } from 'lit';

export default css`

    * {
        font-family: "Roboto", "Noto", sans-serif;
    }

    .outlined {
        outline: .5px solid rgba(0, 0, 0, .1);
        outline-offset: .1px;
        border-radius: 10px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .small-heading {
        font-weight: 700;
        font-size: 100%;
        margin: 0px;
        padding: 0px;
    }

    .large-heading {
        font-weight: 600;
        font-size: 200%;
        margin: 0px;
        padding: 0px;
    }

    .sub-info {
        padding: 0px;
        margin: 0px;
        font-weight: 400;
        font-size: 80%;
    }

    @media (prefers-color-scheme: dark) {
        ha-card {
            color: #ffffff;
        }

        .button {
            color: #ffffff;
        }
    }

`