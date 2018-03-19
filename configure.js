/*jslint
    es6, node, this
*/
(function () {
    "use strict";

    const stampit = require("@stamp/it");

    module.exports = stampit({
        props: {
            request: null,
            uri: null
        },
        init(config = {}) {
            this.request = config.request || require("request-promise-native");

            if (!this.uri) {
                const version = config.version || 1;
                const protocol = config.protocol || "https";

                this.config = config;

                if (!this.config.token && this.config.username && this.config.password) {
                    this.config.token = new Buffer(`${this.config.username}:${this.config.password}`).toString("base64");
                }

                if (!this.config.token) {
                    throw new Error("Targetprocess credentials are missing (either a token or a username/password pair is required)");
                }

                if (!this.config.domain) {
                    throw new Error("Targetprocess domain is missing");
                }

                this.uri = `${protocol}://${this.config.domain}/api/v${version}`;
            }
        }
    });
}());
