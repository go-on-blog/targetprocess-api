/*jslint
    es6, node, this
*/
const {before, describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const sut = require("../src/remove");
const {domain, token} = require("../config/credentials");
const uri = `https://${domain}/api/v1`;

chai.use(chaiAsPromised);

describe("remove", function () {
    "use strict";
    var id;

    describe("factory", function () {
        it("should throw an error when the resource is not allowed for deletion", function () {
            function factory() {
                sut(uri, token, "not allowed");
            }

            return expect(factory).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const remove = sut(uri, token, "Projects");
            const api = ["remove"];

            expect(remove).to.be.an("object");
            api.forEach(function (name) {
                expect(remove).to.have.own.property(name);
                expect(remove[name]).to.be.a("function");
            });
        });
    });

    this.timeout(5000);

    before(function () {
        const factory = require("../src/create");
        const create = factory(uri, token, "Projects");
        const name = Math.random().toString(36).replace(/[^a-z]+/g, "");

        return create.create({"Name": name}).then(function (item) {
            id = item.Id;
        });
    });

    describe("remove", function () {
        it("should return a rejected promise when the Id is missing", function () {
            const remove = sut(uri, token, "Projects");

            return expect(remove.remove())
                .to.eventually.be.rejected;
        });

        it("should return a fulfilled promise", function () {
            const remove = sut(uri, token, "Projects");

            return expect(remove.remove(id))
                .to.eventually.be.fulfilled;
        });
    });
});
