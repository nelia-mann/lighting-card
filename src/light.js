import { html, LitElement } from 'lit';
// import styles from './light.styles';

export class LightComponent extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
            _key: { state: true }
        }
    }

    constructor() {
        super();
    }

    // static styles = styles;

    render() {
        console.log(this._key)
        return html`
            <div>
                Ping
            </div>
        `
    }

}

customElements.define("light-component", LightComponent);