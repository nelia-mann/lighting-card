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
            _floors: { state: true }
        };
    }

    // initializes clocktype in constructor
    constructor() {
        super();
        this._floor = "first";
    }

    // establish config information for card
    setConfig() {
    }

    set hass(hass) {
        this._hass = hass;
        this.setFloors();
        this.setLighting();
    }

    // pull styles
    static styles = styles;

    setFloors() {
        const floorObjects = this._hass.floors;
        const floors = Object.keys(floorObjects);
        let lighting = {};
        floors.forEach((str) => {
            lighting[str] = {};
        })
        this._lighting = lighting;
        this._floors = floors;
    }

    getAreas() {
        return this._hass.areas;
    }

    setLighting() {
        const entities = this._hass.entities;
        const areas = this.getAreas();
        Object.entries(entities).forEach(([key, value]) => {
            if (value.labels.includes("lighting")) {
                const areaId = value.area_id;
                const floorId = areas[areaId].floor_id
                const light = this._hass.states[key];
                const entityId = light.entity_id;
                let labels = [...value.labels];
                labels = labels.filter((label) => label != "lighting");
                if (labels.length === 0) {
                    this._lighting[floorId][entityId] = [light]
                } else {
                    const label = labels[0];
                    if (label in this._lighting[floorId]) {
                        this._lighting[floorId][label].push(light)
                    } else {
                        this._lighting[floorId][label] = [light];
                    }
                }
            }
        })
    }

    prettyFloor(floor) {
        let output = floor.charAt(0).toUpperCase() + floor.slice(1);
        if ((output === "First") || (output === "Second")) {
            output = output + " Floor";
        }
        return output;
    }

    getOnTot(floor) {
        let lights = this._lighting[floor];
        let on = 0;
        let tot = 0;
        Object.values(lights).forEach((value) => {
            value.forEach((light) => {
                let state = light.state;
                if (state === "on") {
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
        return this._floors.map((floor) => (this.floorButton(floor)));
    }

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

    // deals with click
    onClick(e) {
        this._floor = e.currentTarget.id;
    }

    content() {
        return html`
            <panel-component
                ._lights = ${this._lighting[this._floor]}
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
            rows: 5,
            columns: 18,
            min_rows: 4,
            max_rows: 4
        }
    }

}