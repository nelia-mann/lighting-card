import { html, LitElement } from 'lit';
import { mdiLightbulb, mdiLightbulbOff, mdiLightbulbGroup, mdiLightbulbGroupOff } from '@mdi/js';
import styles from './icon.styles.js';
import { interpolateRGB, rgba, OFFLIGHT, ONLIGHT }  from './color-util.js';

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
        let brightness = 1;
        if (this._lightBundle.state.attributes.brightness) {
            brightness = this._lightBundle.state.attributes.brightness / 255;
        }
        return brightness;
    }

    getRGB() {
        return (this._lightBundle.state.attributes.rgb_color);
    }

    getColor() {
        let rgb = OFFLIGHT;
        if (this.isOn()) {
            if (this.getRGB()) {
                rgb = interpolateRGB(OFFLIGHT, this.getRGB(), this.getBrightness());
            } else {
                rgb = interpolateRGB(OFFLIGHT, ONLIGHT, this.getBrightness());
            }
        }
        return rgba(rgb, 1)
    }

    static styles = styles;

    render() {
        if (this._lightBundle) {
            return html`
                <ha-svg-icon .path=${this.lightbulb()} style="--color: ${this.getColor()}"></ha-svg-icon>
            `
        }
    }

}

customElements.define("light-icon", LightIcon);