import { themeLibrary } from './theme-colors.js';

function hsv_to_hsl(hsb, opacity) {
    let h = hsb[0];
    let s = hsb[1];
    let v = hsb[2];
    let l = (2 - s) * v / 2;
    if (l != 0) {
        if (l == 1) {
            s = 0;
        } else if (l < 0.5) {
            s = s * v / (l * 2);
        } else {
            s = s * v / (2 - l * 2);
        }
    }
    return `hsla(${h}, ${s * 100}%, ${l * 100}%, ${opacity})`;
}

function getThemeGradient(theme) {
    const colors = themeLibrary[theme];
    let string = '';
    if (colors) {
        const number = colors.length;
        if (number > 1) {
            string = 'linear-gradient(to left';
            colors.forEach((color, index) => {
                let hsl = hsv_to_hsl(color, .4);
                let percent = ` ${Math.round(100 * index / (number - 1))}%`
                string = string + ', ' + hsl + percent
            })
            string = string + ')'
        } else if (number === 1) {
            string = hsv_to_hsl(colors[0], .4)
        }
    }
    return string;
}

function getThemeOutline(theme) {
    const colors = themeLibrary[theme];
    let string = '';
    if ((colors) && (colors[0])) {
        string = hsv_to_hsl(colors[0], 1);
    }
    return string;
}

export { getThemeGradient, getThemeOutline }