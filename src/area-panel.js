import { html, LitElement } from 'lit';
import styles from './panel.styles.js';
import sharedStyles from './shared-styles.js';
import './light.js';
import { mdiTagPlus } from '@mdi/js';

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

}

customElements.define("area-panel", AreaPanel);