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
                <div class="title">PM 2.5</div>
                <div class="value" v-if="site.pm25 !== null">{{ site.pm25 }}</div>
                <div class="value" v-else><i class="fa fa-ban" aria-hidden="true"></i></div>
                <div class="unit">μg/m3</div>
            </div>

            <div class="measure">
                <div class="title">{{ lang('list.temperature') }}</div>
                <div class="value" v-if="site.temp !== null">{{ site.temp }}</div>
                <div class="value" v-else><i class="fa fa-ban" aria-hidden="true"></i></div>
                <div class="unit">&#8451;</div>
            </div>

            <div class="measure">
                <div class="title">{{ lang('list.humidity') }}</div>
                <div class="value" v-if="site.humidity !== null">{{ site.humidity }}</div>
                <div class="value" v-else><i class="fa fa-ban" aria-hidden="true"></i></div>
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
                    {{ lang('list.analysis.datasource') }}:
                    <a href="https://pm25.lass-net.org/zh_tw/#api" target="_blank">
                        {{ lang('list.analysis.datasourceText') }}
                    </a>
                </span>
            </div>
        </div>

        <div class="suggestionContainer">
            <hr>
            <PM25Suggestion :indicatorType="pm25IndicatorType" :value="site.pm25" />
        </div>

        <div class="charts" v-show="showChart.pm25 || showChart.temp || showChart.humidity">
            <hr>
            <div class="chartContainer" v-show="showChart.pm25">
                <div class="title">{{ pm25IndicatorType }}</div>
                <LineChart ref="chartPM25" />
            </div>

            <div class="chartContainer" v-show="showChart.temp">
                <div class="title">{{ lang('list.temperature') }}</div>
                <LineChart ref="chartTemp" />
            </div>

            <div class="chartContainer" v-show="showChart.humidity">
                <div class="title">{{ lang('list.humidity') }}</div>
                <LineChart ref="chartHumidity" />
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

            setTimeout(() => {
                this.loadLocation();
            }, 2000);
        },

        props: {
            site: {
                requied: true,
            }
        },

        data () {
            return {
                location: null,
                showChart: {
                    pm25: true,
                    temp: true,
                    humidity: true,
                }
            };
        },

        computed: {
            inFavorite () {
                return this.$store.getters['site/isInFavorite'](this.site);
            },
            pm25IndicatorType () {
                return this.$store.state.app.pm25IndicatorType;
            },
        },

        methods: {
            toggleFavorite () {
                let action = this.inFavorite ? 'removeFavorite' : 'addFavorite';
                this.$store.commit(`site/${action}`, this.site);

                let notiWord = this.inFavorite ? 'list.favorite.added' : 'list.favorite.removed';
                this.$ons.notification.toast(lang(notiWord), {timeout: 2000})
            },
            generateColorBar (type, maxValue) {
                return generateColorBar(type, maxValue).map(level => {
                    let rgbcolor = hexToRgb(level.color);
                    return {
                        offset: level.percent / 100,
                        color: `rgba(${rgbcolor.r}, ${rgbcolor.g}, ${rgbcolor.b}, .6)`,
                    }
                })
            },
            processChartData (labels, values, indicatorType) {
                values = [].concat(values).reverse();
                let maxValue = Math.round(Math.max.apply(null, values));

                return {
                    gradientFill: this.generateColorBar(indicatorType, maxValue),
                    chartOptions:  {scales: {yAxes: [{ ticks: {max: maxValue} }]}},
                    chartData: {
                        labels: labels,
                        datasets: [{ data: values }]
                    }
                };
            },
            isAllNull (values) {
                let unique = [...new Set(values)];
                return unique.length === 1 && unique[0] === null;
            },
            fetchHistory (type) {
                this.site.fetchHistory().then(chartData => {
                    let labels = [].concat(chartData.labels).reverse();
                    let datasets = chartData.datasets;

                    setTimeout(() => {
                        if (!datasets.Dust2_5|| this.isAllNull(datasets.Dust2_5)) { this.showChart.pm25 = false; return; }

                        let chartData = this.processChartData(labels, datasets.Dust2_5, this.pm25IndicatorType);
                        this.$refs.chartPM25 && this.$refs.chartPM25.start(chartData);
                    }, 50);

                    setTimeout(() => {
                        if (!datasets.Temperature || this.isAllNull(datasets.Temperature)) { this.showChart.temp = false; return; }

                        let chartData = this.processChartData(labels, datasets.Temperature, 'Temperature');
                        this.$refs.chartTemp && this.$refs.chartTemp.start(chartData);
                    }, 500);

                    setTimeout(() => {
                        if (!datasets.Humidity|| this.isAllNull(datasets.Humidity)) { this.showChart.humidity = false; return; }

                        let chartData = this.processChartData(labels, datasets.Humidity, 'Humidity');
                        this.$refs.chartHumidity && this.$refs.chartHumidity.start(chartData);
                    }, 1000);
                });
            },
            loadLocation() {
                let position = this.site.position;
                let element = this.$refs.location;

                if (!element) {
                    return;
                }

                let map = new google.maps.Map(element, {
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

            .title {
                font-size: .75em;
                background: gray;
                color: white;
                padding: .1em .3em;
            }

            .value {
                min-height: 1em;
                font-size: 1.8em;
                line-height: 1em;
            }

            .unit { font-size: .6em; padding: .3em; }
        }
    }

    .analysisRanking {
        text-align: center;

        .ranking {
            font-size: 2em;
            text-shadow: 1px 1px #aaa;
        }

        .datasource {
            font-size: .6em;
            margin-top: .5em;
        }
    }


    .suggestion {
        margin: 1.5em;
    }

    .chartContainer {
        padding: .5em;

        .title {
            font-size: .8em;
            color: gray;
            text-align: center;
        }
    }

    .location {
        min-height: 300px;
    }
</style>