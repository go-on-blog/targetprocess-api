/*jslint
    es6, node, this
*/
const {after, describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const factory = require("../create");
const credentials = require("../config/credentials");
const config = Object.assign({resource: "Projects"}, credentials);

chai.use(chaiAsPromised);

describe("create", function () {
    "use strict";
    var id;

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

    this.timeout(5000);

    describe("create", function () {
        it("should return an object having an id", function () {
            const sut = factory(config);
            const obj = {
                "Name": Math.random().toString(36).replace(/[^a-z]+/g, ""),
                "Abbreviation": Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 3)
            };
            const promise = sut.create(obj).then(function (item) {
                id = item.Id;
                return item;
            });

            return expect(promise)
                .to.eventually.be.an("object")
                .and.to.eventually.have.own.property("Id");
        });
    });

    after(function () {
        const remove = require("../remove")(config);
        return remove.remove(id);
    });
});
