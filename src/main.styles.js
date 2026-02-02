import { css } from 'lit';

export default css`
    ha-card {
        padding: 25px;
        padding-top: 15px;
        margin: 0px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        height: 500px;
        width: 900px;
    }

    panel-component {
        width: 100%;
        height: 400px;
        margin: 0px;
        padding: 0px;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .button-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 50px;
        margin: 0px;
        padding: 0px;
    }

    .button {
        height: 100%;
        width: 200px;
        padding: 0px;
        border: none;
    }


`;