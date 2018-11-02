<template>
    <div style="margin-bottom: 1em;">
        <v-ons-list-title>
            <v-ons-icon icon="fa-heart"></v-ons-icon>
            {{ lang('resource.specialThanks.title') }}
        </v-ons-list-title>
        <v-ons-list modifier="inset">
            <v-ons-list-item>
                <div class="left">
                    <img :src="require('@/assets/img/logo/probecube.png')" height="50px" />
                </div>
                <div class="center" style="text-align:left;">
                    {{ lang('resource.specialThanks.text') }}
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <a href="https://ocf.tw/" target="_blank">
                        <img :src="require('@/assets/img/logo/ocf.png')" height="50px" />
                    </a>
                </div>
                <div class="center" style="text-align:left;">
                    {{ lang('resource.specialThanks.ocf-text') }}
                </div>
            </v-ons-list-item>
        </v-ons-list>
    </div>
</template>

<style lang="scss" src="@/assets/styles/list.scss" scoped></style>