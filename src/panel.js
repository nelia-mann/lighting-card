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

    getLightDisplay(lightBundle, lightId, lightStructure, lightStates) {
        return html`
            <light-component
                class="outlined"
                ._lightBundle = ${lightBundle}
                ._lightId = ${lightId}
                ._structure = ${lightStructure}
                ._states = ${lightStates}
                .callService=${this.callService}
            ></light-component>
        `
    }

    getEntityIds(lightId, lightStructure) {
        let entityIds = [lightId];
        (lightStructure.theme) && (entityIds.push(lightStructure.theme));
        if (lightStructure.members) {
            Object.entries(lightStructure.members).forEach(([memberId, memberStructure]) => {
                entityIds.push(memberId);
                (memberStructure.theme) && (entityIds.push(memberStructure.theme));
            })
        }
        return entityIds;
    }

    getStates(lightId, lightStructure) {
        const entityIds = this.getEntityIds(lightId, lightStructure);
        let states = {};
        entityIds.forEach((entityId) => {
            states[entityId] = this._states[entityId];
        })
        return states;
    }

    getAreaDisplay(areaId) {
        const title = this.getAreaName(areaId);
        const areaStructure = this._structure[areaId];
        const areaBundles = this.getAreaBundles(areaId);
        const areaComponents = Object.keys(areaStructure).map((lightId) => {
            const lightStructure = areaStructure[lightId];
            const lightStates = this.getStates(lightId, lightStructure)
            return this.getLightDisplay(areaBundles[lightId], lightId, lightStructure, lightStates)
        })
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