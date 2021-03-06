var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/api-router-test');
var ThingSchema = new Schema({
    name: String,
    info: String,
    active: Boolean
});
var Thing = mongoose.model('Thing', ThingSchema);
var MoreThingSchema = new Schema({
    name: String,
    info: String
});
var MoreThing = mongoose.model('MoreThing', MoreThingSchema);
 

module.exports = {
    seedThings: seedThings
};

function seedThings(cb) {
    Thing.find({}).remove(function() {
        Thing.create({
            name: 'Development Tools',
            info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
        }, {
            name: 'Server and Client integration',
            info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
        }, {
            name: 'Smart Build System',
            info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
        }, {
            name: 'Modular Structure',
            info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
        }, {
            name: 'Optimized Build',
            info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
        }, {
            name: 'Deployment Ready',
            info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
        }, function() {
            MoreThing.find({}).remove(function() {
                MoreThing.create({
                    name: 'Development Tools',info:'xxxx'
                }, {
                    name: 'Server and Client integration'
                }, {
                    name: 'Smart Build System'
                }, {
                    name: 'Modular Structure'
                }, {
                    name: 'Optimized Build'
                }, {
                    name: 'Deployment Ready'
                }, function() {
                    cb();
                });
            });
        });
    });
}
