const types = ['PM2.5', 'AQI', 'PM2.5_NASA', 'Temperature', 'Humidity'];

const units = {
    'PM2.5': 'μg/m3',
    'AQI': '',
    'PM2.5_NASA': 'μg/m3',
    'Temperature': '℃',
    'Humidity': '%',
};

const colors = {
    'AQI': [
        { min:0, max: 50, color:'#00E800' },
        { min:51, max: 100, color:'#FFFF00' },
        { min:101, max: 150, color:'#FF7E00' },
        { min:151, max: 200, color:'#FF0000' },
        { min:201, max: 300, color:'#8F3F97' },
        { min:301, max: 500, color:'#7E0023' },
    ],
    'PM2.5': [
        { min:0, max: 11, color:'#9CFF9C' },
        { min:12, max: 23, color:'#31FF00' },
        { min:24, max: 35, color:'#31CF00' },
        { min:36, max: 41, color:'#FFFF00' },
        { min:42, max: 47, color:'#FFCF00' },
        { min:48, max: 53, color:'#FF9A00' },
        { min:54, max: 58, color:'#FF6464' },
        { min:59, max: 64, color:'#990000' },
        { min:65, max: 70, color:'#990000' },
        { min:71, max: Infinity, color:'#CE30FF' },
    ],
    'PM2.5_NASA': [
        { min:0, max: 3, color:'#0000CC' },
        { min:4, max: 5, color:'#0133CC' },
        { min:6, max: 8, color:'#0166FF' },
        { min:9, max: 10, color:'#0099FF' },
        { min:11, max: 13, color:'#32CBFE' },
        { min:14, max: 15, color:'#65FE9A' },
        { min:16, max: 18, color:'#99FF66' },
        { min:19, max: 20, color:'#CCFF33' },
        { min:21, max: 35, color:'#FFFF01' },
        { min:36, max: 50, color:'#FF9933' },
        { min:51, max: 65, color:'#FF3301' },
        { min:66, max: 80, color:'#C90000' },
        { min:81, max: Infinity, color:'#800000' },
    ],
    'Temperature': [
        { min:0, max: 20, color:'#B9E6F6' },
        { min:21, max: 25, color:'#4BAC66' },
        { min:26, max: 30, color:'#F0E389' },
        { min:31, max: 40, color:'#B6023C' },
    ],
    'Humidity': [
        { min:0, max: 20, color:'#FAC090' },
        { min:21, max: 40, color:'#76B531' },
        { min:41, max: 60, color:'#B7DEE8' },
        { min:61, max: Infinity, color:'#215968' },
    ],
};


export const isTypeExist = (type) => {
    return types.indexOf(type) > -1;
}

export const getUnit = (type) => {
    return isTypeExist(type) ? units[type] : null;
}

export const getSupportTypes = () => {
    return types;
}

export const getTypeColors = type => {
    return isTypeExist(type) ? colors[type] : null;
}

export const getTypeColor = (type, value) => {
    if (isNaN(value) || value === 0) {
        return 'transparent';
    }

    const colors = getTypeColors(type);
    if (!colors) { return null; }

    var level = colors.filter(function(level) {
        return value >= level.min && value <= level.max;
    });

    return level && level[0] && level[0].color ? level[0].color : 'transparent';
}

export const ColorBar = {
    getRange: function (colors) {
        let last = colors[colors.length-1];
        let max = last.max === Infinity ? last.min * 1.3 : last.max;

        return {
            min: colors[0].min,
            max: max,
        };
    },
    getPercent: function(min, max, value) {
        let range = max - min;
        let percent = Math.round(((value - min) / range) * 100);

        if (percent < 0) { percent = 0; }
        if (percent > 100) { percent = 100; }

        return percent;
    },
};
export const generateColorBar = (type, maxValue) => {
    if (!isTypeExist(type)) {
        console.log(`${type} is not support`); return;
    }

    let colors = getTypeColors(type);
    let {min, max} = ColorBar.getRange(colors);

    // when give max value, only include level color when level value le maxvalue
    if (maxValue) { max = maxValue; }

    // prevent multiple 100 percent to be added
    let reach100 = false;

    let colorbar = [];
    colors.map(level => {
        ['min', 'max'].map(index => {
            let percent = ColorBar.getPercent(min, max, level[index]);

            if (!reach100) {
                colorbar.push({
                    percent: percent,
                    color: level.color,
                });
            }

            if (percent >= 100) { reach100 = true; }
        });
    });

    return colorbar;
}

