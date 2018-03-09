<template>
    <v-ons-list-item tappable>
        <label class="center" for="showPublishWatermark">
            {{ lang('setting.showPublishWatermark') }}
        </label>
        <div class="right">
            <v-ons-switch input-id="showPublishWatermark" v-model="showPublishWatermark" />
        </div>
    </v-ons-list-item>
</template>

<script>
    export default {
        computed: {
            showPublishWatermark: {
                get () { return this.$store.state.map.showPublishWatermark; },
                set (flag) { this.$store.commit('map/setShowPublishWatermark', flag); }
            },
        }
    }
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>