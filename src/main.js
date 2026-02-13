import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './main.styles.js';
import sharedStyles from './shared-styles.js';
import "./panel.js";
import { interpolateRGB, OFF, ONLIGHT, rgba } from './color-util.js';

export class MainCard extends LitElement {

    // private properties
    _hass;
    _floors = {};
    _areas = {};
    _structure = {};
    _entityIds = [];
    _states = {};
    _ready = false;
    _structuresBuilt = false;
    _changedEntities = false;
    _needsRender = false;
    _changedEntityIds = new Set();
    _floorCEIs = new Set();

    // internal reactive states
    static get properties() {
        return {
            _floorId: { state: true }
        };
    }

    // establish config information for card
    setConfig() {
    }

    // gets the hass, and then creates the light bundles to be passed around.
    set hass(hass) {
        const oldHass = this._hass;
        this._hass = hass;
        if (!oldHass) {
            this._changedEntities = true;
            this._needsRender = true;
            this.requestUpdate();
            return;
        }

        this._changedEntities = this.detectStateChanges(oldHass, hass);
        if (this._changedEntities) {
            this._needsRender = true;
            this.requestUpdate();
        }
    }

    update(changedProps) {
        if (!this._structuresBuilt && this._hass) {
            this.setStructures();
            this.setStates();
            this._structuresBuilt = true;
            this._needsRender = true;
        }

        if (this._changedEntities) {
            this.updateStates();
            this.setFloorCEIs();
            this._changedEntities = false;
        }
        this._ready = this._structuresBuilt && !!this._entityIds.length > 0 && this._entityIds.every(id => this._states[id]);
        super.update(changedProps);
        this._needsRender = false;
    }

    shouldUpdate(changedProps) {
        return this._needsRender || !this._structuresBuilt || changedProps.has("_floorId") > 0;
    }

    detectStateChanges(oldHass, newHass) {
        this._changedEntityIds = new Set();

        for (const id of this._entityIds ?? []) {
            const oldState = oldHass.states[id];
            const newState = newHass.states[id];

            if (!oldState || !newState) continue;

            if (
                oldState.state !== newState.state ||
                oldState.attributes.brightness !== newState.attributes.brightness ||
                oldState.attributes.rgb_color !== newState.attributes.rgb_color
            ) {
                this._changedEntityIds.add(id);
            }

        }
        return this._changedEntityIds.size > 0;
    }

    /********************************* Floor Structure ******************************/

    // returns a dictionary of dictionaries.  The outer dictionary's keys are the floor_ids.
    // the inner dictionary has floor_id and name keys.
    getHassFloors() {
        return this._hass.floors;
    }

    setFloors() {
        const hassFloors = this.getHassFloors();
        let floors = {};
        Object.entries(hassFloors).forEach(([floorId, floor]) => {
            floors[floorId] = { name: floor.name };
        })
        this._floors = floors;
    }

    getFloors() {
        return this._floors;
    }

    getFloorName(floorId) {
        const floors = this.getFloors();
        const floor = floors[floorId];
        return floor.name;
    }

    // adds the outer dictionary structure (with floor_ids as keys) to this._lightBundles
    setFloorStructure() {
        this._structure = {};
        const floors = this.getFloors();
        Object.keys(floors).forEach((floorId) => {
            this._structure[floorId] = {};
        })
    }

    /********************************* Area Structure **************************************/

    getHassAreas() {
        return this._hass.areas;
    }

    setAreas() {
        const hassAreas = this.getHassAreas();
        let areas = {};
        Object.entries(hassAreas).forEach(([areaId, area]) => {
            areas[areaId] = { name: area.name, floorId: area.floor_id }
        })
        this._areas = areas;
    }

    // returns a dictionary of dictionaries.  The outer dictionary's keys are the area_ids.
    // the inner dictionary has area_id, name, and floor_id keys.
    getAreas() {
        return this._areas;
    }

    // determines whether a given area_id corresponds to an area on a floor with a given floor id.
    isOnFloor(floorId, areaId) {
        const areas = this.getAreas();
        const area = areas[areaId];
        return (area.floorId === floorId);
    }

    // adds the second dictionary structure (with area_ids as keys) to this._lightBundles
    setAreaStructure() {
        const areas = this.getAreas();
        Object.entries(this._structure).forEach(([floorId, floorDictionary]) => {
            Object.keys(areas).forEach((areaId) => {
                (this.isOnFloor(floorId, areaId)) && (floorDictionary[areaId] = {});
            })
        })
    }

    /***************************************************************************************/

    getHassEntities() {
        return this._hass.entities;
    }

    getHassStates() {
        return this._hass.states;
    }

    getEntity(entityId) {
        const entities = this.getHassEntities();
        return entities[entityId];
    }

    getState(entityId) {
        const states = this.getHassStates();
        return states[entityId];
    }

