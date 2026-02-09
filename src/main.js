import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import styles from './main.styles.js';
import sharedStyles from './shared-styles.js';
import "./panel.js";
import { interpolateRGB, OFF, ONLIGHT, rgba } from './color-util.js';

export class MainCard extends LitElement {

    // private properties
    _hass;
    _entityIds;

    // internal reactive states
    static get properties() {
        return {
            _floorId: { state: true },
            _lightBundles: { state: true },
            _structure: { state: true },
            _states: { state: true }
        };
    }

    // establish config information for card
    setConfig() {
    }

    // gets the hass, and then creates the light bundles to be passed around.
    set hass(hass) {
        this._hass = hass;
        this.setLightBundles();
        this.setStructure();
        this.setEntityIds();
        this.setStates();
    }

    // upon first render, initializes the selected floor.
    firstUpdated() {
        this.initializeFloor();
    }

    // returns a dictionary of dictionaries.  The outer dictionary's keys are the floor_ids.
    // the inner dictionary has floor_id and name keys.
    getFloors() {
        return this._hass.floors;
    }

    // sets the current floor to be the first of the listed floors.
    initializeFloor() {
        const floors = this.getFloors();
        const floorIds = Object.keys(floors);
        this._floorId = floorIds[0];
    }

    // returns a dictionary of dictionaries.  The outer dictionary's keys are the area_ids.
    // the inner dictionary has area_id, name, and floor_id keys.
    getAreas() {
        return this._hass.areas;
    }

    // returns true if the entity_id corresponds to a light object and no label conradicts this.
    isLight(entity_id) {
        const entity = this._hass.entities[entity_id];
        let notLight = false;
        if (entity) {
            notLight = entity.labels.includes('not_light');
        }
        return (entity_id.substring(0, 6) === "light.") && (!notLight);
    }

    // returns true if the entity_id corresponds to a theme select object
    isTheme(entity_id) {
        return ((entity_id.substring(0, 7) === "select.") && (entity_id.includes("theme")))
    }

    getLightIds() {
        const entities = this._hass.entities;
        let lightIds = [];
        Object.keys(entities).forEach((entity_id) => {
            (this.isLight(entity_id)) && (lightIds.push(entity_id));
        })
        return lightIds;
    }

    getThemeIds() {
        const entities = this._hass.entities;
        let themeIds = [];
        Object.keys(entities).forEach((entity_id) => {
            (this.isTheme(entity_id)) && (themeIds.push(entity_id));
        })
        return themeIds;
    }

    // adds the outer dictionary structure (with floor_ids as keys) to this._lightBundles
    setFloorStructure() {
        this._structure = {};
        const floors = this.getFloors();
        Object.keys(floors).forEach((floor_id) => {
            this._structure[floor_id] = {};
        })
    }

    // determines whether a given area_id corresponds to an area on a floor with a given floor id.
    isOnFloor(floor_id, area_id) {
        const areas = this.getAreas();
        const area = areas[area_id];
        return (area.floor_id === floor_id);
    }

    // adds the second dictionary structure (with area_ids as keys) to this._lightBundles
    setAreaStructure() {
        const areas = this.getAreas();
        Object.entries(this._structure).forEach(([floor_id, floorDictionary]) => {
            Object.keys(areas).forEach((area_id) => {
                (this.isOnFloor(floor_id, area_id)) && (floorDictionary[area_id] = {});
            })
        })
    }

    getEntityArea(entity_id) {
        return this._hass.entities[entity_id].area_id;
    }

