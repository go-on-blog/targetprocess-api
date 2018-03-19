/*jslint
    es6, node, this
*/
(function () {
    "use strict";

    const stampit = require("@stamp/it");

    module.exports = stampit({
        statics: {
            resources: []
        },
        props: {
            uri: null
        },
        deepProps: {
            options: {
                method: "GET",
                json: true
            }
        },
        init(config = {}, {stamp}) {
            if (!stamp.resources.includes(config.resource)) {
                throw new Error(`"${config.resource}" is not available for this operation.`);
            }

            this.options.uri = `${this.uri}/${config.resource}/`;
            this.options.qs = {token: config.token};
        }
    });
}());
