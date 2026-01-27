import { html, LitElement } from 'lit';
import styles from './theme.styles.js';



export class ThemeSelect extends LitElement {

    static get properties() {
        return {
            _light: { state: true },
            _option: { state: true}
        }
    }

    constructor() {
        super();
    }

    static styles = styles;

    firstUpdated() {
        this._option = this.getValue();
    }

    onClick(e) {
        const newOption = e.target.id;
        this._option = newOption;
        this.dispatchEvent(new CustomEvent('change', { detail: newOption }))
    }

    getValue() {
        return this._light.attributes.select.state;
    }

    getOptions() {
        const optionList = this._light.attributes.select.attributes.options;
        return optionList;
    }

    isSelected(option) {
        return (option === this._option);
    }

    listOptions() {
        const optionList = this.getOptions();
        return optionList.map((option) => {
            return html`<div
                class="option ${this.isSelected(option)}"
                id="${option}"
                @click=${this.onClick}
             >
                ${option}
            </div>`
        })
    }

    render() {
        return html`
            <div class="select-panel">
                ${this.listOptions()}
            </div>
        `
    }

}

customElements.define("theme-select", ThemeSelect);