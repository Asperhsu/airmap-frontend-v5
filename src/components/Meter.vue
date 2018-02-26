<template>
    <div class="meter">
        <div class="inner">
            <div class="indicator-type">{{ indicatorType }}</div>
            <div class="bar" :style="{background: barGradient}"></div>
            <div class="pointer" :style="pointerPosition">
                <div class="arrow-down" :style="{'border-top-color': arrowColor}"></div>
                <div class="value">{{ Math.round(value) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getTypeColors, getTypeColor, ColorBar, generateColorBar} from '@/services/indicator';

    export default {
        props: {
            indicatorType: {
                type: String,
                required: true,
            },
            value: {
                type: Number,
                required: true,
            },
        },
        computed: {
            indicatorColors () {
                return getTypeColors(this.indicatorType);
            },
            barGradient () {
                let colors = generateColorBar(this.indicatorType).map(level => {
                    return `${level.color} ${level.percent}%`
                }).join(', ');

                return `linear-gradient(to right, ${colors})`;
            },
            pointerPosition () {
                let {min, max} = ColorBar.getRange(this.indicatorColors);
                let percent = ColorBar.getPercent(min, max, this.value);

                if (percent > 50) {
                    return {right: (100 - percent)+'%'};
                }
                return {left: percent+'%'};
            },
            arrowColor () {
                return getTypeColor(this.indicatorType, this.value);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .meter { height: 50px; overflow: hidden; margin: 5px 0; }

    .inner { position: relative; }

    .indicator-type {
        font-size: .75em;
        color: #999;
        text-align: right;
        margin-right: 2%;
    }

    .bar {
        height: 23px;
        border-radius: 11px;
        margin: 0px 2% 0 3px;
        box-shadow: 0px 3px 5px grey;
    }

    .pointer {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: absolute;
        top: 8px;

        .arrow-down {
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;

            border-top-width: 10px;
            border-top-style: solid;
        }

        .value {
            border: 1px solid #000;
            padding: 2px 5px;
            margin-top: 1px;
            font-size: .7em;
            border-radius: 5px;
            background: rgba(255,255,255,.8);
        }
     }

</style>