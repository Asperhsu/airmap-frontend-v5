<template>
    <v-ons-list modifier="inset">
        <v-ons-list-item tappable>
            <label class="center" for="showIndicator">
                {{ lang('map.setting.showIndicator') }}
            </label>
            <div class="right">
                <v-ons-switch input-id="showIndicator" v-model="showIndicator" />
            </div>
        </v-ons-list-item>
    </v-ons-list>
</template>

<script>
    export default {
        computed: {
            showIndicator: {
                get () { return this.$store.state.map.showIndicator; },
                set (flag) { this.$store.commit('map/setShowIndicator', flag); }
            },
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>