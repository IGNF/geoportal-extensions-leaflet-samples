/**
 * Configuration par defaut de la carte
 */
var  apiKey = "an7nvfzojv5wa96dsga5nk8w";

/**
 * Configuration par defaut du projet
 */
var project = {
    sourceProject : "https://github.com/IGNF/geoportal-extensions-leaflet-samples",
    sourceExtensions: "https://ignf.github.io/geoportal-extensions",
    jsdoc: "https://ignf.github.io/geoportal-extensions/current/jsdoc/leaflet",
    library: {
        name: "Leaflet",
        url: "https://leafletjs.com/",
        logo: "./assets/logo-leaflet.png",
        dist: {
            js: "https://cdn.jsdelivr.net/npm/leaflet@1.8.0/dist/leaflet.js",
            css: "https://cdn.jsdelivr.net/npm/leaflet@1.8.0/dist/leaflet.css"
        },
        plugin: {
            js: "https://ignf.github.io/geoportal-extensions/leaflet-latest/dist/GpPluginLeaflet.js",
            css: "https://ignf.github.io/geoportal-extensions/leaflet-latest/dist/GpPluginLeaflet.css"
        },
        others: [{
            js: "https://cdn.jsdelivr.net/npm/@mapbox/leaflet-omnivore@0.3.4/leaflet-omnivore.js",
            css: ""
        }]
    }
};

export var config = {
    apiKey: apiKey,
    project: project
};
