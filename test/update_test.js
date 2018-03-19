/*jslint
    es6, node, this
*/
const {after, before, describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const factory = require("../update");
const credentials = require("../config/credentials");
const config = Object.assign({resource: "Projects"}, credentials);

chai.use(chaiAsPromised);

describe("update", function () {
    "use strict";
    var id;

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

    this.timeout(5000);

    before(function () {
        const create = require("../create")(config);
        const obj = {
            "Name": Math.random().toString(36).replace(/[^a-z]+/g, ""),
            "Abbreviation": Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 3)
        };

        return create.create(obj).then(function (item) {
            id = item.Id;
        });
    });

    describe("update", function () {
        it("should return a rejected promise when the Id is missing", function () {
            const sut = factory(config);

            return expect(sut.update({"Name": "updated"}))
                .to.eventually.be.rejected;
        });

        it("should return an object having the specified properties changed", function () {
            const sut = factory(config);
            const obj = {
                "Id": id,
                "Name": Math.random().toString(36).replace(/[^a-z]+/g, ""),
                "Abbreviation": Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 3)
            };

            return expect(sut.update(obj))
                .to.eventually.be.an("object")
                .and.to.include(obj);
        });
    });

    after(function () {
        const remove = require("../remove")(config);
        return remove.remove(id);
    });
});
