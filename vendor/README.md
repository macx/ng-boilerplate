# The `vendor/` Directory

## Overview

```
src/
  |- component.json 
  |- vendor/
  |  |- <should be empty, will be install by bower / grunt-bowerful>
```

The `vendor/` folder contains libraries that are either foundational or 
necessary for the build processes to succeed. The `angular` directory contains
both `angular.js` version 1.1.2, which is used during testing and which is of
course included in the final build, and `angular-mocks.js`, which is used only
for testing.

## Adding New Libraries

Adding new libs is easy and should be done within the component.json. As an Example, 
if you want to add jQuery as an new dependency do the following:
```sh
$ bower install jquery --save # for devDependencies use --save-dev
```

As jQuery would be an "normal" dependency, there could be also a devDependency, which 
are only used for the develop process. e.g. angular-mocks for unit testing angular apps.

