var vocabularyTerms = function() {
  var options = { "base": document.location.protocol + "//" +
    document.location.host + document.location.pathname };
  var crossReferenceSection = document.getElementById('cross-reference');


  var documentLoader = jsonld.documentLoaders.xhr();
  var promise = documentLoader(options.base + 'research-cases.jsonld');

  promise.then(function(response) {
    var context = {
      "roc": "https://w3id.org/roc#",
      "cc": "http://creativecommons.org/ns#",
      "dc": "http://purl.org/dc/terms/",
      "owl": "http://www.w3.org/2002/07/owl#",
      "prov": "http://www.w3.org/ns/prov#",
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "skos": "http://www.w3.org/2004/02/skos/core#",
      "vann": "http://purl.org/vocab/vann/",
      "vs": "http://www.w3.org/2003/06/sw-vocab-status/ns#",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "defines": { "@reverse": "rdfs:isDefinedBy" },
      "comment": "rdfs:comment",
      "label": "rdfs:label",
      "domain": { "@id": "rdfs:domain", "@type": "@id" },
      "range": { "@id": "rdfs:range", "@type": "@id" },
      "subClassOf": { "@id": "rdfs:subClassOf", "@type": "@id", "@container": "@set" },
      "subPropertyOf": { "@id": "rdfs:subPropertyOf", "@type": "@id", "@container": "@set" },
      "seeAlso": { "@id": "rdfs:seeAlso", "@type": "@id" },
      "status": "vs:term_status"
    };

    var vocab = JSON.parse(response.document);
    documentClasses(vocab);

    function documentClasses(vocab) {
      var fragment = document.createDocumentFragment();

      var classesFrame = {
        "@context": context,
        "@type": [ "rdfs:Class", "owl:Class" ],
        "subClassOf": { "@embed": false },
        "rdfs:isDefinedBy": { "@embed": false },
      };

      jsonld.frame(vocab, classesFrame, options, function(err, framed) {
        if (err) {
          throw new Exception("Had trouble framing classes", err);
        }

        framed['@graph'].forEach(function(current) {
          console.log(current);

          var id = decomposeCurie(current['@id'], context);
                          
          var section = document.createElement('section');
          section.id = id.name;
          section.className = 'entity';

          var sectionHeader = document.createElement('h2');
          sectionHeader.textContent = "Class: ";
          sectionHeader.insertAdjacentHTML('beforeend', 
            '<a href="#' + id.name + '"><span title="' + id.expanded + '">' + id.curie + '</span></a>');
          section.appendChild(sectionHeader);

          var idP = document.createElement('p');
          idP.innerHTML = '<strong class="crossreference">IRI:</strong><code>' + id.expanded + '</code>';
          section.appendChild(idP);

          var definition = document.createElement('div');
          definition.innerHTML = '<p>' + current['comment']['@value'] + '</p>';
          section.appendChild(definition);

          var descriptionList = document.createElement('dl');
          descriptionList.className = 'description';
          if (current['subClassOf'].length > 0) {
            descriptionList.insertAdjacentHTML('beforeend', '<dt>is subclass of</dt>');
            var dd = document.createElement('dd');
            descriptionList.appendChild(dd);

            current['subClassOf'].forEach(function(subClass, index){
              if (index > 0) dd.insertAdjacentHTML('beforeend', ', ');

              var subClassId = decomposeCurie(subClass, context);
              dd.insertAdjacentHTML('beforeend', '<a title="' + subClassId.expanded + '" href="#' + subClassId.name + '" class="owlclass">' + subClass + '</a>');
            });
          }
          section.appendChild(descriptionList);

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
  }

}

window.addEventListener('DOMContentLoaded', vocabularyTerms);
