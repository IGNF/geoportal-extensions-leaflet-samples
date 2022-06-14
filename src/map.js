// <!-- classe specifique à OpenLayers -->

import { setOptions } from "./helper";
import { config } from "./config";
import { tpl } from "./template";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
    LExtended, 
    leafletExtVersion, 
    leafletExtDate,
    Services,
    // Logger
} from "geoportal-extensions-leaflet";

import JsonElevationPath from "./data/leaflet-elevationpath.doclet.json";
import JsonIsoCurve from "./data/leaflet-isocurve.doclet.json";
import JsonLayerSwitcher from "./data/leaflet-layerswitcher.doclet.json";
import JsonMousePosition from "./data/leaflet-mouseposition.doclet.json";
import JsonReverseGeocode from "./data/leaflet-reversegeocoding.doclet.json";
import JsonRoute from "./data/leaflet-route.doclet.json";
import JsonSearchEngine from "./data/leaflet-searchengine.doclet.json";

import JsonLView from "./data/l/leaflet-view.json";
import JsonLLayer from "./data/l/leaflet-layer.json";

// FIXME le gestion des loggers des API Leaflet n'est pas exposée dans le bundle !?
// const isProduction = process.env.NODE_ENV === 'production';
// isProduction ? Logger.disableAll() : Logger.enableAll();

// gestion du path de deploiement
// const publicPath = process.env.BASE_URL;

var map = null;

/** suppression  de la carte */
export function removeMap() {
    if (map != null) {
        map.remove();
        map = null;
    }
}

/** ajout de la carte */
export function addMap(options, status) {

    // Creation de la Map
    var createMap = function () {
        tpl.clear();

        // traitements des layers
        var layersOptions = [];

        options.l.layer.params.forEach(element => {
            if (element.section) {
                return;
            }
            if (!element.value) {
                return;
            }
            if (element.service.toLowerCase() === "tile") {
                layersOptions.push(LExtended.geoportalLayer.WMTS({
                    layer : element.name
                }));
                tpl.addLayer("tile", element.name);
            }
            if (element.service.toLowerCase() === "image") {
                layersOptions.push(LExtended.geoportalLayer.WMS({
                    layer : element.name
                }));
                tpl.addLayer("image", element.name);
            }
            /* 
            if (element.service.toLowerCase() === "vector.kml") {
                layersOptions.push(new VectorLayer({
                        source: new VectorSource({
                            url: publicPath + element.name,
                            format: new KML()
                        })
                }));
                tpl.addLayer("vector.kml", element.name);
            }
            if (element.service.toLowerCase() === "vector.gpx") {
                layersOptions.push(new VectorLayer({
                        source: new VectorSource({
                            url: publicPath + element.name,
                            format: new GPX()
                        })
                }));
                tpl.addLayer("vector.gpx", element.name);
            }
            if (element.service.toLowerCase() === "vector.geojson") {
                layersOptions.push(new VectorLayer({
                        source: new VectorSource({
                            url: publicPath + element.name,
                            format: new GeoJSON()
                        })
                }));
                tpl.addLayer("vector.geojson", element.name);
            }
            if (element.service.toLowerCase() === "vectortile") {
                layersOptions.push(
                    // EVOL ol v6 !
                    // cf. https://openlayers.org/en/latest/apidoc/module-ol_layer_MapboxVector.html
                    // new MapboxVector({
                    //     styleUrl: publicPath + '',
                    // })
                );
            } 
            */
        });

        map = L.map("map", {
            layers: layersOptions,
            center: [48.9, 2],
            zoom: 13
        });

        // TODO les options de la carte sous Leaflet
        // tpl.addView(setOptions(options.leaflet.view));

        var opts;
        if (status.isocurve) {
            opts = setOptions(options.isocurve);
            var iso = new LExtended.geoportalControl.Isocurve(opts);
            map.addControl(iso);
            tpl.addWidget("isocurve", opts);
        }
        if (status.layerswitcher) {
            opts = setOptions(options.layerswitcher);
            var layerSwitcher = new LExtended.geoportalControl.LayerSwitcher(opts);
            map.addControl(layerSwitcher);
            tpl.addWidget("layerswitcher", opts);
        }
        if (status.mouseposition) {
            opts = setOptions(options.mouseposition);
            var mp = new LExtended.geoportalControl.MousePosition(opts);
            map.addControl(mp);
            tpl.addWidget("mouseposition", opts);
        }
        if (status.route) {
            opts = setOptions(options.route);
            var route = new LExtended.geoportalControl.Route(opts);
            map.addControl(route);
            tpl.addWidget("route", opts);
        }
        if (status.reversegeocode) {
            opts = setOptions(options.reversegeocode);
            var reverse = new LExtended.geoportalControl.ReverseGeocode(opts);
            map.addControl(reverse);
            tpl.addWidget("reversegeocode", opts);
        }
        if (status.searchengine) {
            opts = setOptions(options.searchengine);
            var search = new LExtended.geoportalControl.SearchEngine(opts);
            map.addControl(search);
            tpl.addWidget("searchengine", opts);
        }
        if (status.elevationpath) {
            opts = setOptions(options.elevationpath);
            var measureProfil = new LExtended.geoportalControl.ElevationPath(opts);
            map.addControl(measureProfil);
            tpl.addWidget("elevationpath", opts);
        }
    };

    // Appel autoconf
    Services.getConfig({
        apiKey: config.apiKey,
        protocol : "XHR",
        onSuccess : createMap
    });
}

/** obtenir la nom de la librairie */
export function getLibraryName() {
    return config.project.library.name;
}

/** obtenir les options des widgets par defaut */
export function getWidgetOptions() {
    return {
        route : JsonRoute,
        mouseposition : JsonMousePosition,
        layerswitcher : JsonLayerSwitcher,
        reversegeocode : JsonReverseGeocode,
        searchengine : JsonSearchEngine,
        isocurve : JsonIsoCurve,
        elevationpath : JsonElevationPath
    };
}

/** obtenir les options de la carte par defaut */
export function getMapOptions() {
    return {
        l: {
            view: JsonLView,
            layer: JsonLLayer
        }
    };
}

/** obtenir le statut des widgets par defaut */
export function getWidgetStatus() {
    return {
        route : false,
        mouseposition : false,
        layerswitcher : false,
        reversegeocode : false,
        searchengine : false,
        isocurve : false,
        elevationpath : false
    };
}

/** obtenir la version / date des widgets */
export function getLibraryInfo() {
    return {
        version : "[" + leafletExtVersion + "]",
        date : leafletExtDate
    };
}