<template>
<div  v-show="show" class="chart-container" style="position: relative; width:100%">
    <canvas ref="chart" ></canvas>
</div>
</template>

<script>
    import Chart from 'chart.js'

    let chartOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold",
                    beginAtZero: true,
                    maxTicksLimit: 10,
                    padding: 5
                },
                gridLines: {
                    drawTicks: false,
                    display: false
                },
            }],
            xAxes: [{
                gridLines: {
                    zeroLineColor: "transparent",
                },
                ticks: {
                    maxTicksLimit: 10,
                    maxRotation: 0,
                    padding: 0,
                    autoSkipPadding: 10,
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold"
                }
            }]
        },
        tooltips: {
            displayColors: false,
        },
        elements: {
            point: {
                hitRadius: 5
            }
        }
    };

    let elementDimention = {
        areaMargin: 8,
        yLabel: 20,
    };

    export default {
        props: {
            width: Number,
            height: Number,
        },

        data () {
            return {
                show: false,
                type: 'line',
                chart: null,
                chartData: [],
                chartOptions: [],
            }
        },

        watch: {
            width () {this.chart.update(); },
            height () {this.chart.update(); },
        },

        methods: {
            start(data) {
                this.chartData = data.chartData;
                this.chartOptions = $.extend(true, {}, chartOptions, data.chartOptions || {}, {
                    legend: { display: false }
                });

                this.createChart();

                if (data.hasOwnProperty('gradientFill')) {
                    this.chartData.datasets[0].backgroundColor = this.generateGradientFill(data['gradientFill']);
                    this.chart.update();
                }
            },
            update () {
                this.chart.update();
            },
            remove () {
                this.chart && this.chart.destroy();
                this.show = false;
            },
            createChart () {
                this.show = true;
                this.chart = new Chart(this.$refs.chart, {
                    type: this.type,
                    data: this.chartData,
                    options: this.chartOptions
                })
            },
            generateGradientFill (gradientFillColor) {
                let canvas = this.$refs.chart;
                let ctx = canvas.getContext("2d");
                let areaHeight = parseInt(canvas.style.height ,10) - elementDimention.yLabel - elementDimention.areaMargin;

                let gradientFill = ctx.createLinearGradient(0, areaHeight, 0, 0);

                gradientFillColor.map(level => {
                    gradientFill.addColorStop(level.offset, level.color);
                });

                return gradientFill;
            }
        },

        beforeDestroy () {
            this.chart && this.chart.destroy()
        }
    }
</script>