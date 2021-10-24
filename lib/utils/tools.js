const fs = require('fs');
const path = require('path');
const ejs = require('ejs');


const compile = (templateName, data) => {
    const templateUrl = `../template/${templateName}`;
    const templatePath = path.resolve(__dirname, templateUrl);

    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, {
            data
        }, {}, (err, result) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

const mkdirSync = (pathName, errMsg = '目录已存在') => {
    if(fs.existsSync(pathName)) {
        return errMsg;
    }else {
        if(mkdirSync(path.dirname(pathName))) {
            fs.mkdirSync(pathName);
        }else {
            mkdirSync(pathName);
        }
    }
}

const writeFile = (path, content) => {
    return fs.promises.writeFile(path, content)
}

const readFile = (path, options) => {
    options = options || {
        encoding: 'utf8'
    }
    return fs.promises.readFile(path, options)
}

module.exports = {
    compile,
    writeFile,
    readFile,
}