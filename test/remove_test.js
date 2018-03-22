/*jslint
    es6, node, this
*/
"use strict";

const {describe, it} = require("mocha");

describe("remove", function () {
    const chai = require("chai");
    const expect = chai.expect;
    const chaiAsPromised = require("chai-as-promised");
    const sinon = require("sinon");
    const factory = require("../remove");
    const credentials = require("../config/credentials");
    const config = Object.assign({resource: "Projects"}, credentials);

    chai.use(chaiAsPromised);

    describe("factory", function () {
        it("should throw an error when the resource is not allowed for deletion", function () {
            function constructor() {
                factory(Object.assign({resource: "not allowed"}, credentials));
            }

            return expect(constructor).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const sut = factory(config);
            const api = ["remove"];

            expect(sut).to.be.an("object");
            api.forEach(function (name) {
                expect(sut[name]).to.be.a("function");
            });
        });
    });

    describe("remove", function () {
        it("should return a rejected promise when the Id is missing", function () {
            const sut = factory(config);

            return expect(sut.remove())
                .to.eventually.be.rejected;
        });

        it("should return a fulfilled promise", function () {
            const id = 42;
            const options = {
                method: "DELETE",
                uri: `https://${credentials.domain}/api/v1/Projects/${id}`,
                qs: {token: credentials.token},
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.withArgs(options).returns(Promise.resolve({statusCode: 200}));

            return expect(sut.remove(id))
                .to.eventually.be.fulfilled;
        });
    });
});
