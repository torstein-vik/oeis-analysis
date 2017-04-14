"use strict";

var P = require("./parser.js");

P.Parser.prototype.then = function(parser){return this.bind(() => parser)};


const expect  = (check) => P.Next.bind((c) => c == check ? P.Return(c) : P.Fail);

const text    = (string) => string.split("").reduce((acc, n) => acc.then(expect(n)), P.Return([])).then(P.Return(string))

const many    = (parser) => P.Return([]).or(parser.bind((x) => many(parser).bind((y) => P.Return([x].concat(y)))));
P.Parser.prototype.many = function(){return many(this);};

const some    = (parser) => parser.bind((val) => P.Return([val])).or(parser.bind((x) => some(parser).bind((y) => P.Return([x].concat(y)))));
P.Parser.prototype.some = function(){return some(this);};

const maybe   = (parser, dval) => P.Return(dval).or(parser);
P.Parser.prototype.maybe = function(dval){return maybe(this, dval);}

const any     = (list) => list.reduce((acc, n) => acc.or(n), P.Fail);

const and     = (list) => list.length > 0 ? list[0].bind((res) => and(list.slice(1)).bind((rest) => P.Return([res].concat(rest)))) : P.Return([]);

const exactly = (parser, amt) => and(Array(amt).fill(parser));
P.Parser.prototype.exactly = function(amt){return exactly(this, amt);}

const pair    = (str, val) => text(str).then(P.Return(val));

const lift    = (list, func) => and(list).bind((res) => P.Return(func.apply(null, res)));



const digit   = any([0,1,2,3,4,5,6,7,8,9].map((n) => pair(n + "", n)));

const natural = some(digit).bind((digs) => P.Return(digs.reverse().map((d, i) => d * Math.pow(10, i)).reduce((x, y) => x + y, 0)))

var test = lift([natural, text(' + '), natural], (x, _, y) => x + y);

console.log(P.parse(test, "66 + 44"));
