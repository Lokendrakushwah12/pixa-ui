import React from 'react';

const ButtonV1 = ({ title, color, textColor, icon, disabled }) => {
    // Default background color
    const bgColor = color ? color : '#212121';
    const txtColor = textColor ? textColor : '#f0f0f0';

    const { h, s, l } = hexToHSL(bgColor);
    const borderColor = HSLToHex(h, s, l - 10);

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group';

    return (
        <div className={`relative ${disabledStyles}`}>
            <div style={{ borderColor, backgroundColor: bgColor }} className="border rounded-[8px]">
                <div className="border-t p-2 flex items-center justify-center gap-1 border-[#ffffff80] rounded-[7px]">
                    <div className="absolute w-3/4 h-2 bg-white rounded-full blur-lg opacity-75 group-hover:opacity-0 -translate-x-1/2 -translate-y-1/2 left-1/2 transition-all"></div>
                    <h3 className={`rounded-[7px] text-[${txtColor}] transition-all font-[500] text-[16px] leading-[19px]`}>
                        {title}
                    </h3>
                    {/* arrow right icon */}
                    {icon !== 0 && icon && (
                        <div className="h-5 w-5 text-[#ffffff80] group-hover:text-[#ffffff] transition-all">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.42999 4L15.5 10.07L9.42999 16.14" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                                <path d="M4 10.0699L15 10.0699" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ButtonV1;


const hexToHSL = (H) => {
    // Convert hex to RGB
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
};

const HSLToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    if (r.length === 1) r = "0" + r;
    if (g.length === 1) g = "0" + g;
    if (b.length === 1) b = "0" + b;

    return `#${r}${g}${b}`;
};

