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
            throw new Error("Targetprocess credentials are required");
        }

        if (!options.domain) {
            throw new Error("A Targetprocess domain is required");
        }

        const base = `${options.protocol}://${options.domain}/api/v${options.version}`;
        return base;
    }

    module.exports = factory;
}());
