const { createApp } = Vue;

createApp({
    data() {
        return {
            currentView: 'hq',
            selectedRange: 'today',
            sortMetric: 'unhandledAlerts',
            currentTime: '',
            charts: {},
            timeRanges: [],
            sortMetrics: [],
            selectedHospitalId: '',
            hospitals: []
        };
    },
    computed: {
        selectedHospital() {
            return this.hospitals.find((item) => item.id === this.selectedHospitalId) || this.hospitals[0];
        },
        activeSortLabel() {
            const metric = this.sortMetrics.find((item) => item.value === this.sortMetric);
            return metric ? metric.label : '未认领';
        },
        sortedHospitals() {
            return [...this.hospitals].sort((first, second) => {
                const a = first[this.sortMetric];
                const b = second[this.sortMetric];
                return b - a;
            });
        },
        hqCards() {
            const mttaAvg = this.hospitals.length ? (this.hospitals.reduce((sum, item) => sum + item.mttaValue, 0) / this.hospitals.length).toFixed(1) : '0';
            const mttrAvg = this.hospitals.length ? (this.hospitals.reduce((sum, item) => sum + item.mttrValue, 0) / this.hospitals.length).toFixed(1) : '0';

            // 总部运维视角管理成效核心指标
            return [
                { label: '监控覆盖度', value: '99.2%', yoyDir: 'up', yoyGood: true, yoyText: '3.1%', momDir: 'up', momGood: true, momText: '0.5%', tone: 'good' },
                { label: '故障命中率', value: '94.8%', yoyDir: 'up', yoyGood: true, yoyText: '5.2%', momDir: 'down', momGood: false, momText: '1.2%', tone: 'info' },
                { label: '一线解决率', value: '87.5%', yoyDir: 'up', yoyGood: true, yoyText: '4.5%', momDir: 'up', momGood: true, momText: '2.1%', tone: 'good' },
                { label: '操作合规率', value: '99.8%', yoyDir: 'up', yoyGood: true, yoyText: '1.2%', momDir: 'up', momGood: true, momText: '0.1%', tone: 'info' },
                { label: '平均响应时间', value: mttaAvg + ' m', yoyDir: 'down', yoyGood: true, yoyText: '1.2m', momDir: 'down', momGood: true, momText: '0.3m', tone: 'good' },
                { label: '平均恢复时间', value: mttrAvg + ' m', yoyDir: 'down', yoyGood: true, yoyText: '5.5m', momDir: 'up', momGood: false, momText: '0.8m', tone: 'good' }
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
                this.renderLeftChart1();
                this.renderLeftChart2();
            } else {
                this.renderHospitalAlertChart();
                this.renderHospitalResponseChart();
                this.renderHospitalTimeoutChart();
            }
        },
        renderLeftChart1() {
            const chart = this.ensureChart('leftChart1', 'left-chart-1');
            if (!chart) return;
            const systems = ['RocketMQ', 'ElasticSearch', 'Logstash', 'Kibana', 'Doris', 'Redis', 'OpenGauss', 'Oracle', '海量DB', '达梦', '金仓', '数盈平台', 'HIOS技术', 'HIOS集成', 'HIOS基础', 'HIOS版本', 'HIOS护士', 'HIOS医生', 'HIOS专科', '临床LIS', '临床区域检验', '临床急诊', '临床手麻', '临床ICU', '设备连接', '影像PACS', '影像VNA', '区域医疗公卫'];

            const data = systems.map(sys => {
                return {
                    name: sys,
                    value: Math.floor(Math.random() * 50) + 10 // 随机生成告警总数
                };
            });

            const option = {
                tooltip: {
                    formatter: '{b}<br/>告警总数: <span style="font-weight:bold;color:#00f3ff">{c}</span>',
                    backgroundColor: 'rgba(7, 19, 32, 0.9)',
                    borderColor: '#00f3ff',
                    textStyle: { color: '#fff' }
                },
                series: [
                    {
                        name: '核心系统监控',
                        type: 'treemap',
                        roam: false,
                        width: '100%',
                        height: '100%',
                        data: data,
                        breadcrumb: { show: false },
                        itemStyle: {
                            borderColor: '#0d2235',
                            borderWidth: 1,
                            gapWidth: 1
                        },
                        label: { show: true, formatter: '{b}\n{c}' }
                    }
                ]
            };
            chart.setOption(option);
        },
        renderLeftChart2() {
            const chart = this.ensureChart('leftChart2', 'left-chart-2');
            if (!chart) return;
            const alerts = [
                { name: '预警链路断连', value: 342 },
                { name: '主机不可用', value: 289 },
                { name: '主机CPU利用率过高', value: 245 },
                { name: '主机内存使用率过高', value: 210 },
                { name: '主机存储空间使用率过高', value: 189 },
                { name: '主机重启', value: 156 },
                { name: '主机网络流速过高', value: 120 },
                { name: '主机连接数过高', value: 98 },
                { name: 'DB服务不可用', value: 76 },
                { name: 'DB节点宕机', value: 45 }
            ];

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    backgroundColor: 'rgba(7, 19, 32, 0.9)',
                    borderColor: '#00f3ff',
                    textStyle: { color: '#fff' }
                },
                grid: { top: 0, right: 30, bottom: 0, left: 10, containLabel: true },
                xAxis: {
                    type: 'value',
                    show: false,
                    splitLine: { show: false }
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: alerts.map(a => a.name),
                    axisLabel: { color: '#e9f5ff', fontSize: 11 },
                    axisLine: { show: false },
                    axisTick: { show: false }
                },
                series: [
                    {
                        name: '告警次数',
                        type: 'bar',
                        barWidth: 10,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                { offset: 0, color: '#00f3ff' },
                                { offset: 1, color: 'rgba(0, 243, 255, 0.1)' }
                            ]),
                            borderRadius: [0, 4, 4, 0]
                        },
                        data: alerts.map(a => a.value),
                        label: {
                            show: true,
                            position: 'right',
                            color: '#00f3ff',
                            fontSize: 12,
                            fontWeight: 'bold'
                        }
                    }
                ]
            };
            chart.setOption(option);
        },
        renderLeftChart3() {
            const chart = this.ensureChart('leftChart3', 'left-chart-3');
            if (!chart) return;
            const names = this.hospitals.map((item) => item.alias || item.name);
            const option = {
                tooltip: { trigger: 'axis', backgroundColor: 'rgba(7, 19, 32, 0.9)', borderColor: '#00f3ff', textStyle: { color: '#fff' } },
                grid: { top: 40, right: 20, bottom: 40, left: 40, containLabel: true },
                legend: { top: 0, textStyle: { color: '#88aef6' }, itemWidth: 14 },
                xAxis: {
                    type: 'category',
                    data: names,
                    axisLabel: { color: '#88aef6', interval: 0, rotate: 15, fontSize: 11 },
                    axisLine: { lineStyle: { color: 'rgba(0,243,255,0.2)' } }
                },
                yAxis: { type: 'value', axisLabel: { color: '#88aef6' }, splitLine: { lineStyle: { color: 'rgba(0,243,255,0.1)', type: 'dashed' } } },
                series: [
                    {
                        name: '告警产生量',
                        type: 'bar',
                        barWidth: 12,
                        itemStyle: { color: '#ff2a2a', borderRadius: [4, 4, 0, 0] },
                        data: [185, 120, 140, 155]
                    },
                    {
                        name: '告警解决量',
                        type: 'bar',
                        barWidth: 12,
                        itemStyle: { color: '#00ff88', borderRadius: [4, 4, 0, 0] },
                        data: [172, 105, 138, 140]
                    }
                ]
            };
            chart.setOption(option);
        },
        async renderChina3DMap() {
            const chart = this.ensureChart('china3d', 'china-map-chart');
            if (!chart) return;

            const colorMap = { normal: '#00ff88', warning: '#ffb800', critical: '#ff2a2a' };

            const scatterData = this.hospitals.map((item) => ({
                name: item.name,
                alias: item.alias,
                value: [...item.coord],
                hospitalId: item.id,
                status: item.status,
                city: item.city,
                level: item.level,
                unhandledAlerts: item.unhandledAlerts,
                mtta: item.mtta,
                mttr: item.mttr,
                activeAlerts: item.activeAlerts,
                label: {
                    position: item.id === 'beijing' ? 'left' : 'right'
                }
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
                            if (params.seriesType === 'effectScatter') {
                                const data = params.data;
                                return [
                                    '<div style="font-weight:700;margin-bottom:6px;font-size:16px;" title="' + data.name + '">' + (data.alias || data.name) + '</div>',
                                    '<div style="font-size:13px;color:#5e8baf;margin-bottom:4px">' + data.city + ' · ' + data.level + '</div>',
                                    '<div style="font-size:13px;color:#fff;margin-bottom:2px">未认领：<span style="color:#ff6a6a;font-weight:700">' + data.unhandledAlerts + '</span></div>',
                                    '<div style="font-size:13px;color:#fff;margin-bottom:2px">处理中：<span style="color:#ffca63;font-weight:700">' + data.activeAlerts + '</span></div>',
                                    '<div style="font-size:13px;color:#fff">已关闭：<span style="color:#3ed6c6;font-weight:700">' + (data.activeAlerts * 4 + 15) + '</span></div>'
                                ].join('');
                            }
                            return params.name;
                        }
                    },
                    geo: {
                        map: 'china',
                        roam: true,
                        layoutCenter: ['50%', '62%'], // 调整地图向下偏移
                        layoutSize: '100%',
                        itemStyle: {
                            areaColor: 'rgba(8, 28, 51, 0.8)',
                            borderColor: 'rgba(0, 243, 255, 0.6)',
                            borderWidth: 1.5
                        },
                        label: {
                            show: false,
                            color: '#e9f5ff'
                        },
                        emphasis: {
                            label: {
                                show: false
                            },
                            itemStyle: {
                                areaColor: 'rgba(0, 136, 255, 0.4)',
                                borderColor: 'rgba(0, 243, 255, 1)',
                                borderWidth: 2
                            }
                        }
                    },
                    series: [
                        {
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: scatterData,
                            symbolSize: 14,
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke',
                                scale: 3
                            },
                            itemStyle: {
                                color: (params) => colorMap[params.data.status],
                                opacity: 1
                            },
                            label: {
                                show: true,
                                formatter: (params) => params.data.alias || params.data.name,
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
                                    shadowBlur: 10,
                                    shadowColor: '#fff'
                                }
                            }
                        }
                    ]
                });

                chart.off('click');
                chart.on('click', (params) => {
                    if ((params.seriesType === 'scatter' || params.seriesType === 'effectScatter') && params.data && params.data.hospitalId) {
                        this.selectedHospitalId = params.data.hospitalId;
                    }
                });

            } catch (error) {
                console.error('Failed to load 2D Map:', error);
            }
        },
        renderHqCompareChart() {
            const chart = this.ensureChart('hqCompare', 'hq-compare-chart');
            if (!chart) return;
            const names = this.sortedHospitals.map((item) => item.alias || item.name);
            chart.setOption({
                tooltip: { trigger: 'axis' },
                legend: { top: 0, right: 0, textStyle: { color: '#c8e5f5' } },
                grid: { left: 45, right: 20, bottom: 45, top: 40 },
                xAxis: {
                    type: 'category',
                    data: names,
                    axisLabel: { color: '#86a6bc', interval: 0, rotate: 25, fontSize: 11 },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: {
                    type: 'value',
                    name: '分钟',
                    nameTextStyle: { color: '#86a6bc', align: 'left', padding: [0, 20, 0, 0] },
                    axisLabel: { color: '#86a6bc' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [
                    {
                        name: 'MTTA',
                        type: 'bar',
                        barWidth: 16,
                        data: this.sortedHospitals.map((item) => item.mttaValue),
                        itemStyle: { color: '#36d8c6', borderRadius: [8, 8, 0, 0] },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ],
                            lineStyle: { type: 'dashed', color: '#36d8c6' },
                            label: { position: 'end', formatter: '平均\n{c}' }
                        }
                    },
                    {
                        name: 'MTTR',
                        type: 'line',
                        smooth: true,
                        symbolSize: 8,
                        data: this.sortedHospitals.map((item) => item.mttrValue),
                        lineStyle: { color: '#ffca63', width: 3 },
                        itemStyle: { color: '#ffca63' },
                        areaStyle: { color: 'rgba(255, 202, 99, 0.12)' },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ],
                            lineStyle: { type: 'dashed', color: '#ffca63' },
                            label: { position: 'end', formatter: '平均\n{c}' }
                        }
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
                        { value: closed, name: '已关闭', itemStyle: { color: '#3ed6c6' } },
                        { value: active, name: '处理中', itemStyle: { color: '#ffca63' } },
                        { value: unhandled, name: '未认领', itemStyle: { color: '#ff6a6a' } }
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
