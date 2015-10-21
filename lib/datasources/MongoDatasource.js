var Datasource = require('./Datasource');
var Mongoose = require('mongoose');
var MongooseJSONLD = require('mongoose-jsonld');
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
  this.mongoose = mongooseJSONLDOptions.mongoose = Mongoose.createConnection(mongoURI, mongoOptions);
  this.mongooseJSONLD = new MongooseJSONLD(mongooseJSONLDOptions);
  tson = TSON.load(options.tson);
  for (k in tson) {
    if (k.substr(0,1) === '@') continue;
    def = JSON.parse(JSON.stringify(tson[k]));
    console.log(k);
    // console.log(def);
    console.log(this.mongooseJSONLD.createSchema());
    try {
      this.mongooseJSONLD.createSchema(k, def, {strict: true})
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

Datasource.extend(MongoDatasource, [
  'limit',
  'triplePattern',
  'offset',
  'totalCount'
]);

MongoDatasource.prototype._executeQuery = function (query, tripleStream, metadataCallback) {
  for(modelName in this.mongooseJSONLD.models) {
    model = schema.models[modelName];
    tripleStream.push({
      "subject": "foo",
      "predicate": "yay",
      "object": modelName
    });
  }
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
