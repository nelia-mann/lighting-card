import { html, LitElement } from 'lit';



export class BrightnessBar extends LitElement {

    static get properties() {
        return {
            _light: {state: true}
        }
    }

    render() {
        return html`
            <div>PING</div>
        `
    }

}

customElements.define("brightness-bar", BrightnessBar);