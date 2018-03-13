<template>
    <div class="suggestion" v-if="suggestion">
        <div class="health-effects"
            :style="{'background-color': suggestion.healthEffect.bgColor, 'color': suggestion.healthEffect.color}">
            {{ suggestion.healthEffect.word }}
        </div>

        <div class="normal-human" v-show="layout === 'complex'">
            <div class="label-suggestion">{{ suggestion.meta.normalHumanTitle }}</div>
            <ul>
                <li v-for="word in suggestion.activity.normal" :key="word">{{ word }}</li>
            </ul>
        </div>

        <div class="sensitive-human" v-show="layout === 'complex'">
            <div class="label-suggestion">{{ suggestion.meta.sensitiveHumanTitle }}</div>
            <ul>
                <li v-for="word in suggestion.activity.sensitive" :key="word">{{ word }}</li>
            </ul>
        </div>

        <div class="datasource" v-show="showDatasource">
            <div class="icon">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div class="info">
                {{ lang('app.suggestion.datasource') }}<br/>
                <a class="datasource-link" target="_blank" :href="suggestion.meta.datasource.link">
                    {{ suggestion.meta.datasource.text }}
                </a>
            </div>
        </div>
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
            layout: {
                type: String,
                default: 'simple',
            },
            showDatasource: {
                type: Boolean,
                default: true,
            }
        },

        computed: {
            suggestion () {
                return getSuggestion(this.indicatorType, this.value);
            },
        },
    }
</script>

<style lang="scss">
    .health-effects {
        padding: .5em;
        border-radius: .3em;
    }

    .suggestion {
        font-size: .8em;

        > div {
            margin-bottom: .3em;
        }

        ul, ol {
            margin: 0;
            font-size: .9em;
            padding-left: 2.5em;
        }

        .label-suggestion {
            margin-top: .5em;
            margin-bottom: .3em;
            font-weight: bold;
            // border: 1px solid #999;
            // border-radius: 18px;
            padding: 3px 8px 3px 0;
        }

        .datasource {
            font-size: .8em;
            display: flex;

            .icon {
                margin-right: .5em;
            }
        }
    }
</style>