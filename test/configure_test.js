/*jslint
    es6, node
*/
const {describe, it} = require("mocha");
const {expect} = require("chai");
const sut = require("../src/configure");

describe("configure", function () {
    "use strict";

    describe("factory", function () {
        it("should raise an error when options are missing", function () {
            expect(sut).to.throw(Error);
        });

        it("should raise an error when domain is missing", function () {
            expect(function () {
                sut({token: "t"});
            }).to.throw(Error);
        });

        it("should raise an error when token is missing", function () {
            expect(function () {
                sut({domain: "d"});
            }).to.throw(Error);
        });

        it("should raise an error when username is missing", function () {
            expect(function () {
                sut({domain: "d", password: "p"});
            }).to.throw(Error);
        });

        it("should raise an error when password is missing", function () {
            expect(function () {
                sut({domain: "d", username: "u"});
            }).to.throw(Error);
        });
    });
});
