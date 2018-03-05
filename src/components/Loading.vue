<template>
    <v-ons-modal :visible="show">
        <p style="text-align: center">
            <v-ons-progress-circular indeterminate></v-ons-progress-circular>
            <br><br>
            {{ msg }}
        </p>
    </v-ons-modal>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            msg: {
                type: String,
                default: '',
            }
        }
    }
</script>
