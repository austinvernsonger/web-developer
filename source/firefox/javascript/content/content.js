var WebDeveloper = WebDeveloper || {};

WebDeveloper.Content = WebDeveloper.Content || {};

// Returns the size of a document
WebDeveloper.Content.getDocumentSize = function(callback)
{
  var contentDocument        = WebDeveloper.Common.getContentDocument();
  var contentDocuments       = WebDeveloper.Content.getDocuments(WebDeveloper.Common.getContentWindow());
  var documentSize           = {};
  var documentSizeDocument   = null;
  var documentSizeImage      = null;
  var documentSizeObject     = null;
  var documentSizeScript     = null;
  var documentSizeStyleSheet = null;
  var documentURL            = null;
  var fileSizeRequests       = [];
  var image                  = null;
  var images                 = null;
  var object                 = null;
  var objects                = null;
  var script                 = null;
  var scripts                = null;
  var styleSheets            = null;
  var url                    = null;

  documentSize.documents   = [];
  documentSize.images      = [];
  documentSize.objects     = [];
  documentSize.pageURL     = contentDocument.documentURI;
  documentSize.scripts     = [];
  documentSize.styleSheets = [];

  // Loop through the documents
  for(var i = 0, l = contentDocuments.length; i < l; i++)
  {
    contentDocument           = contentDocuments[i];
    documentSizeDocument      = {};
    documentURL               = contentDocument.documentURI;
    documentSizeDocument.url  = documentURL;
    images                    = WebDeveloper.Common.getDocumentImages(contentDocument);
    objects                   = contentDocument.embeds;
    scripts                   = contentDocument.querySelectorAll("script[src]");
    styleSheets               = WebDeveloper.Content.getDocumentCSS(contentDocument, false).styleSheets;

    fileSizeRequests.push({ fileObject: documentSizeDocument, includeUncompressed: true, url: documentURL });

    // Loop through the images
    for(var j = 0, m = images.length; j < m; j++)
    {
      documentSizeImage     = {};
      image                 = images[j];
      url                   = image.src;
      documentSizeImage.url = url;

      fileSizeRequests.push({ fileObject: documentSizeImage, includeUncompressed: false, url: url });

      documentSize.images.push(documentSizeImage);
    }

    // Loop through the objects
    for(j = 0, m = objects.length; j < m; j++)
    {
      documentSizeObject     = {};
      object                 = objects[j];
      url                    = object.src;
      documentSizeObject.url = url;

      fileSizeRequests.push({ fileObject: documentSizeObject, includeUncompressed: false, url: url });

      documentSize.objects.push(documentSizeObject);
    }

    // Loop through the scripts
    for(j = 0, m = scripts.length; j < m; j++)
    {
      documentSizeScript     = {};
      script                 = scripts[j];
      url                    = script.src;
      documentSizeScript.url = url;

      fileSizeRequests.push({ fileObject: documentSizeScript, includeUncompressed: true, url: url });

      documentSize.scripts.push(documentSizeScript);
    }

    // Loop through the style sheets
    for(j = 0, m = styleSheets.length; j < m; j++)
    {
      documentSizeStyleSheet     = {};
      url                        = styleSheets[j];
      documentSizeStyleSheet.url = url;

      fileSizeRequests.push({ fileObject: documentSizeStyleSheet, includeUncompressed: true, url: url });

      documentSize.styleSheets.push(documentSizeStyleSheet);
    }

    documentSize.documents.push(documentSizeDocument);
  }

  WebDeveloper.Common.getFileSizes(fileSizeRequests, function()
  {
    documentSize.documents.sort(WebDeveloper.Content.sortByFileSize);
    documentSize.images.sort(WebDeveloper.Content.sortByFileSize);
    documentSize.objects.sort(WebDeveloper.Content.sortByFileSize);
    documentSize.scripts.sort(WebDeveloper.Content.sortByFileSize);
    documentSize.styleSheets.sort(WebDeveloper.Content.sortByFileSize);

    callback(documentSize);
  });
};

// Sorts files by file size
WebDeveloper.Content.sortByFileSize = function(fileOne, fileTwo)
{
  return fileTwo.size.size - fileOne.size.size;
};
