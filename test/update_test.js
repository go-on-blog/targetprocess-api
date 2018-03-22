/*jslint
    es6, node, this
*/
"use strict";

const {describe, it} = require("mocha");

describe("update", function () {
    const chai = require("chai");
    const expect = chai.expect;
    const chaiAsPromised = require("chai-as-promised");
    const sinon = require("sinon");
    const factory = require("../update");
    const credentials = require("../config/credentials");
    const config = Object.assign({resource: "Projects"}, credentials);

    chai.use(chaiAsPromised);

    describe("factory", function () {
        it("should throw an error when the resource is not allowed for update", function () {
            function constructor() {
                factory(Object.assign({resource: "not allowed"}, credentials));
            }

            return expect(constructor).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const update = factory(config);
            const api = ["update"];

            expect(update).to.be.an("object");
            api.forEach(function (name) {
                expect(update[name]).to.be.a("function");
            });
        });
    });

    describe("update", function () {
        it("should return a rejected promise when the Id is missing", function () {
            const sut = factory(config);

            return expect(sut.update({"Name": "updated"}))
                .to.eventually.be.rejected;
        });

        it("should return an object having the specified properties changed", function () {
            const obj = {
                "Id": 42,
                "Name": "whatever",
                "Abbreviation": "WE"
            };
            const options = {
                method: "POST",
                uri: `https://${credentials.domain}/api/v1/Projects/`,
                qs: {token: credentials.token},
                body: obj,
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve(obj));

            return expect(sut.update(obj))
                .to.eventually.be.an("object")
                .and.to.include(obj);
        });
    });
});
