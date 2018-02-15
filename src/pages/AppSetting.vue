<template>
    <v-ons-page>
        <BasicToolbar>個人化設定</BasicToolbar>

        <v-ons-list-title>量測指標</v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item v-for="(measure, index) in measures" :key="measure.name" tappable>
                <label class="left">
                    <v-ons-radio
                        :input-id="'measureradio-' + index"
                        :value="measure.name"
                        v-model="checkedMeasures"
                    >
                    </v-ons-radio>
                </label>
                <label class="center" :for="'measureradio-' + index">
                    {{ measure.text }}
                </label>
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
                measures: [
                    {name: 'pm25', text: 'Pm2.5'},
                    {name: 'pm25 AQI', text: 'Pm2.5 AQI'},
                ],
                checkedMeasures: 'pm25',
            };
        }
    };
</script>

<style lang="scss" scoped>
    .list-title { font-size: 1.2em; padding: .5em 0; text-align: center; }
</style>
