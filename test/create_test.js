/*jslint
    es6, node, this
*/
const {describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const sut = require("../src/create");
const {uri, token} = require("../config/credentials");
chai.use(chaiAsPromised);

describe("create", function () {
    "use strict";

    describe("factory", function () {
        it("should throw an error when the resource is not allowed for creation", function () {
            function factory() {
                sut(uri, token, "not allowed");
            }

            return expect(factory).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const create = sut(uri, token, "Projects");
            const api = ["create"];

            expect(create).to.be.an("object");
            api.forEach(function (name) {
                expect(create).to.have.own.property(name);
                expect(create[name]).to.be.a("function");
            });
        });
    });

    this.timeout(5000);

    describe("create", function () {
        it("should return an object having an id", function () {
            const create = sut(uri, token, "Projects");
            const spec = {
                "Name": "Test",
                "Abbreviation": "TST"
            };

            return expect(create.create(spec))
                .to.eventually.be.an("object")
                .and.to.eventually.have.own.property("Id");
        });
    });
});
