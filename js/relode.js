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
      "rdfs:isDefinedBy": { "@embed": false },
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

      if (hasRelationships(resource)) {
        var relationships = document.createElement('dl');
        relationships.className = 'relationships';

        var superClasses = resource['subClassOf'];
        if (superClasses.length > 0) {
          var dt = document.createElement('dt');
          dt.textContent = "has super-classes";
          relationships.appendChild(dt);

          superClasses.forEach(function(superClass){
            var dd = document.createElement('dd'),
                superClassId = decomposeCurie(superClass, context);
            dd.innerHTML = '<a title="Go to ' + superClassId.expanded + '" href="' + superClassId.expanded + '" class="owlclass">' + superClass + '</a>';
            relationships.appendChild(dd);
          });
        }

        classSection.appendChild(relationships);
      }

      return classSection;
    };

    var supportedRelationships = ['subClassOf'];

    var hasRelationships = function(resource) {
      return supportedRelationships.some(function(relationship) {
        return resource[relationship].length > 0;
      });
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
      "subPropertyOf": { "@embed": false },
      "rdfs:isDefinedBy": { "@embed": false },
      "domain": { "@embed": false },
      "range": { "@embed": false },
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

      if (hasRelationships(resource)) {
        var relationships = document.createElement('dl');
        relationships.className = 'relationships';

        var superProperties = resource['subPropertyOf'];
        if (superProperties.length > 0) {
          var dt = document.createElement('dt');
          dt.textContent = "has super-properties";
          relationships.appendChild(dt);

          superProperties.forEach(function(superProperty){
            var dd = document.createElement('dd'),
                superPropertyId = decomposeCurie(superProperty, context);
            dd.innerHTML = '<a title="Go to ' + superPropertyId.expanded + '" href="' + superPropertyId.expanded + '" class="superproperty">' + superProperty + '</a>';
            relationships.appendChild(dd);
          });
        }

        var domain = resource['domain'];
        if (domain) {
          var dt = document.createElement('dt');
          dt.textContent = 'has domain';
          relationships.appendChild(dt);

          var dd = document.createElement('dd'),
              domainId = decomposeCurie(domain, context);
          dd.innerHTML = '<a title="Go to ' + domainId.expanded + '" href="' + domainId.expanded + '" class="domain">' + domain + '</a>';
          relationships.appendChild(dd);
        }

        var range = resource['range'];
        if (range) {
          var dt = document.createElement('dt');
          dt.textContent = 'has range';
          relationships.appendChild(dt);

          var dd = document.createElement('dd'),
              rangeId = decomposeCurie(range, context);
          dd.innerHTML = '<a title="Go to ' + rangeId.expanded + '" href="' + rangeId.expanded + '" class="range">' + range + '</a>';
          relationships.appendChild(dd);
        }

        propertySection.appendChild(relationships);
      }

      return propertySection;
    };

    var supportedRelationships = ['subPropertyOf', 'domain', 'range'];

    var hasRelationships = function(resource) {
      return supportedRelationships.some(function(relationship) {
        return Array.isArray(resource[relationship]) ? resource[relationship].length > 0 : !!resource[relationship];
      });
    };
  };

  var assembleCommon = function(resource, context) {

    var id = decomposeCurie(resource['@id'], context);

    var section = document.createElement('div');
    section.id = id.name;
    section.className = 'resource';
    section.setAttribute('resource', '[' + id.curie + ']');
    section.setAttribute('typeof', getAttribute(resource['@type']));

    var sectionHeader = document.createElement('h2');
    sectionHeader.innerHTML = '<span property="rdfs:label" title="' + getTypeDescription(resource) + '">' + resource['label']['en'] + '</span>';
    section.appendChild(sectionHeader);

    var iri = document.createElement('dl');
    iri.className = 'iri inline';
    iri.innerHTML = '<dt>IRI:</dt><dd><code>' + id.expanded + '</code></dd>';
    section.appendChild(iri);

    var definedBy = document.createElement('dl');
    definedBy.className = 'definedBy inline invisible';
    definedBy.innerHTML = '<dt>is defined by</dt><dd property="rdfs:isDefinedBy" resource="' + resource['rdfs:isDefinedBy'] + '"><code>' + resource['rdfs:isDefinedBy'] + '</code></dd>';
    section.appendChild(definedBy);

    var comment = document.createElement('div');
    comment.className = "comment";
    comment.innerHTML = '<p property="rdfs:comment">' + resource['comment']['en'] + '</p>';
    section.appendChild(comment);

    return section;
  };

  var getTypeDescription = function(resource) {
    var type = resource['@type'];

    if (type === "rdfs:Class" || type === "owl:Class") return 'class';
    else return 'property';
  };

  var getAttribute = function(attribute) {
    return Array.isArray(attribute) ? attribute.join(' ') : attribute;
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
