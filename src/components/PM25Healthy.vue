<template>
    <div class="health-effects" v-if="suggestion"
        :style="style">
        {{ lang(suggestion.healthEffect.lang) }}
    </div>
</template>

<script>
    import {getSuggestion} from '@/services/indicator'

    export default {
        props: {
            value: {
                type: Number,
                required: true,
            },
            indicatorType: {
                type: String,
                required: true,
            },
            useBorder: {
                type: Boolean,
                default: true,
            },
        },

        computed: {
            suggestion () {
                return getSuggestion(this.indicatorType, this.value);
            },
            style () {
                return this.useBorder ? {
                            'background-color': this.suggestion.healthEffect.bgColor,
                            'color': this.suggestion.healthEffect.color
                        } : {
                            'border': '1px solid ' + this.suggestion.healthEffect.bgColor
                        };
            }
        },
    }
</script>

<style lang="scss">
    .health-effects {
        padding: .3rem;
        margin: .3rem 0;
        border-radius: .3em;
        font-size: .8rem;
    }
</style>