    // returns true if the entity_id corresponds to a light object and no label conradicts this.
    isLight(entityId) {
        const entity = this.getEntity(entityId);
        const notLight = entity.labels.includes('not_light');
        return (entityId.substring(0, 6) === "light.") && (!notLight);
    }

    getLightIds() {
        const entities = this.getHassEntities();
        const lightIds = Object.keys(entities).filter((entityId) => this.isLight(entityId));
        return lightIds;
    }

    // returns true if the entity_id corresponds to a theme select object
    isTheme(entityId) {
        return ((entityId.substring(0, 7) === "select.") && (entityId.includes("theme")))
    }

    getThemeIds() {
        const entities = this.getHassEntities();
        const themeIds = Object.keys(entities).filter((entityId) => this.isTheme(entityId));
        return themeIds;
    }

    getEntityArea(entityId) {
        const entity = this.getEntity(entityId);
        return entity.area_id;
    }

    // returns true if the provided entity_id has the given area_id, false otherwise.
    isInArea(entityId, areaId) {
        return (this.getEntityArea(entityId) === areaId);
    }

    // if the provided light entity_id corresponds to valid theme entity_id, returns the theme id.  Otherwise,
    // returns null,
    getThemeId(lightId) {
        const lightIdStub = lightId.substring(6);
        const themeIds = this.getThemeIds();
        let foundId = null;
        themeIds.forEach((themeId) => {
            (themeId.includes(lightIdStub)) && (foundId = themeId);
        })
        return foundId;
    }

    hasTheme(lightId) {
        return (this.getThemeId(lightId) != null);
    }

    setThemeStructure(lightId, lightDictionary) {
        const themeId = this.getThemeId(lightId);
        lightDictionary.theme = themeId;
    }

    getGroupIds() {
        const lightIds = this.getLightIds();
        const groupIds = lightIds.filter((lightId) => {
            const entity = this.getEntity(lightId);
            return (entity.platform === "group")
        })
        return groupIds
    }

    getMemberIds(groupId) {
        const state = this.getState(groupId);
        return state.attributes.entity_id;
    }

    getAllMemberIds() {
        let memberIds = [];
        const groupIds = this.getGroupIds();
        groupIds.forEach((groupId) => {
            memberIds = [...memberIds, ...this.getMemberIds(groupId)]
        });
        return memberIds;
    }

    isInAGroup(lightId) {
        const memberIds = this.getAllMemberIds();
        return memberIds.includes(lightId);
    }

    isAGroup(lightId) {
        const groupIds = this.getGroupIds();
        return groupIds.includes(lightId);
    }

    setGroupStructure(lightId, lightDictionary) {
        const memberIds = this.getMemberIds(lightId);
        let members = {};
        memberIds.forEach((memberId) => {
            let memberDictionary = {};
            (this.hasTheme(memberId)) && (this.setThemeStructure(memberId, memberDictionary));
            members[memberId] = memberDictionary;
        })
        lightDictionary.members = members;
    }

    setLightIdStructure() {
        const lightIds = this.getLightIds();
        Object.values(this._structure).forEach((floorDict) => {
            Object.entries(floorDict).forEach(([areaId, areaDict]) => {
                lightIds.forEach((lightId) => {
                    if ((this.isInArea(lightId, areaId)) && (!this.isInAGroup(lightId))) {
                        let lightDictionary = {};
                        (this.hasTheme(lightId)) && (this.setThemeStructure(lightId, lightDictionary));
                        (this.isAGroup(lightId)) && (this.setGroupStructure(lightId, lightDictionary));
                        areaDict[lightId] = lightDictionary;
                    }
                })
            })
        })
    }

    cleanStructure() {
        Object.entries(this._structure).forEach(([floorId, floorDictionary]) => {
            Object.entries(floorDictionary).forEach(([areaId, areaDictionary]) => {
                const areaKeys = Object.keys(areaDictionary);
                if (areaKeys.length === 0) {
                    delete floorDictionary[areaId];
                }
            })
            const floorKeys = Object.keys(floorDictionary);
            if (floorKeys.length === 0) {
                delete this._structure[floorId]
            }
        })
    }

    setStructures() {
        this.setFloors();
        this.setAreas();
        this.setFloorStructure();
        this.setAreaStructure();
        this.setLightIdStructure();
        this.cleanStructure();
        this.initializeFloor();
        this.setEntityIds();
    }

    setEntityIds() {
        const lightIds = this.getLightIds();
        const themeIds = this.getThemeIds();
        this._entityIds = [...lightIds, ...themeIds];
    }

    setStates() {
        let states = {};
        this._entityIds.forEach((entityId) => {
            states[entityId] = this.getState(entityId);
        })
        this._states = states;
    }

    updateStates() {
        const changedIds = this._changedEntityIds;
        changedIds.forEach((entityId) => {
            this._states[entityId] = this._hass.states[entityId]
        })
    }

