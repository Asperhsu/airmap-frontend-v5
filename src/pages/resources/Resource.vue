<template>
    <v-ons-page>
        <BasicToolbar>{{ lang('resource.title') }}</BasicToolbar>

        <v-ons-list-title>{{ lang('resource.tools.title') }}</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-tachometer" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a href="https://airmap.g0v.asper.tw/widget" target="_blank">{{ lang('resource.tools.widget') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <fa :icon="['fab', 'facebook-messenger']" style="color: #0099FD;"/>
                </div>
                <div class="center">
                    <a href="https://m.me/g0vairmap" target="_blank">{{ lang('resource.tools.messenger') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
        </v-ons-list>


        <v-ons-list-title>{{ lang('resource.links.title') }}</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item tappable modifier="chevron" @click="openRecruit">
                <div class="left">
                    <i class="fa fa-sign-in" aria-hidden="true"></i>
                </div>
                <div class="center">
                    {{ lang('resource.links.recruit') }}
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-facebook-official" aria-hidden="true" style="color: #4267B2;"></i>
                </div>
                <div class="center">
                    <a href="https://www.facebook.com/g0vairmap" target="_blank">{{ lang('resource.links.fb.g0vairmap') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-facebook-official" aria-hidden="true" style="color: #4267B2;"></i>
                </div>
                <div class="center">
                    <a href="https://www.facebook.com/groups/pm25opendata/about/" target="_blank">{{ lang('resource.links.fb.pm25opendata') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-facebook-official" aria-hidden="true" style="color: #4267B2;"></i>
                </div>
                <div class="center">
                    <a href="https://www.facebook.com/groups/1607718702812067/" target="_blank">{{ lang('resource.links.fb.lass') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
        </v-ons-list>


        <v-ons-list-title>{{ lang('resource.datasource.title') }}</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item >
                <div class="left">
                    <img :src="getLogo('lass')" style="width: 100%"/>
                </div>
                <div class="center">
                    <a href="https://pm25.lass-net.org/zh_tw/#api" target="_blank">{{ lang('resource.datasource.lass') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
            <v-ons-list-item >
                <div class="left">
                    <img :src="getLogo('edimax')" style="width: 100%"/>
                </div>
                <div class="center">
                    <a href="https://airbox.edimaxcloud.com/" target="_blank">{{ lang('resource.datasource.edimax') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
            <v-ons-list-item >
                <div class="left">
                    <img :src="getLogo('airq')" style="width: 100%"/>
                </div>
                <div class="center">
                    <a href="http://www.airq.org.tw/" target="_blank">{{ lang('resource.datasource.airq') }}</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
        </v-ons-list>


        <v-ons-list-title>{{ lang('resource.help.title') }}</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item tappable modifier="chevron" @click="openAboutus">
                <div class="left">
                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                </div>
                <div class="center">{{ lang('resource.help.g0vairmap') }}</div>
            </v-ons-list-item>
            <v-ons-list-item tappable modifier="chevron" @click="openAboutsettings">
                <div class="left">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </div>
                <div class="center">{{ lang('resource.help.setting') }}</div>
            </v-ons-list-item>
        </v-ons-list>


        <SpecialThanks />
    </v-ons-page>
</template>

<script>
    import Logo from '@/config/logo';
    import BasicToolbar from '@/components/toolbars/BasicToolbar'
    import SpecialThanks from '@/components/setting/SpecialThanks'

    import Recruit from './Recruit';
    import AboutUs from './AboutUs';
    import AboutSettings from './AboutSettings';

    export default {
        components: {BasicToolbar, SpecialThanks},

        methods: {
            getLogo (name) {
                name = name.toLowerCase();
                if (Logo.hasOwnProperty(name)) {
                    return Logo[name];
                }

                return Logo.nologo;
            },
            openRecruit () {this.$store.commit('navigator/push', Recruit); },
            openAboutus () {this.$store.commit('navigator/push', AboutUs); },
            openAboutsettings () {this.$store.commit('navigator/push', AboutSettings); },
        },
    };
</script>

<style lang="scss" src="@/assets/styles/setting-page.scss" scoped></style>
<style lang="scss" scoped>
    .left {
        max-width: 2em;

        img {
            width: 100%;
        }
    }

</style>

