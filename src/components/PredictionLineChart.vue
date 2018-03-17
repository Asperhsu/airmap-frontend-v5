<template>
    <div v-show="show" class="chart-container" style="position: relative; width:100%">
        <canvas ref="chart" ></canvas>
    </div>
</template>

<script>
    import moment from 'moment'
    import Chart from 'chart.js'
    import annotation from 'chartjs-plugin-annotation';

    let chartColors = {
        "red":"rgb(255, 99, 132)",
        "orange":"rgb(255, 159, 64)",
        "yellow":"rgb(255, 205, 86)",
        "green":"rgb(75, 192, 192)",
        "blue":"rgb(54, 162, 235)",
        "purple":"rgb(153, 102, 255)",
        "grey":"rgb(201, 203, 207)"
    };
    let chartOptions = {
        legend: {
            position: 'bottom',
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold",
                    padding: 5
                },
                gridLines: {
                    drawTicks: false,
                    display: false
                },
            }],
            xAxes: [{
                ticks: {
                    maxRotation: 0,
                    padding: 0,
                    fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold"
                }
            }],
        },
        annotation: {
            annotations: [
                {
                    type: "line",
                    mode: "vertical",
                    scaleID: "x-axis-0",
                    borderColor: "red",
                    label: {
                        backgroundColor: '#333',
                        content: "NOW",
                        enabled: true,
                        position: "top",
                    }
                }
            ]
        },
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
                let annotationValue = this.findCloestLabel(data.chartData.labels);

                data.chartData.labels = this.formatLabels(data.chartData.labels);
                data.chartData.datasets = this.setDatasetsDefaultColor(data.chartData.datasets);

                this.chartData = data.chartData;
                this.chartOptions = $.extend(true, {}, chartOptions, data.chartOptions || {}, {
                    annotation: {annotations: [{ value: annotationValue }]}
                });

                this.createChart();
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
                    options: this.chartOptions,
                    plugins: [annotation],
                })
            },
            formatLabels (labels) {
                if (Array.isArray(labels)) {
                    return labels.map((iso8601) => {
                        return moment(iso8601).format('HH:mm');
                    });
                }

                if (typeof labels === "string") {
                    return moment(labels).format('HH:mm');
                }
            },
            setDatasetsDefaultColor (datasets) {
                let colors = Object.keys(chartColors);

                return datasets.map(dataset => {
                    let color = chartColors[colors.shift()];
                    return Object.assign(dataset, {
                        fill: false,
                        backgroundColor: color,
                        borderColor: color,
                        spanGaps: true,
                    });
                });
            },
            findCloestLabel (labels) {
                let cloestGap = Infinity;
                let cloestLabel = null;
                let now = moment().valueOf();
                labels.map(label => {
                    let diff = Math.abs(moment(label).valueOf() - now);

                    if (diff < cloestGap) {
                        cloestGap = diff;
                        cloestLabel = label;
                    }
                });

                return this.formatLabels(cloestLabel);
            },
        },

        beforeDestroy () {
            this.chart && this.chart.destroy()
        }
    }
</script>