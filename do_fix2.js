const fs = require('fs');
let data = fs.readFileSync('d:/RD2026/bigscreen/js/data/mock-data.js'); // read buffer
// Wait, no, I'll just write a script that rebuilds `hospitals` properties:

data = fs.readFileSync('d:/RD2026/bigscreen/js/data/mock-data.js', 'utf8');

data = data.replace(/name: '[^']+',\s*city: '[^']+',/, "name: '红安县紧密型数字医共体建设项目',\n            alias: '红安项目',\n            city: '黄冈',");
data = data.replace(/name: '[^']+',\s*city: '[^']+',/, "name: '武汉大学中南医院RS7项目',\n            alias: '武大中南',\n            city: '武汉',");
data = data.replace(/name: '[^']+',\s*city: '[^']+',/, "name: '射阳县医共体项目',\n            alias: '射阳医共体',\n            city: '盐城',");

fs.writeFileSync('d:/RD2026/bigscreen/js/data/mock-data.js', data, 'utf8');
