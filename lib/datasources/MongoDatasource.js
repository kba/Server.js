var Datasource = require('./Datasource');
var Mongoose = require('mongoose');
var Schemo = require('mongoose-jsonld');
var TSON = require('tson');

function MongoDatasource(options) {
  if (!(this instanceof MongoDatasource))
    return new MongoDatasource(options);

  Datasource.call(this, options);

  // Set endpoint URL and default graph
  options = options || {};
  var mongoURI = (options.mongoURI || 'mongodb://localhost/ldf');
  var mongoOptions = (options.mongoOptions || {} );
  var mongooseJSONLDOptions = (options.mongooseJSONLDOptions || {
			baseURI: (options.baseURI || "foo"),
			apiPrefix: options.apiPrefix,
			schemaPrefix: options.schemaPrefix
  });
  mongooseJSONLDOptions.schemo = TSON.load(options.schemo);
  this.mongoose = mongooseJSONLDOptions.mongoose = Mongoose.createConnection(mongoURI, mongoOptions);
  this.schemo = new Schemo(mongooseJSONLDOptions);
}

Datasource.extend(MongoDatasource, [
  'limit',
  'triplePattern',
  'offset'
]);

MongoDatasource.prototype._executeQuery = function (query, tripleStream, metadataCallback) {
  this.schemo.handleLinkedDataFragmentsQuery(query, tripleStream, function (err) {
    tripleStream.push(null);
    metadataCallback({ totalCount: 100000 });
  });
};
// Retrieves all triples in the datasource
MongoDatasource.prototype._getAllTriples = function (addTriple, done) {
  throw new Error('_getAllTriples is not implemented');
};

module.exports = MongoDatasource;
