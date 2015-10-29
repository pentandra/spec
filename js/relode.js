var documentJsonLDVocabulary = function(uri, options) {
  options = options || {};
  options.base = document.location.protocol + "//" + document.location.host + document.location.pathname;
  
  var crossReferenceSection = document.getElementById(options.elementId);

  var documentLoader = jsonld.documentLoaders.xhr();
  var promise = documentLoader(options.base + uri);

  promise.then(function(response) {

    var vocab = JSON.parse(response.document);
    documentClasses(vocab, options.context);

    function documentClasses(vocab, context) {
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
                          
          var section = document.createElement('div');
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
  };

};
