/*jslint
    es6, node, this
*/
"use strict";

const {describe, it} = require("mocha");

describe("retrieve", function () {
    const chai = require("chai");
    const expect = chai.expect;
    const chaiAsPromised = require("chai-as-promised");
    const sinon = require("sinon");
    const factory = require("../retrieve");
    const credentials = require("../config/credentials");
    const config = Object.assign({resource: "UserStories"}, credentials);

    chai.use(chaiAsPromised);

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

    describe("get", function () {
        it("should return an object array corresponding to the specified resource", function () {
            const options = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {token: credentials.token},
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({Items: [1, 2, 3, 4]}));

            return expect(sut.get()).to.eventually.be.an("array");
        });
    });

    describe("take", function () {
        it("should return an array containing the specified item count", function () {
            const LIMIT = 2;
            const options = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    take: LIMIT
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({Items: [1, 2]}));

            return expect(sut.take(LIMIT).get())
                .to.eventually.be.an("array")
                .and.to.eventually.have.lengthOf(LIMIT);
        });
    });

    describe("skip", function () {
        it("should return items different from the previous page", function () {
            const LIMIT = 2;
            const options1 = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    take: LIMIT
                },
                json: true
            };
            const options2 = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    take: LIMIT,
                    skip: LIMIT
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options1).returns(Promise.resolve({Items: [1, 2]}));
            request.withArgs(options2).returns(Promise.resolve({Items: [3, 4]}));

            return expect(sut.take(LIMIT).get().then(function (first) {
                return sut.take(LIMIT).skip(LIMIT).get().then(function (second) {
                    const deepEquals = require("mout/lang/deepEquals");
                    return deepEquals(first, second);
                });
            })).to.eventually.be.false;
        });
    });

    describe("where", function () {
        it("should return a subset of resources corresponding to the specified condition", function () {
            const condition = "Project.Id eq 42";
            const options1 = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {token: credentials.token},
                json: true
            };
            const options2 = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    where: condition
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options1).returns(Promise.resolve({Items: [1, 2, 3, 4]}));
            request.withArgs(options2).returns(Promise.resolve({Items: [2, 4]}));

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
            const attribute = "Name";
            const options = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    orderby: attribute
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({Items: [
                {Id: 4, Name: "a"},
                {Id: 2, Name: "b"},
                {Id: 1, Name: "c"},
                {Id: 3, Name: "d"}
            ]}));

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
            const attribute = "Name";
            const options = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    orderbydesc: attribute
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({Items: [
                {Id: 3, Name: "d"},
                {Id: 1, Name: "c"},
                {Id: 2, Name: "b"},
                {Id: 4, Name: "a"}
            ]}));

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
            const attributes = ["CreateDate", "Progress"];
            const alwaysPresent = ["ResourceType", "Id"];
            const options = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    include: "[CreateDate,Progress]"
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({Items: [
                {ResourceType: "UserStory", Id: 1, CreateDate: null, Progress: 0},
                {ResourceType: "UserStory", Id: 2, CreateDate: null, Progress: 0},
                {ResourceType: "UserStory", Id: 3, CreateDate: null, Progress: 0},
                {ResourceType: "UserStory", Id: 4, CreateDate: null, Progress: 0}
            ]}));

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
            const attributes = ["CreateDate", "Progress"];
            const options = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    exclude: "[CreateDate,Progress]"
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({Items: [
                {ResourceType: "UserStory", Id: 1, Name: "c", EndDate: null},
                {ResourceType: "UserStory", Id: 2, Name: "b", EndDate: null},
                {ResourceType: "UserStory", Id: 3, Name: "d", EndDate: null},
                {ResourceType: "UserStory", Id: 4, Name: "a", EndDate: null}
            ]}));

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
            const calculations = ["UserStories-Effort-Avg"];
            const options = {
                method: "GET",
                uri: `https://${credentials.domain}/api/v1/UserStories/`,
                qs: {
                    token: credentials.token,
                    append: "[UserStories-Effort-Avg]"
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({Items: [
                {ResourceType: "UserStory", Id: 1, "UserStories-Effort-Avg": 21, EndDate: null},
                {ResourceType: "UserStory", Id: 2, "UserStories-Effort-Avg": 42, EndDate: null}
            ]}));

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
