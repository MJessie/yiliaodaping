const { createApp } = Vue;

createApp({
    data() {
        return {
            currentView: 'hq',
            selectedRange: '30d',
            sortMetric: 'unhandledAlerts',
            currentTime: '',
            charts: {},
            timeRanges: [],
            sortMetrics: [],
            selectedHospitalId: 'shanghai',
            hospitals: []
        };
    },
    computed: {
        selectedHospital() {
            return this.hospitals.find((item) => item.id === this.selectedHospitalId) || this.hospitals[0];
        },
        activeSortLabel() {
            const metric = this.sortMetrics.find((item) => item.value === this.sortMetric);
            return metric ? metric.label : '未处理告警';
        },
        sortedHospitals() {
            return [...this.hospitals].sort((first, second) => {
                const a = first[this.sortMetric];
                const b = second[this.sortMetric];
                return b - a;
            });
        },
        hqCards() {
            const active = this.hospitals.reduce((sum, item) => sum + item.activeAlerts, 0);
            const abnormal = this.hospitals.filter((item) => item.status !== 'normal').length;
            const unhandled = this.hospitals.reduce((sum, item) => sum + item.unhandledAlerts, 0);
            const fast = this.hospitals.filter((item) => item.mttaValue <= 10).length;
            return [
                { label: '接入医院总数', value: '18', note: '已完成全国重点区域布点', trendDirection: 'up', trendGood: true, trendText: '本季新增 3 家', tone: 'info' },
                { label: '异常医院数', value: String(abnormal).padStart(2, '0'), note: '黄色 / 红色医院需要重点跟踪', trendDirection: 'down', trendGood: true, trendText: '较上周减少 2 家', tone: 'warn' },
                { label: '全国活动告警', value: String(active), note: '未处理告警 ' + unhandled + ' 条', trendDirection: 'down', trendGood: true, trendText: '环比下降 11%', tone: 'info' },
                { label: '快速响应医院', value: String(fast), note: 'MTTA ≤ 10 分钟', trendDirection: 'up', trendGood: true, trendText: '达标率 67%', tone: 'good' }
            ];
        },
        hospitalCards() {
            const hospital = this.selectedHospital;
            const availabilityValue = Number.parseFloat(hospital.availability);
            return [
                { label: '核心系统平均可用率', value: hospital.availability, note: '近 30 天整体可用', trendDirection: hospital.weeklyCompare.availability.direction, trendGood: hospital.weeklyCompare.availability.good, trendText: hospital.weeklyCompare.availability.delta, tone: availabilityValue >= 99.9 ? 'good' : 'warn' },
                { label: '问题闭环率', value: hospital.closureRate, note: '已关闭工单 / 总工单', trendDirection: hospital.weeklyCompare.closure.direction, trendGood: hospital.weeklyCompare.closure.good, trendText: hospital.weeklyCompare.closure.delta, tone: 'good' },
                { label: '平均响应时长', value: hospital.responseAvg, note: '告警生成至处理中', trendDirection: hospital.weeklyCompare.response.direction, trendGood: hospital.weeklyCompare.response.good, trendText: hospital.weeklyCompare.response.delta, tone: 'info' },
                { label: '平均恢复时长', value: hospital.recoveryAvg, note: '告警生成至关闭', trendDirection: 'down', trendGood: true, trendText: '较上月下降 13%', tone: 'info' },
                { label: '超时率', value: hospital.timeoutRate, note: '超时工单 / 总工单', trendDirection: hospital.weeklyCompare.timeout.direction, trendGood: hospital.weeklyCompare.timeout.good, trendText: hospital.weeklyCompare.timeout.delta, tone: Number.parseFloat(hospital.timeoutRate) <= 5 ? 'good' : 'warn' }
            ];
        },
        compareCards() {
            const compare = this.selectedHospital.weeklyCompare;
            return [
                { label: '本周告警量', value: compare.alert.value, delta: compare.alert.delta, direction: compare.alert.direction, good: compare.alert.good, period: compare.alert.period },
                { label: '本周响应时长', value: compare.response.value, delta: compare.response.delta, direction: compare.response.direction, good: compare.response.good, period: compare.response.period },
                { label: '本周超时率', value: compare.timeout.value, delta: compare.timeout.delta, direction: compare.timeout.direction, good: compare.timeout.good, period: compare.timeout.period },
                { label: '本月可用率', value: compare.availability.value, delta: compare.availability.delta, direction: compare.availability.direction, good: compare.availability.good, period: compare.availability.period },
                { label: '本月闭环率', value: compare.closure.value, delta: compare.closure.delta, direction: compare.closure.direction, good: compare.closure.good, period: compare.closure.period }
            ];
        }
    },
    watch: {
        currentView() {
            this.$nextTick(() => this.renderCharts());
        },
        selectedRange() {
            this.$nextTick(() => this.renderCharts());
        },
        sortMetric() {
            this.$nextTick(() => this.renderCharts());
        },
        selectedHospitalId() {
            this.$nextTick(() => this.renderCharts());
        }
    },
    async mounted() {
        if (window.DataService) {
            this.timeRanges = await window.DataService.getTimeRanges();
            this.sortMetrics = await window.DataService.getSortMetrics();
            this.hospitals = await window.DataService.getHospitals();
        }

        const path = window.location.pathname;
        if (path.includes('hospital.html')) {
            this.currentView = 'hospital';
            const params = new URLSearchParams(window.location.search);
            if (params.has('id')) {
                this.selectedHospitalId = params.get('id');
            }
        } else {
            this.currentView = 'hq';
        }

        this.updateTime();
        this.timer = window.setInterval(this.updateTime, 1000);
        window.addEventListener('resize', this.handleResize);
        this.$nextTick(() => this.renderCharts());
    },
    beforeUnmount() {
        window.clearInterval(this.timer);
        window.removeEventListener('resize', this.handleResize);
        Object.values(this.charts).forEach((chart) => {
            if (chart && chart.dispose) chart.dispose();
        });
    },
    methods: {
        updateTime() {
            const now = new Date();
            const pad = (value) => String(value).padStart(2, '0');
            const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            this.currentTime = now.getFullYear() + '年' + pad(now.getMonth() + 1) + '月' + pad(now.getDate()) + '日 ' + weeks[now.getDay()] + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        },
        switchView(view) {
            if (view === 'hq') {
                window.location.href = 'headscreen.html';
            } else {
                this.currentView = view;
            }
        },
        openHospital(id) {
            window.location.href = 'hospital.html?id=' + id;
        },
        statusText(status) {
            if (status === 'normal') return '运行正常';
            if (status === 'warning') return '重点关注';
            return '高风险';
        },
        trendClass(direction, good) {
            return [direction, good ? 'good' : 'bad'];
        },
        handleResize() {
            Object.values(this.charts).forEach((chart) => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        },
        ensureChart(key, elementId) {
            const element = document.getElementById(elementId);
            if (!element) return null;

            let chart = this.charts[key];
            if (chart && chart.getDom() !== element) {
                chart.dispose();
                chart = null;
            }

            if (!chart) {
                chart = echarts.init(element, null, { renderer: 'canvas' });
                this.charts[key] = chart;
            }
            return chart;
        },
        renderCharts() {
            if (this.currentView === 'hq') {
                this.renderChina3DMap();
                this.renderHqCompareChart();
                this.renderClosureChart();
            } else {
                this.renderHospitalAlertChart();
                this.renderHospitalResponseChart();
                this.renderHospitalTimeoutChart();
            }
        },
        async renderChina3DMap() {
            const chart = this.ensureChart('china3d', 'china-map-chart');
            if (!chart) return;

            const colorMap = { normal: '#00ff88', warning: '#ffb800', critical: '#ff2a2a' };

            const scatterData = this.hospitals.map((item) => ({
                name: item.name,
                value: [...item.coord, item.activeAlerts * 2.5],
                hospitalId: item.id,
                status: item.status,
                city: item.city,
                unhandledAlerts: item.unhandledAlerts,
                mtta: item.mtta,
                mttr: item.mttr,
                activeAlerts: item.activeAlerts
            }));

            try {
                const response = await fetch('js/data/100000_full.json');
                const chinaJson = await response.json();
                echarts.registerMap('china', chinaJson);

                chart.setOption({
                    backgroundColor: 'transparent',
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(7, 19, 32, 0.96)',
                        borderColor: 'rgba(123,214,255,0.4)',
                        padding: [12, 16],
                        textStyle: { color: '#e9f5ff' },
                        formatter: (params) => {
                            if (params.seriesType === 'scatter3D') {
                                const data = params.data;
                                return [
                                    '<div style="font-weight:700;margin-bottom:6px;font-size:16px;">' + data.name + '</div>',
                                    '<div style="font-size:13px;color:#5e8baf;margin-bottom:4px">' + data.city + ' · ' + this.statusText(data.status) + '</div>',
                                    '<div style="font-size:13px;color:#fff">活动告警：<span style="color:' + colorMap[data.status] + ';font-weight:700">' + data.activeAlerts + '</span></div>',
                                    '<div style="font-size:13px;color:#fff">未处理：<span style="color:#00f3ff;font-weight:700">' + data.unhandledAlerts + '</span></div>'
                                ].join('');
                            }
                            return params.name;
                        }
                    },
                    geo3D: {
                        map: 'china',
                        roam: true,
                        regionHeight: 4,
                        boxWidth: 105,
                        itemStyle: {
                            color: 'rgba(8, 28, 51, 0.8)',
                            opacity: 0.9,
                            borderWidth: 1.5,
                            borderColor: 'rgba(0, 243, 255, 0.6)'
                        },
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true,
                                textStyle: { color: '#00f3ff' }
                            },
                            itemStyle: {
                                color: 'rgba(0, 136, 255, 0.4)',
                                opacity: 1
                            }
                        },
                        light: {
                            main: {
                                intensity: 1.2,
                                shadow: true,
                                alpha: 40,
                                beta: -20
                            },
                            ambient: {
                                intensity: 0.5
                            }
                        },
                        viewControl: {
                            distance: 90,
                            alpha: 85,
                            beta: 0,
                            center: [-3, 35, 0], // 相机中心向下移动，地图下挂约50px
                            autoRotate: false
                        }
                    },
                    series: [
                        {
                            type: 'scatter3D',
                            coordinateSystem: 'geo3D',
                            data: scatterData,
                            symbol: 'pin',
                            symbolSize: (value) => Math.max(22, 16 + value[2] / 5),
                            itemStyle: {
                                color: (params) => colorMap[params.data.status],
                                opacity: 1
                            },
                            label: {
                                show: true,
                                formatter: '{b}',
                                position: 'right',
                                textStyle: {
                                    color: '#e9f5ff',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    textBorderColor: 'rgba(0,0,0,0.8)',
                                    textBorderWidth: 2
                                }
                            },
                            emphasis: {
                                itemStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    ]
                });

                chart.off('click');
                chart.on('click', (params) => {
                    if (params.seriesType === 'scatter3D' && params.data && params.data.hospitalId) {
                        this.selectedHospitalId = params.data.hospitalId;
                    }
                });

            } catch (error) {
                console.error('Failed to load 3D Map:', error);
            }
        },
        renderHqCompareChart() {
            const chart = this.ensureChart('hqCompare', 'hq-compare-chart');
            if (!chart) return;
            const names = this.sortedHospitals.map((item) => item.city);
            chart.setOption({
                tooltip: { trigger: 'axis' },
                legend: { top: 0, right: 0, textStyle: { color: '#c8e5f5' } },
                grid: { left: 45, right: 20, bottom: 30, top: 40 },
                xAxis: {
                    type: 'category',
                    data: names,
                    axisLabel: { color: '#86a6bc' },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#86a6bc' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [
                    {
                        name: 'MTTA',
                        type: 'bar',
                        barWidth: 16,
                        data: this.sortedHospitals.map((item) => item.mttaValue),
                        itemStyle: { color: '#36d8c6', borderRadius: [8, 8, 0, 0] }
                    },
                    {
                        name: 'MTTR',
                        type: 'line',
                        smooth: true,
                        symbolSize: 8,
                        data: this.sortedHospitals.map((item) => item.mttrValue),
                        lineStyle: { color: '#ffca63', width: 3 },
                        itemStyle: { color: '#ffca63' },
                        areaStyle: { color: 'rgba(255, 202, 99, 0.12)' }
                    }
                ]
            });
        },
        renderClosureChart() {
            const chart = this.ensureChart('hqClosure', 'hq-closure-chart');
            if (!chart) return;
            const active = this.hospitals.reduce((sum, item) => sum + item.activeAlerts, 0);
            const unhandled = this.hospitals.reduce((sum, item) => sum + item.unhandledAlerts, 0);
            const closed = 426;
            chart.setOption({
                tooltip: { trigger: 'item' },
                legend: { bottom: 0, textStyle: { color: '#c8e5f5' } },
                series: [{
                    type: 'pie',
                    radius: ['52%', '74%'],
                    center: ['50%', '46%'],
                    label: { color: '#e9f5ff', formatter: '{b}\n{d}%' },
                    labelLine: { lineStyle: { color: 'rgba(123,214,255,0.25)' } },
                    itemStyle: { borderColor: '#081825', borderWidth: 4 },
                    data: [
                        { value: closed, name: '已闭环工单', itemStyle: { color: '#3ed6c6' } },
                        { value: active, name: '活动告警', itemStyle: { color: '#ffca63' } },
                        { value: unhandled, name: '未处理告警', itemStyle: { color: '#ff6a6a' } }
                    ]
                }],
                graphic: [{
                    type: 'text',
                    left: 'center',
                    top: '39%',
                    style: {
                        text: '闭环率\n96.2%',
                        textAlign: 'center',
                        fill: '#e9f5ff',
                        fontSize: 20,
                        fontWeight: 700
                    }
                }]
            });
        },
        renderHospitalAlertChart() {
            const chart = this.ensureChart('hospitalAlert', 'hospital-alert-chart');
            if (!chart) return;
            const rangeLabel = this.selectedRange === '7d' ? '近 7 天' : this.selectedRange === 'custom' ? '自定义周期' : '近 30 天口径展示近 7 日走势';
            chart.setOption({
                tooltip: { trigger: 'axis' },
                grid: { left: 45, right: 20, top: 35, bottom: 30 },
                xAxis: {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    axisLabel: { color: '#86a6bc' },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#86a6bc' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [{
                    name: rangeLabel,
                    type: 'line',
                    smooth: true,
                    symbolSize: 9,
                    data: this.selectedHospital.alertTrend,
                    lineStyle: { color: '#7de7ff', width: 3 },
                    itemStyle: { color: '#7de7ff' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(125, 231, 255, 0.38)' },
                            { offset: 1, color: 'rgba(125, 231, 255, 0.02)' }
                        ])
                    },
                    markPoint: {
                        symbolSize: 54,
                        data: [{ type: 'max', name: '峰值' }],
                        label: { color: '#04131d', fontWeight: 700 }
                    }
                }]
            });
        },
        renderHospitalResponseChart() {
            const chart = this.ensureChart('hospitalResponse', 'hospital-response-chart');
            if (!chart) return;
            chart.setOption({
                tooltip: { trigger: 'axis' },
                grid: { left: 45, right: 20, top: 35, bottom: 30 },
                xAxis: {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    axisLabel: { color: '#86a6bc' },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#86a6bc', formatter: '{value} 分' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [
                    {
                        name: '平均响应时长',
                        type: 'line',
                        smooth: true,
                        data: this.selectedHospital.responseTrend,
                        lineStyle: { color: '#36d8c6', width: 3 },
                        itemStyle: { color: '#36d8c6' },
                        symbolSize: 8,
                        areaStyle: { color: 'rgba(62, 214, 198, 0.12)' }
                    },
                    {
                        name: 'SLA 基线',
                        type: 'line',
                        data: [15, 15, 15, 15, 15, 15, 15],
                        symbol: 'none',
                        lineStyle: { color: '#ff6a6a', width: 2, type: 'dashed' }
                    }
                ]
            });
        },
        renderHospitalTimeoutChart() {
            const chart = this.ensureChart('hospitalTimeout', 'hospital-timeout-chart');
            if (!chart) return;
            chart.setOption({
                tooltip: { trigger: 'axis' },
                grid: { left: 45, right: 20, top: 35, bottom: 30 },
                xAxis: {
                    type: 'category',
                    data: ['1 月', '2 月', '3 月'],
                    axisLabel: { color: '#86a6bc' },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#86a6bc', formatter: '{value}%' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [
                    {
                        name: '超时率',
                        type: 'bar',
                        barWidth: 26,
                        data: this.selectedHospital.timeoutTrend,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#ffca63' },
                                { offset: 1, color: '#ff8e54' }
                            ]),
                            borderRadius: [10, 10, 0, 0]
                        }
                    },
                    {
                        name: '改善趋势',
                        type: 'line',
                        smooth: true,
                        data: this.selectedHospital.timeoutTrend,
                        lineStyle: { color: '#7de7ff', width: 3 },
                        itemStyle: { color: '#7de7ff' },
                        symbolSize: 8
                    }
                ]
            });
        }
    }
}).mount('#app');
