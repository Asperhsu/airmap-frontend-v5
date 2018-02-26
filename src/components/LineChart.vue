<template>
    <canvas ref="chart" :width="width" :height="height"></canvas>
</template>

<script>
    import Chart from 'chart.js'

    let elementDimention = {
        areaMargin: 8,
        yLabel: 28,
    };

    export default {
        mounted () {
            this.chartData = $.extend({}, this.data);


            this.chartOptions = $.extend({}, this.options, {
                legend: { display: false }
            });

            this.createChart();

            if (this.gradientFillColor) {
                this.chartData.datasets[0].backgroundColor = this.generateGradientFill();
                this.chart.update();
            }
        },

        props: {
            data: {
                required: true,
                type: [Object, Array]
            },
            options: Object,
            width: Number,
            height: Number,

            gradientFillColor: null,
        },

        data () {
            return {
                type: 'line',
                chart: null,
                chartData: [],
                chartOptions: [],
            }
        },

        watch: {
            'data.labels' () {
                this.chart.update()
            },
            'data.datasets' () {
                this.chart.update()
            }
        },

        methods: {
            createChart () {
                this.chart = new Chart(this.$refs.chart, {
                    type: this.type,
                    data: this.chartData,
                    options: this.chartOptions
                })
            },
            generateGradientFill () {
                let canvas = this.$refs.chart;
                let ctx = canvas.getContext("2d");
                let areaHeight = parseInt(canvas.style.height ,10) - elementDimention.yLabel - elementDimention.areaMargin;

                let gradientFill = ctx.createLinearGradient(0, areaHeight, 0, 0);

                this.gradientFillColor.map(level => {
                    gradientFill.addColorStop(level.offset, level.color);
                });

                return gradientFill;
            }
        },

        beforeDestroy () {
            this.chart.destroy()
        }
    }
</script>