const Store = require('electron-store')

const store = new Store({
    Directory: {
        type: 'string'
    }
})

module.exports = store;