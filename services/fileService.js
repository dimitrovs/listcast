//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('fileService', function ($q) {
    this.parseFile = function (file) {
        var reader = new FileReader();
        var dfd = $q.defer(); 
        var channels = [];
        
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            var myRe = /#EXTINF:.*,(.*)\n(.*)\n*/g;
            while ((myArray = myRe.exec(e.target.result)) !== null) {
                channels.push({'name':myArray[1],'url':myArray[2]});
            }
            dfd.resolve(channels);
          };
        })(file);

        reader.readAsText(file[0]);
        
        return dfd.promise;
    };

});