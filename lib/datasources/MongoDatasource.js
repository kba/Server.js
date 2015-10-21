var Datasource = require('./Datasource');
var Mongoose = require('mongoose');
var SchemaFactory = require('mongoose-jsonld');

function MongoDatasource(options) {
  if (!(this instanceof MongoDatasource))
    return new MongoDatasource(options);

  Datasource.call(this, options);

  // Set endpoint URL and default graph
  options = options || {};
  this._mongoURI = (options.url || 'mongodb://localhost/ldf');
}
Datasource.extend(MongoDatasource, [
  'limit',
  'triplePattern',
  'offset',
  'totalCount'
]);

MongoDatasource.prototype._executeQuery = function (query, tripleStream, metadataCallback) {
  tripleStream.push({"subject":"http://foo", "predicate":"http://bar","object": '"quux"'});
  tripleStream.push(null);
  // TODO
  metadataCallback({ totalCount: 90 });
  console.log('fnmp');
};
// Retrieves all triples in the datasource
MongoDatasource.prototype._getAllTriples = function (addTriple, done) {
  throw new Error('_getAllTriples is not implemented');
};

module.exports = MongoDatasource;