export const hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export const rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const suggestion = {
    meta: {
        normalHumanTitle: '一般民眾活動建議',
        sensitiveHumanTitle: '敏感性族群活動建議',
        'PM2.5-Datasource': {
            text: '行政院環保署細懸浮微粒(PM2.5)指標對照表與活動建議 (連結失效)',
            link: 'http://taqm.epa.gov.tw/taqm/tw/fpmi.aspx',
        },
        'AQI-Datasource': {
            text: '行政院環境保護署空氣品質指標',
            link: 'https://taqm.epa.gov.tw/taqm/tw/b0201.aspx',
        }
    },

    'PM2.5': [
        {
            humanType: 'normal',
            levels: [
                {min: 0, max: 53, words: ['正常戶外活動']},
                {min: 54, max: 70, words: ['任何人如果有不適，如眼痛，咳嗽或喉嚨痛等，應該考慮減少戶外活動']},
                {min: 71, max: 999, words: ['任何人如果有不適，如眼痛，咳嗽或喉嚨痛等，應減少體力消耗，特別是減少戶外活動']},
            ],
        },
        {
            humanType: 'sensitive',
            levels: [
                {min: 0, max: 35, words: ['正常戶外活動']},
                {min: 36, max: 53, words: ['有心臟、呼吸道及心血管疾病的成人與孩童感受到癥狀時，應考慮減少體力消耗，特別是減少戶外活動']},
                {min: 54, max: 70, words: [
                    '有心臟、呼吸道及心血管疾病的成人與孩童，應減少體力消耗，特別是減少戶外活動',
                    '老年人應減少體力消耗',
                    '具有氣喘的人可能需增加使用吸入劑的頻率',
                ]},
                {min: 71, max: 999, words: [
                    '有心臟、呼吸道及心血管疾病的成人與孩童，以及老年人應避免體力消耗，特別是避免戶外活動',
                    '具有氣喘的人可能需增加使用吸入劑的頻率',
                ]},
            ]
        }
    ],

    'AQI': [
        {
            humanType: 'normal',
            levels: [
                {min: 0, max: 100, words: ['正常戶外活動']},
                {min: 101, max: 150, words: [
                    '一般民眾如果有不適，如眼痛，咳嗽或喉嚨痛等，應該考慮減少戶外活動',
                    '學生仍可進行戶外活動，但建議減少長時間劇烈運動'
                ]},
                {min: 151, max: 200, words: [
                    '一般民眾如果有不適，如眼痛，咳嗽或喉嚨痛等，應減少體力消耗，特別是減少戶外活動',
                    '學生應避免長時間劇烈運動，進行其他戶外活動時應增加休息時間',
                ]},
                {min: 201, max: 300, words: [
                    '一般民眾應減少戶外活動',
                    '學生應立即停止戶外活動，並將課程調整於室內進行',
                ]},
                {min: 301, max: 500, words: [
                    '一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具',
                    '學生應立即停止戶外活動，並將課程調整於室內進行',
                ]},
            ]
        },
        {
            humanType: 'sensitive',
            levels: [
                {min: 0, max: 50, words: ['正常戶外活動']},
                {min: 51, max: 100, words: ['極特殊敏感族群建議注意可能產生的咳嗽或呼吸急促症狀，但仍可正常戶外活動']},
                {min: 101, max: 150, words: [
                    '有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，必要外出應配戴口罩',
                    '具有氣喘的人可能需增加使用吸入劑的頻率'
                ]},
                {min: 151, max: 200, words: [
                    '有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內並減少體力消耗活動，必要外出應配戴口罩',
                    '具有氣喘的人可能需增加使用吸入劑的頻率'
                ]},
                {min: 201, max: 500, words: [
                    '有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，必要外出應配戴口罩',
                    '具有氣喘的人應增加使用吸入劑的頻率'
                ]},
            ]
        }
    ],
}

export const getSuggestion = function (type, value) {
    if (!suggestion.hasOwnProperty(type)) {
        console.log(`${type} suggestion not defined`); return;
    }

    let words = {};

    suggestion[type].map(item => {
        item.levels.map(level => {
            if (value >= level.min && value <= level.max) {
                words[item.humanType] = level.words;
            }
        })
    });

    return {
        meta: {
            normalHumanTitle: suggestion.meta.normalHumanTitle,
            sensitiveHumanTitle: suggestion.meta.sensitiveHumanTitle,
            datasource: suggestion.meta[`${type}-Datasource`],
        },
        words: words
    };
}