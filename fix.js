const fs = require('fs');
const content = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');
const fixed = content.replace(/<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [0-9a-f]+/g, '$1');
fs.writeFileSync('frontend/src/pages/Home.jsx', fixed);
