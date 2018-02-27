<template>
    <div class="suggestion">
        <div class="normal-human">
            <div class="label-suggestion">{{ suggestion.meta.normalHumanTitle }}</div>
            <ul>
                <li v-for="word in suggestion.words.normal" :key="word">{{ word }}</li>
            </ul>
        </div>

        <div class="sensitive-human">
            <div class="label-suggestion">{{ suggestion.meta.sensitiveHumanTitle }}</div>
            <ul>
                <li v-for="word in suggestion.words.sensitive" :key="word">{{ word }}</li>
            </ul>
        </div>

        <div class="datasource">
            <div class="icon">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div class="info">
                {{ lang('suggestion.datasource') }}<br/>
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