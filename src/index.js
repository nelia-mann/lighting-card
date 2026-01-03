import { MainCard } from "./main.js";

customElements.define( "my-lighting-card", MainCard );

window.customCards = window.customCards || [];
window.customCards.push({
    type: "my-lighting-card",
    name: "my lighting card",
    description: "Lighting Card",
});