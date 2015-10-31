var documentJsonLDVocabulary = function(uri, options) {
  options = options || {};
  options.base = document.location.protocol + "//" + document.location.host + document.location.pathname;
  
  var crossReferenceSection = document.getElementById(options.elementId);

  var documentLoader = jsonld.documentLoaders.xhr();
  var promise = documentLoader(options.base + uri);

  promise.then(function(response) {

    var doc = JSON.parse(response.document);
    documentClasses(doc, doc['@context']);

    function documentClasses(doc, context) {
      var fragment = document.createDocumentFragment();

      var classesFrame = {
        "@context": context,
        "@type": [ "rdfs:Class", "owl:Class" ],
        "subClassOf": { "@embed": false },
        "isDefinedBy": { "@embed": false },
      };

      jsonld.frame(doc, classesFrame, options, function(err, framed) {
        if (err) {
          throw new Exception("Had trouble framing classes", err);
        }

        framed['@graph'].forEach(function(resource) {

          var id = decomposeCurie(resource['@id'], context);
                          
          var section = document.createElement('div');
          section.id = id.name;
          section.className = 'resource';
          section.setAttribute('resource', '[' + id.curie + ']');
          section.setAttribute('typeof', resource['@type']);

          var sectionHeader = document.createElement('h2');
          sectionHeader.innerHTML = '<span property="rdfs:label" title="class">' + resource['label']['en'] + '</span>';
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
          section.appendChild(relationships);

          fragment.appendChild(section);

        });

        crossReferenceSection.appendChild(fragment);
      });
    };
  }, function(err) {
    console.log("Something funny happened:", err);
    return;
  });

  function decomposeCurie(curie, context) {
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
};
