<template>
    <v-ons-list-item modifier="longdivider" class="disable" @click="click">
        <div class="left">
            <i class="fa fa-chain-broken" aria-hidden="true"></i>
        </div>

        <div class="center">{{ group }} {{ name }}</div>

        <div class="right">
            <span class="removeFavoriteBtn" @click="removeFavorite">
                <i class="fa fa-star"></i>
            </span>
        </div>
    </v-ons-list-item>
</template>

<script>
export default {
    props: {
        favorite: {
            type: Object,
            required: true,
        }
    },

    computed: {
        group () { return this.favorite.uid.split('$')[0]; },
        uniqKey () { return this.favorite.uid.split('$')[1]; },
        name () { return this.favorite.name; },
        inFavorite () {
            return this.$store.getters['site/isInFavorite']({uid: this.favorite.uid});
        },
    },

    methods: {
        click () {
            this.$ons.notification.toast(lang('list.favorite.noData'), {timeout: 2000})
        },
        removeFavorite () {
            this.$store.commit('site/removeFavorite', this.favorite);
            this.$ons.notification.toast(lang('list.favorite.removed'), {timeout: 2000})
        },
    }
}
</script>

<style lang="scss" scoped>
    .removeFavoriteBtn {
        color: #ffbd02;
        font-size: 1.5em;
    }
</style>

