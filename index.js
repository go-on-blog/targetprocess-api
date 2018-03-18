/*jslint
    es6, node
*/
(function () {
    "use strict";

    function factory(options) {
        options = options || {};
        options.version = options.version || 1;
        options.protocol = options.protocol || "https";

        if (!options.token && options.username && options.password) {
            options.token = new Buffer(`${options.username}:${options.password}`).toString("base64");
        }

        if (!options.token) {
            throw new Error("Targetprocess credentials are missing");
        }

        if (!options.domain) {
            throw new Error("Targetprocess domain is missing");
        }

        const base = `${options.protocol}://${options.domain}/api/v${options.version}`;

        function create(resource, obj) {
            const func = require("./create")(base, options.token, resource);
            return func.create(obj);
        }

        function retrieve(resource) {
            const func = require("./retrieve")(base, options.token, resource);
            return func;
        }

        function update(resource, obj) {
            const func = require("./update")(base, options.token, resource);
            return func.update(obj);
        }

        // "delete" is a reserved keyword in JavaScript
        function remove(resource, id) {
            const func = require("./remove")(base, options.token, resource);
            return func.remove(id);
        }

        return {
            create,
            retrieve,
            update,
            remove
        };
    }

    module.exports = factory;
}());
