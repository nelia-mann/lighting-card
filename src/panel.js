import { html, LitElement } from 'lit';
import styles from './panel.styles.js';
import sharedStyles from './shared-styles.js';
import './light.js';

export class PanelComponent extends LitElement {

    _areas = {};
    _structure = {};
    _entityIds = [];
    _changedEntityIds = new Set();

    static get properties() {
        return {
            _states: { state: true }
        }
    }

    getAreaName(areaId) {
        return this._areas[areaId].name;
    }

    getLightDisplay(lightId, lightStructure, lightStates) {
        return html`
            <light-component
                class="outlined"
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
        const areaComponents = Object.keys(areaStructure).map((lightId) => {
            const lightStructure = areaStructure[lightId];
            const lightStates = this.getStates(lightId, lightStructure)
            return this.getLightDisplay(lightId, lightStructure, lightStates)
        })
        return html`
            <div class="area">
                <div class="small-heading">${title}</div>
                ${areaComponents}
            </div>`
    }

    getAreaDisplays() {
        return Object.keys(this._structure).map((areaId) =>
            (this.getAreaDisplay(areaId)))
    }

    static styles = [sharedStyles, styles];

    render() {
        console.log(this._entityIds);
        console.log(this._changedEntityIds);
        return html`${this.getAreaDisplays()}`
    }

}

customElements.define("panel-component", PanelComponent);