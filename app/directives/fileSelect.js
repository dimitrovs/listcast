app.directive('fileSelect', function() {
  var template = '<input type="file" name="files"/>';
  return function( scope, elem, attrs ) {
    var selector = $( template );
    elem.append(selector);
    selector.bind('change', function( event ) {
      scope.$apply(function() {
        scope[ attrs.fileSelect ] = event.originalEvent.target.files;
      });
    });
    scope.$watch(attrs.fileSelect, function(file) {
      if (file==null) selector.val(file);
    });
  };
});