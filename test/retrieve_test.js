/*jslint
    es6, node, this
*/
const {describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const factory = require("../retrieve");
const credentials = require("../config/credentials");
const config = Object.assign({resource: "Projects"}, credentials);

chai.use(chaiAsPromised);

describe("retrieve", function () {
    "use strict";

    describe("factory", function () {
        it("should throw an error when the resource is not allowed for retrieval", function () {
            function constructor() {
                factory(Object.assign({resource: "not allowed"}, credentials));
            }

            return expect(constructor).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const sut = factory(config);
            const api = ["get", "take", "skip", "where", "orderby", "orderbydesc", "pick", "omit", "append"];

            expect(sut).to.be.an("object");
            api.forEach(function (name) {
                expect(sut[name]).to.be.a("function");
            });
        });
    });

    this.timeout(10000);

    describe("get", function () {
        it("should return an object array corresponding to the specified resource", function () {
            const resources = [];

            function get(resource) {
                const sut = factory(Object.assign({resource}, credentials));
                return expect(sut.get()).to.eventually.be.an("array");
            }

            return Promise.all(resources.map(get));
        });
    });

    describe("take", function () {
        it("should return an array containing the specified item count", function () {
            const sut = factory(Object.assign({resource: "Features"}, credentials));
            const LIMIT = 2;

            return expect(sut.take(LIMIT).get())
                .to.eventually.be.an("array")
                .and.to.eventually.have.lengthOf(LIMIT);
        });
    });

    describe("skip", function () {
        it("should return items different from the previous page", function () {
            const sut = factory(Object.assign({resource: "UserStories"}, credentials));
            const LIMIT = 2;

            return expect(sut.take(LIMIT).get().then(function (first) {
                return sut.take(LIMIT).skip(LIMIT).get().then(function (second) {
                    const deepEquals = require("mout/lang/deepEquals");
                    return deepEquals(first, second);
                });
            })).to.eventually.be.false;
        });
    });

    describe("where", function () {
        it("should return a rejected promise when the expression contains a syntax error", function () {
            const sut = factory(Object.assign({resource: "UserStories"}, credentials));
            const syntaxError = "EntityState.Name 'In progress'";

            return expect(sut.where(syntaxError).get())
                .to.eventually.be.rejected;
        });

        it("should return a subset of resources corresponding to the specified condition", function () {
            const sut = factory(config);
            const condition = "Process.Name eq 'Scrum'";

            return expect(sut.get().then(function (set) {
                return sut.where(condition).get().then(function (subset) {
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

    describe("orderby", function () {
        it("should return an object array sorted by the specified attribute in ascending order", function () {
            const sut = factory(Object.assign({resource: "Bugs"}, credentials));
            const attribute = "Name";

            return expect(sut.orderby(attribute).get().then(function (items) {
                const sort = require("mout/array/sort");
                const equals = require("mout/array/equals");
                const actual = items.map((i) => i[attribute]);

                return equals(actual, sort(actual));
            })).to.eventually.be.true;
        });
    });

    describe("orderbydesc", function () {
        it("should return an object array sorted by the specified attribute in descending order", function () {
            const sut = factory(Object.assign({resource: "Bugs"}, credentials));
            const attribute = "Name";

            return expect(sut.orderbydesc(attribute).get().then(function (items) {
                const sort = require("mout/array/sort");
                const equals = require("mout/array/equals");
                const actual = items.map((i) => i[attribute]);

                return equals(actual, sort(actual).reverse());
            })).to.eventually.be.true;
        });
    });

    describe("pick", function () {
        it("should throw a TypeError when the given argument is not an array", function () {
            function pick() {
                const sut = factory(config);
                sut.pick(false);
            }

            return expect(pick).to.throw(TypeError);
        });

        it("should return objects with the specified attributes only", function () {
            const sut = factory(config);
            const attributes = ["CreateDate", "Abbreviation"];
            const alwaysPresent = ["ResourceType", "Id"];

            return expect(sut.pick(attributes).get().then(function (items) {
                function hasTheSpecifiedAttributesOnly(item) {
                    const equals = require("mout/array/equals");
                    const difference = require("mout/array/difference");

                    return equals(difference(Object.keys(item), attributes), alwaysPresent);
                }

                return items.every(hasTheSpecifiedAttributesOnly);
            })).to.eventually.be.true;
        });
    });

    describe("omit", function () {
        it("should throw a TypeError when the given argument is not an array", function () {
            function omit() {
                const sut = factory(config);
                sut.omit(false);
            }

            return expect(omit).to.throw(TypeError);
        });

        it("should return objects without the specified attributes", function () {
            const sut = factory(config);
            const attributes = ["CreateDate", "Abbreviation"];

            return expect(sut.omit(attributes).get().then(function (items) {
                function hasNoneOfTheSpecifiedAttributes(item) {
                    const intersection = require("mout/array/intersection");
                    return intersection(Object.keys(item), attributes).length === 0;
                }

                return items.every(hasNoneOfTheSpecifiedAttributes);
            })).to.eventually.be.true;
        });
    });

    describe("append", function () {
        it("should throw a TypeError when the given argument is not an array", function () {
            function omit() {
                const sut = factory(config);
                sut.omit(false);
            }

            return expect(omit).to.throw(TypeError);
        });

        it("should return objects with the specified calculations appended", function () {
            const sut = factory(config);
            const calculations = ["UserStories-Effort-Avg"];

            return expect(sut.append(calculations).get().then(function (items) {
                function hasTheSpecifiedCalculations(item) {
                    const intersection = require("mout/array/intersection");
                    return intersection(Object.keys(item), calculations).length === calculations.length;
                }

                return items.every(hasTheSpecifiedCalculations);
            })).to.eventually.be.true;
        });
    });
});
