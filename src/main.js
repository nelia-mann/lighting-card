import { html, LitElement } from 'lit';
import styles from './main.styles.js';
import "./panel.js";

export class MainCard extends LitElement {

    // private properties:
    _hass;

    // internal reactive states
    static get properties() {
        return {
            _floor: { state: true },
            _lighting: { state: true },
            _floors: { state: true },
        };
    }

    // initializes clocktype in constructor
    constructor() {
        super();
        this._floor = "main_floor";
    }

    // establish config information for card
    setConfig() {
    }

    set hass(hass) {
        this._hass = hass;
        this.setFloors();
        this.setLighting();
    }

    setFloors() {
        const floorObjects = this._hass.floors;
        const floors = Object.keys(floorObjects);
        let lighting = {};
        floors.forEach((str) => {
            lighting[str] = { solo: {}, groups: {}};
        })
        this._lighting = lighting;
        this._floors = floorObjects;
    }

    getAreas() {
        return this._hass.areas;
    }

    getSelects() {
        const entities = this._hass.states;
        let selects = [];
        Object.values(entities).forEach((entity) => {
            if (entity.entity_id.substring(0, 7) === "select.") {
                selects.push(entity);
            }
        })
        return selects;
    }

    getLightEntities() {
        const entities = this._hass.entities;
        let lightEntities = [];
        let selects = this.getSelects();
        Object.entries(entities).forEach(([key, value]) => {
            if (key.substring(0, 6) === "light.") {
                const light_id = value.entity_id.substring(6);
                selects.forEach((select) => {
                    if (select.entity_id.includes(light_id)) {
                        value.select = select
                        console.log(value);
                    }
                })
                lightEntities.push(value)
            }
        })
        return lightEntities;
    }

    getLightingGroups() {
        const entities = this.getLightEntities();
        let groups = [];
        entities.forEach((entity) => {
            if (entity.platform === "group") {
                groups.push(entity)
            }
        })
        return groups;
    }

    getIndividualLightEntities() {
        return this.getLightEntities().filter((entity) => entity.platform != "group" )
    }

    isInGroup(entity) {
        let result = false;
        const groupEntities = this.getLightingGroups();
        const entityId = entity.entity_id;
        groupEntities.forEach(group => {
            const groupId = group.entity_id;
            const members = this._hass.states[groupId].attributes.entity_id;
            members.includes(entityId) && (result = true);
        })
        return result;
    }

    getSoloLightEntities() {
        const individualLights = this.getIndividualLightEntities();
        const soloLights = individualLights.filter((light) => !this.isInGroup(light))
        return soloLights;
    }

    addSoloLights() {
        const entities = this.getSoloLightEntities();
        const areas = this.getAreas();
        entities.forEach((entity) => {
            const areaId = entity.area_id;
            if (areaId) {
                const floorId = areas[areaId].floor_id;
                const entityId = entity.entity_id;
                const state = { ... this._hass.states[entityId] };
                this._lighting[floorId]["solo"][entityId] = state;
            }
        })
    }

    addGroupedLights() {
        const groups = this.getLightingGroups();
        const areas = this.getAreas();
        groups.forEach((group) => {
            const areaId = group.area_id;
            if (areaId) {
                const floorId = areas[areaId].floor_id;
                const groupId = group.entity_id;
                const memberIds = this._hass.states[groupId].attributes.entity_id;
                const memberStates = memberIds.map((id) => {
                    const stateDictionary = { ... this._hass.states[id] };
                    return stateDictionary;
                })
                let state = { ... this._hass.states[groupId] };
                state.members = memberStates;
                this._lighting[floorId]["groups"][groupId] = state;
            }

        })
    }

    setLighting() {
        this.addSoloLights();
        this.addGroupedLights();
    }

    // fix me
    prettyFloor(floor) {
        let floorObject = this._floors[floor];
        return floorObject.name;
    }

    getOnTot(floor) {
        let lights = this._lighting[floor];
        let on = 0;
        let tot = 0;
        Object.values(lights.solo).forEach((light) => {
            if (light.state === "on") {
                on = on + 1;
            }
            tot = tot + 1;
        })
        Object.values(lights.groups).forEach((group) => {
            group.members.forEach((light) => {
                if (light.state === "on") {
                    on = on + 1;
                }
                tot = tot + 1;
            })
        })
        return [on, tot];
    }

    setScale(a, b, t, T) {
        let result = a;
        if (T > 0) {
            result = a + ((b - a) * t / T);
        }
        return Math.floor(result);
    }

    getRGB(floor, op) {
        const onTot = this.getOnTot(floor);
        const red = this.setScale(158, 255, onTot[0], onTot[1]);
        const green = this.setScale(158, 193, onTot[0], onTot[1]);
        const blue = this.setScale(158, 7, onTot[0], onTot[1]);
        return `rgba(${red}, ${green}, ${blue}, ${op})`
    }

    getStyle(floor) {
        let result;
        if (this.isFloor(floor)) {
            result = `
                background-color: ${this.getRGB(floor, .5)};
                outline: solid ${this.getRGB(floor, 1)};
                outline-offset: -4px;
            `
        } else {
            result = `
                background-color: ${this.getRGB(floor, .5)};
            `
        }
        return result;
    }

    floorButton(floor) {
        const onTot = this.getOnTot(floor);
        return html`
            <button
                class="button ${floor}"
                style="${this.getStyle(floor)}"
                id="${floor}"
                @click="${this.onClick}"
            >
            <h1> ${this.prettyFloor(floor)} <h1>
            <p> ${onTot[0]}/${onTot[1]} lights on </p>
            </button>
        `
    }

    isNone(floor) {
        let result = '';
        if (this.getOnTot(floor)[1] === 0) {
            result = 'none';
        }
        return result;
    }

    floorButtons() {
        const floors = Object.keys(this._floors);
        return floors.map((floor) => (this.floorButton(floor)));
    }

    // pull styles
    static styles = styles;

    // return html
    render() {
        return html`
            <ha-card>
                <div class="content-row">
                    ${this.content()}
                </div>
                <div class="button-row">
                    ${this.floorButtons()}
                </div>
            </ha-card>
        `;
    }

    // deals with click
    onClick(e) {
        this._floor = e.currentTarget.id;
    }

    content() {
        return html`
            <panel-component
                ._lights = ${this._lighting[this._floor]}
                .callService=${this._hass.callService}
            ></panel-component>
        `;
    }

    isFloor(floor) {
        return this._floor === floor;
    }

    // set card size parameters for ha
    getCardSize() {
        return 4;
    }

    getGridOptions() {
        return {
            rows: 6,
            columns: 21,
            min_rows: 6,
            max_rows: 6
        }
    }

}