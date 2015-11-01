// relode.js

var relode = (function(jsonld) {

  var my = {}, promises = jsonld.promises;

  var documentClasses = function(doc, context) {

    var classes = document.createDocumentFragment();

    var frame = {
      "@context": context,
      "@type": [ "rdfs:Class", "owl:Class" ],
      "subClassOf": { "@embed": false },
      "isDefinedBy": { "@embed": false },
    }; 

    var promise = promises.frame(doc, frame);

    promise.then(function(framed) {

      framed['@graph'].forEach(function(resource) {
        var classSection = assembleClassSection(resource);
        classes.appendChild(classSection);
      });

      my.crossReferenceSection.appendChild(classes);

    }, function(err) {
      throw new Exception("Had trouble framing classes", err);
    });

    var assembleClassSection = function(resource) {

      var id = decomposeCurie(resource['@id'], context);

      var classSection = document.createElement('div');
      classSection.id = id.name;
      classSection.className = 'resource';
      classSection.setAttribute('resource', '[' + id.curie + ']');
      classSection.setAttribute('typeof', resource['@type']);

      var sectionHeader = document.createElement('h2');
      sectionHeader.innerHTML = '<span property="rdfs:label" title="class">' + resource['label']['en'] + '</span>';
      classSection.appendChild(sectionHeader);

      var iri = document.createElement('dl');
      iri.className = 'iri inline';
      iri.innerHTML = '<dt>IRI:</dt><dd><code>' + id.expanded + '</code></dd>';
      classSection.appendChild(iri);

      var definedBy = document.createElement('dl');
      definedBy.className = 'definedBy inline invisible';
      definedBy.innerHTML = '<dt>is defined by</dt><dd property="rdfs:isDefinedBy"><code>' + resource['isDefinedBy'] + '</code></dd>';
      classSection.appendChild(definedBy);

      var comment = document.createElement('div');
      comment.className = "comment";
      comment.innerHTML = '<p property="rdfs:comment">' + resource['comment']['en'] + '</p>';
      classSection.appendChild(comment);

      var relationships = document.createElement('dl');
      relationships.className = 'description';
      if (resource['subClassOf'].length > 0) {
        relationships.insertAdjacentHTML('beforeend', '<dt>is subclass of</dt>');
        var dd = document.createElement('dd');
        relationships.appendChild(dd);

        resource['subClassOf'].forEach(function(subClass, index){
          if (index > 0) dd.insertAdjacentHTML('beforeend', ', ');

          var subClassId = decomposeCurie(subClass, context);
          dd.insertAdjacentHTML('beforeend', '<a title="Go to ' + subClassId.expanded + '" href="' + subClassId.expanded + '" class="owlclass">' + subClass + '</a>');
        });
      }
      classSection.appendChild(relationships);

      return classSection;
    };
  };

  var documentProperties = function(doc, context) {

    var properties = document.createDocumentFragment();

    var frame = {
      "@context": context,
      "@type": [ "rdf:Property", "owl:ObjectProperty", "owl:DatatypeProperty", "owl:AnnotationProperty" ],
      "isDefinedBy": { "@embed": false },
    }; 

    var promise = promises.frame(doc, frame);

    promise.then(function(framed) {

      framed['@graph'].forEach(function(resource) {
        var propertySection = assemblePropertySection(resource);
        properties.appendChild(propertySection);
      });

      my.crossReferenceSection.appendChild(properties);

    }, function(err) {
      throw new Exception("Had trouble framing properties", err);
    });

    var assemblePropertySection = function(resource) {

      var id = decomposeCurie(resource['@id'], context);

      var propertySection = document.createElement('div');
      propertySection.id = id.name;
      propertySection.className = 'resource';
      propertySection.setAttribute('resource', '[' + id.curie + ']');
      propertySection.setAttribute('typeof', resource['@type']);

      var sectionHeader = document.createElement('h2');
      sectionHeader.innerHTML = '<span property="rdfs:label" title="property">' + resource['label']['en'] + '</span>';
      propertySection.appendChild(sectionHeader);

      var iri = document.createElement('dl');
      iri.className = 'iri inline';
      iri.innerHTML = '<dt>IRI:</dt><dd><code>' + id.expanded + '</code></dd>';
      propertySection.appendChild(iri);

      var definedBy = document.createElement('dl');
      definedBy.className = 'definedBy inline invisible';
      definedBy.innerHTML = '<dt>is defined by</dt><dd property="rdfs:isDefinedBy"><code>' + resource['isDefinedBy'] + '</code></dd>';
      propertySection.appendChild(definedBy);

      var comment = document.createElement('div');
      comment.className = "comment";
      comment.innerHTML = '<p property="rdfs:comment">' + resource['comment']['en'] + '</p>';
      propertySection.appendChild(comment);

      return propertySection;
    };
  };

  var decomposeCurie = function(curie, context) {
    //TODO Check to make sure its a curie
    var parts = curie.split(":"),
    prefix = parts[0],
    name = parts[1];

    return {
      "curie": curie,
      "prefix": prefix,
      "name": name,
      "expanded": context[prefix] + name
    };
  };

  my.init = function(options) {

    options = options || {};

    options.base = options.base || document.location.protocol + "//" + document.location.host + document.location.pathname;
    
    my.crossReferenceSection = document.getElementById(options.elementId);

    var documentLoader = options.documentLoader || jsonld.documentLoaders.xhr();
    var promise = documentLoader(options.base + options.vocabURI);

    promise.then(function(response) {
      var doc = JSON.parse(response.document);
      documentClasses(doc, doc['@context']);
      documentProperties(doc, doc['@context']);
    });

  };

  return my;

}(jsonld));
