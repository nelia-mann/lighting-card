import { html, LitElement } from 'lit';
import styles from './panel.styles.js';
import './light.js';

export class PanelComponent extends LitElement {

    _areas;

    static get properties() {
        return {
            _lightBundles: { state: true }
        }
    }

    constructor() {
        super();
    }

    static styles = styles;

    getAreaName(areaId) {
        return this._areas[areaId].name;
    }

    getAreaBundles(areaId) {
        return this._lightBundles[areaId];
    }

    getAreaDisplay(areaId) {
        const title = this.getAreaName(areaId);
        const areaBundles = this.getAreaBundles(areaId);
        const areaComponents = Object.values(areaBundles).map((lightBundle) => {
            return html`
                <light-component
                    ._light=${lightBundle.state}
                    .callService=${this.callService}
                ></light-component>
            `
        })
        return html`
            <div class="area">
                <h1>${title}</h1>
                ${areaComponents}
            </div>`
    }

    getAreaDisplays() {
        return Object.keys(this._lightBundles).map((areaId) =>
            (this.getAreaDisplay(areaId)))
    }

    render() {
        return html`
            <div class="panel">
                ${this.getAreaDisplays()}
            </div>
        `
    }

}

customElements.define("panel-component", PanelComponent);