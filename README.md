# vuejs / geoportal-extensions

Exemples d'utilisation de l'API des extensions du Géoportail (geoportal-extensions).

![Exemple Image](capture.png)

## Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [VueJS](https://fr.vuejs.org/)
* [Google Chrome](https://google.com/chrome/)
* [DevTool VueJS](https://devtools.vuejs.org/guide/installation.html)

## Installation

* `npm install`

## Running / Development

* `npm run serve`
* Visit your app at [http://localhost:8085](http://localhost:8085).

You can link your developpment library into the *package.json*

Ex.
```json
"dependencies": {
    "geoportal-extensions-leaflet": "https://raw.githubusercontent.com/IGNF/geoportal-extensions/develop/build/scripts/release/geoportal-extensions-leaflet-2.2.4.tgz",
}
```

### Linting

* `npm run lint`
* `npm run lint -- --fix`

### Building

* `npm run build` (production)
* `npm run build -- --mode development` (development)

### Deploying

Specify what it takes to deploy your app.

### Docker

* `docker build -t dockerize-vuejs-app .`
* `docker run -it -p 8888:80 --rm --name dockerize-vuejs-app-1 dockerize-vuejs-app`

avec un accès à notre app sur http://localhost:8888

## Further Reading / Useful Links

* [vue.js](https://fr.vuejs.org/)
* [vue-cli](https://cli.vuejs.org/)
