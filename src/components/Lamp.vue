<template>
    <div class="lamp">
        <div class="left">
            <div class="color" :style="{'background-color': color}"><slot></slot></div>
        </div>
        <div class="right">
            <div class="title">{{ title }}</div>
            <div class="line"></div>
            <div class="value">{{ valueInt }}<span class="unit">{{ unit }}</span></div>
        </div>
    </div>
</template>

<script>
    import {getTypeColor, getUnit} from '@/services/indicator';

    export default {
        props: {
            title: {
                type: String,
                default: '',
            },
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
            color () {
                return getTypeColor(this.indicatorType, this.valueInt);
            },
            unit () {
                return getUnit(this.indicatorType);
            },
            valueInt () {
                return Math.round(this.value);
            },
        },
    }
</script>

<style lang="scss" scoped>
    .lamp {
        display: flex;
        align-items: stretch;
        padding: .4rem 0;

        .left {
            flex-grow: 3;
            margin-right: .8rem;

            .color {
                width: 100%;
                height: 100%;
                border-radius: .3em;
                box-shadow: -2px 2px 8px #666;
                margin-left: 5px;

                display: flex;
                align-items: center;
            }
        }

        .right {
            flex-grow: 1;

            .title {
                font-size: .7em;
            }

            .line {
                height: 1px;
                background-image: linear-gradient(left, rgba(100, 100, 100, 1), rgba(140, 140, 140, 0.5) 30%, rgba(175, 175, 175, 0) 90%);
            }

            .value {
                font-size: 1.2em;
                font-weight: bold;

                .unit {
                    font-size: .3em;
                    color: #888;
                    width: 2em;
                    line-height: 1em;
                    display: inline-block;
                    word-break: break-all;
                    padding-left: 3px;
                }
            }
        }
    }

    .color-right {
        flex-direction: row-reverse;

        .right {
            text-align: right;
            margin-right: .9rem;

            .line {
                background-image: linear-gradient(right, rgba(100, 100, 100, 1), rgba(140, 140, 140, 0.5) 30%, rgba(175, 175, 175, 0) 90%);
            }
        }
    }
</style>