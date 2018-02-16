<template>
    <div>
        <div class="header">
            <p class="title">{{ title }}</p>
        </div>

        <div class="content">
            <Meter :indicatorType="indicatorType" :value="value" />

            <div class="suggestion">

                <div v-show="indicatorType == 'PM2.5'">
                    <div class="normal-human">
                        <div class="label-suggestion">一般民眾活動建議</div>
                        <ul>
                            <li v-show="value<=35">正常戶外活動</li>
                            <li v-show="value>=36 && value<=53">正常戶外活動</li>
                            <li v-show="value>=54 && value<=70">任何人如果有不適，如眼痛，咳嗽或喉嚨痛等，應該考慮減少戶外活動</li>
                            <li v-show="value>=71">任何人如果有不適，如眼痛，咳嗽或喉嚨痛等，應減少體力消耗，特別是減少戶外活動</li>
                        </ul>
                    </div>
                    <div class="sensitive-human">
                        <div class="label-suggestion">敏感性族群活動建議</div>
                        <ul v-show="value<=53">
                            <li v-show="value<=35">正常戶外活動</li>
                            <li v-show="value>=36 && value<=53">有心臟、呼吸道及心血管疾病的成人與孩童感受到癥狀時，應考慮減少體力消耗，特別是減少戶外活動。</li>
                        </ul>
                        <ol v-show="value>=54 && value<=70">
                            <li>有心臟、呼吸道及心血管疾病的成人與孩童，應減少體力消耗，特別是減少戶外活動</li>
                            <li>老年人應減少體力消耗</li>
                            <li>具有氣喘的人可能需增加使用吸入劑的頻率</li>
                        </ol>
                        <ol v-show="value>=71">
                            <li>有心臟、呼吸道及心血管疾病的成人與孩童，以及老年人應避免體力消耗，特別是避免戶外活動</li>
                            <li>具有氣喘的人可能需增加使用吸入劑的頻率</li>
                        </ol>
                    </div>
                    <div class="link">
                        <div class="label-suggestion">資料來源<br/>
                            <a target="_blank" href="http://taqm.epa.gov.tw/taqm/tw/fpmi.aspx">行政院環保署細懸浮微粒(PM2.5)指標對照表與活動建議 (連結失效)</a>
                        </div>
                    </div>
                </div>

                <div v-show="indicatorType == 'AQI'">
                    <div class="normal-human">
                        <div class="label-suggestion">一般民眾活動建議</div>
                        <ul v-show="value<=100">
                            <li>正常戶外活動</li>
                        </ul>
                        <ol v-show="value>=101 && value<=150">
                            <li>一般民眾如果有不適，如眼痛，咳嗽或喉嚨痛等，應該考慮減少戶外活動。</li>
                            <li>學生仍可進行戶外活動，但建議減少長時間劇烈運動。</li>
                        </ol>
                        <ol v-show="value>=151 && value<=200">
                            <li>一般民眾如果有不適，如眼痛，咳嗽或喉嚨痛等，應減少體力消耗，特別是減少戶外活動。</li>
                            <li>學生應避免長時間劇烈運動，進行其他戶外活動時應增加休息時間。</li>
                        </ol>
                        <ol v-show="value>=201 && value<=300">
                            <li>一般民眾應減少戶外活動。</li>
                            <li>學生應立即停止戶外活動，並將課程調整於室內進行。</li>
                        </ol>
                        <ol v-show="value>=300 && value<=500">
                            <li>一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。</li>
                            <li>學生應立即停止戶外活動，並將課程調整於室內進行。</li>
                        </ol>
                    </div>
                    <div class="sensitive-human">
                        <div class="label-suggestion">敏感性族群活動建議</div>
                        <ul v-show="value<=100">
                            <li v-show="value<=50">正常戶外活動</li>
                            <li v-show="value>=51 && value<=100">極特殊敏感族群建議注意可能產生的咳嗽或呼吸急促症狀，但仍可正常戶外活動。</li>
                        </ul>
                        <ol v-show="value>=101 && value<=150">
                            <li>有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，必要外出應配戴口罩。</li>
                            <li>具有氣喘的人可能需增加使用吸入劑的頻率。</li>
                        </ol>
                        <ol v-show="value>=151 && value<=200">
                            <li>有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內並減少體力消耗活動，必要外出應配戴口罩。</li>
                            <li>具有氣喘的人可能需增加使用吸入劑的頻率。</li>
                        </ol>
                        <ol v-show="value>=201">
                            <li>有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，必要外出應配戴口罩。</li>
                            <li>具有氣喘的人應增加使用吸入劑的頻率。</li>
                        </ol>
                    </div>
                    <div class="link">
                        <div class="label-suggestion">資料來源
                            <a target="_blank" href="https://taqm.epa.gov.tw/taqm/tw/b0201.aspx">行政院環境保護署空氣品質指標</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="footer">
            <div class="published-time" :title="publishedAt.format('YYYY-MM-DD HH:mm:ss')">
                <i class="fa fa-clock-o" aria-hidden="true" style="padding: 0 5px;"></i>
                {{ publishedAt.toNow(true) }}
            </div>
            <div class="ranking" title="">
                <i class="fa fa-star" style="padding: 0 2px;" v-for="i in ranking" :key="i"></i>
            </div>
            <div class="buttons">
                <v-ons-button modifier="light" style="padding: 0px 8px;" class="btn-site-page"><i class="fa fa-bookmark"></i></v-ons-button>
                <v-ons-button modifier="light" style="padding: 0px 8px;" class="btn-widget-page"><i class="fa fa-tachometer"></i></v-ons-button>
            </div>
        </div>
    </div>
</template>

<script>
    import Meter from '@/components/Meter';

    export default {
        components: {Meter},
        props: ['site', 'indicatorType'],
        computed: {
            title () { return this.site.title; },
            value () { return this.site.measureValue(this.indicatorType); },
            publishedAt () { return this.site.publishedAt; },
            ranking () { return this.site.analysisRanking; },
        }
    }
</script>

<style lang="scss">
    .title {
        margin-top: 0px;
        margin-bottom: 8px;
    }

    .suggestion {
        font-size: .8em;

        > div {
            margin-bottom: .3em;
        }

        ul, ol {
            margin: 0;
            font-size: .9em;
            padding-left: 2.5em;
        }

        .label-suggestion {
            margin-top: .5em;
            margin-bottom: .3em;
            font-weight: bold;
            border: 1px solid #999;
            border-radius: 18px;
            padding: 3px 8px;
        }
    }

    .footer {
        margin-top: 1em;
        padding-top: .5em;
        border-top: 1px solid #999999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: .8em;

        .published-time {
            font-size: .8em;
        }

        .ranking {
            color: #F8CB6B;
        }
    }
</style>
