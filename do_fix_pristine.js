const fs = require('fs');

let data = fs.readFileSync('d:/RD2026/bigscreen/js/data/mock-data.js', 'utf8');

// 1. Replace the titles in time/sort metrics
data = data.replace(/'未处理告警'/g, "'未认领'");
data = data.replace(/'活动告警'/g, "'处理中'");

// 2. Replace Hospital 1
data = data.replace(/name: '上海瑞和医院',\s*city: '上海',\s*level: '三级甲等',\s*region: '华东',/g,
    `name: '红安县紧密型数字医共体建设项目',
            alias: '红安项目',
            city: '黄冈',
            level: '二级甲等',
            region: '华中',`);

data = data.replace(/coord: \[121\.47, 31\.23\]/, "coord: [114.62, 31.28]");

// 3. Replace Hospital 2
data = data.replace(/name: '北京同创医院',\s*city: '北京',\s*level: '三级甲等',\s*region: '华北',/g,
    `name: '武汉大学中南医院RS7项目',
            alias: '武大中南',
            city: '武汉',
            level: '三级甲等',
            region: '华中',`);

data = data.replace(/coord: \[116\.4, 39\.9\]/, "coord: [114.33, 30.54]");

// 4. Replace Hospital 3
data = data.replace(/name: '成都仁济医院',\s*city: '成都',\s*level: '三级医院',\s*region: '西南',/g,
    `name: '射阳县医共体项目',
            alias: '射阳医共体',
            city: '盐城',
            level: '二级甲等',
            region: '华东',`);

data = data.replace(/coord: \[104\.06, 30\.67\]/, "coord: [120.26, 33.77]");

// 5. Replace Hospital 4
data = data.replace(/name: '广州清源医院',\s*city: '广州',\s*level: '三级甲等',\s*region: '华南',/g,
    `name: '清华玉泉医院',
            alias: '清华玉泉',
            city: '北京',
            level: '三级医院',
            region: '华北',`);

data = data.replace(/coord: \[113\.27, 23\.13\]/, "coord: [116.25, 39.91]");

fs.writeFileSync('d:/RD2026/bigscreen/js/data/mock-data.js', data, 'utf8');
