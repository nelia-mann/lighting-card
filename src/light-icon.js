import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { mdiLightbulb, mdiLightbulbOff, mdiLightbulbGroup, mdiLightbulbGroupOff } from '@mdi/js';
import styles from './icon.styles.js';
import { getColor, isOn }  from './light-util.js';

export class LightIcon extends LitElement {

    _isGroup;

    static get properties() {
        return {
            _lightBundle: { state: true },
            _lightState: { state: true }
        }
    }

    lightbulb() {
        let lightbulb;
        if (this._lightBundle.members) {
            (isOn(this._lightBundle)) ? (lightbulb = mdiLightbulbGroup) : (lightbulb = mdiLightbulbGroupOff);
        } else {
            (isOn(this._lightBundle)) ? (lightbulb = mdiLightbulb) : (lightbulb = mdiLightbulbOff);
        }
        return lightbulb;
    }

    getColor() {
        return getColor(this._lightBundle)
    }

    getStyles() {
        let styles = {
            "color": this.getColor()
        }
        return styles;
    }

    static styles = styles;

    render() {
        if (this._lightBundle) {
            return html`
                <ha-svg-icon .path=${this.lightbulb()} style="${styleMap(this.getStyles())}"></ha-svg-icon>
            `
        }
    }

}

customElements.define("light-icon", LightIcon);