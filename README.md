#lambda-request
This is a wrapper for `request-promise` that includes information about your lambda function on the `User-Agent` header of each request.

##Usage
Pass in your package.json file like so, then use the result as you would normally use `request-promise`.
```
const package = require('./package.json');
const request = require('@sparkpost/lambda-request)(package);
```
