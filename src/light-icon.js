import { html, LitElement } from 'lit';
import { mdiLightbulb, mdiLightbulbOff, mdiLightbulbGroup, mdiLightbulbGroupOff } from '@mdi/js';

export class LightIcon extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
        }
    }

    constructor() {
        super();
    }

    lightbulb() {
        let lightbulb;
        if (this._light.members) {
            (this._light.state === "on") ? (lightbulb = mdiLightbulbGroup) : (lightbulb = mdiLightbulbGroupOff);
        } else {
            (this._light.state === "on") ? (lightbulb = mdiLightbulb) : (lightbulb = mdiLightbulbOff);
        }
        return lightbulb;
    }

    getOpacity() {
        let opacity = 1;
        if (this._light.attributes.brightness) {
            opacity = this._light.attributes.brightness / 255;
        }
        return opacity;
    }

    getColor() {
        let rgb = [68, 115, 158];
        if (this._light.state === "on") {
            if (this._light.attributes.rgb_color) {
                rgb = this._light.attributes.rgb_color;
            } else {
                rgb = [255, 193, 7];
            }
        }
        return `
            rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})
        `
    }

    getStyle() {
        const result = `
            padding: 0%;
            margin: 0%;
            color: ${this.getColor()};
            opacity: ${this.getOpacity()};
        `
        return result;
    }

    render() {
        return html`
            <ha-svg-icon .path=${this.lightbulb()} style="${this.getStyle()}"></ha-svg-icon>
        `
    }

}

customElements.define("light-icon", LightIcon);