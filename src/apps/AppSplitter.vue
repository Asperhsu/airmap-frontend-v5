<template>
    <v-ons-splitter>
        <v-ons-splitter-side side="left" collapse="" width="260px" :open.sync="isOpenLeft">
            <slot name="menuLeft"></slot>
        </v-ons-splitter-side>

        <v-ons-splitter-side side="right" collapse="" width="260px" :open.sync="isOpenRight">
            <slot name="menuRight"></slot>
        </v-ons-splitter-side>

        <v-ons-splitter-content>
            <slot></slot>
        </v-ons-splitter-content>
    </v-ons-splitter>
</template>

<script>
    export default {
        methods: {
            toggleLeft (flag) {
                this.isOpenLeft = typeof flag == undefined ? !this.isOpenLeft : flag;
            },
            toggleLeft (flag) {
                this.isOpenRight = typeof flag == undefined ? !this.isOpenRight : flag;
            },
        },
        data () {
            return {
                //
            }
        },
        computed: {
            isOpenLeft: {
                get() {
                    return this.$store.state.splitter.leftopen;
                },
                set(newValue) {
                    this.$store.commit('splitter/toggleLeft', newValue)
                }
            },
            isOpenRight: {
                get() {
                    return this.$store.state.splitter.rightopen;
                },
                set(newValue) {
                    this.$store.commit('splitter/toggleRight', newValue)
                }
            },
        },
    }
</script>

