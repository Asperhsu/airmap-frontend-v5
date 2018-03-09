<template>
    <div id="indicator-vertical" v-show="show">
        <div class="unit">{{ unit }}</div>

        <div class="levels">
            <div v-for="(level, index) in levels" :key="index">
                <div class="level">
                    <div class="color" :style="{ 'background-color': level.color }"></div>
                    <div class="value">
                        {{ level.max === Infinity ? '' : level.max }}
                    </div>
                </div>
            </div>
        </div>

        <div class="type">{{ typeName }}</div>
    </div>
</template>

<style lang="scss" scoped>
    #indicator-vertical{
        position: absolute;
        bottom: 30px;
        left: 5px;
        z-index: 2;
        opacity: 1;
        cursor: default;
        display:flex;
        flex-direction: column;
        padding: .5em .3em;
        border-radius: 8px;
        font-weight: bold;
        color: #ccc;

        .type {
            text-shadow: 0px 0px 3px #000, 0px 0px 5px #000;
            font-size: 0.75em;
            word-break: break-all;
            line-height: 1em;
            margin-top: .4em;
        }

        .unit {
            font-style: italic;
            font-size: 0.6em;
            margin-bottom: .5em;
            text-shadow: 0px 0px 3px #000, 0px 0px 5px #000;
        }

        .levels {
            display: flex;
            flex-direction: column-reverse;
            margin-left: .1em;
        }

        .level {
            display: flex;
            font-size: .7em;
            position: relative;

            .color {
                width: 1.2rem;
                height: 1.2rem;
                box-shadow: 0px 0px 3px #ccc, 0px 0px 5px #ccc;
            }

            .value {
                margin-top: -.7em;
                margin-left: .5em;
                text-shadow: 0px 0px 3px #000, 0px 0px 5px #000;
            }
        }
    }
</style>

<script>
    import * as service from '@/services/indicator';
    let typesName = {
        'PM2.5_NASA': "NASA",
        'Temperature': "Temp.",
        'Humidity': "RH",
    };

    export default {
        name: 'indicator',
        computed: {
            show () {
                return this.$store.state.map.showIndicator;
            },
            type () {
                return this.$store.getters['app/getIndicatorType'];
            },
            typeName () {
                return typesName.hasOwnProperty(this.type) ? typesName[this.type] : this.type;
            },
            unit () {
                return service.getUnit(this.type);
            },
            levels () {
                return service.getTypeColors(this.type);
            }
        }
    }
</script>

