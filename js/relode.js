// relode.js

var relode = (function(jsonld) {

  var my = {}, promises = jsonld.promises;
  
  var framingContext = {    
    "cc": "http://creativecommons.org/ns#",
    "dc": "http://purl.org/dc/terms",
    "owl": "http://www.w3.org/2002/07/owl#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "vann": "http://purl.org/vocab/vann/",
    "vs": "http://www.w3.org/2003/06/sw-vocab-status/ns#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "rdfs:domain": { "@type": "@id" },
    "rdfs:range": { "@type": "@id" },
    "rdfs:comment": { "@container": "@language" },
    "rdfs:label": { "@container": "@language" },
    "rdfs:isDefinedBy": { "@type": "@id" },
    "rdfs:subClassOf": { "@type": "@id", "@container": "@set" },
    "rdfs:subPropertyOf": { "@type": "@id", "@container": "@set" },
    "rdfs:seeAlso": { "@type": "@id" },
    "creator": { "@id": "dc:creator", "@type": "@id" },
    "contributor": { "@id": "dc:contributor", "@type": "@id" },
    "publisher": { "@id": "dc:publisher", "@type": "@id" },
    "title": { "@id": "dc:title", "@container": "@language" },
    "description": { "@id": "dc:description", "@container": "@language" },
    "rights": { "@id": "dc:rights" },
    "status": "vs:term_status",
    "moreInfo": { "@id": "vs:moreinfo", "@type": "@id" }
  };

  var documentClasses = function(doc, targetElement) {

    var originalContext = doc['@context'], 
        classes = document.createDocumentFragment();

    var classesSection = document.createElement('section');
    var classesHeader = document.createElement('h2');
    classesHeader.textContent = 'Classes';
    classesSection.appendChild(classesHeader);

    var frame = {
      "@context": framingContext,
      "@type": [ "rdfs:Class", "owl:Class" ],
      "rdfs:subClassOf": { "@embed": false },
      "rdfs:isDefinedBy": { "@embed": false },
      "rdfs:seeAlso": { "@embed": false },
    }; 

    var promise = promises.frame(doc, frame);

    promise.then(function(framed) {

      framed['@graph'].forEach(function(resource) {
        var classSection = assembleClassSection(resource);
        classesSection.appendChild(classSection);
      });

      classes.appendChild(classesSection);
      targetElement.appendChild(classes);

    }, function(err) {
      throw new Exception("Had trouble framing classes", err);
    });

    var assembleClassSection = function(resource) {

      var classSection = assembleCommon(resource, originalContext);

      if (hasRelationships(resource)) {
        var relationships = document.createElement('dl');
        relationships.className = 'relationships';

        var superClasses = resource['rdfs:subClassOf'];
        if (superClasses.length > 0) {
          var dt = document.createElement('dt');
          dt.textContent = "has super-classes";
          relationships.appendChild(dt);

          superClasses.forEach(function(superClass){
            var dd = document.createElement('dd'),
                link = getExpandedUri(superClass, originalContext);
            dd.innerHTML = '<a title="Go to ' + link + '" href="' + link + '" class="class">' + getCompactUri(superClass, originalContext) + '</a>';
            relationships.appendChild(dd);
          });
        }

        classSection.appendChild(relationships);
      }

      return classSection;
    };

    var supportedRelationships = ['rdfs:subClassOf'];

    var hasRelationships = function(resource) {
      return supportedRelationships.some(function(relationship) {
        return resource[relationship].length > 0;
      });
    };
  };

  var documentProperties = function(doc, targetElement) {

    var originalContext = doc['@context'], 
        properties = document.createDocumentFragment();

    var propertiesSection = document.createElement('section'),
        propertiesHeader = document.createElement('h2'),
        propertiesToc = document.createElement('nav'),
        propertiesTocList = document.createElement('ol');

    propertiesHeader.textContent = 'Object Properties';
    propertiesSection.appendChild(propertiesHeader);

    propertiesToc.className = 'properties';
    propertiesToc.appendChild(propertiesTocList);
    propertiesSection.appendChild(propertiesToc);

    var frame = {
      "@context": framingContext,
      "@type": [ "owl:ObjectProperty" ],
      "rdfs:subPropertyOf": { "@embed": false },
      "rdfs:isDefinedBy": { "@embed": false },
      "rdfs:seeAlso": { "@embed": false },
      "rdfs:domain": { "@embed": false },
      "rdfs:range": { "@embed": false },
    }; 

    var promise = promises.frame(doc, frame);

    promise.then(function(framed) {

      framed['@graph'].forEach(function(resource) {
        var propertySection = assemblePropertySection(resource);
        propertiesSection.appendChild(propertySection);
      });

      properties.appendChild(propertiesSection);
      targetElement.appendChild(properties);

    }, function(err) {
      throw new Exception("Had trouble framing properties", err);
    });

    var assemblePropertySection = function(resource) {

      var propertySection = assembleCommon(resource, originalContext);

      if (hasRelationships(resource)) {
        var relationships = document.createElement('dl');
        relationships.className = 'relationships';

        var superProperties = resource['rdfs:subPropertyOf'];
        if (superProperties.length > 0) {
          var dt = document.createElement('dt');
          dt.textContent = "has super-properties";
          relationships.appendChild(dt);

          superProperties.forEach(function(superProperty){
            var dd = document.createElement('dd'),
                link = getExpandedUri(superProperty, originalContext);

            dd.innerHTML = '<a title="Go to ' + link + '" href="' + link + '" class="superproperty">' + getCompactUri(superProperty, originalContext) + '</a>';
            relationships.appendChild(dd);
          });
        }

        var domain = resource['rdfs:domain'];
        if (domain) {
          var dt = document.createElement('dt');
          dt.textContent = 'has domain';
          relationships.appendChild(dt);

          var dd = document.createElement('dd'),
              link = getExpandedUri(domain, originalContext);

          dd.innerHTML = '<a title="Go to ' + link + '" href="' + link + '" class="domain">' + getCompactUri(domain, originalContext) + '</a>';
          relationships.appendChild(dd);
        }

        var range = resource['rdfs:range'];
        if (range) {
          var dt = document.createElement('dt');
          dt.textContent = 'has range';
          relationships.appendChild(dt);

          var dd = document.createElement('dd'),
              link = getExpandedUri(range, originalContext);

          dd.innerHTML = '<a title="Go to ' + link + '" href="' + link + '" class="range">' + getCompactUri(range, originalContext) + '</a>';
          relationships.appendChild(dd);
        }

        propertySection.appendChild(relationships);
      }

      return propertySection;
    };

    var supportedRelationships = ['rdfs:subPropertyOf', 'rdfs:domain', 'rdfs:range'];

    var hasRelationships = function(resource) {
      return supportedRelationships.some(function(relationship) {
        return Array.isArray(resource[relationship]) ? resource[relationship].length > 0 : !!resource[relationship];
      });
    };
  };

  var assembleCommon = function(resource, context) {

    var id = decomposeCurie(resource['@id'], context);

    console.log(resource);

    var resourceElement = document.createElement('div');
    resourceElement.id = id.name;
    resourceElement.className = 'resource ' + getTypeClassification(resource);
    resourceElement.setAttribute('resource', '[' + id.curie + ']');
    resourceElement.setAttribute('typeof', getAttribute(resource['@type']));

    var resourceElementHeader = document.createElement('h2');
    resourceElementHeader.innerHTML = '<span property="rdfs:label">' + resource['rdfs:label']['en'] + '</span>';
    resourceElement.appendChild(resourceElementHeader);

    var iri = document.createElement('dl');
    iri.className = 'iri inline';
    iri.innerHTML = '<dt>IRI:</dt><dd><code>' + id.expanded + '</code></dd>';
    resourceElement.appendChild(iri);

    var definedBy = document.createElement('dl');
    definedBy.className = 'defined-by inline invisible';
    definedBy.innerHTML = '<dt>Is defined by:</dt><dd property="rdfs:isDefinedBy" resource="' + resource['rdfs:isDefinedBy'] + '"><code>' + resource['rdfs:isDefinedBy'] + '</code></dd>';
    resourceElement.appendChild(definedBy);

    var comment = resource['rdfs:comment'];
    if (comment) {
      var commentElement = document.createElement('div');
      commentElement.className = "comment";
      commentElement.innerHTML = '<p property="rdfs:comment">' + comment['en'] + '</p>';
      resourceElement.appendChild(commentElement);
    }

    var seeAlso = resource['rdfs:seeAlso'];
    if (seeAlso) {
      var seeAlsoElement = document.createElement('dl');
      seeAlsoElement.className = 'see-also inline';
      seeAlsoElement.innerHTML = '<dt>See also:</dt><dd><a property="rdfs:seeAlso" href="' + getExpandedUri(seeAlso, context) + '">' + seeAlso + '</a></dd>';
      resourceElement.appendChild(seeAlsoElement);
    }

    var moreInfo = resource['moreInfo'];
    if (moreInfo) {
      var moreInfoElement = document.createElement('dl');
      moreInfoElement.className = 'more-info inline';
      moreInfoElement.innerHTML = '<dt>More status info:</dt><dd><a property="vs:moreinfo" href="' + getExpandedUri(moreInfo, context) + '">' + moreInfo + '</a></dd>';
      resourceElement.appendChild(moreInfoElement);
    }

    return resourceElement;
  };

  var getTypeClassification = function(resource) {
    var classTypes = ['rdfs:Class', 'owl:Class'],
        objectPropertyTypes = ['owl:ObjectProperty'],
        datatypePropertyTypes = ['owl:DatatypeProperty'],
        type = (typeof resource === 'string') ? resource : resource['@type'];

    if (Array.isArray(type)) {
      return type.map(getTypeClassification).join(' ');
    }
    
    if (classTypes.indexOf(type) > -1) return 'class';
    else if (objectPropertyTypes.indexOf(type) > -1) return 'object-property';
    else if (datatypePropertyTypes.indexOf(type) > -1) return 'data-property';
    else if (type === 'owl:FunctionalProperty') return 'functional';
  };

  var getAttribute = function(attribute) {
    return Array.isArray(attribute) ? attribute.join(' ') : attribute;
  };

  var decomposeCurie = function(curie, context) {
    if (!isCurie(curie)) {
      for (var term in context) {
        var prefix = context[term];
        if (typeof prefix === 'string' && term.indexOf('@') !== 0 && curie.indexOf(prefix) !== -1) {
          curie = term + ":" + curie.substring(prefix.length);
        }
      }

      if (!isCurie(curie))
        throw new Error("<" + curie + "> is not a curie!");
    }

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

  // Not comprehensive...
  var isCurie = function(uri) {
    return typeof uri === 'string' && !isAbsoluteWebUri(uri);
  };

  var getExpandedUri = function(uri, context) {
    return isCurie(uri) ? decomposeCurie(uri, context).expanded : uri ;
  };

  var getCompactUri = function(uri, context) {
    return isCurie(uri) ? uri : decomposeCurie(uri, context).curie ;
  }

  var isAbsoluteWebUri = function(uri) {
    return (uri.indexOf('http://') === 0 || uri.indexOf('https://') === 0);
  };

  my.init = function(vocabUrl, targetId, options) {

    if (!vocabUrl) {
      throw new Error("A vocabUrl parameter is needed. This should resolve to a valid JSON-LD representation of the ontology that you wish to relode.");
    }
    if (!targetId) {
      throw new Error("A targetId parameter is needed. This id the id of the element to which the ontology description shall be appended.");
    }

    options = options || {};

    if (!('base' in options)) {
      options.base = document.location.protocol + "//" + document.location.host + document.location.pathname;
    }
    if (!('documentLoader' in options)) {
      options.documentLoader = jsonld.documentLoaders.xhr();
    }

    var documentLoader = options.documentLoader || jsonld.documentLoaders.xhr(),
        vocabUrl = isAbsoluteWebUri(vocabUrl) ? vocabUrl : options.base + vocabUrl,
        targetElement = document.getElementById(targetId);

    documentLoader(vocabUrl).then(function(response) {
      var doc = JSON.parse(response.document);

      documentClasses(doc, targetElement);
      documentProperties(doc, targetElement);

    }, function(err) {
      console.warn("There was a problem: ", err);
    });

  };

  return my;

}(jsonld));
