import { html, LitElement } from 'lit';
import styles from './panel.styles.js';
import sharedStyles from './shared-styles.js';
import './light.js';

export class PanelComponent extends LitElement {

    _areas = {};
    _structure = {};
    _entityIds = [];
    _changedEntityIds = new Set();
    _initialized = false;

    static get properties() {
        return {
            _floorId: { state: true },
            _states: { state: true}
        }
    }

    update(changedProps) {
        super.update(changedProps);
        this._initialized = true;
    }

    hasRelevantChanges() {
        return this._entityIds.some((entityId) => (this._changedEntityIds.has(entityId)))
    }

    shouldUpdate(changedProps) {
        return (!this._initialized || this.hasRelevantChanges() || changedProps.has("_floorId") > 0)
    }

    getAreaName(areaId) {
        return this._areas[areaId].name;
    }

    getLightDisplay(lightId, lightStructure) {
        const lightStates = this.getStates(lightId, lightStructure);
        const lightEntityIds = this.getEntityIds(lightId, lightStructure);
        return html`
            <light-component
                class="outlined"
                ._lightId = ${lightId}
                ._structure = ${lightStructure}
                ._entityIds = ${lightEntityIds}
                ._changedEntityIds = ${this._changedEntityIds}
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
            return this.getLightDisplay(lightId, lightStructure)
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
        return html`${this.getAreaDisplays()}`
    }

}

customElements.define("panel-component", PanelComponent);