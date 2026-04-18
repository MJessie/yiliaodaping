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
            hospitals: [],
            metricModalVisible: false,
            activeMetricTitle: '',
            activeModalCard: null,
            selectedAlertLevels: ['P0', 'P1', 'P2', 'P3'],
            modalAlertLevels: ['P0', 'P1', 'P2', 'P3'],
            modalProject: 'all',
            modalObjType: 'all',
            modalSkill: 'all',
            modalRole: 'all',
            modalTimeRange: 'month',
            userCurrentPage: 1,
            userPageSize: 8
        };
    },
    computed: {
        totalAlerts() {
            const active = this.hospitals.reduce((sum, item) => sum + item.activeAlerts, 0);
            const unhandled = this.hospitals.reduce((sum, item) => sum + item.unhandledAlerts, 0);
            const multiplier = this.selectedRange === 'week' ? 6.5 : this.selectedRange === 'month' ? 25 : 1;
            const closed = Math.round(426 * multiplier);
            return active + unhandled + closed;
        },
        activeUserList() {
            if (this.activeMetricTitle !== '一级运维' && this.activeMetricTitle !== '二级运维' && this.activeMetricTitle !== '医院数量') return [];
            let users = [];
            if (this.activeMetricTitle === '一级运维') {
                users = [
                    { name: '王建国', email: 'wangjian@hospital.com', project: 'shanghai', roles: ['项目经理'] },
                    { name: '李明', email: 'liming@hospital.com', project: 'beijing', roles: ['服务台'] },
                    { name: '张伟', email: 'zhangw@hospital.com', project: 'chengdu', roles: ['监控工程师'] },
                    { name: '刘洋', email: 'liuyang@hospital.com', project: 'guangzhou', roles: ['监控工程师', '服务台'] },
                    { name: '陈强', email: 'chenq@hospital.com', project: 'shanghai', roles: ['服务台'] },
                    { name: '杨波', email: 'yangbo@hospital.com', project: 'beijing', roles: ['项目经理'] },
                    { name: '赵勇', email: 'zhaoyong@hospital.com', project: 'chengdu', roles: ['监控工程师'] },
                    { name: '黄磊', email: 'huanglei@hospital.com', project: 'guangzhou', roles: ['服务台'] }
                ];
            } else if (this.activeMetricTitle === '二级运维') {
                users = [
                    { name: '孙伟', email: 'sunw@hospital.com', project: 'beijing', skills: ['操作系统工程师', '网络工程师'] },
                    { name: '周杰', email: 'zhoujie@hospital.com', project: 'shanghai', skills: ['数据库工程师'] },
                    { name: '吴刚', email: 'wugang@hospital.com', project: 'chengdu', skills: ['网络工程师', '虚拟化工程师', '存储工程师'] },
                    { name: '郑州', email: 'zhengz@hospital.com', project: 'guangzhou', skills: ['虚拟化工程师'] },
                    { name: '王飞', email: 'wangf@hospital.com', project: 'beijing', skills: ['存储工程师', '数据库工程师'] },
                    { name: '李娜', email: 'lina@hospital.com', project: 'shanghai', skills: ['研发工程师'] },
                    { name: '刘备', email: 'liub@hospital.com', project: 'chengdu', skills: ['操作系统工程师'] },
                    { name: '关羽', email: 'guanyu@hospital.com', project: 'guangzhou', skills: ['数据库工程师', '虚拟化工程师'] },
                    { name: '张飞', email: 'zhangf@hospital.com', project: 'shanghai', skills: ['网络工程师'] },
                    { name: '赵云', email: 'zhaoyun@hospital.com', project: 'beijing', skills: ['虚拟化工程师', '操作系统工程师'] },
                    { name: '马超', email: 'machao@hospital.com', project: 'chengdu', skills: ['存储工程师'] },
                    { name: '黄忠', email: 'huangz@hospital.com', project: 'guangzhou', skills: ['研发工程师', '网络工程师'] },
                    { name: '魏延', email: 'weiy@hospital.com', project: 'beijing', skills: ['操作系统工程师'] },
                    { name: '诸葛亮', email: 'zhugel@hospital.com', project: 'shanghai', skills: ['数据库工程师', '研发工程师'] },
                    { name: '司马懿', email: 'simayi@hospital.com', project: 'chengdu', skills: ['网络工程师'] },
                    { name: '郭嘉', email: 'guojia@hospital.com', project: 'guangzhou', skills: ['虚拟化工程师', '存储工程师'] },
                    { name: '曹操', email: 'caocao@hospital.com', project: 'beijing', skills: ['存储工程师'] },
                    { name: '孙权', email: 'sunquan@hospital.com', project: 'shanghai', skills: ['研发工程师'] },
                    { name: '周瑜', email: 'zhouyu@hospital.com', project: 'chengdu', skills: ['操作系统工程师', '数据库工程师'] },
                    { name: '陆逊', email: 'luxun@hospital.com', project: 'guangzhou', skills: ['数据库工程师'] }
                ];
            } else if (this.activeMetricTitle === '医院数量') {
                users = this.hospitals.map((h, i) => {
                    const sn = ['张', '王', '李', '赵', '陈', '刘', '周', '吴', '孙', '黄'];
                    const gn = ['伟', '芳', '娜', '强', '磊', '洋', '勇', '艳', '杰', '娟'];
                    return {
                        name: h.name,
                        email: '',
                        phone: h.city || '未知城市',
                        level: h.level || '无评级',
                        roles: [
                            '项目经理: ' + sn[i % 10] + gn[(i + 1) % 10],
                            '服务台: ' + sn[(i + 2) % 10] + gn[(i + 3) % 10],
                            '监控工程师: ' + sn[(i + 4) % 10] + gn[(i + 5) % 10]
                        ]
                    };
                });
            }

            users = users.map((u, index) => ({
                ...u,
                phone: u.phone || ('13' + (800000000 + Math.floor(Math.random() * 10000) + index * 1357).toString())
            }));

            if (this.activeMetricTitle !== '二级运维' && this.modalProject !== 'all') {
                users = users.filter(u => u.project === this.modalProject);
            }
            if (this.activeMetricTitle === '一级运维' && this.modalRole !== 'all') {
                users = users.filter(u => u.roles && u.roles.includes(this.modalRole));
            }
            if (this.activeMetricTitle === '二级运维' && this.modalSkill !== 'all') {
                users = users.filter(u => u.skills && u.skills.includes(this.modalSkill));
            }
            return users;
        },
        selectedClosedAlerts() {
            const multiplier = this.selectedRange === 'week' ? 6.5 : this.selectedRange === 'month' ? 25 : 1;
            return Math.round(426 * multiplier);
        },
        pagedUserList() {
            const start = (this.userCurrentPage - 1) * this.userPageSize;
            return this.activeUserList.slice(start, start + this.userPageSize);
        },
        userTotalPages() {
            return Math.ceil(this.activeUserList.length / this.userPageSize) || 1;
        },
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

            const baseCoverage = this.selectedRange === 'today' ? 99.2 : this.selectedRange === 'week' ? 99.7 : 99.9;
            const baseHit = this.selectedRange === 'today' ? 94.8 : this.selectedRange === 'week' ? 93.5 : 95.2;
            const baseL1 = this.selectedRange === 'today' ? 87.5 : this.selectedRange === 'week' ? 85.9 : 88.0;
            const baseReg = this.selectedRange === 'today' ? 99.8 : this.selectedRange === 'week' ? 99.5 : 99.9;

            // 总部运维视角管理成效核心指标
            return [
                { label: '监控覆盖度', value: baseCoverage + '%', yoyDir: 'up', yoyGood: true, yoyText: '3.1%', momDir: 'up', momGood: true, momText: '0.5%', tone: 'good' },
                { label: '故障命中率', value: baseHit + '%', yoyDir: 'up', yoyGood: true, yoyText: '5.2%', momDir: 'down', momGood: false, momText: '1.2%', tone: 'info' },
                { label: '一线解决率', value: baseL1 + '%', yoyDir: 'up', yoyGood: true, yoyText: '4.5%', momDir: 'up', momGood: true, momText: '2.1%', tone: 'good' },
                { label: '操作合规率', value: baseReg + '%', yoyDir: 'up', yoyGood: true, yoyText: '1.2%', momDir: 'up', momGood: true, momText: '0.1%', tone: 'info' },
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
        async selectedRange() {
            const rawData = window.MockData.hospitals;
            let multiplier = 1;
            let offset = 0;
            if (this.selectedRange === 'week') {
                multiplier = 6.5;
                offset = 2;
            } else if (this.selectedRange === 'month') {
                multiplier = 25;
                offset = 5;
            }

            // Randomize based on multiplier to simulate data shifts
            this.hospitals = rawData.map(hospital => ({
                ...hospital,
                activeAlerts: Math.max(1, Math.round(hospital.activeAlerts * multiplier * (1 + (Math.random() * 0.4 - 0.2)))),
                unhandledAlerts: Math.max(1, Math.round(hospital.unhandledAlerts * multiplier * (1 + (Math.random() * 0.4 - 0.2)))),
                p0Alerts: Math.round(hospital.p0Alerts * multiplier),
                p1Alerts: Math.round(hospital.p1Alerts * multiplier),
                p2Alerts: Math.round(hospital.p2Alerts * multiplier),
                p3Alerts: Math.round(hospital.p3Alerts * multiplier),
                mttaValue: Math.max(1, Math.round(hospital.mttaValue + offset + (Math.random() * 4 - 2))),
                mttrValue: Math.max(10, Math.round(hospital.mttrValue + offset * 2 + (Math.random() * 10 - 5)))
            }));

            this.$nextTick(() => this.renderCharts());
        },
        selectedAlertLevels: {
            deep: true,
            handler() {
                this.$nextTick(() => this.renderLeftChart1());
            }
        },
        modalAlertLevels: {
            deep: true,
            handler() {
                if (this.metricModalVisible && this.activeModalCard) {
                    this.$nextTick(() => this.renderMetricTrendChart(this.activeModalCard));
                }
            }
        },
        modalProject() {
            this.userCurrentPage = 1;
            if (this.metricModalVisible && this.activeModalCard) {
                this.$nextTick(() => this.renderMetricTrendChart(this.activeModalCard));
            }
        },
        modalSkill() {
            this.userCurrentPage = 1;
        },
        modalRole() {
            this.userCurrentPage = 1;
        },
        modalObjType() {
            if (this.metricModalVisible && this.activeModalCard) {
                this.$nextTick(() => this.renderMetricTrendChart(this.activeModalCard));
            }
        },
        modalTimeRange() {
            if (this.metricModalVisible && this.activeModalCard) {
                this.$nextTick(() => this.renderMetricTrendChart(this.activeModalCard));
            }
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
        toggleAlertLevel(level) {
            const idx = this.selectedAlertLevels.indexOf(level);
            if (idx > -1) {
                if (this.selectedAlertLevels.length > 1) {
                    this.selectedAlertLevels.splice(idx, 1);
                }
            } else {
                this.selectedAlertLevels.push(level);
            }
        },
        toggleModalAlertLevel(level) {
            const idx = this.modalAlertLevels.indexOf(level);
            if (idx > -1) {
                if (this.modalAlertLevels.length > 1) {
                    this.modalAlertLevels.splice(idx, 1);
                }
            } else {
                this.modalAlertLevels.push(level);
            }
        },
        openUsersModal(title) {
            this.metricModalVisible = true;
            this.activeMetricTitle = title;
            this.activeModalCard = null;
            this.userCurrentPage = 1;

            if (title === '运维概况') {
                this.$nextTick(() => {
                    this.renderOrgChart();
                });
            }
        },
        changeUserPage(page) {
            if (page >= 1 && page <= this.userTotalPages) {
                this.userCurrentPage = page;
            }
        },
        openMetricModal(card) {
            this.metricModalVisible = true;
            this.activeMetricTitle = card.label;
            this.activeModalCard = card;
            this.$nextTick(() => {
                this.renderMetricTrendChart(card);
            });
        },
        closeMetricModal() {
            this.metricModalVisible = false;
        },
        renderOrgChart() {
            const chart = this.ensureChart('orgChart', 'org-chart-container');
            if (!chart) return;

            const data = {
                name: '添翼整体解决方案运维团队',
                children: [
                    {
                        name: '一级运维',
                        children: [
                            { name: '项目经理', value: 2 },
                            { name: '服务台', value: 3 },
                            { name: '监控工程师', value: 3 }
                        ]
                    },
                    {
                        name: '二级运维',
                        children: [
                            { name: '网络工程师', value: 4 },
                            { name: '数据库工程师', value: 5 },
                            { name: '中间件工程师', value: 3 },
                            { name: '操作系统工程师', value: 4 },
                            { name: '虚拟化工程师', value: 4 },
                            { name: '存储工程师', value: 4 },
                            { name: 'CNIP工程师', value: 4 },
                            { name: '数盈平台工程师', value: 4 },
                            {
                                name: '研发工程师',
                                children: [
                                    { name: 'HIOS-技术', value: 1 },
                                    { name: 'HIOS-集成', value: 1 },
                                    { name: 'HIOS-基础', value: 1 },
                                    { name: 'HIOS-版本', value: 1 },
                                    { name: 'HIOS-护士', value: 1 },
                                    { name: 'HIOS-医生', value: 1 },
                                    { name: 'HIOS-专科', value: 1 },
                                    { name: '临床-LIS', value: 1 },
                                    { name: '临床-区域检验', value: 1 },
                                    { name: '临床-急诊', value: 1 },
                                    { name: '临床-手麻', value: 1 },
                                    { name: '临床-ICU', value: 1 },
                                    { name: '设备-连接', value: 1 },
                                    { name: '影像-PACS', value: 1 },
                                    { name: '影像-VNA', value: 1 },
                                    { name: '区域医疗-公卫', value: 1 }
                                ]
                            }
                        ]
                    }
                ]
            };

            chart.setOption({
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    backgroundColor: 'rgba(10, 24, 43, 0.9)',
                    borderColor: '#00f3ff',
                    textStyle: { color: '#fff' }
                },
                series: [
                    {
                        type: 'tree',
                        data: [data],
                        orient: 'TB',
                        top: '15%',
                        left: '2%',
                        bottom: '20%',
                        right: '2%',
                        symbolSize: 10,
                        itemStyle: {
                            color: '#00f3ff',
                            borderColor: '#00f3ff'
                        },
                        label: {
                            position: 'top',
                            verticalAlign: 'bottom',
                            align: 'center',
                            distance: 12,
                            fontSize: 14,
                            color: '#e9f5ff',
                            backgroundColor: 'rgba(0, 243, 255, 0.1)',
                            borderColor: 'rgba(0, 243, 255, 0.3)',
                            borderWidth: 1,
                            padding: [6, 12],
                            borderRadius: 4
                        },
                        leaves: {
                            label: {
                                position: 'bottom',
                                rotate: 0,
                                verticalAlign: 'top',
                                align: 'center',
                                distance: 10,
                                fontSize: 12,
                                padding: [4, 4],
                                backgroundColor: 'rgba(255, 184, 0, 0.1)',
                                borderColor: 'rgba(255, 184, 0, 0.3)',
                                color: '#ffb800'
                            }
                        },
                        lineStyle: {
                            color: 'rgba(0, 243, 255, 0.4)',
                            width: 1.5,
                            curveness: 0.5
                        },
                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750
                    }
                ]
            }, true);
        },
        renderMetricTrendChart(card) {
            const chart = this.ensureChart('metricTrend', 'metric-trend-chart');
            if (!chart) return;

            const days = [];
            const data = [];
            const now = new Date();
            let baseValue = parseFloat(card.value) || 90;
            let count = 30;

            const isRate = String(card.value).includes('%');

            if (this.modalTimeRange === 'week') {
                count = 7;
                if (!isRate && this.activeMetricTitle === '告警趋势') baseValue = baseValue * 0.25;
            } else if (this.modalTimeRange === 'year') {
                count = 12;
                if (!isRate && this.activeMetricTitle === '告警趋势') baseValue = baseValue * 30;
            }

            if (this.modalProject !== 'all') {
                if (this.activeMetricTitle === '告警趋势') {
                    baseValue = baseValue * 0.4;
                } else if (isRate) {
                    baseValue = baseValue * (1 - Math.random() * 0.05);
                } else {
                    baseValue = baseValue * (1 - Math.random() * 0.1);
                }
            }

            if (this.activeMetricTitle === '告警趋势') {
                const ratio = this.modalAlertLevels.length / 4;
                baseValue = baseValue * ratio;
                if (this.modalObjType !== 'all') {
                    baseValue = baseValue * 0.3;
                }
            }

            for (let i = count - 1; i >= 0; i--) {
                if (this.modalTimeRange === 'year') {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                } else {
                    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
                    days.push(`${d.getMonth() + 1}-${d.getDate()}`);
                }
                const val = baseValue * (1 + (Math.random() * 0.08 - 0.04));
                data.push(val.toFixed(1));
            }

            chart.setOption({
                tooltip: { trigger: 'axis' },
                grid: { left: 45, right: 20, top: 40, bottom: 40 },
                xAxis: {
                    type: 'category',
                    data: days,
                    axisLabel: { color: '#86a6bc', rotate: 30, fontSize: 11 },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    axisLabel: { color: '#86a6bc' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [{
                    name: card.label,
                    type: 'line',
                    data: data,
                    smooth: true,
                    lineStyle: { color: '#00f3ff', width: 3 },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(0,243,255,0.4)' },
                            { offset: 1, color: 'rgba(0,243,255,0.0)' }
                        ])
                    },
                    itemStyle: { color: '#00f3ff' },
                    symbol: 'emptyCircle',
                    symbolSize: 6
                }]
            });
        },
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

            const data = systems.reduce((acc, sys) => {
                const val = Math.floor(Math.random() * 50) + 10; // 随机生成告警总数
                let levelColor = '';
                let level = '';

                if (val >= 45) {
                    levelColor = 'rgba(255, 42, 42, 0.75)'; // P0 - 红色
                    level = 'P0';
                } else if (val >= 35) {
                    levelColor = 'rgba(255, 184, 0, 0.65)'; // P1 - 橙色
                    level = 'P1';
                } else if (val >= 20) {
                    levelColor = 'rgba(0, 243, 255, 0.45)'; // P2 - 蓝色，降低透明度变淡
                    level = 'P2';
                } else {
                    levelColor = 'rgba(0, 255, 136, 0.3)'; // P3 - 绿色，大幅降低透明度变淡
                    level = 'P3';
                }

                // 筛选逻辑
                if (this.selectedAlertLevels.includes(level)) {
                    acc.push({
                        name: sys,
                        value: val,
                        itemStyle: { color: levelColor }
                    });
                }
                return acc;
            }, []);

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

                chart.off('dblclick');
                chart.on('dblclick', (params) => {
                    if ((params.seriesType === 'scatter' || params.seriesType === 'effectScatter') && params.data && params.data.hospitalId) {
                        this.openHospital(params.data.hospitalId);
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
            const closed = this.selectedClosedAlerts;

            const total = closed + active + unhandled;
            const closureRate = total > 0 ? ((closed / total) * 100).toFixed(1) : 0;

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
                        text: '闭环率\n' + closureRate + '%',
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
