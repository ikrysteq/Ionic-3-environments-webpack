// Set the `ENV` global variable to be used in the app.
var path = require('path');
var webpack = require('webpack');
var chalk = require('chalk');

var projectRootDir = process.env.IONIC_ROOT_DIR;
var appScriptsDir = process.env.IONIC_APP_SCRIPTS_DIR;

var config = require(path.join(appScriptsDir, 'config', 'webpack.config.js'));

var env = process.env.IONIC_ENV ? process.env.IONIC_ENV : 'dev';
console.log(chalk.green(`ENV: [`, chalk.underline.yellow(`${env}`), `]`));
console.log(chalk.green(`DIR: [`, chalk.underline.yellow(`${projectRootDir}`), `]`));

var envVars;
try {
  envVars = require(path.join(projectRootDir, './src/config/', env + '.json'));
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