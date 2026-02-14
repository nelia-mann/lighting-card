import { html, LitElement } from 'lit';
import styles from './panel.styles.js';
import sharedStyles from './shared-styles.js';
import './light.js';
import './area-panel.js';

export class FloorPanel extends LitElement {

    _structure = {};
    _entityIds = [];
    _changedEntityIds = new Set();
    _initialized = false;

    static get properties() {
        return {
            _floorId: { state: true },
            _states: { state: true }
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
        return this._structure[areaId].name;
    }

    getAreaDisplays() {
        return Object.keys(this._structure).map((areaId) => {
            const title = this.getAreaName(areaId);
            const areaStructure = this._structure[areaId].structure;
            return html`
                <area-panel
                    ._structure = ${areaStructure}
                    ._name = ${title}
                    ._states = ${this._states}
                    ._changedEntityIds = ${this._changedEntityIds}
                    ._entityIds = ${this._entityIds}
                ></area-panel>
            `
        })
    }

    static styles = [sharedStyles, styles];

    render() {
        return html`${this.getAreaDisplays()}`
    }

}

customElements.define("floor-panel", FloorPanel);