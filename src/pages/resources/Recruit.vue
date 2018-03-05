<template>
    <v-ons-page>
        <BackToolbar>自造站點募集</BackToolbar>

        <v-ons-row>
            <v-ons-col width="2em">
                <h1><i class="fa fa-question-circle" aria-hidden="true"></i></h1>
            </v-ons-col>
            <v-ons-col>
                <h1>為何需要自造測站</h1>
                <p>零時觀測網的任務為彙整官方與非官方的空氣品質觀測資料，測站的數量越多則可使空汙追蹤的解析度提高。 然而官方的大型測站在地理分布數量與更新頻率上並不足夠，社群自造的低成本物聯網感測器即是這時代的互補解決方案。</p>
            </v-ons-col>
        </v-ons-row>
        <v-ons-row>
            <v-ons-col width="2em">
                <h1><i class="fa fa-sign-in" aria-hidden="true"></i></h1>
            </v-ons-col>
            <v-ons-col>
                <h1>立即加入空汙感測器自造社群的行列動手做</h1>
                <p>以下為各社群自造感測器的方案，觀測到的資料皆可即時呈現於g0v零時空汙觀測網。</p>
            </v-ons-col>
        </v-ons-row>

        <v-ons-row class="groupContainer">
            <v-ons-col vertical-align="center" width="30%">
                <img src="https://i.imgur.com/z11DvN7.png">
            </v-ons-col>
            <v-ons-col vertical-align="center">
                <p>ProbeCube是基於開源硬體的物聯網專案，志在提供大眾可以輕鬆動手自造WiFi連網的空汙感測器方案，目前亦為g0v空汙觀測的支援性專案，推廣測站提高觀測網空汙追蹤能力。</p>

                <div class="links-container">
                    <a target="_blank" href="https://github.com/Lafudoci/ProbeCube"><i class="fa fa-github" aria-hidden="true"></i> GitHub原始碼</a>
                    <a target="_blank" href="http://beta.hackfoldr.org/g0vairmap/g0v--rp53Cw7woim"> Hackpad共筆</a>
                    <a target="_blank" href="https://www.facebook.com/groups/491642281023600/"><i class="fa fa-facebook-official" aria-hidden="true"></i> FB社群討論</a>
                </div>
            </v-ons-col>
        </v-ons-row>
        <v-ons-row class="groupContainer">
            <v-ons-col vertical-align="center" width="30%">
                <img src="https://i.imgur.com/6XITiIN.jpg">
            </v-ons-col>
            <v-ons-col vertical-align="center">
                <p>LASS是開源公益的環境感測器網路計畫，系統完成度高、門檻低，支援平台眾多，賦予Maker自行客製各種感測能力，所有感測資料皆自由開放以利各種衍生專案與應用。</p>

                <div class="links-container">
                    <a target="_blank" href="https://github.com/LinkItONEDevGroup/LASS"><i class="fa fa-github" aria-hidden="true"></i> GitHub原始碼</a>
                    <a target="_blank" href="https://lass.hackpad.tw/"> Hackpad共筆</a>
                    <a target="_blank" href="https://www.facebook.com/groups/1607718702812067/"><i class="fa fa-facebook-official" aria-hidden="true"></i> FB社群討論</a>
                </div>
            </v-ons-col>
        </v-ons-row>
        <v-ons-row class="groupContainer">
            <v-ons-col vertical-align="center" width="30%">
                <img src="https://i.imgur.com/d04Edr0.png">
            </v-ons-col>
            <v-ons-col vertical-align="center">
                <v-ons-row>
                    <p>歡迎更多社群方案加入!</p>
                </v-ons-row>
            </v-ons-col>
        </v-ons-row>


        <v-ons-row style="display: flex; justify-content: center;">
            <ons-col>
                <h3><strong>或者，你已有獨立開發的感測器想要分享即時觀測值給零時觀測網可
                <a target="_blank" href="http://goo.gl/forms/Y95gdHCgIr">填寫此表單</a> 與我們聯絡。</strong></h3>
            </ons-col>
        </v-ons-row>

    </v-ons-page>
</template>

<script>
    import BackToolbar from '@/components/toolbars/BackToolbar'

    export default {
        components: {BackToolbar},
    }
</script>

<style lang="scss" scoped>
    ons-col { padding: 0 1em; }

    .groupContainer {
        border: 1px solid gray;
        border-radius: .5em;
        margin: 2.5%;
        width: 95%;

        img { width: 100%; }

        .links-container {
            display: flex;
            justify-content: space-around;
        }
    }
</style>


