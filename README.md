# Ionic 3 environments webpack
Environment variables that you can use in your Ionic 3 project

from: https://github.com/ionic-team/ionic-cli/issues/1205
fiznool commented on 2 Feb :



Inspired by the solution from @tabirkeland I thought I'd post my own version of this. The differences with the script below vs the original solution:

The Ionic webpack.config script is built upon, not replaced, meaning that any updates to @ionic/app-scripts should be merged in.
The script is aware of Ionic's --prod flag, allowing you to provide separate configuration for dev and prod builds.
There is no dependency on dotenv.
Here's the steps to get it all working:

Create a file at config/webpack.config.js and paste the following content:
// Set the `ENV` global variable to be used in the app.
var path = require('path');
var webpack = require('webpack');

var projectRootDir = process.env.IONIC_ROOT_DIR;
var appScriptsDir = process.env.IONIC_APP_SCRIPTS_DIR;

var config = require(path.join(appScriptsDir, 'config', 'webpack.config.js'));

var env = process.env.IONIC_ENV || 'dev';
var envVars;
try {
  envVars = require(path.join(projectRootDir, 'env', env + '.json'));
} catch(e) {
  envVars = {};
}

config.plugins = config.plugins || [];
config.plugins.push(
  new webpack.DefinePlugin({
    ENV: Object.assign(envVars, {
      environment: JSON.stringify(env)
    })
  })
);

if(env === 'prod') {
  // This helps ensure the builds are consistent if source hasn't changed:
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
}

module.exports = config;
Add the following entry to your package.json:
  "config": {
    "ionic_webpack": "./config/webpack.config.js"
  }
If you need additional configuration, create two files env/dev.json and env/prod.json. In here, put any configuration you need for that environment. Your json should be an object of key-value pairs, which will be made available for use in your application.
{
  "enableLogging": true,
  "apiServerUrl": "\"http://example.com/api\""
}
Now, you can use the ENV global constant anywhere in your .ts files:

declare const ENV;

if(ENV.environment === 'dev') {
  // Run without the `--prod` flag.
  // Any keys defined in `dev.json` will be available on the `ENV` object.
} else if (ENV.environment === 'prod') {
  // Run with the `--prod` flag.
  // Any keys defined in `prod.json` will be available on the `ENV` object.
}
The script creates an ENV object with a single key, environment, which is set to prod if you run your ionic command with the --prod flag. Otherwise, this will be dev.

The env/dev.json and env/prod.json files are optional. If present, the script will merge the appropriate object into ENV. The script above uses webpack's DefinePlugin, so remember to 'stringify' any string values, otherwise webpack will assume you want to insert a code fragment. For example:

{
  "apiServerUrl": "\"http://example.com/api\""
}
It would be great to see this baked into the core webpack.config.js file in the app-scripts repo.
