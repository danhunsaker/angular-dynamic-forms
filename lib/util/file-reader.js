angular.module('dynaform.lib.file-reader', [])
//  Following code was adapted from http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx
  .factory('fileReader', function ($q) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.resolve(reader.result);
          });
        };
      },
      onError = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.reject(reader.error);
          });
        };
      },
      onProgress = function (reader, scope) {
        return function (event) {
          scope.$broadcast('fileProgress',
            {
              total: event.total,
              loaded: event.loaded,
              status: reader.readyState
            });
        };
      },
      getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
      };

    return {
      readAsArrayBuffer: function (file, scope) {
        var deferred = $q.defer(),
          reader = getReader(deferred, scope);
        reader.readAsArrayBuffer(file);
        return deferred.promise;
      },
      readAsBinaryString: function (file, scope) {
        var deferred = $q.defer(),
          reader = getReader(deferred, scope);
        reader.readAsBinaryString(file);
        return deferred.promise;
      },
      readAsDataURL: function (file, scope) {
        var deferred = $q.defer(),
          reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
      },
      readAsText: function (file, scope) {
        var deferred = $q.defer(),
          reader = getReader(deferred, scope);
        reader.readAsText(file);
        return deferred.promise;
      }
    };
  })
;
