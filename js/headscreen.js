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
            selectedResponseLevel: '全部',
            selectedTicketStatus: '全部',
            modalAlertLevels: ['P0', 'P1', 'P2', 'P3'],
            modalProject: 'all',
            modalObjType: 'all',
            modalSkill: 'all',
            modalRole: 'all',
            modalTimeRange: 'month',
            userCurrentPage: 1,
            userPageSize: 8,
            activeAppTab: 'core',
            systemAlertModalVisible: false,
            alertModalActiveTab: 'active',
            alertActivePage: 1,
            alertHistoryPage: 1,
            alertPageSize: 8,
            dutyPersonnel: [
                { name: '王建国', role: '系统管理员', phone: '138-1234-5678' },
                { name: '刘洋', role: '网络工程师', phone: '139-9876-5432' },
                { name: '张伟', role: '数据库运维', phone: '158-1122-3344' }
            ]
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
        centerNodes() {
            // 按照图片的精确节点数生成数据
            const buildLayerMetric = (layerType, isError, category) => {
                if (layerType === 'app') {
                    const podTotal = Math.floor(6 + Math.random() * 5);
                    const podAlive = isError
                        ? Math.max(1, podTotal - (1 + Math.floor(Math.random() * Math.min(3, podTotal - 1))))
                        : podTotal;
                    return {
                        metricName: '错误率',
                        metricValue: isError ? Number((1.2 + Math.random() * 2.8).toFixed(2)) : Number((0.01 + Math.random() * 0.18).toFixed(2)),
                        metricUnit: '%',
                        appMetrics: [
                            {
                                label: 'POD存活',
                                value: `${podAlive}|${podTotal}`,
                                unit: ''
                            },
                            {
                                label: '错误率',
                                value: isError ? Number((1.2 + Math.random() * 2.8).toFixed(2)) : Number((0.01 + Math.random() * 0.18).toFixed(2)),
                                unit: '%'
                            },
                            {
                                label: 'P50响应',
                                value: isError ? Math.floor(280 + Math.random() * 260) : Math.floor(35 + Math.random() * 90),
                                unit: 'ms'
                            },
                            {
                                label: '吞吐率',
                                value: isError ? Number((220 + Math.random() * 180).toFixed(1)) : Number((520 + Math.random() * 380).toFixed(1)),
                                unit: 'req/s'
                            }
                        ]
                    };
                }

                if (layerType === 'db') {
                    if (category === 'RocketMQ') {
                        return {
                            metricName: '消息堆积',
                            metricValue: isError ? Math.floor(800 + Math.random() * 900) : Math.floor(20 + Math.random() * 120),
                            metricUnit: '条'
                        };
                    }

                    return {
                        metricName: '连接使用率',
                        metricValue: isError ? Number((86 + Math.random() * 8).toFixed(1)) : Number((38 + Math.random() * 28).toFixed(1)),
                        metricUnit: '%'
                    };
                }

                const cpuLoad = isError ? Number((7.2 + Math.random() * 2.3).toFixed(2)) : Number((1.1 + Math.random() * 3.8).toFixed(2));
                const memoryUsage = isError ? Number((82 + Math.random() * 12).toFixed(1)) : Number((32 + Math.random() * 26).toFixed(1));
                const diskUsage = isError ? Number((84 + Math.random() * 10).toFixed(1)) : Number((36 + Math.random() * 28).toFixed(1));
                return {
                    metricName: 'CPU负载',
                    metricValue: cpuLoad,
                    metricUnit: '',
                    vmMetrics: [
                        {
                            label: 'CPU负载',
                            value: cpuLoad,
                            unit: ''
                        },
                        {
                            label: '内存使用率',
                            value: memoryUsage,
                            unit: '%'
                        },
                        {
                            label: '目录使用率',
                            value: diskUsage,
                            unit: '%'
                        }
                    ]
                };
            };

            const topCategories = [
                { cat: 'LIS', n: 11 }, { cat: 'PACS', n: 8 }, { cat: '专科', n: 8 }, { cat: '公卫', n: 7 },
                { cat: '区域检验', n: 8 }, { cat: '医生', n: 8 }, { cat: '基础', n: 8 }, { cat: '急诊', n: 8 },
                { cat: '技术', n: 8 }, { cat: '护士', n: 5 }, { cat: '集成', n: 1 }, { cat: '外部接口', n: 10 }
            ];
            const errorNodes = ['LIS11', '公卫7', '区域检验1', '医生5'];
            const middlewareErrorNodes = ['RocketMQ实例2', 'Redis实例3'];
            const vmErrorNodes = ['RocketMQ VM实例2', 'Mysql VM实例1'];
            const nodes = [];

            topCategories.forEach(obj => {
                for (let i = 1; i <= obj.n; i++) {
                    const nodeName = obj.cat + i;
                    const health = errorNodes.includes(nodeName) ? 60 : 100;
                    const metric = buildLayerMetric('app', health < 85, obj.cat);
                    nodes.push({
                        name: nodeName,
                        category: obj.cat,
                        value: health,
                        layerType: 'app',
                        metricName: metric.metricName,
                        metricValue: metric.metricValue,
                        metricUnit: metric.metricUnit,
                        appMetrics: metric.appMetrics,
                        symbol: obj.cat === '外部接口' ? 'circle' : undefined
                    });
                }
            });

            // 数据库与中间件
            const dbConfigs = [
                { name: 'Oracle DB', count: 2 },
                { name: 'RocketMQ', count: 4 },
                { name: 'Redis', count: 4 },
                { name: 'Mysql DB', count: 2 },
                { name: 'Milvus DB', count: 2 }
            ];

            dbConfigs.forEach(conf => {
                for (let i = 1; i <= conf.count; i++) {
                    const dbNodeName = conf.name + '实例' + i;
                    const dbHealth = middlewareErrorNodes.includes(dbNodeName) ? 60 : 100;
                    const dbMetric = buildLayerMetric('db', false, conf.name);
                    nodes.push({
                        name: dbNodeName,
                        category: conf.name,
                        value: dbHealth,
                        layerType: 'db',
                        metricName: dbMetric.metricName,
                        metricValue: buildLayerMetric('db', dbHealth < 85, conf.name).metricValue,
                        metricUnit: dbMetric.metricUnit
                    });
                    // 同步的虚拟机
                    const vmCat = conf.name.replace(' DB', ' VM').replace('RocketMQ', 'RocketMQ VM').replace('Redis', 'Redis VM');
                    const vmNodeName = vmCat + '实例' + i;
                    const vmHealth = vmErrorNodes.includes(vmNodeName) ? 60 : 100;
                    const vmMetric = buildLayerMetric('vm', vmHealth < 85, vmCat);
                    nodes.push({
                        name: vmNodeName,
                        category: vmCat,
                        value: vmHealth,
                        layerType: 'vm',
                        metricName: vmMetric.metricName,
                        metricValue: vmMetric.metricValue,
                        metricUnit: vmMetric.metricUnit,
                        vmMetrics: vmMetric.vmMetrics
                    });
                }
            });

            return nodes;
        },
        pagedUserList() {
            const start = (this.userCurrentPage - 1) * this.userPageSize;
            return this.activeUserList.slice(start, start + this.userPageSize);
        },
        userTotalPages() {
            return Math.ceil(this.activeUserList.length / this.userPageSize) || 1;
        },
        // --- Alert Modal Computed ---
        activeAlertsData() {
            const arr = [];
            for (let i = 0; i < 35; i++) {
                arr.push({ id: 1000 + i, level: i % 4 === 0 ? 'P1' : 'P2', content: '系统组件服务降级或网关超时报错', time: '10:0' + (i % 9), status: '处理中' });
            }
            return arr;
        },
        historyAlertsData() {
            const arr = [];
            for (let i = 0; i < 120; i++) {
                arr.push({ id: 2000 + i, level: i % 5 === 0 ? 'P2' : 'P3', content: 'CPU内存使用率短暂峰值达到90%', time: '昨天', status: '已恢复' });
            }
            return arr;
        },
        pagedActiveAlerts() {
            const start = (this.alertActivePage - 1) * this.alertPageSize;
            return this.activeAlertsData.slice(start, start + this.alertPageSize);
        },
        activeAlertsTotalPages() {
            return Math.ceil(this.activeAlertsData.length / this.alertPageSize) || 1;
        },
        pagedHistoryAlerts() {
            const start = (this.alertHistoryPage - 1) * this.alertPageSize;
            return this.historyAlertsData.slice(start, start + this.alertPageSize);
        },
        historyAlertsTotalPages() {
            return Math.ceil(this.historyAlertsData.length / this.alertPageSize) || 1;
        },
        // -------------------------
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

            const formatTrend = (text) => text ? text.replace(/[提升下降]/g, '').replace('较上月', '').trim() : '';

            const _his = (availabilityValue - 0.02).toFixed(2);
            const _emr = (availabilityValue + 0.01).toFixed(2);
            const _lis = (availabilityValue - 0.05).toFixed(2);
            const _pacs = (availabilityValue + 0.04).toFixed(2);

            return [
                { label: 'HIS可用率', value: _his + '%', trendDirection: 'up', trendGood: true, trendText: '0.01%', tone: _his >= 99.9 ? 'good' : 'warn', span: 1 },
                { label: 'EMR可用率', value: _emr + '%', trendDirection: 'up', trendGood: true, trendText: '0.01%', tone: _emr >= 99.9 ? 'good' : 'warn', span: 1 },
                { label: 'LIS可用率', value: _lis + '%', trendDirection: 'down', trendGood: false, trendText: '0.02%', tone: _lis >= 99.9 ? 'good' : 'warn', span: 1 },
                { label: 'PACS可用率', value: _pacs + '%', trendDirection: 'up', trendGood: true, trendText: '0.03%', tone: _pacs >= 99.9 ? 'good' : 'warn', span: 1 },
                { label: '平均响应时长', value: hospital.responseAvg, note: '告警生成至处理中', trendDirection: hospital.weeklyCompare.response.direction, trendGood: hospital.weeklyCompare.response.good, trendText: formatTrend(hospital.weeklyCompare.response.delta), tone: 'info', span: 2 },
                { label: '平均恢复时长', value: hospital.recoveryAvg, note: '告警生成至关闭', trendDirection: 'down', trendGood: true, trendText: '13%', tone: 'info', span: 2 },
                { label: '问题闭环率', value: hospital.closureRate, note: '已关闭工单 / 总工单', trendDirection: hospital.weeklyCompare.closure.direction, trendGood: hospital.weeklyCompare.closure.good, trendText: formatTrend(hospital.weeklyCompare.closure.delta), tone: 'good', span: 2 },
                { label: '超时率', value: hospital.timeoutRate, note: '超时工单 / 总工单', trendDirection: hospital.weeklyCompare.timeout.direction, trendGood: hospital.weeklyCompare.timeout.good, trendText: formatTrend(hospital.weeklyCompare.timeout.delta), tone: Number.parseFloat(hospital.timeoutRate) <= 5 ? 'good' : 'warn', span: 2 }
            ];
        },
        compareCards() {
            const compare = this.selectedHospital.weeklyCompare;
            const formatTrend = (text) => text ? text.replace(/[提升下降]/g, '').replace('较上月', '').trim() : '';

            return [
                { label: '本周告警量', value: compare.alert.value, delta: formatTrend(compare.alert.delta), direction: compare.alert.direction, good: compare.alert.good, period: compare.alert.period },
                { label: '本周响应时长', value: compare.response.value, delta: formatTrend(compare.response.delta), direction: compare.response.direction, good: compare.response.good, period: compare.response.period },
                { label: '本周超时率', value: compare.timeout.value, delta: formatTrend(compare.timeout.delta), direction: compare.timeout.direction, good: compare.timeout.good, period: compare.timeout.period },
                { label: '本月可用率', value: compare.availability.value, delta: formatTrend(compare.availability.delta), direction: compare.availability.direction, good: compare.availability.good, period: compare.availability.period },
                { label: '本月闭环率', value: compare.closure.value, delta: formatTrend(compare.closure.delta), direction: compare.closure.direction, good: compare.closure.good, period: compare.closure.period }
            ];
        }
    },
    watch: {
        activeAppTab() {
            this.$nextTick(() => this.renderHospitalTopologyChart());
        },
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
                this.$nextTick(() => {
                    this.renderLeftChart1();
                    if (this.currentView !== 'hq') {
                        this.renderHospitalAlertChart();
                    }
                });
            }
        },
        selectedResponseLevel() {
            if (this.currentView !== 'hq') {
                this.$nextTick(() => this.renderHospitalResponseChart());
            }
        },
        selectedTicketStatus() {
            if (this.currentView !== 'hq') {
                this.$nextTick(() => this.renderHospitalTicketChart());
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
        this.$nextTick(() => {
            this.renderCharts();
        });
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
        getLiquidNodeStyle(index, total, value) {
            const isInner = index < 6;
            const radius = isInner ? 160 : 300;
            const count = isInner ? Math.min(6, total) : total - 6;
            const posIndex = isInner ? index : index - 6;
            const angle = (posIndex * (360 / count) - 90) * (Math.PI / 180);

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            let color = '#00ff88';
            let shadow = 'rgba(0, 255, 136, 0.4)';
            if (value < 70) { color = '#ff2a2a'; shadow = 'rgba(255, 42, 42, 0.4)'; }
            else if (value < 80) { color = '#ffb800'; shadow = 'rgba(255, 184, 0, 0.4)'; }
            else if (value < 90) { color = '#00f3ff'; shadow = 'rgba(0, 243, 255, 0.4)'; }

            return {
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                borderColor: color,
                boxShadow: `0 0 15px ${shadow}, inset 0 0 20px ${shadow}`
            };
        },
        getLiquidWaterStyle(value, isDelay = false) {
            let color = 'rgba(0, 255, 136, 0.6)';
            if (value < 70) { color = 'rgba(255, 42, 42, 0.6)'; }
            else if (value < 80) { color = 'rgba(255, 184, 0, 0.6)'; }
            else if (value < 90) { color = 'rgba(0, 243, 255, 0.6)'; }

            return {
                top: `calc(${100 - value}% - 140px)`,
                backgroundColor: color,
                animationDelay: isDelay ? '-3s' : '0s'
            };
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
                this.renderHospitalClosureTimeoutChart();
                this.renderHospitalTicketChart();
                this.renderHospitalResourceChart();
                this.renderHospitalTopologyChart();
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

            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                last7Days.push(`${d.getMonth() + 1}-${d.getDate()}`);
            }

            // 根据选中的告警级别进行数据折算 (模拟筛选变化)
            let multiplier = 0;
            if (this.selectedAlertLevels.includes('P0')) multiplier += 0.4;
            if (this.selectedAlertLevels.includes('P1')) multiplier += 0.3;
            if (this.selectedAlertLevels.includes('P2')) multiplier += 0.2;
            if (this.selectedAlertLevels.includes('P3')) multiplier += 0.1;

            // 如果全部都没选，默认展示0
            if (multiplier === 0) multiplier = 0;

            const filteredData = (this.selectedHospital.alertTrend || []).map(val => Math.round(val * multiplier));

            chart.setOption({
                tooltip: { trigger: 'axis' },
                grid: { left: 45, right: 20, top: 35, bottom: 30 },
                xAxis: {
                    type: 'category',
                    data: last7Days,
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
                    data: filteredData,
                    lineStyle: { color: '#7de7ff', width: 3 },
                    itemStyle: { color: '#7de7ff' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(125, 231, 255, 0.38)' },
                            { offset: 1, color: 'rgba(125, 231, 255, 0.02)' }
                        ])
                    }
                }]
            });
        },
        renderHospitalResponseChart() {
            const chart = this.ensureChart('hospitalResponse', 'hospital-response-chart');
            if (!chart) return;

            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                last7Days.push(`${d.getMonth() + 1}-${d.getDate()}`);
            }

            // 根据选择的级别调整模拟数据和SLA基线
            let multiplier = 1;
            let slaBaselineMtta = null;
            let slaBaselineMttr = null;
            if (this.selectedResponseLevel === 'P0') { multiplier = 0.4; slaBaselineMtta = 10; slaBaselineMttr = 30; }
            else if (this.selectedResponseLevel === 'P1') { multiplier = 0.6; slaBaselineMtta = 15; slaBaselineMttr = 60; }
            else if (this.selectedResponseLevel === 'P2') { multiplier = 1.2; slaBaselineMtta = 30; slaBaselineMttr = 120; }
            else if (this.selectedResponseLevel === 'P3') { multiplier = 2.0; slaBaselineMtta = 60; slaBaselineMttr = 240; }

            // 模拟 MTTR (恢复时长) 数据，通常比 MTTA (响应时长) 长
            const baseMtta = this.selectedHospital.responseTrend || [10, 12, 11, 15, 10, 9, 8];
            const mttaData = baseMtta.map(val => Math.max(1, Math.round(val * multiplier)));
            const mttrData = mttaData.map(val => val * 3 + Math.floor(Math.random() * 10));

            const legendData = ['平均响应时长 (MTTA)', '平均恢复时长 (MTTR)'];

            const seriesConfig = [
                {
                    name: '平均响应时长 (MTTA)',
                    type: 'line',
                    smooth: true,
                    data: mttaData,
                    lineStyle: { color: '#36d8c6', width: 3 },
                    itemStyle: { color: '#36d8c6' },
                    symbolSize: 8,
                    areaStyle: { color: 'rgba(62, 214, 198, 0.12)' }
                },
                {
                    name: '平均恢复时长 (MTTR)',
                    type: 'line',
                    smooth: true,
                    data: mttrData,
                    lineStyle: { color: '#a03fe8', width: 3 },
                    itemStyle: { color: '#a03fe8' },
                    symbolSize: 8,
                    areaStyle: { color: 'rgba(160, 63, 232, 0.12)' }
                }
            ];

            if (slaBaselineMtta) {
                seriesConfig.push({
                    name: '响应 SLA 基线',
                    type: 'line',
                    data: Array(last7Days.length).fill(slaBaselineMtta),
                    symbol: 'none',
                    lineStyle: { color: 'rgba(54, 216, 198, 0.4)', width: 2, type: 'dashed' }
                });
                seriesConfig.push({
                    name: '恢复 SLA 基线',
                    type: 'line',
                    data: Array(last7Days.length).fill(slaBaselineMttr),
                    symbol: 'none',
                    lineStyle: { color: 'rgba(160, 63, 232, 0.4)', width: 2, type: 'dashed' } // 与恢复时长同色系，降低可见度
                });
            }

            chart.setOption({
                tooltip: { trigger: 'axis' },
                legend: {
                    data: legendData,
                    textStyle: { color: '#86a6bc' },
                    top: 0
                },
                grid: { left: 45, right: 20, top: 35, bottom: 30 },
                xAxis: {
                    type: 'category',
                    data: last7Days,
                    axisLabel: { color: '#86a6bc' },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#86a6bc', formatter: '{value} 分' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: seriesConfig
            }, true);
        },
        renderHospitalClosureTimeoutChart() {
            const chart = this.ensureChart('hospitalClosureTimeout', 'hospital-closure-timeout-chart');
            if (!chart) return;

            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                last7Days.push(`${d.getMonth() + 1}-${d.getDate()}`);
            }

            // Mock Data for 7 days
            const closureRates = [94, 95, 96.5, 94.8, 97.2, 96.8, 98.1];
            const timeoutRates = [5.2, 4.8, 4.1, 5.1, 3.8, 4.2, 3.4];

            chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].name + '<br/>' +
                            params[0].seriesName + ': ' + params[0].value + '%<br/>' +
                            params[1].seriesName + ': ' + params[1].value + '%';
                    }
                },
                legend: {
                    data: ['闭环率', '超时率'],
                    textStyle: { color: '#86a6bc' },
                    top: 0
                },
                grid: { left: 45, right: 45, top: 35, bottom: 30 },
                xAxis: {
                    type: 'category',
                    data: last7Days,
                    axisLabel: { color: '#86a6bc' },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '闭环率(%)',
                        nameTextStyle: { color: '#86a6bc' },
                        min: 90,
                        max: 100,
                        axisLabel: { color: '#86a6bc', formatter: '{value}' },
                        splitLine: { show: false }
                    },
                    {
                        type: 'value',
                        name: '超时率(%)',
                        nameTextStyle: { color: '#86a6bc' },
                        min: 0,
                        max: 10,
                        axisLabel: { color: '#86a6bc', formatter: '{value}' },
                        splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                    }
                ],
                series: [
                    {
                        name: '闭环率',
                        type: 'line',
                        smooth: true,
                        data: closureRates,
                        lineStyle: { color: '#00f3ff', width: 3 },
                        itemStyle: { color: '#00f3ff' },
                        symbolSize: 8,
                        areaStyle: { color: 'rgba(0, 243, 255, 0.12)' },
                        yAxisIndex: 0
                    },
                    {
                        name: '超时率',
                        type: 'line',
                        smooth: true,
                        data: timeoutRates,
                        lineStyle: { color: '#ffcc00', width: 3 },
                        itemStyle: { color: '#ffcc00' },
                        symbolSize: 8,
                        yAxisIndex: 1
                    }
                ]
            });
        },
        renderHospitalTicketChart() {
            const chart = this.ensureChart('hospitalTicket', 'hospital-ticket-chart');
            if (!chart) return;

            let multiplier = 1;
            if (this.selectedTicketStatus === '未分派') multiplier = 0.15;
            else if (this.selectedTicketStatus === '处理中') multiplier = 0.4;
            else if (this.selectedTicketStatus === '待审核') multiplier = 0.2;
            else if (this.selectedTicketStatus === '已关闭') multiplier = 0.25;

            const baseData = [
                { value: 89, name: '事件', itemStyle: { color: '#ff6a6a' } },
                { value: 65, name: '请求', itemStyle: { color: '#00f3ff' } },
                { value: 24, name: '问题', itemStyle: { color: '#ffcc00' } },
                { value: 30, name: '变更', itemStyle: { color: '#36d8c6' } },
                { value: 12, name: '发布', itemStyle: { color: '#a03fe8' } },
                { value: 45, name: '巡检', itemStyle: { color: '#85ff53' } }
            ];

            const data = baseData.map(item => ({
                ...item,
                value: Math.max(1, Math.round(item.value * multiplier))
            }));

            chart.setOption({
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: 40, right: 20, top: 30, bottom: 25 },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.name),
                    axisLabel: { color: '#86a6bc', fontSize: 12 },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#86a6bc' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [
                    {
                        name: '工单数量',
                        type: 'bar',
                        barWidth: 15,
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 12
                        },
                        data: data.map(item => ({
                            value: item.value,
                            itemStyle: item.itemStyle
                        }))
                    }
                ]
            });
        },
        renderHospitalResourceChart() {
            const chart = this.ensureChart('hospitalResource', 'hospital-resource-chart');
            if (!chart) return;

            const storageData = {
                categories: ['S3', 'NAS'],
                total: [320, 180],
                used: [218, 124],
                remaining: [102, 56]
            };

            chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        return params[0].name + '<br/>' + params.map(item => `${item.seriesName}: ${item.value} TB`).join('<br/>');
                    }
                },
                legend: {
                    data: ['总空间', '已用', '剩余'],
                    top: 0,
                    textStyle: { color: '#86a6bc' }
                },
                grid: { left: 45, right: 20, top: 35, bottom: 25 },
                xAxis: {
                    type: 'category',
                    data: storageData.categories,
                    axisLabel: { color: '#86a6bc', fontSize: 12 },
                    axisLine: { lineStyle: { color: 'rgba(123,214,255,0.14)' } },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: 'value',
                    name: 'TB',
                    nameTextStyle: { color: '#86a6bc', padding: [0, 0, 0, -5] },
                    axisLabel: { color: '#86a6bc', formatter: '{value}' },
                    splitLine: { lineStyle: { color: 'rgba(123,214,255,0.08)' } }
                },
                series: [
                    {
                        name: '总空间',
                        type: 'bar',
                        barWidth: 16,
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#56f0df' },
                                { offset: 1, color: 'rgba(86, 240, 223, 0.18)' }
                            ])
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 12,
                            formatter: '{c} TB'
                        },
                        data: storageData.total
                    },
                    {
                        name: '已用',
                        type: 'bar',
                        barWidth: 16,
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#ffc95e' },
                                { offset: 1, color: 'rgba(255, 201, 94, 0.16)' }
                            ])
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 12,
                            formatter: '{c} TB'
                        },
                        data: storageData.used
                    },
                    {
                        name: '剩余',
                        type: 'bar',
                        barWidth: 16,
                        itemStyle: {
                            borderRadius: [4, 4, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#54b8ff' },
                                { offset: 1, color: 'rgba(84, 184, 255, 0.16)' }
                            ])
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 12,
                            formatter: '{c} TB'
                        },
                        data: storageData.remaining
                    }
                ]
            });
        },
        renderHospitalTopologyChart() {
            const chart = this.ensureChart('hospitalTopology', 'hospital-topology-chart');
            if (!chart) return;

            // 绑定双击事件显示告警详情弹窗
            chart.off('dblclick');
            chart.on('dblclick', (params) => {
                if (params.data && params.data.name !== '中心系统' && params.seriesName !== 'labels') {
                    this.systemAlertModalVisible = true;
                }
            });

            const dataNodes = this.centerNodes || [];
            if (dataNodes.length === 0) return;

            // 如果节点数量特别大（例如170个），切换展示方式：点阵蜂窝/散点图布局
            if (dataNodes.length > 50) {
                const scatterDataNormal = [];
                const scatterDataWarn = [];
                const labelData = [];
                const zoneData = [];
                const connectorLines = [];
                const zoneAnchors = {};
                const guideLineData = [];
                const zonePresets = {
                    app: { width: 132, height: 122, topOffset: 30, titleInset: 10 },
                    db: { width: 112, height: 96, topOffset: 20, titleInset: 10 },
                    vm: { width: 112, height: 96, topOffset: 20, titleInset: 10 }
                };
                const layerSymbols = {
                    app: 'path://M120 120H360V360H120zM420 120H660V360H420zM120 420H360V660H120zM420 420H660V660H420z',
                    db: 'path://M160 220C160 160 316 120 512 120C708 120 864 160 864 220V760C864 820 708 860 512 860C316 860 160 820 160 760V220zM160 220C160 280 316 320 512 320C708 320 864 280 864 220M160 490C160 550 316 590 512 590C708 590 864 550 864 490',
                    middleware: 'path://M160 250L320 170L480 250L320 330zM544 250L704 170L864 250L704 330zM160 470L320 390L480 470L320 550zM544 470L704 390L864 470L704 550zM352 610L512 530L672 610L512 690z',
                    vm: 'path://M150 160H874C915 160 948 193 948 234V404C948 445 915 478 874 478H150C109 478 76 445 76 404V234C76 193 109 160 150 160zM150 546H874C915 546 948 579 948 620V790C948 831 915 864 874 864H150C109 864 76 831 76 790V620C76 579 109 546 150 546zM188 248H736V390H188zM188 634H736V776H188zM792 248H846V302H792zM792 336H846V390H792zM792 634H846V688H792zM792 722H846V776H792z'
                };

                // 按照原图布局（3行4列+两排紧密的实例）
                const catLayout = {};
                const topCats = ['LIS', 'PACS', '专科', '公卫', '区域检验', '医生', '基础', '急诊', '技术', '护士', '集成', '外部接口'];
                const dbCats = ['Oracle DB', 'RocketMQ', 'Redis', 'Mysql DB', 'Milvus DB'];
                const vmCats = ['Oracle VM', 'RocketMQ VM', 'Redis VM', 'Mysql VM', 'Milvus VM'];
                const sharedGrid = {
                    fiveCols: [15, 155, 295, 435, 575],
                    fourCols: [85, 225, 365, 505],
                    threeCols: [155, 295, 435]
                };

                // 顶层11个模块布局处理：使用固定中心点，保证第三排不会因为列数不同而视觉错位
                const appCenters = {
                    'LIS': { centerX: sharedGrid.fourCols[0], baseY: 182 },
                    'PACS': { centerX: sharedGrid.fourCols[1], baseY: 182 },
                    '专科': { centerX: sharedGrid.fourCols[2], baseY: 182 },
                    '公卫': { centerX: sharedGrid.fourCols[3], baseY: 182 },
                    '区域检验': { centerX: sharedGrid.fourCols[0], baseY: 47 },
                    '医生': { centerX: sharedGrid.fourCols[1], baseY: 47 },
                    '基础': { centerX: sharedGrid.fourCols[2], baseY: 47 },
                    '急诊': { centerX: sharedGrid.fourCols[3], baseY: 47 },
                    '技术': { centerX: sharedGrid.fourCols[0], baseY: -88 },
                    '护士': { centerX: sharedGrid.fourCols[1], baseY: -88 },
                    '集成': { centerX: sharedGrid.fourCols[2], baseY: -88 },
                    '外部接口': { centerX: sharedGrid.fourCols[3], baseY: -88 }
                };
                topCats.forEach((cat) => {
                    catLayout[cat] = appCenters[cat];
                });

                // 数据库/中间件和虚机统一使用 5 列母网格，确保与上方 4 列/3 列形成整齐的内缩关系
                dbCats.forEach((cat, index) => {
                    catLayout[cat] = { centerX: sharedGrid.fiveCols[index], baseY: -240 };
                });

                // 虚拟机与数据库一一对应对其，在数据库的更下方
                vmCats.forEach((cat, index) => {
                    catLayout[cat] = { centerX: sharedGrid.fiveCols[index], baseY: -372 };
                });

                [
                    { name: '数据库/中间件层', y: -188, color: 'rgba(72,255,213,0.22)' },
                    { name: '虚机资源层', y: -338, color: 'rgba(72,255,213,0.22)' }
                ].forEach((guide) => {
                    guideLineData.push({
                        coords: [[-70, guide.y], [640, guide.y]],
                        lineStyle: {
                            color: guide.color,
                            width: 1,
                            type: 'dashed'
                        }
                    });
                });

                const groupedNodes = {};
                dataNodes.forEach(node => {
                    const cat = node.category || '其他';
                    if (!groupedNodes[cat]) groupedNodes[cat] = [];
                    groupedNodes[cat].push(node);
                });

                for (const cat in groupedNodes) {
                    const layout = catLayout[cat] || { centerX: 0, baseY: 300 };
                    const nodes = groupedNodes[cat];

                    const centerX = layout.centerX;
                    const baseY = layout.baseY;
                    const layerType = topCats.includes(cat) ? 'app' : (dbCats.includes(cat) ? 'db' : 'vm');

                    // 在该业务区块内计算内部小节点的排列，先获取其真实渲染跨径
                    let maxSubCols = 4;
                    // 拉开每个圆点的间距
                    let gapX = 26;
                    let gapY = 26;

                    if (cat === '护士') {
                        maxSubCols = 3;
                    } else if (dbCats.includes(cat) || vmCats.includes(cat)) {
                        maxSubCols = 2; // 圆点排成2列
                        gapX = 35;
                        gapY = 35;
                    } else if (cat === '集成') {
                        maxSubCols = 1;
                    }

                    // 根据真实节点数和单行最大列数求出最大宽度和最后标题应当所处的X中心位置 (由于节点从baseX散发产生偏移)
                    const actualCols = Math.min(nodes.length, maxSubCols);
                    const actualRows = Math.max(1, Math.ceil(nodes.length / maxSubCols));
                    const groupWidth = (actualCols - 1) * gapX;
                    const groupHeight = (actualRows - 1) * gapY;
                    const zonePreset = zonePresets[layerType];
                    const titleCenterX = centerX;
                    const nodeStartX = centerX - groupWidth / 2;
                    const zoneWidth = zonePreset.width;
                    const zoneHeight = zonePreset.height;
                    const zoneCenterY = baseY + zonePreset.topOffset - zoneHeight / 2;
                    const titleY = zoneCenterY - zoneHeight / 2 + zonePreset.titleInset;

                    zoneData.push({
                        value: [titleCenterX, zoneCenterY],
                        symbolSize: [zoneWidth, zoneHeight],
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                { offset: 0, color: 'rgba(23, 75, 84, 0.26)' },
                                { offset: 1, color: 'rgba(5, 25, 28, 0.10)' }
                            ]),
                            borderColor: 'rgba(73, 255, 218, 0.35)',
                            borderWidth: 1.2,
                            shadowBlur: 16,
                            shadowColor: 'rgba(73, 255, 218, 0.15)'
                        }
                    });

                    zoneAnchors[cat] = {
                        centerX: titleCenterX,
                        topY: zoneCenterY + zoneHeight / 2 - 12,
                        bottomY: zoneCenterY - zoneHeight / 2 + 12
                    };

                    // 添加该业务模块的标题文本
                    labelData.push({
                        name: cat,
                        value: [titleCenterX, titleY],
                        symbolSize: 1,
                        itemStyle: { color: 'transparent' },
                        label: {
                            show: true,
                            formatter: `{name|${cat}}`,
                            position: 'center',
                            align: 'center',
                            verticalAlign: 'middle',
                            rich: {
                                name: {
                                    width: zoneWidth,
                                    align: 'center',
                                    color: '#eafcff',
                                    fontSize: layerType === 'app' ? 15 : 13,
                                    fontWeight: 700,
                                    lineHeight: 20,
                                    textShadowColor: 'rgba(0, 243, 255, 0.25)',
                                    textShadowBlur: 10
                                }
                            }
                        }
                    });

                    nodes.forEach((node, i) => {
                        const sc = i % maxSubCols;
                        const sr = Math.floor(i / maxSubCols);
                        const isError = node.value < 85;

                        // 横纵坐标偏移量计算 (左上角开始排，向下向右扩展)
                        const px = nodeStartX + sc * gapX;
                        const py = baseY - sr * gapY;
                        const nodeSymbol = node.symbol || layerSymbols[layerType] || 'circle';
                        const nodeSymbolSize = isError
                            ? (layerType === 'app' ? 19 : 21)
                            : (layerType === 'app' ? 17 : (layerType === 'db' ? 19 : 18));
                        const nodeColor = isError
                            ? new echarts.graphic.RadialGradient(0.5, 0.5, 0.6, [
                                { offset: 0, color: '#fff4ef' },
                                { offset: 0.45, color: '#ff8f70' },
                                { offset: 1, color: '#ff3b3b' }
                            ])
                            : new echarts.graphic.RadialGradient(0.5, 0.5, 0.65, [
                                { offset: 0, color: '#e9fff8' },
                                { offset: 0.42, color: '#51ffd6' },
                                { offset: 1, color: '#00b98f' }
                            ]);

                        const pt = {
                            name: node.name,
                            category: cat,
                            layerType: node.layerType || layerType,
                            metricName: node.metricName,
                            metricValue: node.metricValue,
                            metricUnit: node.metricUnit,
                            appMetrics: node.appMetrics,
                            vmMetrics: node.vmMetrics,
                            value: [px, py, node.value],
                            symbol: nodeSymbol,
                            itemStyle: {
                                color: nodeColor,
                                borderColor: isError ? '#ffd0c5' : '#c7fff3',
                                borderWidth: 1,
                                shadowBlur: isError ? 28 : (layerType === 'app' ? 16 : 18),
                                shadowColor: isError ? 'rgba(255, 75, 75, 0.55)' : 'rgba(72,255,213,0.38)',
                                opacity: 0.96
                            },
                            symbolSize: nodeSymbolSize,
                        };

                        if (isError) scatterDataWarn.push(pt);
                        else scatterDataNormal.push(pt);
                    });
                }

                dbCats.forEach((dbCat) => {
                    const vmCat = dbCat.replace(' DB', ' VM').replace('RocketMQ', 'RocketMQ VM').replace('Redis', 'Redis VM');
                    if (!zoneAnchors[dbCat] || !zoneAnchors[vmCat]) return;
                    connectorLines.push({
                        coords: [
                            [zoneAnchors[dbCat].centerX, zoneAnchors[dbCat].bottomY],
                            [zoneAnchors[vmCat].centerX, zoneAnchors[vmCat].topY]
                        ],
                        lineStyle: {
                            color: 'rgba(129, 165, 255, 0.3)',
                            width: 1.6,
                            curveness: 0.08
                        }
                    });
                });

                chart.clear();
                chart.setOption({
                    animationDuration: 900,
                    animationDurationUpdate: 450,
                    tooltip: {
                        formatter: function (params) {
                            if (params.seriesName === 'labels' || params.seriesName === 'zones' || params.seriesName === 'links' || params.seriesName === 'guides' || params.seriesName === 'guideLabels') return '';
                            if (params.data.layerType === 'app' && Array.isArray(params.data.appMetrics)) {
                                const metrics = params.data.category === '外部接口'
                                    ? params.data.appMetrics.filter(item => item.label === '错误率' || item.label === 'P50响应')
                                    : params.data.appMetrics;
                                return `${params.data.name}<br/>${metrics.map(item => `${item.label}: ${item.value}${item.unit}`).join('<br/>')}`;
                            }
                            if (params.data.layerType === 'vm' && Array.isArray(params.data.vmMetrics)) {
                                return `${params.data.name}<br/>${params.data.vmMetrics.map(item => `${item.label}: ${item.value}${item.unit}`).join('<br/>')}`;
                            }
                            const metricName = params.data.metricName || '健康度';
                            const metricValue = params.data.metricValue !== undefined ? params.data.metricValue : params.data.value[2];
                            const metricUnit = params.data.metricUnit || '';
                            return `${params.data.name}<br/>${metricName}: ${metricValue}${metricUnit}`;
                        }
                    },
                    grid: { left: 40, right: 40, top: 40, bottom: 20 },
                    xAxis: { show: false, min: -80, max: 660 },
                    yAxis: { show: false, min: -460, max: 240 },
                    series: [
                        {
                            name: 'guides',
                            type: 'lines',
                            coordinateSystem: 'cartesian2d',
                            silent: true,
                            data: guideLineData,
                            z: 0,
                            lineStyle: {
                                color: 'rgba(112, 210, 228, 0.2)',
                                width: 1,
                                type: 'dashed'
                            }
                        },
                        {
                            name: 'links',
                            type: 'lines',
                            coordinateSystem: 'cartesian2d',
                            silent: true,
                            data: connectorLines,
                            z: 0,
                            lineStyle: {
                                color: 'rgba(112, 210, 228, 0.3)',
                                width: 1.5,
                                type: 'dashed',
                                curveness: 0.08
                            },
                            effect: {
                                show: true,
                                period: 4,
                                trailLength: 0.12,
                                symbol: 'circle',
                                symbolSize: 4,
                                color: '#9fc7ff'
                            }
                        },
                        {
                            name: 'zones',
                            type: 'scatter',
                            silent: true,
                            symbol: 'roundRect',
                            data: zoneData,
                            z: 1
                        },
                        {
                            name: 'labels',
                            type: 'scatter',
                            data: labelData,
                            symbol: 'circle',
                            silent: true // 忽略鼠标事件
                        },
                        {
                            type: 'scatter',
                            data: scatterDataNormal,
                            z: 3
                        },
                        {
                            type: 'effectScatter',
                            data: scatterDataWarn,
                            rippleEffect: { brushType: 'stroke', scale: 5, period: 2.4 },
                            itemStyle: { opacity: 1 },
                            zlevel: 2
                        }
                    ]
                });
                return;
            }

            const nodes = [];
            const links = [];
            const effectData = [];

            nodes.push({
                name: '中心系统',
                value: [0, 0],
                symbolSize: 70,
                itemStyle: { color: '#00f3ff' },
                label: { show: true, position: 'bottom', color: '#fff', fontSize: 14, fontWeight: 'bold' }
            });

            const angleStep = (Math.PI * 2) / dataNodes.length;
            const radius = 100;

            dataNodes.forEach((node, i) => {
                const angle = i * angleStep;
                const isError = node.value < 85;

                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                nodes.push({
                    name: node.name,
                    value: [x, y, node.value],
                    symbolSize: 45,
                    itemStyle: {
                        color: isError ? '#ff2a2a' : '#00ff88',
                    },
                    label: { show: true, position: 'top', color: '#fff', fontSize: 12 }
                });

                links.push({
                    source: '中心系统',
                    target: node.name,
                    lineStyle: {
                        color: isError ? '#ff2a2a' : '#00ff88',
                        width: isError ? 2 : 1,
                        curveness: 0.2
                    }
                });

                if (isError) {
                    effectData.push({
                        name: node.name,
                        value: [x, y, node.value],
                        symbolSize: 55,
                        itemStyle: { color: '#ff2a2a' },
                        tooltip: { formatter: node.name + ' (异常)' }
                    });
                }
            });

            chart.clear();
            chart.setOption({
                tooltip: {
                    formatter: function (params) {
                        return params.data && params.data.name ? params.data.name : '';
                    }
                },
                xAxis: { show: false, min: -150, max: 150 },
                yAxis: { show: false, min: -150, max: 150 },
                series: [
                    {
                        type: 'graph',
                        coordinateSystem: 'cartesian2d',
                        data: nodes,
                        links: links,
                        roam: true,
                        label: { show: true },
                        lineStyle: { opacity: 0.6 }
                    },
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'cartesian2d',
                        data: effectData,
                        rippleEffect: {
                            brushType: 'stroke',
                            scale: 2.5
                        },
                        label: { show: false },
                        zlevel: 1
                    }
                ]
            });
        }
    }
}).mount('#app');
