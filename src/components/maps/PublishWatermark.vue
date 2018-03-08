<template>
    <div class="publish-watermark" v-show="showPublishWatermark">
        {{ timeString }}
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        props: {
            timestamp: {
                required: true,
            },
            format: {
                type: String,
                default: 'YY-MM-DDTHH:mmZZ[Z]'
            },
        },

        computed: {
            showPublishWatermark () {
                return this.$store.state.app.showPublishWatermark;
            },
            timeString () {
                return moment(this.timestamp).format(this.format);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .publish-watermark {
        position: absolute;
        top: 13px;
        right: 48px;
        z-index: 2;
        opacity: 1;
        cursor: default;
        color: #000;
        text-shadow: 0px 0px 3px #fff, 0px 0px 5px #fff;
        font-family: monospace;
        font-weight: bold;
        font-size: 1.1em;
    }
</style>
