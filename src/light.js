import { html, LitElement } from 'lit';
import './light-icon.js'

export class LightComponent extends LitElement {

    _down;

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

    render() {
        const name = this._light.attributes.friendly_name;
        return html`
            <div  @click="${this.onClick}" @mouseup="${this.onUp}" @mousedown="${this.onDown}">
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

    onDown() {
        this._down = new Date().valueOf();
    }

    onUp() {
        const elapsed = new Date().valueOf() - this._down;
        if (elapsed > 1000) {
            this.onHold();
        }
    }

    onHold() {
        const entityId = this._light.entity_id;
        const data = {
            entity_id: "light.kitchen_pantry_light",
        }
        this.callService('light', 'turn_on', data)
    }

}

customElements.define("light-component", LightComponent);