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
        z-index: 2;
        opacity: 1;
        cursor: default;

        display: flex;
        align-items: center;
        flex-wrap: nowrap;

        .header{
            color: #333;
            margin-right: 5px;
            text-shadow: 0px 2px #fff;

            .type {
                line-height: 1em;
                font-size: 0.7em;
            }

            .unit {
                line-height: 1em;
                font-style: italic;
                font-size: 0.6em;
                text-align: right;
            }
        }

        .levels {
            display: flex;

            > .level {
                font-size: 0.75em;
                color: #fff;
                text-shadow: 1px 1px #333;
                padding: 0 .35em;
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

