// relode.js

var relode = (function(jsonld) {

  var my = {}, 
      target, 
      promises = jsonld.promises;

  var documentClasses = function(doc, context) {

    var classes = document.createDocumentFragment();

    var classesSection = document.createElement('section');
    var classesHeader = document.createElement('h2');
    classesHeader.textContent = 'Classes';
    classesSection.appendChild(classesHeader);

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
        classesSection.appendChild(classSection);
      });

      classes.appendChild(classesSection);
      target.appendChild(classes);

    }, function(err) {
      throw new Exception("Had trouble framing classes", err);
    });

    var assembleClassSection = function(resource) {

      var classSection = assembleCommon(resource, context);

      var relationships = document.createElement('dl');
      relationships.className = 'relationships';
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

    var propertiesSection = document.createElement('section');
    var propertiesHeader = document.createElement('h2');
    propertiesHeader.textContent = 'Object Properties';
    propertiesSection.appendChild(propertiesHeader);

    var frame = {
      "@context": context,
      "@type": [ "owl:ObjectProperty" ],
      "isDefinedBy": { "@embed": false },
    }; 

    var promise = promises.frame(doc, frame);

    promise.then(function(framed) {

      framed['@graph'].forEach(function(resource) {
        var propertySection = assemblePropertySection(resource);
        propertiesSection.appendChild(propertySection);
      });

      properties.appendChild(propertiesSection);
      target.appendChild(properties);

    }, function(err) {
      throw new Exception("Had trouble framing properties", err);
    });

    var assemblePropertySection = function(resource) {

      var propertySection = assembleCommon(resource, context);

      return propertySection;
    };
  };

  var assembleCommon = function(resource, context) {

    var id = decomposeCurie(resource['@id'], context);

    var section = document.createElement('div');
    section.id = id.name;
    section.className = 'resource';
    section.setAttribute('resource', '[' + id.curie + ']');
    section.setAttribute('typeof', resource['@type']);

    var sectionHeader = document.createElement('h2');
    sectionHeader.innerHTML = '<span property="rdfs:label" title="property">' + resource['label']['en'] + '</span>';
    section.appendChild(sectionHeader);

    var iri = document.createElement('dl');
    iri.className = 'iri inline';
    iri.innerHTML = '<dt>IRI:</dt><dd><code>' + id.expanded + '</code></dd>';
    section.appendChild(iri);

    var definedBy = document.createElement('dl');
    definedBy.className = 'definedBy inline invisible';
    definedBy.innerHTML = '<dt>is defined by</dt><dd property="rdfs:isDefinedBy"><code>' + resource['isDefinedBy'] + '</code></dd>';
    section.appendChild(definedBy);

    var comment = document.createElement('div');
    comment.className = "comment";
    comment.innerHTML = '<p property="rdfs:comment">' + resource['comment']['en'] + '</p>';
    section.appendChild(comment);

    return section;
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
    
    target = document.getElementById(options.targetId);

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
