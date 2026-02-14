import { html, LitElement } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import styles from './area.styles.js';
import sharedStyles from './shared-styles.js';
import './light.js';

export class AreaPanel extends LitElement {

    _structure = {};
    _name;
    _entityIds = [];
    _initialized = false;
    _ready = false;

    static get properties() {
        return {
            _states: { state: true },
            _changedEntityIds: { state: true }
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
        return (!this._intialized) || this.hasRelevantChanges()
    }

    getAreaName() {
        return this._name;
    }

    getLightDisplay(lightId) {
        const lightStructure = this._structure[lightId].structure;
        const lightTheme = this._structure[lightId].theme;
        return html`
            <light-component
                class="outlined"
                ._lightId = ${lightId}
                ._structure = ${lightStructure}
                ._theme = ${lightTheme}
                ._entityIds = ${this._entityIds}
                ._changedEntityIds = ${this._changedEntityIds}
                ._states = ${this._states}
                .callService=${this.callService}
            ></light-component>
        `
    }

    getEntityIds(lightId) {
        const lightStructure = this._structure[lightId].structure;
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

    static styles = [sharedStyles, styles];

    render() {
        const title = this.getAreaName();
        const lightIds = Object.keys(this._structure);
        return html`
            <div class="small-heading">${title}</div>
            ${repeat(lightIds, (lightId) => lightId, lightId => this.getLightDisplay(lightId))}
        `
    }

}

customElements.define("area-panel", AreaPanel);