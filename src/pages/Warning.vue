<template>
    <v-ons-page>
        <div class="container">
            <v-ons-card>
                <div class="title">
                    請注意
                </div>
                <div class="content">
                    <v-ons-list>
                        <v-ons-list-item>
                            <div class="left">1.</div>
                            <div class="center">
                                微型感測器與標準測站的感測值，因為兩者感測原理不同，感測數值自然不相同，迄今仍無良好的系統校正方式，因此兩者的數值不宜直接進行比較。
                            </div>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="left">2.</div>
                            <div class="center">
                                根據目前已知的研究報告，微型感測器的感測數值在精確度上具有極高的一致性，且與標準測站的感測值亦有相同的趨勢表現，但在準確度方面，兩者間的誤差會隨著環境因素變化而產生極大的差異。
                            </div>
                        </v-ons-list-item>
                        <v-ons-list-item>
                            <div class="left">2.</div>
                            <div class="center">
                                本系統目前只負責資料之彙整與呈現，使用本系統所提供之各項資訊時，需謹守「趨勢比對」、「相對判斷」的原則，切勿過度解讀闡釋，以免產生其他爭議，有關空氣品質相關資訊，一切仍應以官方數據為準。
                            </div>
                        </v-ons-list-item>
                    </v-ons-list>

                    <v-ons-button modifier="large outline" class="calm" @click="calmdown">
                        我了解，我不恐慌
                    </v-ons-button>

                    <v-ons-button modifier="large outline" class="panic" @click="gotoEPA">
                        我不懂，我感到恐慌
                    </v-ons-button>
                </div>
            </v-ons-card>
        </div>

    </v-ons-page>
</template>

<script>
    import AppTabbar from '@/apps/AppTabbar.vue';

    export default {
        methods: {
            gotoEPA () {
                window.location.href = "https://taqm.epa.gov.tw/taqm/tw/default.aspx";
            },
            calmdown () {
                this.$store.commit('app/setLastShowWarning', (new Date).getTime());
                this.$store.commit('navigator/push', AppTabbar);
            },
        }
    }
</script>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 5rem;
        height: 100vh;
        background-color: #333;
    }

    .title {
        text-align: center;
    }
    .calm, .panic {
        margin-top: 1rem;
    }
</style>