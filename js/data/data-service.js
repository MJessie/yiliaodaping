// 数据服务层
//统一管理系统的mock数据，方便后续无缝对接到真实后端 API

window.DataService = {
    // 全局配置：设为 false 时将请求真实接口
    isMock: true,
    async getTimeRanges() { 
        if (!this.isMock) {
            // 真实接口调用示例
            // const resp = await fetch('/api/time-ranges');
            // const res = await resp.json();
            // return res.data;
        }
        return window.MockData.timeRanges; },

    async getSortMetrics() { 
        if (!this.isMock) {
            // const resp = await fetch('/api/sort-metrics');
            // const res = await resp.json();
            // return res.data;
        }
        return window.MockData.sortMetrics; },

    async getHospitals() { 
        if (!this.isMock) {
            // const resp = await fetch('/api/hospitals');
            // const res = await resp.json();
            // return res.data;
        }
        return window.MockData.hospitals; }
};


