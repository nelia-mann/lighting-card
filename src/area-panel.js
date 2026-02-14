import { html, LitElement } from 'lit';
import styles from './area.styles.js';
import sharedStyles from './shared-styles.js';
import './light.js';

export class AreaPanel extends LitElement {

    _structure = {};
    _name;
    _entityIds = [];
    _changedEntityIds = new Set();
    _initialized = false;
    _ready = false;

    static get properties() {
        return {
            _states: { state: true }
        }
    }

/*     update(changedProps) {
        super.update(changedProps);
        this._initialized = true;
    }

    hasRelevantChanges() {
        return this._entityIds.some((entityId) => (this._changedEntityIds.has(entityId)))
    }

    shouldUpdate(changedProps) {
        return (!this._intialized) || this.hasRelevantChanges()
    } */

    getAreaName() {
        return this._name;
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

    static styles = [sharedStyles, styles];

    render() {
        const title = this.getAreaName();
        const areaComponents = Object.keys(this._structure).map((lightId) => {
            const lightStructure = this._structure[lightId];
            return this.getLightDisplay(lightId, lightStructure)
        })
        return html`
            <div class="small-heading">${title}</div>
            ${areaComponents}
            `
    }

}

customElements.define("area-panel", AreaPanel);