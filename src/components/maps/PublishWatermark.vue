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
                return this.$store.state.map.showPublishWatermark;
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
        top: 25px;
        right: 15px;
        z-index: 2;
        opacity: .8;
        cursor: default;
        color: #ccc;
        text-shadow: 0px 0px 3px #000, 0px 0px 5px #000;
        font-family: monospace;
        font-weight: bold;
        font-size: 1.1em;

        transform: rotate(-90deg);
        transform-origin: right bottom;
    }
</style>
