module.exports = function (app, model) {
    var mongoose = require("mongoose"),
        poemFavoriteModel = model.poemFavoriteModel,
        userModel = model.userModel;
        poemModel = model.poemModel;
    // var poemModel = require('../models/poem/model_poem');

    app.delete("/api/poem/:userId", unFavoritePoem);
    app.get("/api/poem/users", findFavoriteUsers);
    app.get("/api/poem/:userId", findFavoritesByUser);
    app.put("/api/poem/:userId", favoritePoem);
    app.get("/api/poem", findPoemById);
    app.get("/api/poems", findAllPoemsByUser);
    app.post("/api/poem", createPoem);
    app.delete("/api/poem", deletePoem);


    function findPoemById(req, res) {
        var poemId = req.query.poemId;
        if(poemId) {
            poemModel
                .findPoemById(poemId)
                .then(function (poem) {
                    res.json.send(poem);

                }, function () {
                    res.setStus(404).send("poem not found");
                });
        }
        else {
            res.setStatus(404).send("userId not defined");

        }
    }

    function findAllPoemsByUser(req, res) {
        var userId = req.query.userId;
    }

    function createPoem(req, res) {
        var poemId = req.body.poemId;
        var poem = req.body.poem;
        if (poemId) {
            poemModel
                .updatePoem(poemId)
                .then(function (poem) {
                    res.json(poem);
                }, function () {
                    res.setStatus(501).send("unable to update poem");
                });
        }
        else {
            poemModel
                .createPoem(poem)
                .then(function (poem) {
                    res.json(poem);
                }, function () {
                    res.setStatus(501).send("unable to create poem");
                });
        }
    }

    function deletePoem(req, res) {

    }

    function favoritePoem(req, res) {
        var userId = req.params.userId,
            author = req.query.author,
            title = req.query.title;

        if (!(userId && author && title)) {
            res.json({msg: "Favorite must have user, author, and title"});
        } else {
            poemFavoriteModel
                .addFavorite(userId, author, title)
                .then(_genSuccessCb(res), _genErrorCb(res));
        }
    }

    function findFavoriteUsers(req, res) {
        var author = req.query.author,
            title = req.query.title;

        poemFavoriteModel
            .findFavorites(author, title)
            .then(function (favorites) {
                var userIds = favorites.map(function (fav) {return mongoose.Types.ObjectId(fav._userId)});

                userModel
                    .findUsers(userIds)
                    .then(_genSuccessCb(res), _genErrorCb(res));
            });
    }

    function findFavoritesByUser(req, res) {
        var userId = req.params.userId;

        poemFavoriteModel
            .findFavoritesByUser(userId)
            .then(_genSuccessCb(res, "favorites"), _genErrorCb(res));
    }

    function unFavoritePoem(req, res) {
        var userId = req.params.userId,
            favoriteId = req.query.favoriteId;

        poemFavoriteModel
            .removeFavorite(userId, favoriteId)
            .then(_genSuccessCb(res), _genErrorCb(res));
    }

    function _genErrorCb(res) {
        return function (err) {
            // res.status(400).send(err);
            res.json({msg: err.message});
        }
    }

    function _genSuccessCb(res, resultName) {
        var output = {};
        return function (results) {
            if (resultName) {
                output[resultName] = results;
                res.json(output);
            } else {
                res.json(results);
            }
        };
    }
};