import { css } from 'lit';

export default css`

    .control-column {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: center;
        margin-left: 10px;
    }

    .icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
    }

    slider-bar {
        margin-left: 20px;
        margin-right: 10px;
        width: 115px;
        height: 150px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        padding: 20px;
    }

    color-wheel {
        position: relative;
        width: 150px;
        height: 150px;
        margin-left: 20px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    theme-select {
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-items: center;
        margin-left: 15px;
        width: 450px;
        height: 360px;
        padding: 15px;
    }

    ha-svg-icon {
        padding: 0%;
        margin: 0%;
        --mdc-icon-size: 20px;
        height: 20px;
        width: 20px;
    }

`;