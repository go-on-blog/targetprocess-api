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
        it("should throw an error when the resource is unknown", function () {
            function factory() {
                sut(uri, token, "unknown");
            }

            return expect(factory).to.throw(Error);
        });

        it("should return an object having the specified API", function () {
            const query = sut(uri, token, "Projects");
            const api = ["get", "take", "pick", "omit", "where", "append", "skip", "context"];

            expect(query).to.be.an("object");
            api.forEach(function (name) {
                expect(query).to.have.own.property(name);
                expect(query[name]).to.be.a("function");
            });
        });
    });

    this.timeout(5000);

    describe("get", function () {
        it("should return an object array", function () {
            const query = sut(uri, token, "Projects");

            return expect(query.get())
                .to.eventually.be.an("array");
        });
    });

    describe("take", function () {
        it("should return an array containing the specified item count", function () {
            const query = sut(uri, token, "Features");
            const LIMIT = 2;

            return expect(query.take(LIMIT).get())
                .to.eventually.be.an("array")
                .and.to.eventually.have.lengthOf(LIMIT);
        });
    });

    describe("skip", function () {
        it("should return items different from the previous page", function () {
            const query = sut(uri, token, "UserStories");
            const LIMIT = 2;

            return expect(query.take(LIMIT).get().then(function (first) {
                return query.take(LIMIT).skip(LIMIT).get().then(function (second) {
                    const deepEquals = require("mout/lang/deepEquals");
                    return deepEquals(first, second);
                });
            })).to.eventually.be.false;
        });
    });

    describe("where", function () {
        it("should return a rejected promise when the expression contains a syntax error", function () {
            const query = sut(uri, token, "UserStories");
            const syntaxError = "EntityState.Name 'In progress'";

            return expect(query.where(syntaxError).get())
                .to.eventually.be.rejected;
        });

        it("should return a subset of resources corresponding to the specified condition", function () {
            const query = sut(uri, token, "Projects");
            const condition = "Process.Name eq 'Scrum'";

            return expect(query.get().then(function (set) {
                return query.where(condition).get().then(function (subset) {
                    function belongsToSet(item) {
                        const deepEquals = require("mout/lang/deepEquals");
                        var i = 0;

                        while (i < set.length) {
                            if (deepEquals(item, set[i])) {
                                return true;
                            }
                            i += 1;
                        }

                        return false;
                    }

                    return (subset.length < set.length && subset.every(belongsToSet));
                });
            })).to.eventually.be.true;
        });
    });
});
