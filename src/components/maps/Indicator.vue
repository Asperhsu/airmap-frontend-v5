<template>
    <div id="indicatorLevel" v-show="show">
        <div class="header">
            <div class="type">{{ type }}</div>
            <div class="unit">{{ unit }}</div>
        </div>
        <div class="levels">
            <div v-for="(level, index) in levels" :key="index"
                 class="level" :style="{ 'background-color': level.color }">
                 {{ level.max === Infinity ? level.min : level.max }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    #indicatorLevel{
        position: absolute;
        bottom: 20px;
        right: 48px;
        z-index:2;
        opacity: 1;
        height: 2em;
        text-align: center;
        cursor: default;

        .header{
            display: inline-block;
            vertical-align: middle;
            color: #fff;
            margin-right: 5px;
        }

        .type {
            line-height: 1em;
            font-size: 0.8em;
        }

        .unit {
            line-height: 1em;
            font-style: italic;
            font-size: 0.6em;
            text-align: right;
        }

        .levels {
            text-align:center;
            display: inline-block;


            > .level {
                display: inline-block;
                width: 1.8em;
                height: 1.8em;
                font-size:0.9em;
                line-height: 1.8em;
                background: red;
                color: #4F595D;
                // text-shadow: 1px 1px 0px #333, -1px -1px 0px #333,
                //             1px -1px 0px #333, -1px 1px 0px #333;
                // box-shadow: 2px 2px 2px 0px rgba(51,51,51,0.75);
            }
        }
    }
</style>

<script>
    import * as service from '@/services/indicator';

    export default {
        name: 'indicator',
        computed: {
            show () {
                return this.$store.state.map.showIndicator;
            },
            type () {
                return this.$store.getters['app/getIndicatorType'];
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

