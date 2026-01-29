import { css } from 'lit';

export default css`

    .light-element {
        border: solid 1px #e5e5e5;
        width: 215px;
        border-radius: 8px;
        height: 25px;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin: 7px;
        touch-action: none;
    }

    .light-element.true {
        outline: solid rgb(255, 193, 7);
        outline-offset: -4px;
    }


`;