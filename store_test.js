// Writing...
// var fs = require("fs");
// var myJson = {
//     key: "myvalue"
// };

// fs.writeFile( "filename.json", JSON.stringify( myJson ), "utf8", function(){console.log('stored success!!');} );

// And then, to read it...
myJson = require("./filename.json");
console.log(myJson.hello==undefined);