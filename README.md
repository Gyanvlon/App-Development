[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
# SeedApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Creating manifest file

To create manifest file for your project run this command

`node create-manifest.js <NAME> <DESCRIPTION> <VERSION eg. 0.0.0>`

Where:

NAME = Name of the app you want to create

DESCRIPTION = Description of the app you want to create (If not supplied name will be used instead)

VERSION = Version of the app you want to create, eg 0.0.0 (If not supplied, default version will be used .i.e. 0.0.0)


## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

NOTE: Development server requires that proxy-config.json file be included with proxy configuration to any dhis2 instance. An example file is supplied
.i.e. proxy-config.example.json
```{
     "/api": {
       "target": "https://play.hisptz.org/28",
       "secure": "false",
       "auth":"system:System123",
       "changeOrigin": "true"
   
     },
     "/": {
       "target": "https://play.hisptz.org/28",
       "secure": "false",
       "auth":"system:System123",
       "changeOrigin": "true"
     }
   }
   ```
You should make a copy and rename the copy to proxy-config.json and make it ignored to protect your credentials.
## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. This will also compress codes ready to be installed in any DHIS2 instance. 

Zipped file will have the default name of seed-app.zip. You should rename the name for the compressed file into the name of your liking. You can change this in package.json file in this line

```
...
"build": "ng build --prod --aot --output-hashing all --sourcemaps false --named-chunks false --build-optimizer --vendor-chunk  && cd dist && zip -r -D <seed-app>.zip .",
...
```
Replace name seed-app to your name
## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Code commit

This app has been configured to use Commitizen tool in order to write commits in standard format. To commit using commitizen just type
`npm run commit` and fill in details based on questions that will be asked. For more info about Commitizen tool check out  [Commitizen](https://commitizen.github.io/cz-cli/)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
