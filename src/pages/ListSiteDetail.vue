<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">{{ site.name }}</div>
            <div class="right">
                <v-ons-toolbar-button class="addToFavoriteBtn" @click="toggleFavorite">
                    <v-ons-icon :icon="inFavorite ? 'fa-star' : 'fa-star-o'"></v-ons-icon>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>

        <div class="measureContainer">
            <div class="measure">
                <div class="title">{{ pm25IndicatorType }}</div>
                <div class="value">{{ site.pm25 }}</div>
                <div class="unit">μg/m3</div>
            </div>

            <div class="measure">
                <div class="title">Temp.</div>
                <div class="value">{{ site.temp }}</div>
                <div class="unit">&#8451;</div>
            </div>

            <div class="measure">
                <div class="title">Humidity</div>
                <div class="value">{{ site.humidity }}</div>
                <div class="unit">%</div>
            </div>
        </div>

        <div class="analysisRanking" v-if="site.analysisRanking">
            <hr>

            <div class="ranking">
                <i class="fa fa-star" style="padding: 0 2px;" v-for="i in site.analysisRanking" :key="i"></i>
            </div>

            <div class="datasource">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
                <span class="info">
                    資料分析來源:
                    <a href="https://pm25.lass-net.org/zh_tw/#api" target="_blank">
                        台灣中央研究院資訊科學研究所網路研究實驗室
                    </a>
                </span>
            </div>
        </div>

        <div class="suggestionContainer">
            <hr>
            <PM25Suggestion :indicatorType="pm25IndicatorType" :value="site.pm25" />
        </div>

        <div class="charts" v-show="chartData.pm25 || chartData.temp || chartData.humidity">
            <hr>
            <div class="chartContainer" v-if="chartData.pm25">
                <div class="title">{{ pm25IndicatorType }}</div>
                <LineChart type="line" :data="chartData.pm25" :options="chartOptions" :gradientFillColor="generateColorBar(pm25IndicatorType)" />
            </div>

            <div class="chartContainer" v-if="chartData.temp">
                <div class="title">Temperature</div>
                <LineChart type="line" :data="chartData.temp" :options="chartOptions" :gradientFillColor="generateColorBar('Temperature')" />
            </div>

            <div class="chartContainer" v-if="chartData.humidity">
                <div class="title">Humidity</div>
                <LineChart type="line" :data="chartData.humidity" :options="chartOptions" :gradientFillColor="generateColorBar('Humidity')" />
            </div>
        </div>

        <hr>
        <div ref="location" class="location"></div>
    </v-ons-page>
</template>

<script>
    import {generateColorBar, hexToRgb} from '@/services/indicator'
    import LineChart from '@/components/LineChart'
    import PM25Suggestion from '@/components/PM25Suggestion'

    export default {
        components: {LineChart, PM25Suggestion},

        mounted () {
            this.fetchHistory();
            this.loadLocation();
        },

        props: {
            site: {
                requied: true,
            }
        },

        data () {
            return {
                chartOptions: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold",
                                beginAtZero: true,
                                maxTicksLimit: 5,
                                padding: 20
                            },
                            gridLines: {
                                drawTicks: false,
                                display: false
                            }
                        }],
                    },
                    tooltips: {
                        displayColors: false,
                    },
                    elements: {
                        point: {
                            radius: 5,
                            hoverRadius: 10,
                            hitRadius: 3
                        }
                    }
                },
                chartData: {
                    pm25: null,
                    temp: null,
                    humidity: null,
                },
                location: null,
            };
        },

        computed: {
            inFavorite () {
                return this.$store.getters['site/isInFavorite'](this.site);
            },
            pm25IndicatorType () {
                return this.$store.state.site.pm25IndicatorType;
            },
        },

        methods: {
            toggleFavorite () {
                let action = this.inFavorite ? 'removeFavorite' : 'addFavorite';
                this.$store.commit(`site/${action}`, this.site);

                let notiWord = this.inFavorite ? 'added' : 'removed';
                this.$ons.notification.toast(`Favorite ${notiWord}`, {timeout: 2000})
            },
            generateColorBar (type) {
                let colorbar = generateColorBar(type)

                return generateColorBar(type).map(level => {
                    let rgbcolor = hexToRgb(level.color);
                    return {
                        offset: level.percent / 100,
                        color: `rgba(${rgbcolor.r}, ${rgbcolor.g}, ${rgbcolor.b}, .6)`,
                    }
                })
            },
            fetchHistory (type) {
                this.site.fetchHistory().then(chartData => {
                    this.chartData.pm25 = {
                        labels: chartData.labels,
                        datasets: [{ data: chartData.datasets.Dust2_5}]
                    }

                    this.chartData.temp = {
                        labels: chartData.labels,
                        datasets: [{ data: chartData.datasets.Temperature}]
                    }

                    this.chartData.humidity = {
                        labels: chartData.labels,
                        datasets: [{ data: chartData.datasets.Humidity}]
                    }
                });
            },
            loadLocation() {
                let position = this.site.position;

                let map = new google.maps.Map(this.$refs.location, {
                    center: position,
                    zoom: 16
                });

                let marker = new google.maps.Marker({
                    position: position,
                    map: map,
                });

                this.location = {map, marker};
            }
        },
    }
</script>

<style lang="scss" scoped>
    .addToFavoriteBtn {
        color: #ffbd02;
        font-size: 1.5em;
    }

    .measureContainer {
        display: flex;
        justify-content: space-around;
        margin: 1em;

        .measure {
            border: 1px solid gray;
            border-radius: 5px;
            text-align: center;
            min-width: 25%;

            .title { font-size: .75em; background: gray; color: white; padding: .1em .3em; }
            .unit { font-size: .6em; padding: .3em; }
        }
    }

    .analysisRanking {
        text-align: center;

        .datasource {
            font-size: .6em;
            margin-top: .5em;
        }
    }


    .suggestion {
        margin: 1.5em;
    }

    .chartContainer {
        margin: .5em;
        padding: .5em;

        .title {
            font-size: .8em;
            color: gray;
            text-align: right;
        }
    }

    .location {
        min-height: 300px;
    }
</style>


