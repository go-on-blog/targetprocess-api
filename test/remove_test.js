/*jslint
    es6, node, this
*/
const {before, describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const factory = require("../remove");
const credentials = require("../config/credentials");
const config = Object.assign({resource: "Projects"}, credentials);

chai.use(chaiAsPromised);

describe("remove", function () {
    "use strict";
    var id;

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

    this.timeout(5000);

    before(function () {
        const create = require("../create")(config);
        const name = Math.random().toString(36).replace(/[^a-z]+/g, "");

        return create.create({"Name": name}).then(function (item) {
            id = item.Id;
        });
    });

    describe("remove", function () {
        it("should return a rejected promise when the Id is missing", function () {
            const sut = factory(config);

            return expect(sut.remove())
                .to.eventually.be.rejected;
        });

        it("should return a fulfilled promise", function () {
            const sut = factory(config);

            return expect(sut.remove(id))
                .to.eventually.be.fulfilled;
        });
    });
});
