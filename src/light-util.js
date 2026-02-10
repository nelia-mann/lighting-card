import { interpolateRGB, rgba, OFFLIGHT, ONLIGHT, HALFLIGHT } from './color-util.js';

function isOn(lightState) {
    return (lightState.state === "on");
}

function getRGB(lightState) {
    return (lightState.attributes.rgb_color);
}

function getBrightness(lightState) {
    let brightness = 1;
    if (lightState.attributes.brightness) {
        brightness = lightState.attributes.brightness / 255;
    }
    return brightness;
}

function getColor(lightState) {
    let rgb = OFFLIGHT;
    if (isOn(lightState)) {
        if (getRGB(lightState)) {
            rgb = interpolateRGB(HALFLIGHT, getRGB(lightState), getBrightness(lightState));
        } else {
            rgb = interpolateRGB(HALFLIGHT, ONLIGHT, getBrightness(lightState));
        }
    }
    return rgba(rgb, 1)
}

export {
    isOn,
    getColor
}