import { html, LitElement } from 'lit';
import styles from './theme.styles.js';
import sharedStyles from './shared-styles.js';
import { styleMap } from 'lit/directives/style-map.js';
import { getThemeGradient, getThemeOutline } from './theme-util.js';


export class ThemeSelect extends LitElement {

    static get properties() {
        return {
            _theme: { state: true },
            _option: { state: true }
        }
    }

    constructor() {
        super();
    }

    static styles = [sharedStyles, styles];

    onClick(e) {
        const newOption = e.target.id;
        this._option = newOption;
        this.dispatchEvent(new CustomEvent('change', { detail: newOption }))
    }

    setValue() {
        this._option = this._theme.state;
    }

    getOptions() {
        const optionList = this._theme.attributes.options;
        return optionList;
    }

    isSelected(option) {
        return (option === this._option);
    }

    getStyles(option) {
        let styles = {};
        if (this.isSelected(option)) {
            styles['outline'] = `solid ${getThemeOutline(option)}`;
            styles['outline-offset'] = '-3px;'
        }
        styles['background'] = getThemeGradient(option)
        return styles;
    }

    listOptions() {
        const optionList = this.getOptions();
        return optionList.map((option) => {
            return html`<div
                class="option outlined sub-info"
                style="${styleMap(this.getStyles(option))}"
                id="${option}"
                @click=${this.onClick}
             >
                ${option}
            </div>`
        })
    }

    render() {
        this.setValue();
        return html`
            ${this.listOptions()}
        `
    }

}

customElements.define("theme-select", ThemeSelect);