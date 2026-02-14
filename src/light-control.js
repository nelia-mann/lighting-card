import { html, LitElement } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { styleMap } from 'lit/directives/style-map.js';
import { tempGradient, getTempColor, hsGradient, rgba, ONLIGHT, INDIGO } from './color-util.js';
import { mdiBrightness6, mdiCreationOutline } from '@mdi/js';
import styles from './light-control.styles.js';
import sharedStyles from './shared-styles.js';
import './light-icon.js';
import './slider.js';
import './color-wheel.js';
import './theme-select.js';

export class LightControl extends LitElement {

    _entityIds = [];
    _TYPES = ['onOff', 'brightness', 'ct', 'hs', 'theme'];
    _MINTEMP = 1500;
    _MAXTEMP = 9000;
    _initialized = false;

    static get properties() {
        return {
            _lightState: { state: true },
            _themeState: { state: true },
            _control: { state: true },
            _changedEntityIds: { state: true }
        }
    }

    constructor() {
        super();
    }

    update(changedProps) {
        super.update(changedProps);
        this._initialized = true;
    }

    hasRelevantChanges() {
        return this._entityIds.some((entityId) => (this._changedEntityIds.has(entityId)))
    }

    shouldUpdate(changedProps) {
        return (!this._initialized
            || this.hasRelevantChanges()
            || changedProps.has("_control")
            || changedProps.has("_lightState"))
    }

    static styles = [sharedStyles, styles];

    getTempGradient() {
        const steps = 10;
        return tempGradient(this._MINTEMP, this._MAXTEMP, steps);
    }

    getTempBorder() {
        return rgba(getTempColor(this._MINTEMP), 1)
    }

    isOption(type) {
        let valid;
        let attribute;
        switch (type) {
            case 'onOff':
                valid = true;
                break;
            case 'theme':
                valid = !!(this._themeState.entity_id);
                break;
            case 'hs':
                attribute = this._lightState.attributes['hs_color'];
                valid = !(attribute === undefined);
                break;
            case 'ct':
                attribute = this._lightState.attributes['color_temp_kelvin'];
                valid = !(attribute === undefined);
                break;
            default:
                attribute = this._lightState.attributes[type];
                valid = !(attribute === undefined);
        }
        return valid;
    }

    getStyles(type) {
        let styles = {};
        switch (type) {
            case 'brightness':
                styles['background'] = rgba(ONLIGHT, .2);
                (this.isSelected(type)) && (styles['outline'] = 'solid ' + rgba(ONLIGHT, 1));
                break;
            case 'ct':
                styles['background'] = this.getTempGradient();
                (this.isSelected(type)) && (styles['outline'] = 'solid ' + this.getTempBorder());
                break;
            case 'hs':
                styles['background'] = hsGradient(10);
                (this.isSelected(type)) && (styles['outline'] = 'solid ' + rgba(INDIGO, 1));
                break;
            case 'theme':
                styles['background'] = rgba(ONLIGHT, .2);
                (this.isSelected(type)) && (styles['outline'] = 'solid ' + rgba(ONLIGHT, 1));
                break;
        }
        if (this.isSelected(type) && (type != 'onOff')) {
            styles['outline-offset'] = '-2px';
        }
        return styles;
    }

    isGroup() {
        return !!(this._lightState.attributes.entity_id)
    }

    iconContent(type) {
        let content = html``;
        switch (type) {
            case 'onOff':
                content = html`<light-icon ._state=${{ ...this._lightState }} ._isGroup=${this.isGroup()}></light-icon>`;
                break;
            case 'brightness':
                content = html`<ha-svg-icon .path=${mdiBrightness6}></ha-svg-icon>`;
                break;
            case 'theme':
                content = html`<ha-svg-icon .path=${mdiCreationOutline}></ha-svg-icon>`;
                break;
        }
        return content;
    }

    icon(type) {
        return html`
                <div
                    class="icon outlined"
                    style=${styleMap(this.getStyles(type))}
                    @click=${() => this.onSelect(type)}
                >
                    ${this.iconContent(type)}
                </div>
        `
    }

    onSelect(type) {
        if (type === 'onOff') {
            this.handleLightService('toggle', null, null);
        }
        this._control = type;
    }

    isSelected(type) {
        return (this._control === type);
    }

    handleLightService(service, key, value) {
        const entityId = this._lightState.entity_id;
        let data = { entity_id: entityId }
        if (key) {
            data[key] = value;
        }
        this.callService('light', service, data)
    }

    handleTheme(event) {
        const entityId = this._themeState.entity_id;
        const data = {
            entity_id: entityId,
            option: event.detail
        }
        this.callService('select', 'select_option', data)
    }

    brightnessBar() {
        const light = this._lightState;
        return keyed(light.entity_id, html`
            <slider-bar
                class="outlined"
                ._entityIds = ${this._entityIds}
                ._changedEntityIds = ${this._changedEntityIds}
                ._light=${{...light}}
                @change=${(e) => this.handleLightService('turn_on', 'brightness', e.detail)}
                ._max=${100}
                ._min=${0}
                ._startValue=${light.attributes.brightness * 100 / 255}
                ._type=${'brightness'}
            ></slider-bar>`)
    }

    ctBar() {
        const light = this._lightState;
        return keyed(light.entity_id, html`<slider-bar
            class="outlined"
            ._entityIds = ${this._entityIds}
            ._changedEntityIds = ${this._changedEntityIds}
            ._light=${{...light}}
            @change=${(e) => this.handleLightService('turn_on', 'color_temp_kelvin', e.detail)}
            ._max=${light.attributes.max_color_temp_kelvin}
            ._min=${light.attributes.min_color_temp_kelvin}
            ._startValue=${light.attributes.color_temp_kelvin}
            ._type=${'ct'}
        ></slider-bar>`)
    }

    colorWheel() {
        const light = this._lightState;
        return keyed(light.entity_id, html`<color-wheel
            class="outlined"
            ._entityIds = ${this._entityIds}
            ._changedEntityIds = ${this._changedEntityIds}
            ._light = ${{...light}}
            @change = ${(e) => this.handleLightService('turn_on', 'hs_color', e.detail)}
        ></color-wheel>`)
    }

    themeSelect() {
        const theme = this._themeState;
        return keyed(theme.entity_id, html`<theme-select
            class="outlined"
            ._entityIds = ${this._entityIds}
            ._changedEntityIds = ${this._changedEntityIds}
            ._theme = ${{...theme}}
            @change = ${this.handleTheme}
        ></theme-select>
        `)
    }

    controls() {
        let panel;
        switch (this._control) {
            case 'brightness':
                panel = this.brightnessBar();
                break;
            case 'ct':
                panel = this.ctBar();
                break;
            case 'hs':
                panel = this.colorWheel();
                break;
            case 'theme':
                (this._themeState) && (panel = this.themeSelect());
                break;
            default:
                panel = '';
        }
        return panel;
    }

    icons() {
        let icons = [];
        this._TYPES.forEach((type) => {
            if (this.isOption(type)) {
                icons.push(this.icon(type));
            }
        })
        return icons;
    }

    render() {
        if (this._initialized) {
            return html`
                <div class="control-column outlined">
                    ${this.icons()}
                </div>
                ${this.controls()}
            `
        }
    }

}

customElements.define("light-control", LightControl);