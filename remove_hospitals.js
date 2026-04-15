const fs = require('fs');
let data = fs.readFileSync('d:/RD2026/bigscreen/js/data/mock-data.js', 'utf8');
let t = data.indexOf("id: 'wuhan'");
if(t > -1) {
   let idx = data.lastIndexOf("{", t);
   let before = data.substring(0, idx).trim();
   if(before.endsWith(",")) { before = before.substring(0, before.length-1); }
   fs.writeFileSync('d:/RD2026/bigscreen/js/data/mock-data.js', before + '\n    ]\n};\n', 'utf8');
}
