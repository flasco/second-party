"use strict";
const tslib_1 = require("tslib");
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
function quert(content, instStr) {
    let $ = cheerio_1.default.load(content, { decodeEntities: false })('html');
    const insts = instStr.split('!')[0].split('@');
    while (insts.length > 1) {
        const inst = insts.shift();
        $ = formatX(inst, $);
    }
    const resX = insts[0].includes('.')
        ? formatX(insts[0], $)
        : formatLatest(insts[0], $);
    return resX;
}
function formatX(inst, $) {
    const words = inst.split('.');
    switch (words[0]) {
        case 'class': {
            const rx = $.find('.' + words[1]);
            if (words[2] != null)
                return rx.eq(words[3] || 0);
            return rx;
        }
        case 'id': {
            const rx = $.find('#' + words[1]);
            if (words[2] != null)
                return rx.eq(words[3] || 0);
            return rx;
        }
        case 'tag': {
            const rx = $.find(words[1]);
            if (words[2] != null)
                return rx.eq(words[3] || 0);
            return rx;
        }
    }
    return $;
}
function formatLatest(key, $) {
    switch (key) {
        case 'text': {
            const x = [];
            for (let i = 0; i < $.length; i++) {
                x.push(cheerio_1.default($[i]).text());
            }
            return x.join('\n');
        }
        default: {
            const result = $.attr(key);
            return result;
        }
    }
}
module.exports = quert;
//# sourceMappingURL=index.js.map