    // returns true if the provided entity_id has the given area_id, false otherwise.
    isInArea(entity_id, area_id) {
        return (this.getEntityaArea(entity_id) === area_id);
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
            const entity = this._hass.entities[lightId];
            return (entity.platform === "group")
        })
        return groupIds
    }

    getMemberIds(groupId) {
        const state = this._hass.states[groupId];
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
        Object.entries(this._structure).forEach(([floor_id, floorDictionary]) => {
            Object.entries(floorDictionary).forEach(([area_id, areaDictionary]) => {
                const areaKeys = Object.keys(areaDictionary);
                if (areaKeys.length === 0) {
                    delete floorDictionary[area_id];
                }
            })
            const floorKeys = Object.keys(floorDictionary);
            if (floorKeys.length === 0) {
                delete this._structure[floor_id]
            }
        })
    }

    setStructure() {
        this.setFloorStructure();
        this.setAreaStructure();
        this.setLightIdStructure();
        this.cleanStructure();
    }

    setEntityIds() {
        const lightIds = this.getLightIds();
        const themeIds = this.getThemeIds();
        this._entityIds = [...lightIds, ...themeIds];
    }

    setStates() {
        let states = {};
        this._entityIds.forEach((entityId) => {
            states[entityId] = this._hass.states[entityId];
        })
        this._states = states;
    }

    // returns a dictionary of dictionaries.  The outer dictionary's keys are entity_ids that
    // start with "light."  The inner dictionary has keys that include entity_id, area_id,
    // platform (wich might be "group"), and name
    getLightEntities() {
        const entities = this._hass.entities;
        let lightEntities = {};
        Object.entries(entities).forEach(([entity_id, entity_dictionary]) => {
            (this.isLight(entity_id)) && (lightEntities[entity_id] = entity_dictionary);
        })
        return lightEntities;
    }

    // returns a dictionary of dictionaries.  The outer dictionary's keys are entity_ids for lights.
    //  The inner dictionary has keys that include entity_id, state, and
    // attributes.  Attributes is, itself a dictionary which includes supported_color_mode,
    // and may include keys corresponding to brightness, hs_color, color_temp_kelvin,
    // if the light object is a group, it includes entity_id (which is an array of ids for members.)
    getLightStates() {
        const states = this._hass.states;
        let lightStates = {};
        Object.entries(states).forEach(([entity_id, state_dictionary]) => {
            (this.isLight(entity_id)) && (lightStates[entity_id] = state_dictionary)
        })
        return lightStates;
    }

    // returns a dictionary of dictionaries.  The outer dictionary's keys are entity_ids for theme select
    // objects.  The inner dictionary's keys include entity_id, state, and attributes, which is itself
    // a dictionary including the key "options".
    getThemeStates() {
        const states = this._hass.states;
        let themeStates = {};
        Object.entries(states).forEach(([entity_id, state_dictionary]) => {
            (this.isTheme(entity_id)) && (themeStates[entity_id] = state_dictionary);
        })
        return themeStates;
    }

    // adds the outer dictionary structure (with floor_ids as keys) to this._lightBundles
    setFloorStructure2() {
        this._lightBundles = {};
        this._structure = {};
        const floors = this.getFloors();
        Object.keys(floors).forEach((floor_id) => {
            this._lightBundles[floor_id] = {};
            this._structure[floor_id] = {};
        })
    }

    // determines whether a given area_id corresponds to an area on a floor with a given floor id.
    isOnFloor(floor_id, area_id) {
        const areas = this.getAreas();
        const area = areas[area_id];
        return (area.floor_id === floor_id);
    }

    // adds the second dictionary structure (with area_ids as keys) to this._lightBundles
    setAreaStructure2() {
        const areas = this.getAreas();
        Object.entries(this._lightBundles).forEach(([floor_id, floorDictionary]) => {
            Object.keys(areas).forEach((area_id) => {
                (this.isOnFloor(floor_id, area_id)) && (floorDictionary[area_id] = {});
            })
        })
        Object.entries(this._structure).forEach(([floor_id, floorDictionary]) => {
            Object.keys(areas).forEach((area_id) => {
                (this.isOnFloor(floor_id, area_id)) && (floorDictionary[area_id] = {});
            })
        })
    }

    // returns true if the provided entity_id is a light group, otherwise false.
    isGroup(entity_id) {
        const lightEntities = this.getLightEntities();
        const entityDictionary = lightEntities[entity_id];
        return (entityDictionary.platform === "group");
    }

    // returns an array of entity_ids corresponding to lights that are members of groups.
    getLightMemberIds() {
        const lightStates = this.getLightStates();
        let memberIds = [];
        Object.entries(lightStates).forEach(([entity_id, stateDictionary]) => {
            if (this.isGroup(entity_id)) {
                const theseMembers = stateDictionary.attributes.entity_id;
                memberIds = [...memberIds, ...theseMembers];
            }
        })
        return memberIds;
    }

    // returns true if the provided entity_id appears as a member of a light group, false otherwise.
    isInGroup(entity_id) {
        const lightMemberIds = this.getLightMemberIds();
        return (lightMemberIds.includes(entity_id));
    }

    // returns true if the provided entity_id has the given area_id, false otherwise.
    isInArea(entity_id, area_id) {
        const lightEntities = this.getLightEntities();
        const entityDictionary = lightEntities[entity_id];
        return (entityDictionary.area_id === area_id);
    }

    // if the provided light entity_id corresponds to valid theme entity_id, returns the theme id.  Otherwise,
    // returns null,
    getThemeId(entity_id) {
        const themeStates = this.getThemeStates();
        const lightId = entity_id.substring(6);
        const themeIds = Object.keys(themeStates);
        let foundId = null;
        themeIds.forEach((themeId) => {
            (themeId.includes(lightId)) && (foundId = themeId);
        })
        return foundId;
    }

    // finds the theme state associated with a particular light, and adds that to the light dictionary.
    addTheme(lightDictionary) {
        const themeStates = this.getThemeStates();
        const lightId = lightDictionary.state.entity_id;
        const themeId = this.getThemeId(lightId);
        lightDictionary.theme = themeStates[themeId];
    }

    addThemeId(lightId, lightDictionary) {
        const themeId = this.getThemeId(lightId);
        lightDictionary.theme = themeId;
    }

    // finds the group member states associated with a particular light group, and adds them to the
    // light dictionary.
    addMembers(lightDictionary) {
        const lightStates = this.getLightStates();
        const memberIds = lightDictionary.state.attributes.entity_id;
        lightDictionary.members = {};
        memberIds.forEach((memberId) => {
            const memberDictionary = { state: lightStates[memberId] };
            (this.getThemeId(memberId)) && (this.addTheme(memberDictionary));
            lightDictionary.members[memberId] = memberDictionary;
        })
    }

    // trawls through each floor and area, finds the lights that belong there, and creates the
    // light dictionary for each light (adding in theme and members as necessary).
    bundleLights() {
        const lightStates = this.getLightStates();
        Object.values(this._lightBundles).forEach((floorDictionary) => {
            Object.entries(floorDictionary).forEach(([area_id, areaDictionary]) => {
                Object.entries(lightStates).forEach(([entity_id, stateDictionary]) => {
                    if (this.isInArea(entity_id, area_id) && !this.isInGroup(entity_id)) {
                        let lightDictionary = { state: stateDictionary };
                        (this.isGroup(entity_id)) && (this.addMembers(lightDictionary));
                        (this.getThemeId(entity_id)) && (this.addTheme(lightDictionary));
                        areaDictionary[entity_id] = lightDictionary;
                    }
                })
            })
        })
    }

    // trawls through the this._lightBundles object and removes any areas or floors that don't have any actual lights.
    cleanStructure2() {
        Object.entries(this._lightBundles).forEach(([floor_id, floorDictionary]) => {
            Object.entries(floorDictionary).forEach(([area_id, areaDictionary]) => {
                const areaKeys = Object.keys(areaDictionary);
                if (areaKeys.length === 0) {
                    delete floorDictionary[area_id];
                }
            })
            const floorKeys = Object.keys(floorDictionary);
            if (floorKeys.length === 0) {
                delete this._lightBundles[floor_id]
            }
        })
    }

    // fully creates the this._lightBundles object.
    setLightBundles() {
        this.setFloorStructure2();
        this.setAreaStructure2();
        this.bundleLights();
        this.cleanStructure2();
    }

    // returns the bundles associated with the currently selected floor.
    getFloorBundles() {
        return this._lightBundles[this._floorId];
    }

    // given a floor id, returns the name of the floor.
    prettyFloor(floorId) {
        const floors = this.getFloors();
        const floor = floors[floorId];
        return floor.name;
    }

    // given a particular floor id, returns an array with the total number of lights,
    // and the number that are on.
    getLightData(floorId) {
        const floorDictionary = this._lightBundles[floorId];
        let on = 0;
        let tot = 0;
        Object.values(floorDictionary).forEach((areaDictionary) => {
            Object.values(areaDictionary).forEach((lightBundle) => {
                const lightState = lightBundle.state;
                tot = tot + 1;
                (lightState.state === "on") && (on = on + 1);
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
                <div class="small-heading"> ${this.prettyFloor(floorId)} <div>
                <div class="sub-info"> ${onTot[0]}/${onTot[1]} lights on </div>
            </button>
        `
    }

    // generates the list of floor buttons.
    floorButtons() {
        const floorIds = Object.keys(this.getFloors());
        return floorIds.map((floorId) => (this.floorButton(floorId)));
    }

    // pull styles
    static styles = [sharedStyles, styles];



    // return html
    render() {
        return html`
            <ha-card>
                ${this.content()}
                <div class="button-row">
                    ${this.floorButtons()}
                </div>
            </ha-card>
        `;
    }

    // deals with click to select floor.
    onClick(e) {
        this._floorId = e.currentTarget.id;
    }

    // generates panel content, based on currently selected floor.
    content() {
        if ((this.getFloorBundles()) && (this.getAreas())) {
            return html`
                <panel-component
                    ._lightBundles = ${this.getFloorBundles()}
                    ._areas = ${this.getAreas()}
                    .callService=${this._hass.callService}
                ></panel-component>
            `;
        }
    }

    // determines if the given floor id corresponds to the currently selected floor.
    isFloor(floorId) {
        return this._floorId === floorId;
    }

    // set card size parameters for ha
    getCardSize() {
        return 7;
    }

    getGridOptions() {
        return {
            rows: 7,
            columns: 24,
            min_rows: 7,
            max_rows: 7
        }
    }

}