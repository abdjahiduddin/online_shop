const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json')

const getDataFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err || fileContent.length == 0) {
            return cb([])
        }
        cb(JSON.parse(fileContent))
    })
}

module.exports = class {
    constructor(t) {
        this.title = t
    }

    save() {
        getDataFromFile( products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => { })
        })
    }

    static fetchAll(cb) {
        getDataFromFile(cb)
    }

    // save() {
    //     const p = path.join(
    //         path.dirname(process.mainModule.filename),
    //         'data',
    //         'products.json'
    //     );
    //     fs.readFile(p, (err, fileContent) => {
    //         let products = [];
    //         if (!err) {
    //             products = JSON.parse(fileContent);
    //         }
    //         products.push(this);
    //         fs.writeFile(p, JSON.stringify(products), err => { });
    //     });
    // }

    // static fetchAll(cb) {
    //     const p = path.join(
    //         path.dirname(process.mainModule.filename),
    //         'data',
    //         'products.json'
    //     );
    //     fs.readFile(p, (err, fileContent) => {
    //         if (err) {
    //             cb([]);
    //         }
    //         cb(JSON.parse(fileContent));
    //     });
    // }
}