const ONLIGHT = [255, 193, 7]; // color in rgb (yellow)
const HALFLIGHT = [127, 97, 3]; // should be black-ish yellow
const OFF = [158, 158, 158]; // color in rgb (gray)
const OFFLIGHT = [68, 115, 158]; // color in rgb (steel blue)
const INDIGO = [41, 0, 255]; // blue color

function getTempRed(temp) {
    let red;
    if (temp <= 6600) {
        red = 255;
    } else {
        red = (temp / 100) - 60;
        red = Math.round(329.698727446 * (red ** (-0.1332047592)));
    }
    (red < 0) && (red = 0);
    (red > 255) && (red = 255);
    return red;
}

function getTempGreen(temp) {
    let green;
    if (temp <= 6600) {
        green = temp / 100;
        green = Math.round((99.4708025861) * Math.log(green) - 161.1195681661);
    } else {
        green = (temp / 100) - 60;
        green = Math.round(288.1221695283 * (green ** (-0.0755148492)));
    }
    (green < 0) && (green = 0);
    (green > 255) && (green = 255);
    return green;
}

function getTempBlue(temp) {
    let blue;
    if (temp > 6600) {
        blue = 255;
    } else {
        if (temp <= 1900) {
            blue = 0;
        } else {
            blue = (temp / 100) - 10;
            blue = Math.round(138.5177312231 * Math.log(blue) - 305.0447927307);
        }
    }
    (blue < 0) && (blue = 0);
    (blue > 255) && (blue = 255);
    return blue;
}

function getTempColor(temp) {
    return [getTempRed(temp), getTempGreen(temp), getTempBlue(temp)]
}

function tempGradient(minTemp, maxTemp, steps) {
    let output = `linear-gradient(to top`
    for (let step = 0; step <= steps; step++) {
        const temp = (minTemp * (steps - step) + maxTemp * step) / steps;
        const rgb = getTempColor(temp);
        const result = rgba(rgb, 1);
        const percent = Math.round(step * 100 / steps);
        output = output + `, ` + result + ` ${percent}%`;
    }
    output = output + `)`;
    return output;
}

function hsGradient(steps) {
    let output = 'radial-gradient(circle at center, white 0%, transparent 100%), '
    output = output + 'conic-gradient( from 0deg'
    for (let step = 0; step <= steps; step++) {
        const angle = Math.round(step * 360 / steps);
        output = output + `, hsl(${angle}, 100%, 50%)`
    }
    output = output + `)`;
    return output;
}

function setScale(a, b, t) {
    let result = a;
    if (t > 1) {
        result = b;
    } else if (t < 0) {
        result = a
    } else {
        result = a + ((b - a) * t )
    }
    return result;
}

function rgba(rgbArray, opacity) {
    return `rgba(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}, ${opacity})`
}

function interpolateRGB(rgbA, rgbB, t) {
    const red = setScale(rgbA[0], rgbB[0], t);
    const green = setScale(rgbA[1], rgbB[1], t);
    const blue = setScale(rgbA[2], rgbB[2], t);
    return [red, green, blue]
}

export {
    tempGradient,
    hsGradient,
    interpolateRGB,
    rgba,
    getTempColor,
    OFFLIGHT,
    ONLIGHT,
    OFF,
    HALFLIGHT,
    INDIGO
}