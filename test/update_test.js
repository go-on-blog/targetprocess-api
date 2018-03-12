/*jslint
    es6, node, this
*/
const {after, before, describe, it} = require("mocha");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const sut = require("../src/update");
const {domain, token} = require("../config/credentials");
const uri = `https://${domain}/api/v1`;

chai.use(chaiAsPromised);

describe("update", function () {
    "use strict";
    const id = 2;
    var oldName;
    var oldAbbreviation;

    describe("factory", function () {
        it("should throw an error when the resource is not allowed for update", function () {
            function factory() {
                sut(uri, token, "not allowed");
            }

            return expect(factory).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const update = sut(uri, token, "Projects");
            const api = ["update"];

            expect(update).to.be.an("object");
            api.forEach(function (name) {
                expect(update).to.have.own.property(name);
                expect(update[name]).to.be.a("function");
            });
        });
    });

    this.timeout(5000);

    before(function () {
        const factory = require("../src/retrieve");
        const retrieve = factory(uri, token, "Projects");

        return retrieve.where(`Id eq ${id}`).get().then(function (items) {
            oldName = items[0].Name;
            oldAbbreviation = items[0].Abbreviation;
        });
    });

    describe("update", function () {
        it("should return a rejected promise when the Id is missing", function () {
            const update = sut(uri, token, "Projects");

            return expect(update.update({"Name": "updated"}))
                .to.eventually.be.rejected;
        });

        it("should return an object having the specified properties changed", function () {
            const update = sut(uri, token, "Projects");
            const obj = {
                "Id": id,
                "Name": Math.random().toString(36).replace(/[^a-z]+/g, ""),
                "Abbreviation": Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 3)
            };

            return expect(update.update(obj))
                .to.eventually.be.an("object")
                .and.to.include(obj);
        });
    });

    after(function () {
        const update = sut(uri, token, "Projects");
        const obj = {
            "Id": id,
            "Name": oldName,
            "Abbreviation": oldAbbreviation
        };

        return update.update(obj);
    });
});
