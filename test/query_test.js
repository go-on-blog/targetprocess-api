/*jslint
    es6, node, this
*/
const {describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const sut = require("../src/query");
const {uri, token} = require("../config/credentials");
chai.use(chaiAsPromised);

describe("query", function () {
    "use strict";

    describe("factory", function () {
        it("should return an object having a specific api", function () {
            const query = sut(uri, token);
            const api = ["get", "pick", "omit", "where", "append", "take", "skip", "context"];

            expect(query).to.be.an("object");
            api.forEach(function (name) {
                expect(query).to.have.own.property(name);
                expect(query[name]).to.be.a("function");
            });
        });
    });
});
