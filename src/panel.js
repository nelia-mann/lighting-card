import { html, LitElement } from 'lit';
import styles from './panel.styles.js';
import sharedStyles from './shared-styles.js';
import './light.js';

export class PanelComponent extends LitElement {

    _areas;
    _structure;

    static get properties() {
        return {
            _lightBundles: { state: true },
            _states: { state: true }
        }
    }

    static styles = [sharedStyles, styles];

    getAreaName(areaId) {
        return this._areas[areaId].name;
    }

    getAreaBundles(areaId) {
        return this._lightBundles[areaId];
    }

    getLightDisplay(lightBundle) {
        return html`
            <light-component
                class="outlined"
                ._lightBundle = ${lightBundle}
                .callService=${this.callService}
            ></light-component>
        `
    }

    getAreaDisplay(areaId) {
        const title = this.getAreaName(areaId);
        const areaBundles = this.getAreaBundles(areaId);
        const areaComponents = Object.values(areaBundles).map((lightBundle) =>
            this.getLightDisplay(lightBundle))
        return html`
            <div class="area">
                <div class="small-heading">${title}</div>
                ${areaComponents}
            </div>`
    }

    getAreaDisplays() {
        return Object.keys(this._lightBundles).map((areaId) =>
            (this.getAreaDisplay(areaId)))
    }

    render() {
        return html`${this.getAreaDisplays()}`
    }

}

customElements.define("panel-component", PanelComponent);