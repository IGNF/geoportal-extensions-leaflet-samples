// <!-- classe specifique à OpenLayers -->
// ES6 notation
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Template_literals
import {
    /* commaLists, */
    /* stripIndent, */
    stripIndents,
    html
} from 'common-tags';

import {
    config
} from "./config";

var data = {
    apiKey: config.apiKey,
    layers: [],
    view: "",
    widgets: {
        isocurve: {
            code: "",
            class: "Isocurve"
        },
        layerswitcher: {
            code: "",
            class: "LayerSwitcher"
        },
        mouseposition: {
            code: "",
            class: "MousePosition"
        },
        route: {
            code: "",
            class: "Route"
        },
        reversegeocode: {
            code: "",
            class: "ReverseGeocode"
        },
        searchengine: {
            code: "",
            class: "SearchEngine"
        },
        elevationpath: {
            code: "",
            class: "ElevationPath"
        }
    },
    res : []
};

// const indentString = (str, count, indent = ' ') => {
//     if (count >= 0) {
//         str.replace(/^/gm, indent.repeat(count));
//     }
// }

/**
 * clear data
 */
function __clear() {
    data.layers = [];
    data.view = "";
    data.res = [];
    for (const key in data.widgets) {
        if (Object.hasOwnProperty.call(data.widgets, key)) {
            const el = data.widgets[key];
            el.code = "";
        }
    }
}

/**
 * add a layer config into template
 * @param {String} type 
 * @param {String} name 
 * @example
 * __addLayer('tile', 'ORTHOIMAGERY.ORTHOPHOTOS')
 */
function __addLayer(type, name) {
    switch (type) {
        case "tile":
            data.layers.push(`
                L.geoportalLayer.WMTS({
                    layer : "${name}"
                }).addTo(map);
            `);
            break;
        case "image":
            data.layers.push(`
                L.geoportalLayer.WMS({
                    layer : "${name}"
                }).addTo(map);
            `);
            break;
        case "vector.kml":
            var fileKml = name.substring(name.lastIndexOf('/')+1);
            data.layers.push(`
                omnivore.kml("${fileKml}")
                    .on('ready', function() {})
                    .on('error', function() {})
                .addTo(map);
            `);
            data.res.push({
                file : fileKml,
                url : name
            });
            break;
        case "vector.gpx":
            var fileGpx = name.substring(name.lastIndexOf('/')+1);
            data.layers.push(`
                omnivore.gpx("${fileGpx}")
                    .on('ready', function() {})
                    .on('error', function() {})
                .addTo(map);
            `);
            data.res.push({
                file : fileGpx,
                url : name
            });
            break;
        case "vector.geojson":
            var fileJson = name.substring(name.lastIndexOf('/')+1);
            data.layers.push(`
                omnivore.geojson("${fileJson}")
                    .on('ready', function() {})
                    .on('error', function() {})
                .addTo(map);
            `);
            data.res.push({
                file : fileJson,
                url : name
            });
            break;
        case "vectortile":
        default:
            break;
    }
}

/**
 * add a view config into template
 * @param {Object} option 
 */
function __addView(option) {
    data.view = JSON.stringify(option, null, 0);
}

/**
 * add a widget config into template
 * @param {String} name 
 * @param {Object} option
 * @example
 * __addWidget('drawing', {})
 */
function __addWidget(name, option) {
    var opts = JSON.stringify(option || {}, null, 0);
    var className = data.widgets[name].class;
    data.widgets[name].code = `
        // widget ${name}
        var ${name} = L.geoportalControl.${className}(${opts});
        map.addControl(${name});
    `;
}

/**
 * get code js
 * @returns {String}
 */
function __getCodeJS() {
    var strLayers = "";
    data.layers.forEach(l => {
        strLayers = strLayers.concat(l);
    });

    var layers = `${strLayers}`;
    var view = stripIndents `${data.view}`;

    return `
    window.onload = function () {
        
        // la carte
        var map = L.map("map", ${view});

        // les couches
        ${layers}

        // les widgets
        ${data.widgets.isocurve.code}
        ${data.widgets.layerswitcher.code}
        ${data.widgets.mouseposition.code}
        ${data.widgets.route.code}
        ${data.widgets.reversegeocode.code}
        ${data.widgets.searchengine.code}
        ${data.widgets.elevationpath.code}
    };
    `;
}

/**
 * get code html
 * @returns {String}
 */
function __getCodeHTML() {
    var code = {
        js: __getCodeJS(),
        css: __getCodeCSS()
    };

    var otherJs = "";
    var otherCss = "";
    var others = config.project.library.others;
    others.forEach(el => {
        if (el.js) {
            otherJs = otherJs.concat("<script src=\"", el.js, "\"></script>");
        }
        if (el.css) {
            otherCss = otherCss.concat("<link rel=\"stylesheet\" href=\"", el.css, "\" />");
        }
    });

    return html `
    <!DOCTYPE html>
    <html>
        <head>
            <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
            <meta charset="UTF-8">

            <!-- Library -->
            <link rel="stylesheet" href="${config.project.library.dist.css}" />
            <script src="${config.project.library.dist.js}"></script>
            ${otherJs}
            ${otherCss}

            <!-- Plugin IGN -->
            <link rel="stylesheet" href="${config.project.library.plugin.css}" />
            <script src="${config.project.library.plugin.js}" data-key="${data.apiKey}"></script>

            <style>
            ${code.css}
            </style>

            <title>Exemple</title>

        </head>
        <body>
            <h1>Extensions Géoportail</h1>
            <!-- map -->
            <div id="map"></div>
            <!-- code source -->
            <script>
            ${code.js}
            </script>
        </body>
    </html>
    `;
}

/**
 * get code css
 * @returns {String}
 */
function __getCodeCSS() {
    return `
    #map {
        height: 400px;
        width: 100%;
    }
    `;
}

function __getResources() {
    return data.res;
}

export var tpl = {
    clear: __clear,
    addLayer: __addLayer,
    addView: __addView,
    addWidget: __addWidget,
    getCodeJS: __getCodeJS,
    getCodeHTML: __getCodeHTML,
    getCodeCSS: __getCodeCSS,
    getResources : __getResources
};