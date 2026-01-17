import { html, LitElement } from 'lit';
import './light-icon.js';
import styles from './panel.styles';

export class LightComponent extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
        }
    }

    constructor() {
        super();
    }

    getStyle() {
        let result;
        if (this._light.state === "off") {
            result = `
                color: #44739e;
            `
        } else {
            result = `
                color: #ffc107;;
            `
        }
        return result;
    }

    isBrightness() {
        const result = this._light.attributes.brightness;
        return (!(result === undefined))
    }

    // pull styles
    static styles = styles;

    render() {
        const name = this._light.attributes.friendly_name;
        console.log(name, this.isBrightness());
        return html`
            <div  class="light-element" @click=${this.onClick}>
                <light-icon ._light=${this._light}></light-icon>
                ${name}
            </div>
        `
    }

    onClick() {
        const entityId = this._light.entity_id;
        const data = {
            entity_id: entityId,
        }
        this.callService('light', 'toggle', data)
    }

}

customElements.define("light-inner", LightComponent);