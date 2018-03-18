/*jslint
    es6, node, this
*/
const {after, describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const sut = require("../create");
const {domain, token} = require("../config/credentials");
const uri = `https://${domain}/api/v1`;

chai.use(chaiAsPromised);

describe("create", function () {
    "use strict";
    var id;

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
            const obj = {
                "Name": Math.random().toString(36).replace(/[^a-z]+/g, ""),
                "Abbreviation": Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 3)
            };
            const promise = create.create(obj).then(function (item) {
                id = item.Id;
                return item;
            });

            return expect(promise)
                .to.eventually.be.an("object")
                .and.to.eventually.have.own.property("Id");
        });
    });

    after(function () {
        const factory = require("../remove");
        const remove = factory(uri, token, "Projects");

        return remove.remove(id);
    });
});
