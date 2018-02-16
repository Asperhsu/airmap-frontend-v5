<template>
    <div class="meter">
        <div class="inner">
            <div class="bar" :style="{background: barGradient}"></div>
            <div class="pointer" :style="pointerPosition">
                <div class="arrow-down"></div>
                <div class="line"></div>
                <div class="value">{{ value }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getTypeColors} from '@/services/indicator';

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
            range () {
                return this.getRange(this.indicatorColors);
            },
            barGradient () {
                let colors = [];
                this.indicatorColors.map((level, index) => {
                    if (index == (this.indicatorColors.length - 1)) {
                        colors.push(`${level.color}`);
                        return;
                    }

                    if (index == 0) {
                        colors.push(`${level.color}`);
                    }

                    let percent = this.getPercent(level.max);
                    colors.push(`${level.color} ${percent}%`);
                });
                colors = colors.join(', ');

                return `linear-gradient(to right, ${colors})`;
            },
            pointerPosition () {
                let min = 0;
                let max = 90;
                let percent = this.getPercent(this.value);

                if (percent > 50) {
                    return {right: (100 - percent)+'%'};
                }
                return {left: percent+'%'};
            },
        },
        methods: {
            getPercent(value) {
                let range = this.range.max - this.range.min;
                let percent = Math.round(((value - this.range.min) / range) * 100);

                if (percent < 0) { percent = 0; }
                if (percent > 100) { percent = 100; }

                return percent;
            },
            getRange(colors) {
                let last = colors[colors.length-1];
                let max = last.max === Infinity ? last.min * 1.3 : last.max;

                return {
                    min: colors[0].min,
                    max: max,
                };
            },
        }
    }
</script>

<style lang="scss" scoped>
    .meter { height: 60px; overflow: hidden; }

    .inner { position: relative; }

    .bar {
        height: 23px;
        border-radius: 8px;
        margin: 10px 2% 0 3px;
        box-shadow: 0px 3px 5px grey;
    }

    .pointer {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: absolute;
        top: -8px;

        .arrow-down {
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;

            border-top: 10px solid #C90000;
        }

        .line {
            width: 2px;
            height: 27px;
            background-color: #fff;
            box-shadow: 0px 0px 3px #000;
        }

        .value {
            border: 1px solid #000;
            padding: 2px;
            font-size: .7em;
            border-radius: 5px;
        }
     }

</style>