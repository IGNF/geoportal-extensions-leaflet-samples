// <!-- classe specifique à OpenLayers -->

import { setOptions } from "./helper";
import { config } from "./config";
import { tpl } from "./template";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import omnivore from "@mapbox/leaflet-omnivore";

import {
    LExtended, 
    leafletExtVersion, 
    leafletExtDate,
    Services,
    Logger
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

const isProduction = process.env.NODE_ENV === 'production';
isProduction ? Logger.disableAll() : Logger.enableAll();

// gestion du path de deploiement
const publicPath = process.env.BASE_URL;

var m_map = null;
var m_container = null;

/** suppression  de la carte */
export function removeMap() {
    if (m_map != null) {
        m_map.remove();
        m_map = null;
        // if (m_container) {
        //     m_container.remove();
        //     m_container = null;
        // }
    }
}

/** ajout de la carte */
export function addMap(options, status) {

    // Creation de la Map
    var createMap = function () {
        tpl.clear();

        // container
        var containerMain = document.getElementById("mapContainer");
        m_container = containerMain.firstChild;
        // FIXME map container is being reused by another instance
        // if (! m_container) {
        //     m_container = document.createElement("div");
        //     m_container.className = "map";
        //     m_container.id = "map";
        //     containerMain.appendChild(container);
        // }

        // options de la carte
        var mapOptions = setOptions(options.l.view);
        tpl.addView(setOptions(options.l.view));

        // creation de la carte
        m_map = L.map(m_container, mapOptions);

        // traitements des layers
        options.l.layer.params.forEach(element => {
            if (element.section) {
                return;
            }
            if (!element.value) {
                return;
            }
            if (element.service.toLowerCase() === "tile") {
                var wmts = LExtended.geoportalLayer.WMTS({
                    layer : element.name
                });
                tpl.addLayer("tile", element.name);
                m_map.addLayer(wmts);
            }
            if (element.service.toLowerCase() === "image") {
                var wms = LExtended.geoportalLayer.WMS({
                    layer : element.name
                });
                tpl.addLayer("image", element.name);
                m_map.addLayer(wms);
            }
            if (element.service.toLowerCase() === "vector.kml") {
                var urlKml = publicPath + element.name;
                omnivore.kml(urlKml)
                .on('ready', function() {})
                .on('error', function() {})
                .addTo(m_map);
                tpl.addLayer("vector.kml", element.name);
            }
            if (element.service.toLowerCase() === "vector.gpx") {
                var urlGpx = publicPath + element.name;
                omnivore.gpx(urlGpx)
                .on('ready', function() {})
                .on('error', function() {})
                .addTo(m_map);
                tpl.addLayer("vector.gpx", element.name);
            }
            if (element.service.toLowerCase() === "vector.geojson") {
                var urlJson = publicPath + element.name;
                omnivore.geojson(urlJson)
                .on('ready', function() {})
                .on('error', function() {})
                .addTo(m_map);
                tpl.addLayer("vector.geojson", element.name);
            }
            /*
            if (element.service.toLowerCase() === "vectortile") {
                layersOptions.layers.push();
            } 
            */
        });

        // traitements des widgets
        var opts;
        if (status.isocurve) {
            opts = setOptions(options.isocurve);
            var iso = new LExtended.geoportalControl.Isocurve(opts);
            m_map.addControl(iso);
            tpl.addWidget("isocurve", opts);
        }
        if (status.layerswitcher) {
            opts = setOptions(options.layerswitcher);
            var layerswitcher = new LExtended.geoportalControl.LayerSwitcher(opts);
            m_map.addControl(layerswitcher);
            tpl.addWidget("layerswitcher", opts);
        }
        if (status.mouseposition) {
            opts = setOptions(options.mouseposition);
            var mp = new LExtended.geoportalControl.MousePosition(opts);
            m_map.addControl(mp);
            tpl.addWidget("mouseposition", opts);
        }
        if (status.route) {
            opts = setOptions(options.route);
            var route = new LExtended.geoportalControl.Route(opts);
            m_map.addControl(route);
            tpl.addWidget("route", opts);
        }
        if (status.reversegeocode) {
            opts = setOptions(options.reversegeocode);
            var reverse = new LExtended.geoportalControl.ReverseGeocode(opts);
            m_map.addControl(reverse);
            tpl.addWidget("reversegeocode", opts);
        }
        if (status.searchengine) {
            opts = setOptions(options.searchengine);
            var search = new LExtended.geoportalControl.SearchEngine(opts);
            m_map.addControl(search);
            tpl.addWidget("searchengine", opts);
        }
        if (status.elevationpath) {
            opts = setOptions(options.elevationpath);
            var measureProfil = new LExtended.geoportalControl.ElevationPath(opts);
            m_map.addControl(measureProfil);
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