/*jslint
    es6, node, this
*/
(function () {
    "use strict";

    const stampit = require("@stamp/it");
    const configure = require("./configure");

    module.exports = stampit(configure, {
        methods: {
            create(resource, obj) {
                const func = require("./create")(Object.assign(this.config, resource));
                return func.create(obj);
            },

            retrieve(resource) {
                const func = require("./retrieve")(Object.assign(this.config, resource));
                return func;
            },

            update(resource, obj) {
                const func = require("./update")(Object.assign(this.config, resource));
                return func.update(obj);
            },

            // "delete" is a reserved keyword in JavaScript
            remove(resource, id) {
                const func = require("./remove")(Object.assign(this.config, resource));
                return func.remove(id);
            }
        }
    });
}());
