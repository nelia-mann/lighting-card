import { interpolateRGB, rgba, OFFLIGHT, ONLIGHT, HALFLIGHT } from './color-util.js';

function isOn(lightBundle) {
    return (lightBundle.state.state === "on");
}

function getRGB(lightBundle) {
    return (lightBundle.state.attributes.rgb_color);
}

function getBrightness(lightBundle) {
    let brightness = 1;
    if (lightBundle.state.attributes.brightness) {
        brightness = lightBundle.state.attributes.brightness / 255;
    }
    return brightness;
}

function getColor(lightBundle) {
    let rgb = OFFLIGHT;
    if (isOn(lightBundle)) {
        if (getRGB(lightBundle)) {
            rgb = interpolateRGB(HALFLIGHT, getRGB(lightBundle), getBrightness(lightBundle));
        } else {
            rgb = interpolateRGB(HALFLIGHT, ONLIGHT, getBrightness(lightBundle));
        }
    }
    return rgba(rgb, 1)
}

export {
    isOn,
    getColor
}