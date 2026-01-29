import { html, LitElement } from 'lit';
import { mdiLightbulb, mdiLightbulbOff, mdiLightbulbGroup, mdiLightbulbGroupOff } from '@mdi/js';

export class LightIcon extends LitElement {

    static get properties() {
        return {
            _lightBundle: { state: true }
        }
    }

    isOn() {
        return (this._lightBundle.state.state === "on");
    }

    lightbulb() {
        let lightbulb;
        if (this._lightBundle.members) {
            (this.isOn()) ? (lightbulb = mdiLightbulbGroup) : (lightbulb = mdiLightbulbGroupOff);
        } else {
            (this.isOn()) ? (lightbulb = mdiLightbulb) : (lightbulb = mdiLightbulbOff);
        }
        return lightbulb;
    }

    getBrightness() {
        return (this._lightBundle.state.attributes.brightness);
    }

    getOpacity() {
        let opacity = 1;
        if (this.getBrightness()) {
            opacity = this.getBrightness() / 255;
        }
        return opacity;
    }

    getRGB() {
        return (this._lightBundle.state.attributes.rgb_color);
    }

    getColor() {
        let rgb = [68, 115, 158];
        if (this.isOn()) {
            if (this.getRGB()) {
                rgb = this.getRGB();
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
        if (this._lightBundle) {
            return html`
                <ha-svg-icon .path=${this.lightbulb()} style="${this.getStyle()}"></ha-svg-icon>
            `
        }
    }

}

customElements.define("light-icon", LightIcon);