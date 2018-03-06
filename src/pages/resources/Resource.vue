<template>
    <v-ons-page>
        <BasicToolbar>{{ lang('menu.resource') }}</BasicToolbar>

        <v-ons-list-title>工具</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-tachometer" aria-hidden="true"></i>
                </div>
                <div class="center">
                    <a href="https://airmap.g0v.asper.tw/widget" target="_blank">Widget 小工具</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>todo
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <fa :icon="['fab', 'facebook-messenger']" style="color: #0099FD;"/>
                </div>
                <div class="center">
                    <a href="https://m.me/g0vairmap" target="_blank">Messenger 機器人</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
        </v-ons-list>


        <v-ons-list-title>相關連結</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item tappable modifier="chevron" @click="openRecruit">
                <div class="left">
                    <i class="fa fa-sign-in" aria-hidden="true"></i>
                </div>
                <div class="center">
                    自造站點募集
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="left">
                    <i class="fa fa-facebook-official" aria-hidden="true" style="color: #4267B2;"></i>
                </div>
                <div class="center">
                    <a href="https://www.facebook.com/g0vairmap" target="_blank">零時空汙觀測網開發日誌</a>
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
                    <a href="https://www.facebook.com/groups/pm25opendata/about/" target="_blank">PM2.5 開放資料：社群協同分析平台</a>
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
                    <a href="https://www.facebook.com/groups/1607718702812067/" target="_blank">LASS-開源公益環境感測網路</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
        </v-ons-list>


        <v-ons-list-title>資料來源</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item >
                <div class="left">
                    <img :src="getLogo('lass')" style="width: 100%"/>
                </div>
                <div class="center">
                    <a href="https://pm25.lass-net.org/zh_tw/#api" target="_blank">PM2.5 開放資料入口網站</a>
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
                    <a href="https://airbox.edimaxcloud.com/" target="_blank">Edimax Airbox</a>
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
                    <a href="http://www.airq.org.tw/" target="_blank">暨南國際大學在地空氣品質地圖</a>
                </div>
                <div class="right">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </div>
            </v-ons-list-item>
        </v-ons-list>


        <v-ons-list-title>說明文件</v-ons-list-title>
        <v-ons-list>
            <v-ons-list-item tappable modifier="chevron" @click="openAboutus">
                <div class="left">
                    <i class="fa fa-sitemap" aria-hidden="true"></i>
                </div>
                <div class="center">關於 g0v 零時空汙觀測網</div>
            </v-ons-list-item>
            <v-ons-list-item tappable modifier="chevron" @click="openAboutsettings">
                <div class="left">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </div>
                <div class="center">關於 設定值</div>
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