    /************************* Floor Selection Structure ***********************************************/

    getFloorId() {
        return this._floorId
    }

    setFloorId(floorId) {
        this._floorId = floorId;
    }

    // determines if the given floor id corresponds to the currently selected floor.
    isFloor(floorId) {
        return this.getFloorId() === floorId;
    }

    // sets the current floor to be the first of the listed floors.
    initializeFloor() {
        const floors = this.getFloors();
        const floorIds = Object.keys(floors);
        this.setFloorId(floorIds[0]);
    }

    getFloorStructure() {
        return this._structure[this.getFloorId()];
    }

    getFloorEntityIds() {
        const floorStructure = this.getFloorStructure();
        let entityIds = [];
        Object.values(floorStructure).forEach((areaStructure) => {
            Object.entries(areaStructure).forEach(([lightId, lightStructure]) => {
                entityIds.push(lightId);
                (lightStructure.theme) && (entityIds.push(lightStructure.theme))
                if (lightStructure.members) {
                    Object.entries(lightStructure.members).forEach(([memberId, memberStructure]) => {
                        entityIds.push(memberId);
                        (memberStructure.theme) && (entityIds.push(memberStructure.theme))
                    })
                }
            })
        })
        return entityIds;
    }

    getFloorStates() {
        const entityIds = this.getFloorEntityIds();
        let states = {};
        entityIds.forEach((entityId) => {
            states[entityId] = this._states[entityId]
        })
        return states;
    }

    setFloorCEIs() {
        const floorEntityIds = this.getFloorEntityIds();
        const changedEntityIds = this._changedEntityIds;
        let floorCEIs = new Set();
        changedEntityIds.forEach((entityId) => {
            (floorEntityIds.includes(entityId)) && (floorCEIs.add(entityId));
        })
        this._floorCEIs = floorCEIs;
    }

    getFloorCEIs() {
        return this._floorCEIs;
    }

    // deals with click to select floor.
    onClick(e) {
        this.setFloorId(e.currentTarget.id);
    }

    /************************* style and html ***********************************/

    // given a particular floor id, returns an array with the total number of lights,
    // and the number that are on.
    getLightData(floorId) {
        const floorStructure = this._structure[floorId];
        let on = 0;
        let tot = 0;
        Object.values(floorStructure).forEach((areaStructure) => {
            Object.keys(areaStructure).forEach((lightId) => {
                const lightState = this._states[lightId]
                if (lightState) {
                    tot = tot + 1;
                    (lightState.state === "on") && (on = on + 1);
                }
            })
        })
        return [on, tot];
    }

    // determines the shade of color associated with a particular floor id, based on
    // the fraction of the lights that are on.
    getRGB(floorId, opacity) {
        const onTot = this.getLightData(floorId);
        const rgb = interpolateRGB(OFF, ONLIGHT, onTot[0] / onTot[1])
        return rgba(rgb, opacity);
    }

    getStyles(floorId) {
        let styles = {
            'background-color': this.getRGB(floorId, 0.5)
        }
        if (this.isFloor(floorId)) {
            styles['outline'] = `solid ${this.getRGB(floorId, 1)}`;
            styles['outline-offset'] = '-4px';
        }
        return styles;
    }

    // generates the floor button for a particular floor id.
    floorButton(floorId) {
        const onTot = this.getLightData(floorId);
        return html`
            <button
                class="button outlined"
                style="${styleMap(this.getStyles(floorId))}"
                id="${floorId}"
                @click="${this.onClick}"
            >
                <div class="small-heading"> ${this.getFloorName(floorId)} <div>
                <div class="sub-info"> ${onTot[0]}/${onTot[1]} lights on </div>
            </button>
        `
    }

    // generates the list of floor buttons.
    floorButtons() {
        const floorIds = Object.keys(this.getFloors());
        return floorIds.map((floorId) => (this.floorButton(floorId)));
    }

    // generates panel content, based on currently selected floor.
    content() {
        return html`
            <panel-component
                ._structure = ${this.getFloorStructure()}
                ._states = ${this.getFloorStates()}
                ._areas = ${this.getAreas()}
                ._entityIds = ${this.getFloorEntityIds()}
                ._changedEntityIds = ${this.getFloorCEIs()}
                ._floorId = ${this.getFloorId()}
                .callService=${this._hass.callService}
            ></panel-component>
        `;
    }

    // pull styles
    static styles = [sharedStyles, styles];

    // return html
    render() {
        if (this._ready) {
            return html`
                <ha-card>
                    ${this.content()}
                    <div class="button-row">
                        ${this.floorButtons()}
                    </div>
                </ha-card>
            `;
        }
    }

    // set card size parameters for ha
    getCardSize() {
        return 8;
    }

    getGridOptions() {
        return {
            rows: 8,
            columns: 24,
            min_rows: 8,
            max_rows: 8
        }
    }

}