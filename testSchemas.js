/**
 * Created by davidz on 8/10/14.
 */
var parser = require("./schemas/WixSchemaParser.js");
var test = require("./schemas/sources/e_commerce/purchaseSchema.json");

var generator = require("./schemas/visitors/ToClassVisitor.js");
var obj = parser.parse(test, "SendSchema");

var sendSchemaGen = new generator();
var sendSchemaBuffer = parser.parse(test, "SendSchema", sendSchemaGen);

console.log(sendSchemaBuffer);

obj.withMessageId(obj);