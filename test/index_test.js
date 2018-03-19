/*jslint
    es6, node
*/
const {describe, it} = require("mocha");
const {expect} = require("chai");
const sut = require("../index");
const {domain, token} = require("../config/credentials");

describe("index", function () {
    "use strict";

    describe("factory", function () {
        it("should throw an error when options are missing", function () {
            expect(sut).to.throw(Error);
        });

        it("should throw an error when domain is missing", function () {
            expect(function () {
                sut({token: "t"});
            }).to.throw(Error);
        });

        it("should throw an error when token is missing", function () {
            expect(function () {
                sut({domain: "d"});
            }).to.throw(Error);
        });

        it("should throw an error when username is missing", function () {
            expect(function () {
                sut({domain: "d", password: "p"});
            }).to.throw(Error);
        });

        it("should throw an error when password is missing", function () {
            expect(function () {
                sut({domain: "d", username: "u"});
            }).to.throw(Error);
        });

        it("should return an object having the expected API", function () {
            const index = sut({domain, token});
            const api = ["create", "retrieve", "update", "remove"];

            expect(index).to.be.an("object");
            api.forEach(function (name) {
                expect(index[name]).to.be.a("function");
            });
        });
    });
});
