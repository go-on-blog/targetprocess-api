/*jslint
    es6, node, this
*/
(function () {
    "use strict";

    function factory(uri, token) {
        const options = {
            qs: {token},
            json: true,
            headers: {Authorization: `Basic ${token}`}
        };

        function normalize(response) {
            return response.Items;
        }

        function get(entity) {
            const request = require("request-promise-native");
            options.uri = `${uri}/${entity}/`;
            return request(options).then(normalize);
        }

        function pick(keys) {
            if (options.qs.exclude) {
                options.js.exclude = null;
            }

            // Nested attributes are not supported yet
            options.qs.include = `[${keys.join(",")}]`;
            return this;
        }

        function omit(keys) {
            if (options.qs.include) {
                options.js.include = null;
            }

            // Nested attributes are not supported yet
            options.qs.exclude = `[${keys.join(",")}]`;
            return this;
        }

        function where(condition) {
            options.qs.where = condition;
            return this;
        }

        function append(keys) {
            options.qs.append = `[${keys.join(",")}]`;
            return this;
        }

        function take(count) {
            options.qs.take = count;
            return this;
        }

        function skip(count) {
            options.qs.skip = count;
            return this;
        }

        function context(id) {
            options.qs.acid = id;
            return this;
        }

        return {
            get,
            pick,
            omit,
            where,
            append,
            take,
            skip,
            context
        };
    }

    module.exports = factory;
}());
