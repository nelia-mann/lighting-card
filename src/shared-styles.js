import { css } from 'lit';

export default css`

    * {
        font-family: "Roboto", "Noto", sans-serif;
        ---mdc-icon-size: 20px;
    }

    .small-heading {
        font-weight: 700;
        font-size: 105%;
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
        font-size: 85%;
    }

    .outlined {
        outline-offset: 0px;
        border-radius: 8px;
    }

    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .outlined {
        outline: .5px solid rgba(0, 0, 0, .1);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .inner-slider {
        border-top: solid 2px rgba(0, 0, 0, .1);
        border-bottom: solid 2px rgba(0, 0, 0, .1);
    }

    .shown-level {
        background: rgba(0, 0, 0, 1);
    }

    @media (prefers-color-scheme: dark) {
        * {
            color: #ffffff;
        }

        .outlined {
            outline: .5px solid rgba(255, 255, 255, .1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(255, 255, 255, 0.1) inset;
        }

        .inner-slider {
            border-top: solid 2px rgba(255, 255, 255, .1);
            border-bottom: solid 2px rgba(255, 255, 255, .1);
        }

        .shown-level {
            background: rgba(255, 255, 255, 1);
        }

        dialog {
            background: #2c2c2c;
        }

        .slider {
            background: #2c2c2c;
        }
    }

`