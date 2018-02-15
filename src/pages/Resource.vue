<template>
    <v-ons-page>
        <BasicToolbar>相關資源</BasicToolbar>

        <v-ons-list modifier="inset">
            <v-ons-list-header>Default</v-ons-list-header>

            <v-ons-list-item tappable>
                All
            </v-ons-list-item>
        </v-ons-list>
    </v-ons-page>
</template>

<script>
    import BasicToolbar from '@/components/BasicToolbar'

    export default {
        components: {BasicToolbar},
        methods: {

        },
        data() {
            return {
                //
            };
        }
    };
</script>

<style lang="scss" scoped>

</style>
