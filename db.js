const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
        item: [],
        user: [],
        admin:[],
        comment:[],
        new_comment: []
    })
    .write();

module.exports = db
