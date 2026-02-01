import { css } from 'lit';

export default css`

    popout-window {
    }

    .light-element {
        width: 205px;
        height: 25px;
        padding: 10px;
        padding-top: 8px;
        padding-bottom: 5px;
        margin: 10px;
        touch-action: none;
        display: flex;
        flex-flow: row nowrap;
    }

    .light-element.true {
        outline: solid rgb(255, 193, 7);
        outline-offset: -4px;
    }

    .light-element.member {
        width: 155px;
        margin-left: 35px;
    }

    .icons {
        margin-right: 10px;
        margin-left: 0px;
        display: flex;
        flex-flow: row nowrap;
    }


`;