const fs = require("fs");
const path = require("path");
const mark = require("marked");

fs.readdir('./markdown', function(error, files) {
    for(let item of files) {
        let p = path.join('./markdown', item);
        fs.readFile(p, 'utf-8', function(error, data) {
            const content = data.toString();
            console.log(content);
            const mardown = mark(content);            
            let template = fs.readFileSync('./template.html').toString();
            let result =  template.replace('%content%', mardown);
            fs.writeFileSync("./pulic/" + item + '.html', result);
        });
    }
});