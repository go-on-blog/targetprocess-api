/*jslint
    es6, node, this
*/
"use strict";

const {describe, it} = require("mocha");

describe("create", function () {
    const chai = require("chai");
    const expect = chai.expect;
    const chaiAsPromised = require("chai-as-promised");
    const sinon = require("sinon");
    const factory = require("../create");
    const credentials = require("../config/credentials");
    const config = Object.assign({resource: "Projects"}, credentials);

    chai.use(chaiAsPromised);

    describe("factory", function () {
        it("should throw an error when the resource is not allowed for creation", function () {
            function constructor() {
                factory(Object.assign({resource: "not allowed"}, credentials));
            }

            return expect(constructor).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const sut = factory(config);
            const api = ["create"];

            expect(sut).to.be.an("object");
            api.forEach(function (name) {
                expect(sut[name]).to.be.a("function");
            });
        });
    });

    describe("create", function () {
        it("should return an object having an id", function () {
            const obj = {
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

            request.withArgs(options).resolves({Id: 1});

            return expect(sut.create(obj))
                .to.eventually.be.an("object")
                .and.to.eventually.have.own.property("Id");
        });

        it("should be idempotent", function () {
            const options1 = {
                method: "POST",
                uri: `https://${credentials.domain}/api/v1/Projects/`,
                qs: {token: credentials.token},
                body: {
                    Name: "x",
                    Abbreviation: "ABC"
                },
                json: true
            };
            const options2 = {
                method: "POST",
                uri: `https://${credentials.domain}/api/v1/Projects/`,
                qs: {token: credentials.token},
                body: {
                    Name: "y"
                },
                json: true
            };
            const request = sinon.stub();
            const sut = factory(Object.assign({request}, config));

            request.rejects();
            request.withArgs(options1).resolves({Id: 128});
            request.withArgs(options2).resolves({Id: 129});

            return expect(sut.create(options1.body).then(function () {
                return sut.create(options2.body);
            }))
                .to.eventually.be.fulfilled;
        });
    });
});
