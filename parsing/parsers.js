"use strict";

var P = require("./parser.js");

P.Parser.prototype.then = (parser) => {return this.bind(() => parser)};


const expect = (check) => P.Next.bind((c) => c == check ? P.Return(c) : P.Fail);

const many = (parser) => P.Return([]).or(parser.bind((x) => many(parser).bind((y) => P.Return([x].concat(y)))));

P.Parser.prototype.many = () => {return many(this)};

var test = expect('a').or(expect('A'));

console.log(P.parse(test, "A"));
