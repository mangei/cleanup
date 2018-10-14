var fs = require('fs');
var rimraf = require('rimraf');

var rootDir = "XXXXX";
var dryRun = true;

var walk = function(dir, done) {
  var results = [];
  var delDirs = []
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results, delDirs);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
			if(file.endsWith('/node_modules') || file.endsWith('/target') || file.endsWith('/bower_components') || file.endsWith('/build')) {
				delDirs.push(file)
				next();
			} else {
			  walk(file, function(err, res, delDirs2) {
				results = results.concat(res);
				delDirs = delDirs.concat(delDirs2);
				next();
			  });
			}
        } else {
		  if(file.endsWith('package.json') || file.endsWith('pom.xml') || file.endsWith('bower.json') || file.endsWith('build.gradle')) {
			  results.push(file);
		  }
		  if(file.endsWith('.iml')) {
			  var parentDir = file.substring(0, file.lastIndexOf("/"))
			  results.push(parentDir + "/.iml");
		  }
		  next();
        }
      });
    })();
  });
};


walk(rootDir, function(err, results, delDirs) {
  if (err) throw err;
  //console.log("---")
  //console.log(results)
  
  var notDeleted = []
  
  console.log("---")
  console.log("deleted:")
  delDirs.forEach(function(file) {
	  var parentDir = file.substring(0, file.lastIndexOf("/"))
	  
	  // do not delete node_modules for this script
	  if(parentDir === rootDir) return;
	  
	  var del = false
	  if(file.endsWith('/target') && (results.includes(parentDir + '/pom.xml') || results.includes(parentDir + '/build.gradle') || results.includes(parentDir + '/.iml'))) {
		  del = true
	  } else if(file.endsWith('/build') && results.includes(parentDir + '/build.gradle')) {
		  del = true
	  } else if(file.endsWith('/node_modules') && results.includes(parentDir + '/package.json')) {
		  del = true
	  } else if(file.endsWith('/bower_components') && results.includes(parentDir + '/bower.json')) {
		  del = true
	  }
	  if(del) {
		  if(!dryRun) {
			rimraf.sync(file);
		  }
		  console.log(file);
	  } else {
		  notDeleted.push(file)
	  }
  });
  
  console.log("---")
  console.log("not deleted:")
  notDeleted.forEach(function(e) {
	  console.log(e)
  })
});
