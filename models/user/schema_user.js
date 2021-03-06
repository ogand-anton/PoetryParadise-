module.exports = function () {
    var mongoose = require("mongoose");

    return mongoose.Schema({
        username: {type: String, required: true, trim: true, unique: true},
        password: {type: String, select: false},
        firstName: {type: String},
        lastName: {type: String},
        emailAddress: {type: String},
        phone: {type: String},
        facebook: {
            id: {type: String},
            token: {type: String}
        },
        google: {
            id: {type: String},
            token: {type: String}
        },
        adminFlag: {type: Boolean},
        dateCreated: {type: Date, required: true, default: Date.now}
    }, {collection: "user"});
};