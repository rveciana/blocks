var StaticCanvasMap;
var ZoomableCanvasMap;

! function() {
    "use strict";

    // TODO use turf inside as a dependency?
    // Copied from turf.inside
    function inside(pt, polygon) {
        var polys = polygon.geometry.coordinates
        // normalize to multipolygon
        if (polygon.geometry.type === 'Polygon')
            polys = [polys]

        var insidePoly = false
        var i = 0
        while (i < polys.length && !insidePoly) {
            // check if it is in the outer ring first
            if (inRing(pt, polys[i][0])) {
                var inHole = false
                var k = 1
                // check for the point in any of the holes
                while (k < polys[i].length && !inHole) {
                    if (inRing(pt, polys[i][k])) {
                        inHole = true
                    }
                    k++
                }
                if(!inHole)
                    insidePoly = true
            }
            i++
        }
        return insidePoly
    }

    // pt is [x,y] and ring is [[x,y], [x,y],..]
    function inRing (pt, ring) {
        var isInside = false
        for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            var xi = ring[i][0], yi = ring[i][1]
            var xj = ring[j][0], yj = ring[j][1]
            var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
                (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)
            if (intersect) isInside = !isInside
        }
        return isInside
    }

    function maxBounds(one, two) {
        var bounds = two
        if (one[0][0] < two[0][0])
            bounds[0][0] = one[0][0]
        if (one[0][1] < two[0][1])
            bounds[0][1] = one[0][1]
        if (one[1][0] > two[1][0])
            bounds[1][0] = one[1][0]
        if (one[1][1] > two[1][1])
            bounds[1][1] = one[1][1]
        return bounds
    }

    function createRTree(element, dataPath) {
        element.lookupTree = rbush(4)
        var elements = []

        for (var j in element.features.features) {
            var bounds = dataPath.bounds(element.features.features[j])
            elements.push([
                bounds[0][0].toFixed(0),
                bounds[0][1].toFixed(0),
                Math.ceil(bounds[1][0]),
                Math.ceil(bounds[1][1]),
                element.features.features[j]
            ])
        }
        element.lookupTree.load(elements)
    }

    function paintFeature(element, feature, parameters) {
        parameters.context.beginPath()
        parameters.path(feature)
        element.static.paintfeature(parameters, feature)
    }

    function paintBackgroundElement(element, parameters) {
        if (!element.static)
            return
        if (element.static.prepaint)
            element.static.prepaint(parameters)
        if (element.static.paintfeature) {
            var lookup = element.lookupTree.search([
                parameters.translate[0],
                parameters.translate[1],
                parameters.width / parameters.scale - parameters.translate[0],
                parameters.height / parameters.scale - parameters.translate[1]
            ])
            for (var j in lookup) {
                paintFeature(element, lookup[j][4], parameters)
            }
        }
        if (element.static.postpaint)
            element.static.postpaint(parameters)
    }

    function PartialPainter(data, parameters) {
        var index = 0,
            j = 0,
            element = null,
            currentLookup = []

        this.hasNext = function() {
            return index <= data.length && j < currentLookup.length
        }
        this.renderNext = function() {
            if (index >= data.length && j >= currentLookup.length)
                return
            var start = performance.now()
            if (!element || j >= currentLookup.length) {
                while (index < data.length && !data[index].static) {
                    index++
                }
                if (index >= data.length)
                    return
                element = data[index]

                if (element.static.prepaint)
                    element.static.prepaint(parameters)

                currentLookup = element.lookupTree.search([
                    - parameters.translate[0],
                    - parameters.translate[1],
                    parameters.width / parameters.scale - parameters.translate[0],
                    parameters.height / parameters.scale - parameters.translate[1]
                ])
                j = 0
                ++index
            }
            if (element.static.paintfeature) {
                for (; j != currentLookup.length; ++j) {
                    var feature = currentLookup[j][4]
                    paintFeature(element, feature, parameters)
                    if ((performance.now() - start) > 10)
                        break
                }
            } else {
                j = currentLookup.length
            }
            if (j == currentLookup.length && element.static.postpaint) {
                element.static.postpaint(parameters)
            }
        }
        this.finish = function() {
            if (index >= data.length && j >= currentLookup.length)
                return
            if (j < currentLookup.length)
                index--
            for (; index != data.length; ++index) {
                if (j >= currentLookup.length) {
                    while (!data[index].static && index < data.length) {
                        index++
                    }
                    if (index >= data.length)
                        return
                    element = data[index]

                    if (element.static.prepaint)
                        element.static.prepaint(parameters)
                    currentLookup = element.lookupTree.search([
                        - parameters.translate[0],
                        - parameters.translate[1],
                        parameters.width / parameters.scale - parameters.translate[0],
                        parameters.height / parameters.scale - parameters.translate[1]
                    ])
                    j = 0
                }
                if (element.static.paintfeature) {
                    for (; j != currentLookup.length; ++j) {
                        var feature = currentLookup[j][4]
                        paintFeature(element, feature, parameters)
                    }
                }
                if (element.static.postpaint)
                    element.static.postpaint(parameters)
            }
        }
    }


    function translatePoint(point, scale, translate) {
        return [
            point[0] / scale - translate[0],
            point[1] / scale - translate[1]
        ]
    }

    function extend(extension, obj) {
        var newObj = {}
        // FIXME this is a bit hacky? Can't we just mutate the original obj? (can't bc projection)
        for (var elem in obj) {
            newObj[elem] = obj[elem]
        }
        for (var elem in extension) {
            if (!newObj.hasOwnProperty(elem))
                newObj[elem] = extension[elem]
        }
        return newObj
    }

    function CanvasMap(parameters) {
        var settings = extend({
                width: d3.select(parameters.element).node().getBoundingClientRect().width,
                ratio: 1,
                area: 0,
                scale: 1,
                translate: [0, 0],
                background: null,
                backgroundScale: 1,
                backgroundTranslate: [0, 0],
                map: this
            }, parameters),
            simplify = d3.geo.transform({
                point: function(x, y, z) {
                    if (!z || z >= settings.area) {
                        this.stream.point(x, y)
                    }
                }
            }),
            canvas = null,
            context = null

        if (!parameters.projection) {
            var b = [[Infinity, Infinity],
                     [-Infinity, -Infinity]]
            for (var i in settings.data) {
                b = maxBounds(b, d3.geo.bounds(settings.data[i].features))
            }
            settings.projection = d3.geo.mercator()
                .scale(1)
                .center([(b[1][0] + b[0][0]) / 2, (b[1][1] + b[0][1]) / 2])
        }
        var dataPath = d3.geo.path().projection({
            stream: function(s) {
                return simplify.stream(settings.projection.stream(s))
            }
        })
        var b = [[Infinity, Infinity],
                 [-Infinity, -Infinity]]
        for (var i in settings.data) {
            b = maxBounds(b, dataPath.bounds(settings.data[i].features))
        }

        var dx = b[1][0] - b[0][0],
            dy = b[1][1] - b[0][1]

        if (!parameters.projection) {
            settings.height = settings.height || Math.ceil(dy * settings.width / dx)
            settings.projection.scale(0.9 * (settings.width / dx))
                .translate([settings.width / 2, settings.height / 2])
        } else if (!settings.height) {
            settings.height = Math.ceil(dy * 1 / 0.9)
        }
        d3.select(settings.parameters).attr("height", settings.height)

        function init() {
            canvas = d3.select(settings.element)
                .append("canvas")
            context = canvas.node().getContext("2d")

            var devicePixelRatio = window.devicePixelRatio || 1,
                backingStoreRatio = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1
            settings.ratio = devicePixelRatio / backingStoreRatio
            settings.area = 1 / settings.projection.scale() / settings.ratio / 20

            canvas.attr("width", settings.width * settings.ratio)
            canvas.attr("height", settings.height * settings.ratio)
            canvas.style("width", settings.width + "px")
            canvas.style("height", settings.height + "px")
            context.lineJoin = "round"
            context.lineCap = "round"

            dataPath.context(context)
            context.clearRect(0, 0, settings.width * settings.ratio, settings.height * settings.ratio)
            context.save()
            context.scale(settings.ratio, settings.ratio)

            // TODO move rtree part out?
            for (var i in settings.data) {
                createRTree(settings.data[i], dataPath)
            }

            settings.background = new Image()
            settings.backgroundScale = settings.scale
            settings.backgroundTranslate = settings.translate
            var parameters = {
                path: dataPath,
                context: context,
                scale: settings.scale,
                translate: settings.translate,
                width: settings.width,
                height: settings.height,
                map: settings.map
            }
            var callback = function() {
                var hasHover = false,
                    hasClick = false
                for (var i in settings.data) {
                    var element = settings.data[i]

                    hasHover = hasHover || (element.events && element.events.hover)
                    hasClick = hasClick || (element.events && element.events.click)

                    if (element.dynamic && element.dynamic.postpaint)
                        element.dynamic.postpaint(parameters, null)
                }

                context.restore()

                hasClick && canvas.on("click", click)
                hasHover && canvas.on("mousemove", hover)
                                  .on("mouseleave", hoverLeave)
            }

            for (var i in settings.data) {
                var element = settings.data[i]
                if (element.dynamic && element.dynamic.prepaint)
                    element.dynamic.prepaint(parameters, element.hoverElement)
            }
            for (var i in settings.data) {
                var element = settings.data[i]
                paintBackgroundElement(element, parameters)
            }
            settings.background.onload = callback
            settings.background.src = canvas.node().toDataURL()

            //Prevent another call to the init method
            this.init = function() {}
        }

        // TODO probably try to use the same data path in the zoom class, but have a different area settable?

        function paint() {
            context.save()
            context.scale(settings.scale * settings.ratio, settings.scale * settings.ratio)
            context.translate(settings.translate[0], settings.translate[1])

            context.clearRect(- settings.translate[0], - settings.translate[1], settings.width * settings.ratio, settings.height * settings.ratio)

            context.rect(- settings.translate[0], - settings.translate[1],
                settings.width / settings.scale,
                settings.height / settings.scale)
            context.clip()


            // FIXME this needs a way for the callback to use the lookupTree?
            var parameters = {
                path: dataPath,
                context: dataPath.context(),
                scale: settings.scale,
                translate: settings.translate,
                width: settings.width,
                height: settings.height,
                map: settings.map
            }

            settings.area = 1 / settings.projection.scale() / settings.scale / settings.ratio / 20

            for (var i in settings.data) {
                var element = settings.data[i]
                if (element.dynamic && element.dynamic.prepaint)
                    element.dynamic.prepaint(parameters, element.hoverElement)
            }

            context.drawImage(settings.background, 0, 0,
                settings.width * settings.ratio, settings.height * settings.ratio,
                - settings.backgroundTranslate[0],
                - settings.backgroundTranslate[1],
                settings.width / settings.backgroundScale, settings.height / settings.backgroundScale)

            for (var i in settings.data) {
                var element = settings.data[i]
                if (element.dynamic && element.dynamic.postpaint)
                    element.dynamic.postpaint(parameters, element.hoverElement)
            }

            context.restore()
        }

        function click() {
            var point = translatePoint(d3.mouse(this), settings.scale, settings.translate)

            var parameters = {
                scale: settings.scale,
                translate: settings.translate,
                width: settings.width,
                height: settings.height,
                map: settings.map
            }
            for (var i in settings.data) {
                var element = settings.data[i]
                if (!element.events || !element.events.click)
                    continue

                var lookup = element.lookupTree.search([point[0], point[1], point[0], point[1]])
                var isInside = false
                for (var j in lookup) {
                    var feature = lookup[j][4]
                    if (inside(settings.projection.invert(point), feature)) {
                        element.events.click(parameters, feature)
                        isInside = true
                    }
                }
                isInside || element.events.click(parameters, null)
            }
        }

        function hoverLeave() {
            var parameters = {
                scale: settings.scale,
                translate: settings.translate,
                width: settings.width,
                height: settings.height,
                map: settings.map
            }
            for (var i in settings.data) {
                var element = settings.data[i]
                if (!element.events || !element.events.hover)
                    continue
                element.hoverElement = false
                element.events.hover(parameters, null)
            }
        }

        function hover() {
            var point = translatePoint(d3.mouse(this), settings.scale, settings.translate),
                parameters = {
                    scale: settings.scale,
                    translate: settings.translate,
                    width: settings.width,
                    height: settings.height,
                    map: settings.map
                }

            for (var i in settings.data) {
                var element = settings.data[i]
                if (!element.events || !element.events.hover ||
                    (element.hoverElement && inside(settings.projection.invert(point), element.hoverElement))) {
                    continue
                }
                element.hoverElement = false
                var lookup = element.lookupTree.search([point[0], point[1], point[0], point[1]])
                for (var j in lookup) {
                    var feature = lookup[j][4]
                    if (inside(settings.projection.invert(point), feature)) {
                        element.hoverElement = feature
                        break
                    }
                }
                element.events.hover(parameters, element.hoverElement)
            }
        }

        this.init = init
        this.paint = paint
        this.settings = function() {
            return settings
        }
    }

    StaticCanvasMap = function(parameters) {
        var map = new CanvasMap(parameters)

        this.init = function() {
            map.init()
        }
        this.paint = function() {
            map.paint()
        }
    }

    var epsilon = 0.5
    function nearEqual(a, b) {
        return Math.abs(a - b) < epsilon
    }

    function ImageCache(parameters) {
        var cache = [],
            settings = parameters

        this.addImage = function(parameters) {
            cache.push(parameters)
        }

        this.getImage = function(parameters) {
            for (var i in cache) {
                var element = cache[i]
                if (nearEqual(element.scale, parameters.scale) &&
                    nearEqual(element.translate[0], parameters.translate[0]) &&
                    nearEqual(element.translate[1], parameters.translate[1]))
                    return element
            }
            return null
        }

        this.getFittingImage = function(bbox) {
            // Auto set scale=1, translate[0, 0] image as default return
            var currentImage = cache.length > 0 ? cache[0] : null
            for (var i in cache) {
                var image = cache[i]
                var imageBB = [
                    - image.translate[0],
                    - image.translate[1],
                    settings.width / image.scale - image.translate[0],
                    settings.height / image.scale - image.translate[1]
                ]
                if (imageBB[0] <= bbox[0] &&
                    imageBB[1] <= bbox[1] &&
                    imageBB[2] >= bbox[2] &&
                    imageBB[3] >= bbox[3] &&
                    (!currentImage || currentImage.scale < image.scale)) {
                    currentImage = image
                }
            }
            return currentImage
        }
    }

    ZoomableCanvasMap = function(parameters) {
        var map = new CanvasMap(parameters),
            simplify = d3.geo.transform({
                point: function(x, y, z) {
                    if (z >= area) this.stream.point(x, y)
                }
            }),
            area = 0,
            canvas = null,
            context = null,
            settings = map.settings(),
            dataPath = d3.geo.path().projection({
                stream: function(s) {
                    return simplify.stream(settings.projection.stream(s))
                }
            }),
            imageCache = new ImageCache({
                width: settings.width,
                height: settings.height
            }),
            busy = false

        settings.map = this
        settings.zoomScale = settings.zoomScale || 0.5

        this.init = function() {
            map.init()

            canvas = d3.select(settings.element)
                .append("canvas")
            context = canvas.node().getContext("2d")
            area = 1 / settings.projection.scale() / settings.ratio / 20

            canvas.attr("width", settings.width * settings.ratio)
            canvas.attr("height", settings.height * settings.ratio)
            canvas.style("width", settings.width + "px")
            canvas.style("height", settings.height + "px")
            canvas.style("display", "none")
            context.lineJoin = "round"
            context.lineCap = "round"

            dataPath.context(context)

            imageCache.addImage({
                image: settings.background,
                scale: settings.scale,
                translate: settings.translate
            })
        }
        this.paint = function() {
            map.paint()
        }
        function scaleZoom(scale, translate) {
            if (busy) {
                return
            }
            busy = true
            if (nearEqual(scale, settings.scale) &&
                nearEqual(translate[0], settings.translate[0]) &&
                nearEqual(translate[1], settings.translate[1])) {
                scale = 1
                translate = [0, 0]
            }
            if (scale == 1 && settings.scale == 1 &&
                !translate[0] && !translate[1] &&
                !settings.translate[0] && !settings.translate[1]) {
                return
            }
            area = 1 / settings.projection.scale() / scale / settings.ratio / 20

            context.save()
            context.scale(scale * settings.ratio, scale * settings.ratio)
            context.translate(translate[0], translate[1])
            context.clearRect(- translate[0], - translate[1], settings.width * settings.ratio, settings.height * settings.ratio)
            var parameters = {
                path: dataPath,
                context: context,
                scale: scale,
                translate: translate,
                width: settings.width,
                height: settings.height,
                map: settings.map
            }

            var image = imageCache.getImage({
                scale: scale,
                translate: translate
            })
            if (!image) {
                var background = new Image(),
                    partialPainter = new PartialPainter(settings.data, parameters)
            }

            var translatedOne = translatePoint([settings.width, settings.height], scale, translate),
                translatedTwo = translatePoint([settings.width, settings.height], settings.scale, settings.translate)
            var bbox = [
                Math.min(- translate[0], - settings.translate[0]),
                Math.min(- translate[1], - settings.translate[1]),
                Math.max(translatedOne[0], translatedTwo[0]),
                Math.max(translatedOne[1], translatedTwo[1])
            ]
            var zoomImage = imageCache.getFittingImage(bbox)
            if (zoomImage) {
                settings.background = zoomImage.image
                settings.backgroundScale = zoomImage.scale
                settings.backgroundTranslate = zoomImage.translate
            }
            d3.transition()
                .duration(300)
                .ease("linear")
                .tween("zoom", function() {
                    var i = d3.interpolateNumber(settings.scale, scale),
                        oldTranslate = settings.translate,
                        oldScale = settings.scale
                    return function(t) {
                        settings.scale = i(t)
                        var newTranslate = [
                            oldTranslate[0] + (translate[0] - oldTranslate[0]) / (scale - oldScale) * (i(t) - oldScale) * scale / i(t),
                            oldTranslate[1] + (translate[1] - oldTranslate[1]) / (scale - oldScale) * (i(t) - oldScale) * scale / i(t),
                        ]
                        settings.translate = newTranslate
                        map.paint()
                        !image && partialPainter.renderNext()
                    }
                })
                .each("end", function() {
                    settings.scale = scale
                    settings.translate = translate

                    if (image) {
                        context.restore()
                        settings.background = image.image
                        settings.backgroundScale = image.scale
                        settings.backgroundTranslate = image.translate
                        map.paint()
                    } else {
                        map.paint()
                        partialPainter.finish()
                        background.onload = function() {
                            context.restore()
                            imageCache.addImage({
                                image: background,
                                scale: scale,
                                translate: translate
                            })
                            settings.background = background
                            settings.backgroundScale = scale
                            settings.backgroundTranslate = translate
                            map.paint()
                        }
                        // TODO there is a function to get the image data from the context, is that faster?
                        // TODO use getImageData/putImageData, because it's faster?
                        background.src = canvas.node().toDataURL()
                    }
                    busy = false
                })
        }
        this.zoom = function(d) {
            if (!d) {
                scaleZoom.call(this, 1, [0, 0])
                return
            }
            var bounds = dataPath.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                bx = (bounds[0][0] + bounds[1][0]) / 2,
                by = (bounds[0][1] + bounds[1][1]) / 2,
                scale = settings.zoomScale *
                    Math.min(settings.width / dx, settings.height / dy),
                translate = [-bx + settings.width / scale / 2,
                             -by + settings.height / scale / 2]

            scaleZoom.call(this, scale, translate)
        }
        this.settings = function(d){
            return map.settings()
        }
    }
}()
