(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.rastertools = global.rastertools || {})));
}(this, function (exports) { 'use strict';

  var isobands = function(data, geoTransform, intervals){
      var bands = { "type": "FeatureCollection",
      "features": []
      };
      for(var i=1; i<intervals.length; i++){
          var lowerValue = intervals[i-1];
          var upperValue = intervals[i];
          var coords = projectedIsoband(data, geoTransform, lowerValue, upperValue - lowerValue);
          //Change clockwise
          for(var j=0; j< coords.length; j++)
            coords[j].reverse();

          bands['features'].push({"type": "Feature",
           "geometry": {
             "type": "Polygon",
            "coordinates": coords},
            "properties": [{"lowerValue": lowerValue, "upperValue": upperValue}]}
          );
      }

      return bands;
    };


  var projectedIsoband = function(data, geoTransform, minV, bandwidth){
      if(typeof(geoTransform) != typeof(new Array()) || geoTransform.length != 6)
          throw new Error("GeoTransform must be a 6 elements array");
      var coords = isoband(data, minV, bandwidth);

      for(var i = 0; i<coords.length; i++){
          for(var j = 0; j<coords[i].length; j++){
              var coordsGeo = applyGeoTransform(coords[i][j][0], coords[i][j][1], geoTransform);
              coords[i][j][0]= coordsGeo[0];
              coords[i][j][1]= coordsGeo[1];
          }
      }

      return coords;
    };

    /**
      Xgeo = GT(0) + Xpixel*GT(1) + Yline*GT(2)
      Ygeo = GT(3) + Xpixel*GT(4) + Yline*GT(5)
    */
    var applyGeoTransform = function(x, y, geoTransform){
      var xgeo = geoTransform[0] + x*geoTransform[1] + y*geoTransform[2];
      var ygeo = geoTransform[3] + x*geoTransform[4] + y*geoTransform[5];
      return [xgeo, ygeo];
    }

    /*
      Compute isobands(s) of a scalar 2D field given a certain
      threshold and a bandwidth by applying the Marching Squares
      Algorithm. The function returns a list of path coordinates
      either for individual polygons within each grid cell, or the
      outline of connected polygons.
    */
    var isoband = function(data, minV, bandwidth, options){
      var settings = {};
      var defaultSettings = {
      successCallback:  null,
      progressCallback: null,
      verbose:          false
      };

      /* process options */
      options = options ? options : {};

      var optionKeys = Object.keys(defaultSettings);

      for(var i = 0; i < optionKeys.length; i++){
        var key = optionKeys[i];
        var val = options[key];
        val = ((typeof val !== 'undefined') && (val !== null)) ? val : defaultSettings[key];

        settings[key] = val;
      }

      if(settings.verbose)
        console.log("computing isobands for [" + minV + ":" + (minV + bandwidth) + "]");

      var grid = computeBandGrid(data, minV, bandwidth);

      var ret = BandGrid2AreaPaths(grid);

      return ret;
    };

    /*
      Thats all for the public interface, below follows the actual
      implementation
    */

    /* Some private variables */
    var Node0 = 64;
  var Node1 = 16;
  var Node2 = 4;
  var Node3 = 1;
  /*  For isoBands, each square is defined by the three states
        of its corner points. However, since computers use power-2
        values, we use 2bits per trit, i.e.:

        00 ... below minV
        01 ... between minV and maxV
        10 ... above maxV

        Hence we map the 4-trit configurations as follows:

        0000 => 0
        0001 => 1
        0002 => 2
        0010 => 4
        0011 => 5
        0012 => 6
        0020 => 8
        0021 => 9
        0022 => 10
        0100 => 16
        0101 => 17
        0102 => 18
        0110 => 20
        0111 => 21
        0112 => 22
        0120 => 24
        0121 => 25
        0122 => 26
        0200 => 32
        0201 => 33
        0202 => 34
        0210 => 36
        0211 => 37
        0212 => 38
        0220 => 40
        0221 => 41
        0222 => 42
        1000 => 64
        1001 => 65
        1002 => 66
        1010 => 68
        1011 => 69
        1012 => 70
        1020 => 72
        1021 => 73
        1022 => 74
        1100 => 80
        1101 => 81
        1102 => 82
        1110 => 84
        1111 => 85
        1112 => 86
        1120 => 88
        1121 => 89
        1122 => 90
        1200 => 96
        1201 => 97
        1202 => 98
        1210 => 100
        1211 => 101
        1212 => 102
        1220 => 104
        1221 => 105
        1222 => 106
        2000 => 128
        2001 => 129
        2002 => 130
        2010 => 132
        2011 => 133
        2012 => 134
        2020 => 136
        2021 => 137
        2022 => 138
        2100 => 144
        2101 => 145
        2102 => 146
        2110 => 148
        2111 => 149
        2112 => 150
        2120 => 152
        2121 => 153
        2122 => 154
        2200 => 160
        2201 => 161
        2202 => 162
        2210 => 164
        2211 => 165
        2212 => 166
        2220 => 168
        2221 => 169
        2222 => 170
    */

    /*
      The look-up tables for tracing back the contour path
      of isoBands
    */

    var isoBandNextXTL = [];
    var isoBandNextYTL = [];
    var isoBandNextOTL = [];

    var isoBandNextXTR = [];
    var isoBandNextYTR = [];
    var isoBandNextOTR = [];

    var isoBandNextXRT = [];
    var isoBandNextYRT = [];
    var isoBandNextORT = [];

    var isoBandNextXRB = [];
    var isoBandNextYRB = [];
    var isoBandNextORB = [];

    var isoBandNextXBL = [];
    var isoBandNextYBL = [];
    var isoBandNextOBL = [];

    var isoBandNextXBR = [];
    var isoBandNextYBR = [];
    var isoBandNextOBR = [];

    var isoBandNextXLT = [];
    var isoBandNextYLT = [];
    var isoBandNextOLT = [];

    var isoBandNextXLB = [];
    var isoBandNextYLB = [];
    var isoBandNextOLB = [];

    isoBandNextXRT[85] = isoBandNextXRB[85] = -1;
    isoBandNextYRT[85] = isoBandNextYRB[85] = 0;
    isoBandNextORT[85] = isoBandNextORB[85] = 1;
    isoBandNextXLT[85] = isoBandNextXLB[85] = 1;
    isoBandNextYLT[85] = isoBandNextYLB[85] = 0;
    isoBandNextOLT[85] = isoBandNextOLB[85] = 1;

    isoBandNextXTL[85] = isoBandNextXTR[85] = 0;
    isoBandNextYTL[85] = isoBandNextYTR[85] = -1;
    isoBandNextOTL[85] = isoBandNextOBL[85] = 0;
    isoBandNextXBR[85] = isoBandNextXBL[85] = 0;
    isoBandNextYBR[85] = isoBandNextYBL[85] = 1;
    isoBandNextOTR[85] = isoBandNextOBR[85] = 1;


    /* triangle cases */
    isoBandNextXLB[1] = isoBandNextXLB[169] = 0;
    isoBandNextYLB[1] = isoBandNextYLB[169] = -1;
    isoBandNextOLB[1] = isoBandNextOLB[169] = 0;
    isoBandNextXBL[1] = isoBandNextXBL[169] = -1;
    isoBandNextYBL[1] = isoBandNextYBL[169] = 0;
    isoBandNextOBL[1] = isoBandNextOBL[169] = 0;

    isoBandNextXRB[4] = isoBandNextXRB[166] = 0;
    isoBandNextYRB[4] = isoBandNextYRB[166] = -1;
    isoBandNextORB[4] = isoBandNextORB[166] = 1;
    isoBandNextXBR[4] = isoBandNextXBR[166] = 1;
    isoBandNextYBR[4] = isoBandNextYBR[166] = 0;
    isoBandNextOBR[4] = isoBandNextOBR[166] = 0;

    isoBandNextXRT[16] = isoBandNextXRT[154] = 0;
    isoBandNextYRT[16] = isoBandNextYRT[154] = 1;
    isoBandNextORT[16] = isoBandNextORT[154] = 1;
    isoBandNextXTR[16] = isoBandNextXTR[154] = 1;
    isoBandNextYTR[16] = isoBandNextYTR[154] = 0;
    isoBandNextOTR[16] = isoBandNextOTR[154] = 1;

    isoBandNextXLT[64] = isoBandNextXLT[106] = 0;
    isoBandNextYLT[64] = isoBandNextYLT[106] = 1;
    isoBandNextOLT[64] = isoBandNextOLT[106] = 0;
    isoBandNextXTL[64] = isoBandNextXTL[106] = -1;
    isoBandNextYTL[64] = isoBandNextYTL[106] = 0;
    isoBandNextOTL[64] = isoBandNextOTL[106] = 1;

    /* single trapezoid cases */
    isoBandNextXLT[2] = isoBandNextXLT[168] = 0;
    isoBandNextYLT[2] = isoBandNextYLT[168] = -1;
    isoBandNextOLT[2] = isoBandNextOLT[168] = 1;
    isoBandNextXLB[2] = isoBandNextXLB[168] = 0;
    isoBandNextYLB[2] = isoBandNextYLB[168] = -1;
    isoBandNextOLB[2] = isoBandNextOLB[168] = 0;
    isoBandNextXBL[2] = isoBandNextXBL[168] = -1;
    isoBandNextYBL[2] = isoBandNextYBL[168] = 0;
    isoBandNextOBL[2] = isoBandNextOBL[168] = 0;
    isoBandNextXBR[2] = isoBandNextXBR[168] = -1;
    isoBandNextYBR[2] = isoBandNextYBR[168] = 0;
    isoBandNextOBR[2] = isoBandNextOBR[168] = 1;

    isoBandNextXRT[8] = isoBandNextXRT[162] = 0;
    isoBandNextYRT[8] = isoBandNextYRT[162] = -1;
    isoBandNextORT[8] = isoBandNextORT[162] = 0;
    isoBandNextXRB[8] = isoBandNextXRB[162] = 0;
    isoBandNextYRB[8] = isoBandNextYRB[162] = -1;
    isoBandNextORB[8] = isoBandNextORB[162] = 1;
    isoBandNextXBL[8] = isoBandNextXBL[162] = 1;
    isoBandNextYBL[8] = isoBandNextYBL[162] = 0;
    isoBandNextOBL[8] = isoBandNextOBL[162] = 1;
    isoBandNextXBR[8] = isoBandNextXBR[162] = 1;
    isoBandNextYBR[8] = isoBandNextYBR[162] = 0;
    isoBandNextOBR[8] = isoBandNextOBR[162] = 0;

    isoBandNextXRT[32] = isoBandNextXRT[138] = 0;
    isoBandNextYRT[32] = isoBandNextYRT[138] = 1;
    isoBandNextORT[32] = isoBandNextORT[138] = 1;
    isoBandNextXRB[32] = isoBandNextXRB[138] = 0;
    isoBandNextYRB[32] = isoBandNextYRB[138] = 1;
    isoBandNextORB[32] = isoBandNextORB[138] = 0;
    isoBandNextXTL[32] = isoBandNextXTL[138] = 1;
    isoBandNextYTL[32] = isoBandNextYTL[138] = 0;
    isoBandNextOTL[32] = isoBandNextOTL[138] = 0;
    isoBandNextXTR[32] = isoBandNextXTR[138] = 1;
    isoBandNextYTR[32] = isoBandNextYTR[138] = 0;
    isoBandNextOTR[32] = isoBandNextOTR[138] = 1;

    isoBandNextXLB[128] = isoBandNextXLB[42] = 0;
    isoBandNextYLB[128] = isoBandNextYLB[42] = 1;
    isoBandNextOLB[128] = isoBandNextOLB[42] = 1;
    isoBandNextXLT[128] = isoBandNextXLT[42] = 0;
    isoBandNextYLT[128] = isoBandNextYLT[42] = 1;
    isoBandNextOLT[128] = isoBandNextOLT[42] = 0;
    isoBandNextXTL[128] = isoBandNextXTL[42] = -1;
    isoBandNextYTL[128] = isoBandNextYTL[42] = 0;
    isoBandNextOTL[128] = isoBandNextOTL[42] = 1;
    isoBandNextXTR[128] = isoBandNextXTR[42] = -1;
    isoBandNextYTR[128] = isoBandNextYTR[42] = 0;
    isoBandNextOTR[128] = isoBandNextOTR[42] = 0;

    /* single rectangle cases */
    isoBandNextXRB[5] = isoBandNextXRB[165] = -1;
    isoBandNextYRB[5] = isoBandNextYRB[165] = 0;
    isoBandNextORB[5] = isoBandNextORB[165] = 0;
    isoBandNextXLB[5] = isoBandNextXLB[165] = 1;
    isoBandNextYLB[5] = isoBandNextYLB[165] = 0;
    isoBandNextOLB[5] = isoBandNextOLB[165] = 0;

    isoBandNextXBR[20] = isoBandNextXBR[150] = 0;
    isoBandNextYBR[20] = isoBandNextYBR[150] = 1;
    isoBandNextOBR[20] = isoBandNextOBR[150] = 1;
    isoBandNextXTR[20] = isoBandNextXTR[150] = 0;
    isoBandNextYTR[20] = isoBandNextYTR[150] = -1;
    isoBandNextOTR[20] = isoBandNextOTR[150] = 1;

    isoBandNextXRT[80] = isoBandNextXRT[90] = -1;
    isoBandNextYRT[80] = isoBandNextYRT[90] = 0;
    isoBandNextORT[80] = isoBandNextORT[90] = 1;
    isoBandNextXLT[80] = isoBandNextXLT[90] = 1;
    isoBandNextYLT[80] = isoBandNextYLT[90] = 0;
    isoBandNextOLT[80] = isoBandNextOLT[90] = 1;

    isoBandNextXBL[65] = isoBandNextXBL[105] = 0;
    isoBandNextYBL[65] = isoBandNextYBL[105] = 1;
    isoBandNextOBL[65] = isoBandNextOBL[105] = 0;
    isoBandNextXTL[65] = isoBandNextXTL[105] = 0;
    isoBandNextYTL[65] = isoBandNextYTL[105] = -1;
    isoBandNextOTL[65] = isoBandNextOTL[105] = 0;

    isoBandNextXRT[160] = isoBandNextXRT[10] = -1;
    isoBandNextYRT[160] = isoBandNextYRT[10] = 0;
    isoBandNextORT[160] = isoBandNextORT[10] = 1;
    isoBandNextXRB[160] = isoBandNextXRB[10] = -1;
    isoBandNextYRB[160] = isoBandNextYRB[10] = 0;
    isoBandNextORB[160] = isoBandNextORB[10] = 0;
    isoBandNextXLB[160] = isoBandNextXLB[10] = 1;
    isoBandNextYLB[160] = isoBandNextYLB[10] = 0;
    isoBandNextOLB[160] = isoBandNextOLB[10] = 0;
    isoBandNextXLT[160] = isoBandNextXLT[10] = 1;
    isoBandNextYLT[160] = isoBandNextYLT[10] = 0;
    isoBandNextOLT[160] = isoBandNextOLT[10] = 1;

    isoBandNextXBR[130] = isoBandNextXBR[40] = 0;
    isoBandNextYBR[130] = isoBandNextYBR[40] = 1;
    isoBandNextOBR[130] = isoBandNextOBR[40] = 1;
    isoBandNextXBL[130] = isoBandNextXBL[40] = 0;
    isoBandNextYBL[130] = isoBandNextYBL[40] = 1;
    isoBandNextOBL[130] = isoBandNextOBL[40] = 0;
    isoBandNextXTL[130] = isoBandNextXTL[40] = 0;
    isoBandNextYTL[130] = isoBandNextYTL[40] = -1;
    isoBandNextOTL[130] = isoBandNextOTL[40] = 0;
    isoBandNextXTR[130] = isoBandNextXTR[40] = 0;
    isoBandNextYTR[130] = isoBandNextYTR[40] = -1;
    isoBandNextOTR[130] = isoBandNextOTR[40] = 1;

    /* single hexagon cases */
    isoBandNextXRB[37] = isoBandNextXRB[133] = 0;
    isoBandNextYRB[37] = isoBandNextYRB[133] = 1;
    isoBandNextORB[37] = isoBandNextORB[133] = 1;
    isoBandNextXLB[37] = isoBandNextXLB[133] = 0;
    isoBandNextYLB[37] = isoBandNextYLB[133] = 1;
    isoBandNextOLB[37] = isoBandNextOLB[133] = 0;
    isoBandNextXTL[37] = isoBandNextXTL[133] = -1;
    isoBandNextYTL[37] = isoBandNextYTL[133] = 0;
    isoBandNextOTL[37] = isoBandNextOTL[133] = 0;
    isoBandNextXTR[37] = isoBandNextXTR[133] = 1;
    isoBandNextYTR[37] = isoBandNextYTR[133] = 0;
    isoBandNextOTR[37] = isoBandNextOTR[133] = 0;

    isoBandNextXBR[148] = isoBandNextXBR[22] = -1;
    isoBandNextYBR[148] = isoBandNextYBR[22] = 0;
    isoBandNextOBR[148] = isoBandNextOBR[22] = 0;
    isoBandNextXLB[148] = isoBandNextXLB[22] = 0;
    isoBandNextYLB[148] = isoBandNextYLB[22] = -1;
    isoBandNextOLB[148] = isoBandNextOLB[22] = 1;
    isoBandNextXLT[148] = isoBandNextXLT[22] = 0;
    isoBandNextYLT[148] = isoBandNextYLT[22] = 1;
    isoBandNextOLT[148] = isoBandNextOLT[22] = 1;
    isoBandNextXTR[148] = isoBandNextXTR[22] = -1;
    isoBandNextYTR[148] = isoBandNextYTR[22] = 0;
    isoBandNextOTR[148] = isoBandNextOTR[22] = 1;

    isoBandNextXRT[82] = isoBandNextXRT[88] = 0;
    isoBandNextYRT[82] = isoBandNextYRT[88] = -1;
    isoBandNextORT[82] = isoBandNextORT[88] = 1;
    isoBandNextXBR[82] = isoBandNextXBR[88] = 1;
    isoBandNextYBR[82] = isoBandNextYBR[88] = 0;
    isoBandNextOBR[82] = isoBandNextOBR[88] = 1;
    isoBandNextXBL[82] = isoBandNextXBL[88] = -1;
    isoBandNextYBL[82] = isoBandNextYBL[88] = 0;
    isoBandNextOBL[82] = isoBandNextOBL[88] = 1;
    isoBandNextXLT[82] = isoBandNextXLT[88] = 0;
    isoBandNextYLT[82] = isoBandNextYLT[88] = -1;
    isoBandNextOLT[82] = isoBandNextOLT[88] = 0;

    isoBandNextXRT[73] = isoBandNextXRT[97] = 0;
    isoBandNextYRT[73] = isoBandNextYRT[97] = 1;
    isoBandNextORT[73] = isoBandNextORT[97] = 0;
    isoBandNextXRB[73] = isoBandNextXRB[97] = 0;
    isoBandNextYRB[73] = isoBandNextYRB[97] = -1;
    isoBandNextORB[73] = isoBandNextORB[97] = 0;
    isoBandNextXBL[73] = isoBandNextXBL[97] = 1;
    isoBandNextYBL[73] = isoBandNextYBL[97] = 0;
    isoBandNextOBL[73] = isoBandNextOBL[97] = 0;
    isoBandNextXTL[73] = isoBandNextXTL[97] = 1;
    isoBandNextYTL[73] = isoBandNextYTL[97] = 0;
    isoBandNextOTL[73] = isoBandNextOTL[97] = 1;

    isoBandNextXRT[145] = isoBandNextXRT[25] = 0;
    isoBandNextYRT[145] = isoBandNextYRT[25] = -1;
    isoBandNextORT[145] = isoBandNextORT[25] = 0;
    isoBandNextXBL[145] = isoBandNextXBL[25] = 1;
    isoBandNextYBL[145] = isoBandNextYBL[25] = 0;
    isoBandNextOBL[145] = isoBandNextOBL[25] = 1;
    isoBandNextXLB[145] = isoBandNextXLB[25] = 0;
    isoBandNextYLB[145] = isoBandNextYLB[25] = 1;
    isoBandNextOLB[145] = isoBandNextOLB[25] = 1;
    isoBandNextXTR[145] = isoBandNextXTR[25] = -1;
    isoBandNextYTR[145] = isoBandNextYTR[25] = 0;
    isoBandNextOTR[145] = isoBandNextOTR[25] = 0;

    isoBandNextXRB[70] = isoBandNextXRB[100] = 0;
    isoBandNextYRB[70] = isoBandNextYRB[100] = 1;
    isoBandNextORB[70] = isoBandNextORB[100] = 0;
    isoBandNextXBR[70] = isoBandNextXBR[100] = -1;
    isoBandNextYBR[70] = isoBandNextYBR[100] = 0;
    isoBandNextOBR[70] = isoBandNextOBR[100] = 1;
    isoBandNextXLT[70] = isoBandNextXLT[100] = 0;
    isoBandNextYLT[70] = isoBandNextYLT[100] = -1;
    isoBandNextOLT[70] = isoBandNextOLT[100] = 1;
    isoBandNextXTL[70] = isoBandNextXTL[100] = 1;
    isoBandNextYTL[70] = isoBandNextYTL[100] = 0;
    isoBandNextOTL[70] = isoBandNextOTL[100] = 0;

    /* single pentagon cases */
    isoBandNextXRB[101] = isoBandNextXRB[69] = 0;
    isoBandNextYRB[101] = isoBandNextYRB[69] = 1;
    isoBandNextORB[101] = isoBandNextORB[69] = 0;
    isoBandNextXTL[101] = isoBandNextXTL[69] = 1;
    isoBandNextYTL[101] = isoBandNextYTL[69] = 0;
    isoBandNextOTL[101] = isoBandNextOTL[69] = 0;

    isoBandNextXLB[149] = isoBandNextXLB[21] = 0;
    isoBandNextYLB[149] = isoBandNextYLB[21] = 1;
    isoBandNextOLB[149] = isoBandNextOLB[21] = 1;
    isoBandNextXTR[149] = isoBandNextXTR[21] = -1;
    isoBandNextYTR[149] = isoBandNextYTR[21] = 0;
    isoBandNextOTR[149] = isoBandNextOTR[21] = 0;

    isoBandNextXBR[86] = isoBandNextXBR[84] = -1;
    isoBandNextYBR[86] = isoBandNextYBR[84] = 0;
    isoBandNextOBR[86] = isoBandNextOBR[84] = 1;
    isoBandNextXLT[86] = isoBandNextXLT[84] = 0;
    isoBandNextYLT[86] = isoBandNextYLT[84] = -1;
    isoBandNextOLT[86] = isoBandNextOLT[84] = 1;

    isoBandNextXRT[89] = isoBandNextXRT[81] = 0;
    isoBandNextYRT[89] = isoBandNextYRT[81] = -1;
    isoBandNextORT[89] = isoBandNextORT[81] = 0;
    isoBandNextXBL[89] = isoBandNextXBL[81] = 1;
    isoBandNextYBL[89] = isoBandNextYBL[81] = 0;
    isoBandNextOBL[89] = isoBandNextOBL[81] = 1;

    isoBandNextXRT[96] = isoBandNextXRT[74] = 0;
    isoBandNextYRT[96] = isoBandNextYRT[74] = 1;
    isoBandNextORT[96] = isoBandNextORT[74] = 0;
    isoBandNextXRB[96] = isoBandNextXRB[74] = -1;
    isoBandNextYRB[96] = isoBandNextYRB[74] = 0;
    isoBandNextORB[96] = isoBandNextORB[74] = 1;
    isoBandNextXLT[96] = isoBandNextXLT[74] = 1;
    isoBandNextYLT[96] = isoBandNextYLT[74] = 0;
    isoBandNextOLT[96] = isoBandNextOLT[74] = 0;
    isoBandNextXTL[96] = isoBandNextXTL[74] = 1;
    isoBandNextYTL[96] = isoBandNextYTL[74] = 0;
    isoBandNextOTL[96] = isoBandNextOTL[74] = 1;

    isoBandNextXRT[24] = isoBandNextXRT[146] = 0;
    isoBandNextYRT[24] = isoBandNextYRT[146] = -1;
    isoBandNextORT[24] = isoBandNextORT[146] = 1;
    isoBandNextXBR[24] = isoBandNextXBR[146] = 1;
    isoBandNextYBR[24] = isoBandNextYBR[146] = 0;
    isoBandNextOBR[24] = isoBandNextOBR[146] = 1;
    isoBandNextXBL[24] = isoBandNextXBL[146] = 0;
    isoBandNextYBL[24] = isoBandNextYBL[146] = 1;
    isoBandNextOBL[24] = isoBandNextOBL[146] = 1;
    isoBandNextXTR[24] = isoBandNextXTR[146] = 0;
    isoBandNextYTR[24] = isoBandNextYTR[146] = -1;
    isoBandNextOTR[24] = isoBandNextOTR[146] = 0;

    isoBandNextXRB[6] = isoBandNextXRB[164] = -1;
    isoBandNextYRB[6] = isoBandNextYRB[164] = 0;
    isoBandNextORB[6] = isoBandNextORB[164] = 1;
    isoBandNextXBR[6] = isoBandNextXBR[164] = -1;
    isoBandNextYBR[6] = isoBandNextYBR[164] = 0;
    isoBandNextOBR[6] = isoBandNextOBR[164] = 0;
    isoBandNextXLB[6] = isoBandNextXLB[164] = 0;
    isoBandNextYLB[6] = isoBandNextYLB[164] = -1;
    isoBandNextOLB[6] = isoBandNextOLB[164] = 1;
    isoBandNextXLT[6] = isoBandNextXLT[164] = 1;
    isoBandNextYLT[6] = isoBandNextYLT[164] = 0;
    isoBandNextOLT[6] = isoBandNextOLT[164] = 0;

    isoBandNextXBL[129] = isoBandNextXBL[41] = 0;
    isoBandNextYBL[129] = isoBandNextYBL[41] = 1;
    isoBandNextOBL[129] = isoBandNextOBL[41] = 1;
    isoBandNextXLB[129] = isoBandNextXLB[41] = 0;
    isoBandNextYLB[129] = isoBandNextYLB[41] = 1;
    isoBandNextOLB[129] = isoBandNextOLB[41] = 0;
    isoBandNextXTL[129] = isoBandNextXTL[41] = -1;
    isoBandNextYTL[129] = isoBandNextYTL[41] = 0;
    isoBandNextOTL[129] = isoBandNextOTL[41] = 0;
    isoBandNextXTR[129] = isoBandNextXTR[41] = 0;
    isoBandNextYTR[129] = isoBandNextYTR[41] = -1;
    isoBandNextOTR[129] = isoBandNextOTR[41] = 0;

    isoBandNextXBR[66] = isoBandNextXBR[104] = 0;
    isoBandNextYBR[66] = isoBandNextYBR[104] = 1;
    isoBandNextOBR[66] = isoBandNextOBR[104] = 0;
    isoBandNextXBL[66] = isoBandNextXBL[104] = -1;
    isoBandNextYBL[66] = isoBandNextYBL[104] = 0;
    isoBandNextOBL[66] = isoBandNextOBL[104] = 1;
    isoBandNextXLT[66] = isoBandNextXLT[104] = 0;
    isoBandNextYLT[66] = isoBandNextYLT[104] = -1;
    isoBandNextOLT[66] = isoBandNextOLT[104] = 0;
    isoBandNextXTL[66] = isoBandNextXTL[104] = 0;
    isoBandNextYTL[66] = isoBandNextYTL[104] = -1;
    isoBandNextOTL[66] = isoBandNextOTL[104] = 1;

    isoBandNextXRT[144] = isoBandNextXRT[26] = -1;
    isoBandNextYRT[144] = isoBandNextYRT[26] = 0;
    isoBandNextORT[144] = isoBandNextORT[26] = 0;
    isoBandNextXLB[144] = isoBandNextXLB[26] = 1;
    isoBandNextYLB[144] = isoBandNextYLB[26] = 0;
    isoBandNextOLB[144] = isoBandNextOLB[26] = 1;
    isoBandNextXLT[144] = isoBandNextXLT[26] = 0;
    isoBandNextYLT[144] = isoBandNextYLT[26] = 1;
    isoBandNextOLT[144] = isoBandNextOLT[26] = 1;
    isoBandNextXTR[144] = isoBandNextXTR[26] = -1;
    isoBandNextYTR[144] = isoBandNextYTR[26] = 0;
    isoBandNextOTR[144] = isoBandNextOTR[26] = 1;

    isoBandNextXRB[36] = isoBandNextXRB[134] = 0;
    isoBandNextYRB[36] = isoBandNextYRB[134] = 1;
    isoBandNextORB[36] = isoBandNextORB[134] = 1;
    isoBandNextXBR[36] = isoBandNextXBR[134] = 0;
    isoBandNextYBR[36] = isoBandNextYBR[134] = 1;
    isoBandNextOBR[36] = isoBandNextOBR[134] = 0;
    isoBandNextXTL[36] = isoBandNextXTL[134] = 0;
    isoBandNextYTL[36] = isoBandNextYTL[134] = -1;
    isoBandNextOTL[36] = isoBandNextOTL[134] = 1;
    isoBandNextXTR[36] = isoBandNextXTR[134] = 1;
    isoBandNextYTR[36] = isoBandNextYTR[134] = 0;
    isoBandNextOTR[36] = isoBandNextOTR[134] = 0;

    isoBandNextXRT[9] = isoBandNextXRT[161] = -1;
    isoBandNextYRT[9] = isoBandNextYRT[161] = 0;
    isoBandNextORT[9] = isoBandNextORT[161] = 0;
    isoBandNextXRB[9] = isoBandNextXRB[161] = 0;
    isoBandNextYRB[9] = isoBandNextYRB[161] = -1;
    isoBandNextORB[9] = isoBandNextORB[161] = 0;
    isoBandNextXBL[9] = isoBandNextXBL[161] = 1;
    isoBandNextYBL[9] = isoBandNextYBL[161] = 0;
    isoBandNextOBL[9] = isoBandNextOBL[161] = 0;
    isoBandNextXLB[9] = isoBandNextXLB[161] = 1;
    isoBandNextYLB[9] = isoBandNextYLB[161] = 0;
    isoBandNextOLB[9] = isoBandNextOLB[161] = 1;

    /* 8-sided cases */
    isoBandNextXRT[136] = 0;
    isoBandNextYRT[136] = 1;
    isoBandNextORT[136] = 1;
    isoBandNextXRB[136] = 0;
    isoBandNextYRB[136] = 1;
    isoBandNextORB[136] = 0;
    isoBandNextXBR[136] = -1;
    isoBandNextYBR[136] = 0;
    isoBandNextOBR[136] = 1;
    isoBandNextXBL[136] = -1;
    isoBandNextYBL[136] = 0;
    isoBandNextOBL[136] = 0;
    isoBandNextXLB[136] = 0;
    isoBandNextYLB[136] = -1;
    isoBandNextOLB[136] = 0;
    isoBandNextXLT[136] = 0;
    isoBandNextYLT[136] = -1;
    isoBandNextOLT[136] = 1;
    isoBandNextXTL[136] = 1;
    isoBandNextYTL[136] = 0;
    isoBandNextOTL[136] = 0;
    isoBandNextXTR[136] = 1;
    isoBandNextYTR[136] = 0;
    isoBandNextOTR[136] = 1;

    isoBandNextXRT[34] = 0;
    isoBandNextYRT[34] = -1;
    isoBandNextORT[34] = 0;
    isoBandNextXRB[34] = 0;
    isoBandNextYRB[34] = -1;
    isoBandNextORB[34] = 1;
    isoBandNextXBR[34] = 1;
    isoBandNextYBR[34] = 0;
    isoBandNextOBR[34] = 0;
    isoBandNextXBL[34] = 1;
    isoBandNextYBL[34] = 0;
    isoBandNextOBL[34] = 1;
    isoBandNextXLB[34] = 0;
    isoBandNextYLB[34] = 1;
    isoBandNextOLB[34] = 1;
    isoBandNextXLT[34] = 0;
    isoBandNextYLT[34] = 1;
    isoBandNextOLT[34] = 0;
    isoBandNextXTL[34] = -1;
    isoBandNextYTL[34] = 0;
    isoBandNextOTL[34] = 1;
    isoBandNextXTR[34] = -1;
    isoBandNextYTR[34] = 0;
    isoBandNextOTR[34] = 0;

    isoBandNextXRT[35] = 0;
    isoBandNextYRT[35] = 1;
    isoBandNextORT[35] = 1;
    isoBandNextXRB[35] = 0;
    isoBandNextYRB[35] = -1;
    isoBandNextORB[35] = 1;
    isoBandNextXBR[35] = 1;
    isoBandNextYBR[35] = 0;
    isoBandNextOBR[35] = 0;
    isoBandNextXBL[35] = -1;
    isoBandNextYBL[35] = 0;
    isoBandNextOBL[35] = 0;
    isoBandNextXLB[35] = 0;
    isoBandNextYLB[35] = -1;
    isoBandNextOLB[35] = 0;
    isoBandNextXLT[35] = 0;
    isoBandNextYLT[35] = 1;
    isoBandNextOLT[35] = 0;
    isoBandNextXTL[35] = -1;
    isoBandNextYTL[35] = 0;
    isoBandNextOTL[35] = 1;
    isoBandNextXTR[35] = 1;
    isoBandNextYTR[35] = 0;
    isoBandNextOTR[35] = 1;

    /* 6-sided cases */
    isoBandNextXRT[153] = 0;
    isoBandNextYRT[153] = 1;
    isoBandNextORT[153] = 1;
    isoBandNextXBL[153] = -1;
    isoBandNextYBL[153] = 0;
    isoBandNextOBL[153] = 0;
    isoBandNextXLB[153] = 0;
    isoBandNextYLB[153] = -1;
    isoBandNextOLB[153] = 0;
    isoBandNextXTR[153] = 1;
    isoBandNextYTR[153] = 0;
    isoBandNextOTR[153] = 1;

    isoBandNextXRB[102] = 0;
    isoBandNextYRB[102] = -1;
    isoBandNextORB[102] = 1;
    isoBandNextXBR[102] = 1;
    isoBandNextYBR[102] = 0;
    isoBandNextOBR[102] = 0;
    isoBandNextXLT[102] = 0;
    isoBandNextYLT[102] = 1;
    isoBandNextOLT[102] = 0;
    isoBandNextXTL[102] = -1;
    isoBandNextYTL[102] = 0;
    isoBandNextOTL[102] = 1;

    isoBandNextXRT[155] = 0;
    isoBandNextYRT[155] = -1;
    isoBandNextORT[155] = 0;
    isoBandNextXBL[155] = 1;
    isoBandNextYBL[155] = 0;
    isoBandNextOBL[155] = 1;
    isoBandNextXLB[155] = 0;
    isoBandNextYLB[155] = 1;
    isoBandNextOLB[155] = 1;
    isoBandNextXTR[155] = -1;
    isoBandNextYTR[155] = 0;
    isoBandNextOTR[155] = 0;

    isoBandNextXRB[103] = 0;
    isoBandNextYRB[103] = 1;
    isoBandNextORB[103] = 0;
    isoBandNextXBR[103] = -1;
    isoBandNextYBR[103] = 0;
    isoBandNextOBR[103] = 1;
    isoBandNextXLT[103] = 0;
    isoBandNextYLT[103] = -1;
    isoBandNextOLT[103] = 1;
    isoBandNextXTL[103] = 1;
    isoBandNextYTL[103] = 0;
    isoBandNextOTL[103] = 0;

    /* 7-sided cases */
    isoBandNextXRT[152] = 0;
    isoBandNextYRT[152] = 1;
    isoBandNextORT[152] = 1;
    isoBandNextXBR[152] = -1;
    isoBandNextYBR[152] = 0;
    isoBandNextOBR[152] = 1;
    isoBandNextXBL[152] = -1;
    isoBandNextYBL[152] = 0;
    isoBandNextOBL[152] = 0;
    isoBandNextXLB[152] = 0;
    isoBandNextYLB[152] = -1;
    isoBandNextOLB[152] = 0;
    isoBandNextXLT[152] = 0;
    isoBandNextYLT[152] = -1;
    isoBandNextOLT[152] = 1;
    isoBandNextXTR[152] = 1;
    isoBandNextYTR[152] = 0;
    isoBandNextOTR[152] = 1;

    isoBandNextXRT[156] = 0;
    isoBandNextYRT[156] = -1;
    isoBandNextORT[156] = 1;
    isoBandNextXBR[156] = 1;
    isoBandNextYBR[156] = 0;
    isoBandNextOBR[156] = 1;
    isoBandNextXBL[156] = -1;
    isoBandNextYBL[156] = 0;
    isoBandNextOBL[156] = 0;
    isoBandNextXLB[156] = 0;
    isoBandNextYLB[156] = -1;
    isoBandNextOLB[156] = 0;
    isoBandNextXLT[156] = 0;
    isoBandNextYLT[156] = 1;
    isoBandNextOLT[156] = 1;
    isoBandNextXTR[156] = -1;
    isoBandNextYTR[156] = 0;
    isoBandNextOTR[156] = 1;

    isoBandNextXRT[137] = 0;
    isoBandNextYRT[137] = 1;
    isoBandNextORT[137] = 1;
    isoBandNextXRB[137] = 0;
    isoBandNextYRB[137] = 1;
    isoBandNextORB[137] = 0;
    isoBandNextXBL[137] = -1;
    isoBandNextYBL[137] = 0;
    isoBandNextOBL[137] = 0;
    isoBandNextXLB[137] = 0;
    isoBandNextYLB[137] = -1;
    isoBandNextOLB[137] = 0;
    isoBandNextXTL[137] = 1;
    isoBandNextYTL[137] = 0;
    isoBandNextOTL[137] = 0;
    isoBandNextXTR[137] = 1;
    isoBandNextYTR[137] = 0;
    isoBandNextOTR[137] = 1;

    isoBandNextXRT[139] = 0;
    isoBandNextYRT[139] = 1;
    isoBandNextORT[139] = 1;
    isoBandNextXRB[139] = 0;
    isoBandNextYRB[139] = -1;
    isoBandNextORB[139] = 0;
    isoBandNextXBL[139] = 1;
    isoBandNextYBL[139] = 0;
    isoBandNextOBL[139] = 0;
    isoBandNextXLB[139] = 0;
    isoBandNextYLB[139] = 1;
    isoBandNextOLB[139] = 0;
    isoBandNextXTL[139] = -1;
    isoBandNextYTL[139] = 0;
    isoBandNextOTL[139] = 0;
    isoBandNextXTR[139] = 1;
    isoBandNextYTR[139] = 0;
    isoBandNextOTR[139] = 1;

    isoBandNextXRT[98] = 0;
    isoBandNextYRT[98] = -1;
    isoBandNextORT[98] = 0;
    isoBandNextXRB[98] = 0;
    isoBandNextYRB[98] = -1;
    isoBandNextORB[98] = 1;
    isoBandNextXBR[98] = 1;
    isoBandNextYBR[98] = 0;
    isoBandNextOBR[98] = 0;
    isoBandNextXBL[98] = 1;
    isoBandNextYBL[98] = 0;
    isoBandNextOBL[98] = 1;
    isoBandNextXLT[98] = 0;
    isoBandNextYLT[98] = 1;
    isoBandNextOLT[98] = 0;
    isoBandNextXTL[98] = -1;
    isoBandNextYTL[98] = 0;
    isoBandNextOTL[98] = 1;

    isoBandNextXRT[99] = 0;
    isoBandNextYRT[99] = 1;
    isoBandNextORT[99] = 0;
    isoBandNextXRB[99] = 0;
    isoBandNextYRB[99] = -1;
    isoBandNextORB[99] = 1;
    isoBandNextXBR[99] = 1;
    isoBandNextYBR[99] = 0;
    isoBandNextOBR[99] = 0;
    isoBandNextXBL[99] = -1;
    isoBandNextYBL[99] = 0;
    isoBandNextOBL[99] = 1;
    isoBandNextXLT[99] = 0;
    isoBandNextYLT[99] = -1;
    isoBandNextOLT[99] = 0;
    isoBandNextXTL[99] = 1;
    isoBandNextYTL[99] = 0;
    isoBandNextOTL[99] = 1;

    isoBandNextXRB[38] = 0;
    isoBandNextYRB[38] = -1;
    isoBandNextORB[38] = 1;
    isoBandNextXBR[38] = 1;
    isoBandNextYBR[38] = 0;
    isoBandNextOBR[38] = 0;
    isoBandNextXLB[38] = 0;
    isoBandNextYLB[38] = 1;
    isoBandNextOLB[38] = 1;
    isoBandNextXLT[38] = 0;
    isoBandNextYLT[38] = 1;
    isoBandNextOLT[38] = 0;
    isoBandNextXTL[38] = -1;
    isoBandNextYTL[38] = 0;
    isoBandNextOTL[38] = 1;
    isoBandNextXTR[38] = -1;
    isoBandNextYTR[38] = 0;
    isoBandNextOTR[38] = 0;

    isoBandNextXRB[39] = 0;
    isoBandNextYRB[39] = 1;
    isoBandNextORB[39] = 1;
    isoBandNextXBR[39] = -1;
    isoBandNextYBR[39] = 0;
    isoBandNextOBR[39] = 0;
    isoBandNextXLB[39] = 0;
    isoBandNextYLB[39] = -1;
    isoBandNextOLB[39] = 1;
    isoBandNextXLT[39] = 0;
    isoBandNextYLT[39] = 1;
    isoBandNextOLT[39] = 0;
    isoBandNextXTL[39] = -1;
    isoBandNextYTL[39] = 0;
    isoBandNextOTL[39] = 1;
    isoBandNextXTR[39] = 1;
    isoBandNextYTR[39] = 0;
    isoBandNextOTR[39] = 0;

    /*
      The lookup tables for edge number given the polygon
      is entered at a specific location
    */

    var isoBandEdgeRT = [];
    var isoBandEdgeRB = [];
    var isoBandEdgeBR = [];
    var isoBandEdgeBL = [];
    var isoBandEdgeLB = [];
    var isoBandEdgeLT = [];
    var isoBandEdgeTL = [];
    var isoBandEdgeTR = [];

    /* triangle cases */
    isoBandEdgeBL[1]    = isoBandEdgeLB[1]    = 18;
    isoBandEdgeBL[169]  = isoBandEdgeLB[169]  = 18;
    isoBandEdgeBR[4]    = isoBandEdgeRB[4]    = 12;
    isoBandEdgeBR[166]  = isoBandEdgeRB[166]  = 12;
    isoBandEdgeRT[16]   = isoBandEdgeTR[16]   = 4;
    isoBandEdgeRT[154]  = isoBandEdgeTR[154]  = 4;
    isoBandEdgeLT[64]   = isoBandEdgeTL[64]   = 22;
    isoBandEdgeLT[106]  = isoBandEdgeTL[106]  = 22;

    /* trapezoid cases */
    isoBandEdgeBR[2]    = isoBandEdgeLT[2]    = 17;
    isoBandEdgeBL[2]    = isoBandEdgeLB[2]    = 18;
    isoBandEdgeBR[168]  = isoBandEdgeLT[168]  = 17;
    isoBandEdgeBL[168]  = isoBandEdgeLB[168]  = 18;
    isoBandEdgeRT[8]    = isoBandEdgeBL[8]    = 9;
    isoBandEdgeRB[8]    = isoBandEdgeBR[8]    = 12;
    isoBandEdgeRT[162]  = isoBandEdgeBL[162]  = 9;
    isoBandEdgeRB[162]  = isoBandEdgeBR[162]  = 12;
    isoBandEdgeRT[32]   = isoBandEdgeTR[32]   = 4;
    isoBandEdgeRB[32]   = isoBandEdgeTL[32]   = 1;
    isoBandEdgeRT[138]  = isoBandEdgeTR[138]  = 4;
    isoBandEdgeRB[138]  = isoBandEdgeTL[138]  = 1;
    isoBandEdgeLB[128]  = isoBandEdgeTR[128]  = 21;
    isoBandEdgeLT[128]  = isoBandEdgeTL[128]  = 22;
    isoBandEdgeLB[42]   = isoBandEdgeTR[42]   = 21;
    isoBandEdgeLT[42]   = isoBandEdgeTL[42]   = 22;

    /* rectangle cases */
    isoBandEdgeRB[5] = isoBandEdgeLB[5] = 14;
    isoBandEdgeRB[165] = isoBandEdgeLB[165] = 14;
    isoBandEdgeBR[20] = isoBandEdgeTR[20] = 6;
    isoBandEdgeBR[150] = isoBandEdgeTR[150] = 6;
    isoBandEdgeRT[80] = isoBandEdgeLT[80] = 11;
    isoBandEdgeRT[90] = isoBandEdgeLT[90] = 11;
    isoBandEdgeBL[65] = isoBandEdgeTL[65] = 3;
    isoBandEdgeBL[105] = isoBandEdgeTL[105] = 3;
    isoBandEdgeRT[160] = isoBandEdgeLT[160] = 11;
    isoBandEdgeRB[160] = isoBandEdgeLB[160] = 14;
    isoBandEdgeRT[10] = isoBandEdgeLT[10] = 11;
    isoBandEdgeRB[10] = isoBandEdgeLB[10] = 14;
    isoBandEdgeBR[130] = isoBandEdgeTR[130] = 6;
    isoBandEdgeBL[130] = isoBandEdgeTL[130] = 3;
    isoBandEdgeBR[40] = isoBandEdgeTR[40] = 6;
    isoBandEdgeBL[40] = isoBandEdgeTL[40] = 3;

    /* pentagon cases */
    isoBandEdgeRB[101] = isoBandEdgeTL[101] = 1;
    isoBandEdgeRB[69] = isoBandEdgeTL[69] = 1;
    isoBandEdgeLB[149] = isoBandEdgeTR[149] = 21;
    isoBandEdgeLB[21] = isoBandEdgeTR[21] = 21;
    isoBandEdgeBR[86] = isoBandEdgeLT[86] = 17;
    isoBandEdgeBR[84] = isoBandEdgeLT[84] = 17;
    isoBandEdgeRT[89] = isoBandEdgeBL[89] = 9;
    isoBandEdgeRT[81] = isoBandEdgeBL[81] = 9;
    isoBandEdgeRT[96] = isoBandEdgeTL[96] = 0;
    isoBandEdgeRB[96] = isoBandEdgeLT[96] = 15;
    isoBandEdgeRT[74] = isoBandEdgeTL[74] = 0;
    isoBandEdgeRB[74] = isoBandEdgeLT[74] = 15;
    isoBandEdgeRT[24] = isoBandEdgeBR[24] = 8;
    isoBandEdgeBL[24] = isoBandEdgeTR[24] = 7;
    isoBandEdgeRT[146] = isoBandEdgeBR[146] = 8;
    isoBandEdgeBL[146] = isoBandEdgeTR[146] = 7;
    isoBandEdgeRB[6] = isoBandEdgeLT[6] = 15;
    isoBandEdgeBR[6] = isoBandEdgeLB[6] = 16;
    isoBandEdgeRB[164] = isoBandEdgeLT[164] = 15;
    isoBandEdgeBR[164] = isoBandEdgeLB[164] = 16;
    isoBandEdgeBL[129] = isoBandEdgeTR[129] = 7;
    isoBandEdgeLB[129] = isoBandEdgeTL[129] = 20;
    isoBandEdgeBL[41] = isoBandEdgeTR[41] = 7;
    isoBandEdgeLB[41] = isoBandEdgeTL[41] = 20;
    isoBandEdgeBR[66] = isoBandEdgeTL[66] = 2;
    isoBandEdgeBL[66] = isoBandEdgeLT[66] = 19;
    isoBandEdgeBR[104] = isoBandEdgeTL[104] = 2;
    isoBandEdgeBL[104] = isoBandEdgeLT[104] = 19;
    isoBandEdgeRT[144] = isoBandEdgeLB[144] = 10;
    isoBandEdgeLT[144] = isoBandEdgeTR[144] = 23;
    isoBandEdgeRT[26] = isoBandEdgeLB[26] = 10;
    isoBandEdgeLT[26] = isoBandEdgeTR[26] = 23;
    isoBandEdgeRB[36] = isoBandEdgeTR[36] = 5;
    isoBandEdgeBR[36] = isoBandEdgeTL[36] = 2;
    isoBandEdgeRB[134] = isoBandEdgeTR[134] = 5;
    isoBandEdgeBR[134] = isoBandEdgeTL[134] = 2;
    isoBandEdgeRT[9] = isoBandEdgeLB[9] = 10;
    isoBandEdgeRB[9] = isoBandEdgeBL[9] = 13;
    isoBandEdgeRT[161] = isoBandEdgeLB[161] = 10;
    isoBandEdgeRB[161] = isoBandEdgeBL[161] = 13;

    /* hexagon cases */
    isoBandEdgeRB[37] = isoBandEdgeTR[37] = 5;
    isoBandEdgeLB[37] = isoBandEdgeTL[37] = 20;
    isoBandEdgeRB[133] = isoBandEdgeTR[133] = 5;
    isoBandEdgeLB[133] = isoBandEdgeTL[133] = 20;
    isoBandEdgeBR[148] = isoBandEdgeLB[148] = 16;
    isoBandEdgeLT[148] = isoBandEdgeTR[148] = 23;
    isoBandEdgeBR[22] = isoBandEdgeLB[22] = 16;
    isoBandEdgeLT[22] = isoBandEdgeTR[22] = 23;
    isoBandEdgeRT[82] = isoBandEdgeBR[82] = 8;
    isoBandEdgeBL[82] = isoBandEdgeLT[82] = 19;
    isoBandEdgeRT[88] = isoBandEdgeBR[88] = 8;
    isoBandEdgeBL[88] = isoBandEdgeLT[88] = 19;
    isoBandEdgeRT[73] = isoBandEdgeTL[73] = 0;
    isoBandEdgeRB[73] = isoBandEdgeBL[73] = 13;
    isoBandEdgeRT[97] = isoBandEdgeTL[97] = 0;
    isoBandEdgeRB[97] = isoBandEdgeBL[97] = 13;
    isoBandEdgeRT[145] = isoBandEdgeBL[145] = 9;
    isoBandEdgeLB[145] = isoBandEdgeTR[145] = 21;
    isoBandEdgeRT[25] = isoBandEdgeBL[25] = 9;
    isoBandEdgeLB[25] = isoBandEdgeTR[25] = 21;
    isoBandEdgeRB[70] = isoBandEdgeTL[70] = 1;
    isoBandEdgeBR[70] = isoBandEdgeLT[70] = 17;
    isoBandEdgeRB[100] = isoBandEdgeTL[100] = 1;
    isoBandEdgeBR[100] = isoBandEdgeLT[100] = 17;

    /* 8-sided cases */
    isoBandEdgeRT[34] = isoBandEdgeBL[34] = 9;
    isoBandEdgeRB[34] = isoBandEdgeBR[34] = 12;
    isoBandEdgeLB[34] = isoBandEdgeTR[34] = 21;
    isoBandEdgeLT[34] = isoBandEdgeTL[34] = 22;
    isoBandEdgeRT[136] = isoBandEdgeTR[136] = 4;
    isoBandEdgeRB[136] = isoBandEdgeTL[136] = 1;
    isoBandEdgeBR[136] = isoBandEdgeLT[136] = 17;
    isoBandEdgeBL[136] = isoBandEdgeLB[136] = 18;
    isoBandEdgeRT[35] = isoBandEdgeTR[35] = 4;
    isoBandEdgeRB[35] = isoBandEdgeBR[35] = 12;
    isoBandEdgeBL[35] = isoBandEdgeLB[35] = 18;
    isoBandEdgeLT[35] = isoBandEdgeTL[35] = 22;

    /* 6-sided cases */
    isoBandEdgeRT[153] = isoBandEdgeTR[153] = 4;
    isoBandEdgeBL[153] = isoBandEdgeLB[153] = 18;
    isoBandEdgeRB[102] = isoBandEdgeBR[102] = 12;
    isoBandEdgeLT[102] = isoBandEdgeTL[102] = 22;
    isoBandEdgeRT[155] = isoBandEdgeBL[155] = 9;
    isoBandEdgeLB[155] = isoBandEdgeTR[155] = 23;
    isoBandEdgeRB[103] = isoBandEdgeTL[103] = 1;
    isoBandEdgeBR[103] = isoBandEdgeLT[103] = 17;

    /* 7-sided cases */
    isoBandEdgeRT[152] = isoBandEdgeTR[152] = 4;
    isoBandEdgeBR[152] = isoBandEdgeLT[152] = 17;
    isoBandEdgeBL[152] = isoBandEdgeLB[152] = 18;
    isoBandEdgeRT[156] = isoBandEdgeBR[156] = 8;
    isoBandEdgeBL[156] = isoBandEdgeLB[156] = 18;
    isoBandEdgeLT[156] = isoBandEdgeTR[156] = 23;
    isoBandEdgeRT[137] = isoBandEdgeTR[137] = 4;
    isoBandEdgeRB[137] = isoBandEdgeTL[137] = 1;
    isoBandEdgeBL[137] = isoBandEdgeLB[137] = 18;
    isoBandEdgeRT[139] = isoBandEdgeTR[139] = 4;
    isoBandEdgeRB[139] = isoBandEdgeBL[139] = 13;
    isoBandEdgeLB[139] = isoBandEdgeTL[139] = 20;
    isoBandEdgeRT[98] = isoBandEdgeBL[98] = 9;
    isoBandEdgeRB[98] = isoBandEdgeBR[98] = 12;
    isoBandEdgeLT[98] = isoBandEdgeTL[98] = 22;
    isoBandEdgeRT[99] = isoBandEdgeTL[99] = 0;
    isoBandEdgeRB[99] = isoBandEdgeBR[99] = 12;
    isoBandEdgeBL[99] = isoBandEdgeLT[99] = 19;
    isoBandEdgeRB[38] = isoBandEdgeBR[38] = 12;
    isoBandEdgeLB[38] = isoBandEdgeTR[38] = 21;
    isoBandEdgeLT[38] = isoBandEdgeTL[38] = 22;
    isoBandEdgeRB[39] = isoBandEdgeTR[39] = 5;
    isoBandEdgeBR[39] = isoBandEdgeLB[39] = 16;
    isoBandEdgeLT[39] = isoBandEdgeTL[39] = 22;

    /* 0212 with flipped == 1 || 2010 with flipped == 1 */



    /*
    ####################################
    Some small helper functions
    ####################################
    */

    /* assume that x1 == 1 &&  x0 == 0 */
    function interpolateX(y, y0, y1){
      return (y - y0) / (y1 - y0);
    }

    /*
    ####################################
    Below is the actual Marching Squares implementation
    ####################################
    */

    var computeBandGrid = function(data, minV, bandwidth){
      var rows = data.length - 1;
      var cols = data[0].length - 1;
      var BandGrid = { rows: rows, cols: cols, cells: [] };

      var maxV = minV + Math.abs(bandwidth);

      for(var j = 0; j < rows; ++j){
        BandGrid.cells[j] = [];
        for(var i = 0; i < cols; ++i){
          /*  compose the 4-trit corner representation */
          var cval = 0;

          var tl = data[j+1][i];
          var tr = data[j+1][i+1];
          var br = data[j][i+1];
          var bl = data[j][i];

          if(isNaN(tl) || isNaN(tr) || isNaN(br) || isNaN(bl)){
            continue;
          }

          cval |= (tl < minV) ? 0 : (tl > maxV) ? 128 : 64;
          cval |= (tr < minV) ? 0 : (tr > maxV) ? 32 : 16;
          cval |= (br < minV) ? 0 : (br > maxV) ? 8 : 4;
          cval |= (bl < minV) ? 0 : (bl > maxV) ? 2 : 1;

          var cval_real = +cval;

          /* resolve ambiguity via averaging */
          var flipped = 0;
          if(     (cval == 17) /* 0101 */
              ||  (cval == 18) /* 0102 */
              ||  (cval == 33) /* 0201 */
              ||  (cval == 34) /* 0202 */
              ||  (cval == 38) /* 0212 */
              ||  (cval == 68) /* 1010 */
              ||  (cval == 72) /* 1020 */
              ||  (cval == 98) /* 1202 */
              ||  (cval == 102) /* 1212 */
              ||  (cval == 132) /* 2010 */
              ||  (cval == 136) /* 2020 */
              ||  (cval == 137) /* 2021 */
              ||  (cval == 152) /* 2120 */
              ||  (cval == 153) /* 2121 */
          ){
            var average = (tl + tr + br + bl) / 4;
            /* set flipped state */
            flipped = (average > maxV) ? 2 : (average < minV) ? 0 : 1;

            /* adjust cval for flipped cases */

            /* 8-sided cases */
            if(cval === 34){
              if(flipped === 1){
                cval = 35;
              } else if(flipped === 0){
                cval = 136;
              }
            } else if(cval === 136){
              if(flipped === 1){
                cval = 35;
                flipped = 4;
              } else if(flipped === 0){
                cval = 34;
              }
            }

            /* 6-sided polygon cases */
            else if(cval === 17){
              if(flipped === 1){
                cval = 155;
                flipped = 4;
              } else if(flipped === 0){
                cval = 153;
              }
            } else if(cval === 68){
              if(flipped === 1){
                cval = 103;
                flipped = 4;
              } else if(flipped === 0){
                cval = 102;
              }
            } else if(cval === 153){
              if(flipped === 1)
                cval = 155;
            } else if(cval === 102){
              if(flipped === 1)
                cval = 103;
            }

            /* 7-sided polygon cases */
            else if(cval === 152){
              if(flipped < 2){
                cval    = 156;
                flipped = 1;
              }
            } else if(cval === 137){
              if(flipped < 2){
                cval = 139;
                flipped = 1;
              }
            } else if(cval === 98){
              if(flipped < 2){
                cval    = 99;
                flipped = 1;
              }
            } else if(cval === 38){
              if(flipped < 2){
                cval    = 39;
                flipped = 1;
              }
            } else if(cval === 18){
              if(flipped > 0){
                cval = 156;
                flipped = 4;
              } else {
                cval = 152;
              }
            } else if(cval === 33){
              if(flipped > 0){
                cval = 139;
                flipped = 4;
              } else {
                cval = 137;
              }
            } else if(cval === 72){
              if(flipped > 0){
                cval = 99;
                flipped = 4;
              } else {
                cval = 98;
              }
            } else if(cval === 132){
              if(flipped > 0){
                cval = 39;
                flipped = 4;
              } else {
                cval = 38;
              }
            }
          }

          /* add cell to BandGrid if it contains at least one polygon-side */
          if((cval != 0) && (cval != 170)){
            var topleft, topright, bottomleft, bottomright,
                righttop, rightbottom, lefttop, leftbottom;

            topleft = topright = bottomleft = bottomright = righttop
                    = rightbottom = lefttop = leftbottom = 0.5;

            var edges = [];

            /* do interpolation here */
            /* 1st Triangles */
            if(cval === 1){ /* 0001 */
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 169){ /* 2221 */
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = interpolateX(maxV, bl, tl);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 4){ /* 0010 */
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = interpolateX(minV, bl, br);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 166){ /* 2212 */
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = 1 - interpolateX(maxV, br, bl);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 16){ /* 0100 */
              righttop = interpolateX(minV, br, tr);
              topright = interpolateX(minV, tl, tr);
              edges.push(isoBandEdgeRT[cval]);
            } else if(cval === 154){ /* 2122 */
              righttop = 1 - interpolateX(maxV, tr, br);
              topright = 1 - interpolateX(maxV, tr, tl);
              edges.push(isoBandEdgeRT[cval]);
            } else if(cval === 64){ /* 1000 */
              lefttop = interpolateX(minV, bl, tl);
              topleft = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 106){ /* 1222 */
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeLT[cval]);
            }
            /* 2nd Trapezoids */
            else if(cval === 168){ /* 2220 */
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 2){ /* 0002 */
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 162){ /* 2202 */
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 8){ /* 0020 */
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 138){ /* 2022 */
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 32){ /* 0200 */
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 42){ /* 0222 */
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeLB[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 128){ /* 2000 */
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeLB[cval]);
              edges.push(isoBandEdgeLT[cval]);
            }

            /* 3rd rectangle cases */
            if(cval === 5){ /* 0011 */
              rightbottom = 1 - interpolateX(minV, tr, br);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 165){ /* 2211 */
              rightbottom = interpolateX(maxV, br, tr);
              leftbottom = interpolateX(maxV, bl, tl);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 20){ /* 0110 */
              bottomright = interpolateX(minV, bl, br);
              topright = interpolateX(minV, tl, tr);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 150){ /* 2112 */
              bottomright = 1 - interpolateX(maxV, br, bl);
              topright = 1 - interpolateX(maxV, tr, tl);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 80){ /* 1100 */
              righttop = interpolateX(minV, br, tr);
              lefttop = interpolateX(minV, bl, tl);
              edges.push(isoBandEdgeRT[cval]);
            } else if(cval === 90){ /* 1122 */
              righttop = 1 - interpolateX(maxV, tr, br);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              edges.push(isoBandEdgeRT[cval]);
            } else if(cval === 65){ /* 1001 */
              bottomleft = 1 - interpolateX(minV, br, bl);
              topleft = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 105){ /* 1221 */
              bottomleft = interpolateX(maxV, bl, br);
              topleft = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 160){ /* 2200 */
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 10){ /* 0022 */
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 130){ /* 2002 */
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 40){ /* 0220 */
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeBL[cval]);
            }

            /* 4th single pentagon cases */
            else if(cval === 101){ /* 1211 */
              rightbottom = interpolateX(maxV, br, tr);
              topleft = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 69){ /* 1011 */
              rightbottom = 1 - interpolateX(minV, tr, br);
              topleft = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 149){ /* 2111 */
              leftbottom = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 21){ /* 0111 */
              leftbottom = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 86){ /* 1112 */
              bottomright = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 84){ /* 1110 */
              bottomright = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 89){ /* 1121 */
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 81){ /* 1101 */
              righttop = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 96){ /* 1200 */
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              lefttop = interpolateX(minV, bl, tl);
              topleft = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 74){ /* 1022 */
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1- interpolateX(maxV, tr, br);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 24){ /* 0120 */
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              topright = interpolateX(minV, tl, tr);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 146){ /* 2102 */
              righttop = interpolateX(minV, br, tr);
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              topright = 1 - interpolateX(maxV, tr, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 6){ /* 0012 */
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 164){ /* 2210 */
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 129){ /* 2001 */
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeBL[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 41){ /* 0221 */
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeBL[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 66){ /* 1002 */
              bottomright = 1 - interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 104){ /* 1220 */
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              topleft = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeBL[cval]);
              edges.push(isoBandEdgeTL[cval]);
            } else if(cval === 144){ /* 2100 */
              righttop = interpolateX(minV, br, tr);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 26){ /* 0122 */
              righttop = 1 - interpolateX(maxV, tr, br);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 36){ /* 0210 */
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = interpolateX(minV, bl, br);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 134){ /* 2012 */
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = 1 - interpolateX(maxV, br, bl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 9){ /* 0021 */
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 161){ /* 2201 */
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = interpolateX(maxV, bl, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            }

            /* 5th single hexagon cases */
            else if(cval === 37){ /* 0211 */
              rightbottom = interpolateX(maxV, br, tr);
              leftbottom = 1- interpolateX(minV, tl, bl);
              topleft = interpolateX(minV, tl, tr);
              topright = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 133){ /* 2011 */
              rightbottom = 1 - interpolateX(minV, tr, br);
              leftbottom = interpolateX(maxV, bl, tl);
              topleft = 1 - interpolateX(maxV, tr, tl);
              topright = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 148){ /* 2110 */
              bottomright = interpolateX(minV, bl, br);
              leftbottom = interpolateX(minV, bl, tl);
              lefttop = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 22){ /* 0112 */
              bottomright = 1 - interpolateX(maxV, br, bl);
              leftbottom = 1 - interpolateX(maxV, tl, bl);
              lefttop = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 82){ /* 1102 */
              righttop = interpolateX(minV, br, tr);
              bottomright = 1- interpolateX(minV, br, bl);
              bottomleft = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 88){ /* 1120 */
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomright = interpolateX(maxV, bl, br);
              bottomleft = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 73){ /* 1021 */
              righttop = 1 - interpolateX(minV, tr, br);
              rightbottom = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              topleft = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 97){ /* 1201 */
              righttop = interpolateX(maxV, br, tr);
              rightbottom = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              topleft = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
            } else if(cval === 145){ /* 2101 */
              righttop = interpolateX(minV, br, tr);
              bottomleft = 1 - interpolateX(minV, br, bl);
              leftbottom = interpolateX(maxV, bl, tl);
              topright = 1 - interpolateX(maxV, tr, tl);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 25){ /* 0121 */
              righttop = 1 - interpolateX(maxV, tr, br);
              bottomleft = interpolateX(maxV, bl, br);
              leftbottom = 1 - interpolateX(minV, tl, bl);
              topright = interpolateX(minV, tl, tr);
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 70){ /* 1012 */
              rightbottom = 1 - interpolateX(minV, tr, br);
              bottomright = 1 - interpolateX(maxV, br, bl);
              lefttop = 1 - interpolateX(maxV, tl, bl);
              topleft = 1 - interpolateX(minV, tr, tl);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
            } else if(cval === 100){ /* 1210 */
              rightbottom = interpolateX(maxV, br, tr);
              bottomright = interpolateX(minV, bl, br);
              lefttop = interpolateX(minV, bl, tl);
              topleft = interpolateX(maxV, tl, tr);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
            }

            /* 8-sided cases */
            else if(cval === 34){ /* 0202 || 2020 with flipped == 0 */
              if(flipped === 0){
                righttop = 1 - interpolateX(minV, tr, br);
                rightbottom = 1 - interpolateX(maxV, tr, br);
                bottomright = interpolateX(maxV, bl, br);
                bottomleft = interpolateX(minV, bl, br);
                leftbottom = interpolateX(minV, bl, tl);
                lefttop = interpolateX(maxV, bl, tl);
                topleft = 1 - interpolateX(maxV, tr, tl);
                topright = 1 - interpolateX(minV, tr, tl);
              } else {
                righttop = interpolateX(maxV, br, tr);
                rightbottom = interpolateX(minV, br, tr);
                bottomright = 1 - interpolateX(minV, br, bl);
                bottomleft = 1 - interpolateX(maxV, br, bl);
                leftbottom = 1 - interpolateX(maxV, tl, bl);
                lefttop = 1 - interpolateX(minV, tl, bl);
                topleft = interpolateX(minV, tl, tr);
                topright = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLB[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 35){ /* flipped == 1 state for 0202, and 2020 with flipped == 4*/
              if(flipped === 4){
                righttop = 1 - interpolateX(minV, tr, br);
                rightbottom = 1 - interpolateX(maxV, tr, br);
                bottomright = interpolateX(maxV, bl, br);
                bottomleft = interpolateX(minV, bl, br);
                leftbottom = interpolateX(minV, bl, tl);
                lefttop = interpolateX(maxV, bl, tl);
                topleft = 1 - interpolateX(maxV, tr, tl);
                topright = 1 - interpolateX(minV, tr, tl);
              } else {
                righttop = interpolateX(maxV, br, tr);
                rightbottom = interpolateX(minV, br, tr);
                bottomright = 1 - interpolateX(minV, br, bl);
                bottomleft = 1 - interpolateX(maxV, br, bl);
                leftbottom = 1 - interpolateX(maxV, tl, bl);
                lefttop = 1 - interpolateX(minV, tl, bl);
                topleft = interpolateX(minV, tl, tr);
                topright = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBL[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 136){ /* 2020 || 0202 with flipped == 0 */
              if(flipped === 0){
                righttop = interpolateX(maxV, br, tr);
                rightbottom = interpolateX(minV, br, tr);
                bottomright = 1 - interpolateX(minV, br, bl);
                bottomleft = 1 - interpolateX(maxV, br, bl);
                leftbottom = 1 - interpolateX(maxV, tl, bl);
                lefttop = 1 - interpolateX(minV, tl, bl);
                topleft = interpolateX(minV, tl, tr);
                topright = interpolateX(maxV, tl, tr);
              } else {
                righttop = 1 - interpolateX(minV, tr, br);
                rightbottom = 1 - interpolateX(maxV, tr, br);
                bottomright = interpolateX(maxV, bl, br);
                bottomleft = interpolateX(minV, bl, br);
                leftbottom = interpolateX(minV, bl, tl);
                lefttop = interpolateX(maxV, bl, tl);
                topleft = 1 - interpolateX(maxV, tr, tl);
                topright = 1 - interpolateX(minV, tr, tl);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLB[cval]);
              edges.push(isoBandEdgeLT[cval]);
            }

            /* 6-sided polygon cases */
            else if(cval === 153){ /* 0101 with flipped == 0 || 2121 with flipped == 2 */
              if(flipped === 0){
                righttop = interpolateX(minV, br, tr);
                bottomleft = 1 - interpolateX(minV, br, bl);
                leftbottom = 1 - interpolateX(minV, tl, bl);
                topright = interpolateX(minV, tl, tr);
              } else {
                righttop = 1 - interpolateX(maxV, tr, br);
                bottomleft = interpolateX(maxV, bl, br);
                leftbottom = interpolateX(maxV, bl, tl);
                topright = 1 - interpolateX(maxV, tr, tl);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 102){ /* 1010 with flipped == 0 || 1212 with flipped == 2 */
              if(flipped === 0){
                rightbottom = 1 - interpolateX(minV, tr, br);
                bottomright = interpolateX(minV, bl, br);
                lefttop = interpolateX(minV, bl, tl);
                topleft = 1 - interpolateX(minV, tr, tl);
              } else {
                rightbottom = interpolateX(maxV, br, tr);
                bottomright = 1 - interpolateX(maxV, br, bl);
                lefttop = 1 - interpolateX(maxV, tl, bl);
                topleft = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 155){ /* 0101 with flipped == 4 || 2121 with flipped == 1 */
              if(flipped === 4){
                righttop = interpolateX(minV, br, tr);
                bottomleft = 1 - interpolateX(minV, br, bl);
                leftbottom = 1 - interpolateX(minV, tl, bl);
                topright = interpolateX(minV, tl, tr);
              } else {
                righttop = 1 - interpolateX(maxV, tr, br);
                bottomleft = interpolateX(maxV, bl, br);
                leftbottom = interpolateX(maxV, bl, tl);
                topright = 1 - interpolateX(maxV, tr, tl);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 103){ /* 1010 with flipped == 4 || 1212 with flipped == 1 */
              if(flipped === 4){
                rightbottom = 1 - interpolateX(minV, tr, br);
                bottomright = interpolateX(minV, bl, br);
                lefttop = interpolateX(minV, bl, tl);
                topleft = 1 - interpolateX(minV, tr, tl);
              } else {
                rightbottom = interpolateX(maxV, br, tr);
                bottomright = 1 - interpolateX(maxV, br, bl);
                lefttop = 1 - interpolateX(maxV, tl, bl);
                topleft = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
            }

            /* 7-sided polygon cases */
            else if(cval === 152){ /* 2120 with flipped == 2 || 0102 with flipped == 0 */
              if(flipped === 0){
                righttop = interpolateX(minV, br, tr);
                bottomright = 1 - interpolateX(minV, br, bl);
                bottomleft = 1 - interpolateX(maxV, br, bl);
                leftbottom = 1 - interpolateX(maxV, tl, bl);
                lefttop = 1 - interpolateX(minV, tl, bl);
                topright = interpolateX(minV, tl, tr);
              } else {
                righttop = 1 - interpolateX(maxV, tr, br);
                bottomright = interpolateX(maxV, bl, br);
                bottomleft = interpolateX(minV, bl, br);
                leftbottom = interpolateX(minV, bl, tl);
                lefttop = interpolateX(maxV, bl, tl);
                topright = 1 - interpolateX(maxV, tr, tl);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 156){ /* 2120 with flipped == 1 || 0102 with flipped == 4 */
              if(flipped === 4){
                righttop = interpolateX(minV, br, tr);
                bottomright = 1 - interpolateX(minV, br, bl);
                bottomleft = 1 - interpolateX(maxV, br, bl);
                leftbottom = 1 - interpolateX(maxV, tl, bl);
                lefttop = 1 - interpolateX(minV, tl, bl);
                topright = interpolateX(minV, tl, tr);
              } else {
                righttop = 1 - interpolateX(maxV, tr, br);
                bottomright = interpolateX(maxV, bl, br);
                bottomleft = interpolateX(minV, bl, br);
                leftbottom = interpolateX(minV, bl, tl);
                lefttop = interpolateX(maxV, bl, tl);
                topright = 1 - interpolateX(maxV, tr, tl);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeBL[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 137){ /* 2021 with flipped == 2 || 0201 with flipped == 0 */
              if(flipped === 0){
                righttop = interpolateX(maxV, br, tr);
                rightbottom = interpolateX(minV, br, tr);
                bottomleft = 1 - interpolateX(minV, br, bl);
                leftbottom = 1 - interpolateX(minV, tl, bl);
                topleft = interpolateX(minV, tl, tr);
                topright = interpolateX(maxV, tl, tr);
              } else {
                righttop = 1 - interpolateX(minV, tr, br);
                rightbottom = 1 - interpolateX(maxV, tr, br);
                bottomleft = interpolateX(maxV, bl, br);
                leftbottom = interpolateX(maxV, bl, tl);
                topleft = 1 - interpolateX(maxV, tr, tl);
                topright = 1 - interpolateX(minV, tr, tl);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 139){ /* 2021 with flipped == 1 || 0201 with flipped == 4 */
              if(flipped === 4){
                righttop = interpolateX(maxV, br, tr);
                rightbottom = interpolateX(minV, br, tr);
                bottomleft = 1 - interpolateX(minV, br, bl);
                leftbottom = 1 - interpolateX(minV, tl, bl);
                topleft = interpolateX(minV, tl, tr);
                topright = interpolateX(maxV, tl, tr);
              } else {
                righttop = 1 - interpolateX(minV, tr, br);
                rightbottom = 1 - interpolateX(maxV, tr, br);
                bottomleft = interpolateX(maxV, bl, br);
                leftbottom = interpolateX(maxV, bl, tl);
                topleft = 1 - interpolateX(maxV, tr, tl);
                topright = 1 - interpolateX(minV, tr, tl);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLB[cval]);
            } else if(cval === 98){ /* 1202 with flipped == 2 || 1020 with flipped == 0 */
              if(flipped === 0){
                righttop = 1 - interpolateX(minV, tr, br);
                rightbottom = 1 - interpolateX(maxV, tr, br);
                bottomright = interpolateX(maxV, bl, br);
                bottomleft = interpolateX(minV, bl, br);
                lefttop = interpolateX(minV, bl, tl);
                topleft = 1 - interpolateX(minV, tr, tl);
              } else {
                righttop = interpolateX(maxV, br, tr);
                rightbottom = interpolateX(minV, br, tr);
                bottomright = 1 - interpolateX(minV, br, bl);
                bottomleft = 1 - interpolateX(maxV, br, bl);
                lefttop = 1 - interpolateX(maxV, tl, bl);
                topleft = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 99){ /* 1202 with flipped == 1 || 1020 with flipped == 4 */
              if(flipped === 4){
                righttop = 1 - interpolateX(minV, tr, br);
                rightbottom = 1 - interpolateX(maxV, tr, br);
                bottomright = interpolateX(maxV, bl, br);
                bottomleft = interpolateX(minV, bl, br);
                lefttop = interpolateX(minV, bl, tl);
                topleft = 1 - interpolateX(minV, tr, tl);
              } else {
                righttop = interpolateX(maxV, br, tr);
                rightbottom = interpolateX(minV, br, tr);
                bottomright = 1 - interpolateX(minV, br, bl);
                bottomleft = 1 - interpolateX(maxV, br, bl);
                lefttop = 1 - interpolateX(maxV, tl, bl);
                topleft = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRT[cval]);
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBL[cval]);
            } else if(cval === 38){ /* 0212 with flipped == 2 || 2010 with flipped == 0 */
              if(flipped === 0){
                rightbottom = 1 - interpolateX(minV, tr, br);
                bottomright = interpolateX(minV, bl, br);
                leftbottom = interpolateX(minV, bl, tl);
                lefttop = interpolateX(maxV, bl, tl);
                topleft = 1 - interpolateX(maxV, tr, tl);
                topright = 1 - interpolateX(minV, tr, tl);
              } else {
                rightbottom = interpolateX(maxV, br, tr);
                bottomright = 1 - interpolateX(maxV, br, bl);
                leftbottom = 1 - interpolateX(maxV, tl, bl);
                lefttop = 1 - interpolateX(minV, tl, bl);
                topleft = interpolateX(minV, tl, tr);
                topright = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeLB[cval]);
              edges.push(isoBandEdgeLT[cval]);
            } else if(cval === 39){ /* 0212 with flipped == 1 || 2010 with flipped == 4 */
              if(flipped === 4){
                rightbottom = 1 - interpolateX(minV, tr, br);
                bottomright = interpolateX(minV, bl, br);
                leftbottom = interpolateX(minV, bl, tl);
                lefttop = interpolateX(maxV, bl, tl);
                topleft = 1 - interpolateX(maxV, tr, tl);
                topright = 1 - interpolateX(minV, tr, tl);
              } else {
                rightbottom = interpolateX(maxV, br, tr);
                bottomright = 1 - interpolateX(maxV, br, bl);
                leftbottom = 1 - interpolateX(maxV, tl, bl);
                lefttop = 1 - interpolateX(minV, tl, bl);
                topleft = interpolateX(minV, tl, tr);
                topright = interpolateX(maxV, tl, tr);
              }
              edges.push(isoBandEdgeRB[cval]);
              edges.push(isoBandEdgeBR[cval]);
              edges.push(isoBandEdgeLT[cval]);
            }

            else if(cval === 85){
              righttop = 1;
              rightbottom = 0;
              bottomright = 1;
              bottomleft = 0;
              leftbottom = 0;
              lefttop = 1;
              topleft = 0;
              topright = 1;
            }

            if(topleft < 0 || topleft > 1 || topright < 0 || topright > 1 || righttop < 0 || righttop > 1 || bottomright < 0 || bottomright > 1 || leftbottom < 0 || leftbottom > 1 || lefttop < 0 || lefttop > 1){
              console.log(cval + " " + cval_real + " " + tl + "," + tr + "," + br + "," + bl + " " + flipped + " " + topleft + " " + topright + " " + righttop + " " + rightbottom + " " + bottomright + " " + bottomleft + " " + leftbottom + " " + lefttop);
            }

            BandGrid.cells[j][i] = {
                                      cval:         cval,
                                      cval_real:    cval_real,
                                      flipped:      flipped,
                                      topleft:      topleft,
                                      topright:     topright,
                                      righttop:     righttop,
                                      rightbottom:  rightbottom,
                                      bottomright:  bottomright,
                                      bottomleft:   bottomleft,
                                      leftbottom:   leftbottom,
                                      lefttop:      lefttop,
                                      edges:        edges
                                  };
          }
        }
      }

      return BandGrid;
    }

    function BandGrid2AreaPaths(grid){
      var areas = [];
      var area_idx = 0;
      var rows = grid.rows;
      var cols = grid.cols;
      var currentPolygon = [];

      for(var j = 0; j < rows; j++){
        for(var i = 0; i < cols; i++){
          if((typeof grid.cells[j][i] !== 'undefined') && (grid.cells[j][i].edges.length > 0)){
            /* trace back polygon path starting from this cell */
            var o = 0,
                x = i,
                y = j;

            var cell = grid.cells[j][i];
            /* get start coordinates */
            var cval = cell.cval;

            var prev  = getStartXY(cell),
                next  = null,
                p     = i,
                q     = j;

            if(prev !== null){
              currentPolygon.push([ prev.p[0] + p, prev.p[1] + q ]);
              //console.log(cell);
              //console.log("coords: " + (prev.p[0] + p) + " " + (prev.p[1] + q));
            }

            do{
              //console.log(p + "," + q);
              //console.log(grid.cells[q][p]);
              //console.log(grid.cells[q][p].edges);
              //console.log("from : " + prev.x + " " + prev.y + " " + prev.o);

              next = getExitXY(grid.cells[q][p], prev.x, prev.y, prev.o);
              if(next !== null){
                //console.log("coords: " + (next.p[0] + p) + " " + (next.p[1] + q));
                currentPolygon.push([ next.p[0] + p, next.p[1] + q ]);
                p += next.x;
                q += next.y;
                prev = next;
              } else {
                //console.log("getExitXY() returned null!");
                break;
              }
              //console.log("to : " + next.x + " " + next.y + " " + next.o);
              /* special case, where we've reached the grid boundaries */
              if((q < 0) || (q >= rows) || (p < 0) || (p >= cols) || (typeof grid.cells[q][p] === 'undefined')){
                /* to create a closed path, we need to trace our way
                    arround the missing data, until we find an entry
                    point again
                */

                /* set back coordinates of current cell */
                p -= next.x;
                q -= next.y;

                //console.log("reached boundary at " + p + " " + q);

                var missing = traceOutOfGridPath(grid, p, q, next.x, next.y, next.o);
                if(missing !== null){
                  missing.path.forEach(function(pp){
                    //console.log("coords: " + (pp[0]) + " " + (pp[1]));
                    currentPolygon.push(pp);
                  });
                  p = missing.i;
                  q = missing.j;
                  prev = missing;
                } else {
                  break;
                }
                //console.log(grid.cells[q][p]);
              }
            } while(    (typeof grid.cells[q][p] !== 'undefined')
                     && (grid.cells[q][p].edges.length > 0));

            areas.push(currentPolygon);
            //console.log("next polygon");
            //console.log(currentPolygon);
            currentPolygon = [];
            if(grid.cells[j][i].edges.length > 0)
              i--;
          }
        }
      }
      return areas;
    }

    function traceOutOfGridPath(grid, i, j, d_x, d_y, d_o){
      var cell = grid.cells[j][i];
      var cval = cell.cval_real;
      var p = i + d_x,
          q = j + d_y;
      var path = [];
      var rows = grid.rows;
      var cols = grid.cols;
      var closed = false;

      while(!closed){
        //console.log("processing cell " + p + "," + q + " " + d_x + " " + d_y + " " + d_o);
        if((typeof grid.cells[q] === 'undefined') || (typeof grid.cells[q][p] === 'undefined')){
          //console.log("which is undefined");
          /* we can't move on, so we have to change direction to proceed further */

          /* go back to previous cell */
          q -= d_y;
          p -= d_x;
          cell = grid.cells[q][p];
          cval = cell.cval_real;

          /* check where we've left defined cells of the grid... */
          if(d_y === -1){ /* we came from top */
            if(d_o === 0){  /* exit left */
              if(cval & Node3){ /* lower left node is within range, so we move left */
                path.push([p, q]);
                d_x = -1;
                d_y = 0;
                d_o = 0;
              } else if(cval & Node2){ /* lower right node is within range, so we move right */
                path.push([p + 1, q]);
                d_x = 1;
                d_y = 0;
                d_o = 0;
              } else { /* close the path */
                path.push([p + cell.bottomright, q]);
                d_x = 0;
                d_y = 1;
                d_o = 1;
                closed = true;
                break;
              }
            } else {
              if(cval & Node3){
                path.push([p, q]);
                d_x = -1;
                d_y = 0;
                d_o = 0;
              } else if(cval & Node2){
                path.push([p + cell.bottomright, q]);
                d_x = 0;
                d_y = 1;
                d_o = 1;
                closed = true;
                break;
              } else {
                path.push([p + cell.bottomleft, q]);
                d_x = 0;
                d_y = 1;
                d_o = 0;
                closed = true;
                break;
              }
            }
          } else if(d_y === 1){ /* we came from bottom */
            //console.log("we came from bottom and hit a non-existing cell " + (p + d_x) + "," + (q + d_y) + "!");
            if(d_o === 0){ /* exit left */
              if(cval & Node1){ /* top right node is within range, so we move right */
                path.push([p+1,q+1]);
                d_x = 1;
                d_y = 0;
                d_o = 1;
              } else if(!(cval & Node0)){ /* found entry within same cell */
                path.push([p + cell.topright, q + 1]);
                d_x = 0;
                d_y = -1;
                d_o = 1;
                closed = true;
                //console.log("found entry from bottom at " + p + "," + q);
                break;
              } else {
                path.push([p + cell.topleft, q + 1]);
                d_x = 0;
                d_y = -1;
                d_o = 0;
                closed = true;
                break;
              }
            } else {
              if(cval & Node1){
                path.push([p+1, q+1]);
                d_x = 1;
                d_y = 0;
                d_o = 1;
              } else { /* move right */
                path.push([p+1, q+1]);
                d_x = 1;
                d_y = 0;
                d_o = 1;
                //console.log("wtf");
                //break;
              }
            }
          } else if(d_x === -1){ /* we came from right */
            //console.log("we came from right and hit a non-existing cell at " + (p + d_x) + "," + (q + d_y) + "!");
            if(d_o === 0){
              //console.log("continue at bottom");
              if(cval & Node0){
                path.push([p,q+1]);
                d_x = 0;
                d_y = 1;
                d_o = 0;
                //console.log("moving upwards to " + (p + d_x) + "," + (q + d_y) + "!");
              } else if(!(cval & Node3)){ /* there has to be an entry into the regular grid again! */
                //console.log("exiting top");
                path.push([p, q + cell.lefttop]);
                d_x = 1;
                d_y = 0;
                d_o = 1;
                closed = true;
                break;
              } else {
                //console.log("exiting bottom");
                path.push([p, q + cell.leftbottom]);
                d_x = 1;
                d_y = 0;
                d_o = 0;
                closed = true;
                break;
              }
            } else {
              //console.log("continue at top");
              if(cval & Node0){
                path.push([p,q+1]);
                d_x = 0;
                d_y = 1;
                d_o = 0;
                //console.log("moving upwards to " + (p + d_x) + "," + (q + d_y) + "!");
              } else { /* */
                console.log("wtf");
                break;
              }
            }
          } else if(d_x === 1){ /* we came from left */
            //console.log("we came from left and hit a non-existing cell " + (p + d_x) + "," + (q + d_y) + "!");
            if(d_o === 0){ /* exit bottom */
              if(cval & Node2){
                path.push([p+1,q]);
                d_x = 0;
                d_y = -1;
                d_o = 1;
              } else {
                path.push([p+1,q+cell.rightbottom]);
                d_x = -1;
                d_y = 0;
                d_o = 0;
                closed = true;
                break;
              }
            } else { /* exit top */
              if(cval & Node2){
                path.push([p+1,q]);
                d_x = 0;
                d_y = -1;
                d_o = 1;
              } else if(!(cval & Node1)){
                path.push([p + 1, q + cell.rightbottom]);
                d_x = -1;
                d_y = 0;
                d_o = 0;
                closed = true;
                break;
              } else {
                path.push([p+1,q+cell.righttop]);
                d_x = -1;
                d_y = 0;
                d_o = 1;
                break;
              }
            }
          } else { /* we came from the same cell */
            console.log("we came from nowhere!");
            break;
          }

        } else { /* try to find an entry into the regular grid again! */
          cell = grid.cells[q][p];
          cval = cell.cval_real;
          //console.log("which is defined");

          if(d_x === -1){
            if(d_o === 0){
              /* try to go downwards */
              if((typeof grid.cells[q - 1] !== 'undefined') && (typeof grid.cells[q - 1][p] !== 'undefined')){
                d_x = 0;
                d_y = -1;
                d_o = 1;
              } else if(cval & Node3){ /* proceed searching in x-direction */
                //console.log("proceeding in x-direction!");
                path.push([p, q]);
              } else { /* we must have found an entry into the regular grid */
                path.push([p + cell.bottomright, q]);
                d_x = 0;
                d_y = 1;
                d_o = 1;
                closed = true;
                //console.log("found entry from bottom at " + p + "," + q);
                break;
              }
            } else {
              if(cval & Node0) { /* proceed searchin in x-direction */
                console.log("proceeding in x-direction!");
              } else { /* we must have found an entry into the regular grid */
                console.log("found entry from top at " + p + "," + q);
                break;
              }
            }
          } else if(d_x === 1){
            if(d_o === 0){
              console.log("wtf");
              break;
            } else {
              /* try to go upwards */
              if((typeof grid.cells[q+1] !== 'undefined') && (typeof grid.cells[q+1][p] !== 'undefined')){
                d_x = 0;
                d_y = 1;
                d_o = 0;
              } else if(cval & Node1){
                path.push([p+1,q+1]);
                d_x = 1;
                d_y = 0;
                d_o = 1;
              } else { /* found an entry point into regular grid! */
                path.push([p+cell.topleft, q + 1]);
                d_x = 0;
                d_y = -1;
                d_o = 0;
                closed = true;
                //console.log("found entry from bottom at " + p + "," + q);
                break;
              }
            }
          } else if(d_y === -1){
            if(d_o === 1){
              /* try to go right */
              if(typeof grid.cells[q][p+1] !== 'undefined'){
                d_x = 1;
                d_y = 0;
                d_o = 1;
              } else if(cval & Node2){
                path.push([p+1,q]);
                d_x = 0;
                d_y = -1;
                d_o = 1;
              } else { /* found entry into regular grid! */
                path.push([p+1, q + cell.righttop]);
                d_x = -1;
                d_y = 0;
                d_o = 1;
                closed = true;
                //console.log("found entry from top at " + p + "," + q);
                break;
              }
            } else {
              console.log("wtf");
              break;
            }
          } else if(d_y === 1){
            if(d_o === 0){
              //console.log("we came from bottom left and proceed to the left");
              /* try to go left */
              if(typeof grid.cells[q][p - 1] !== 'undefined'){
                d_x = -1;
                d_y = 0;
                d_o = 0;
              } else if(cval & Node0){
                path.push([p,q+1]);
                d_x = 0;
                d_y = 1;
                d_o = 0;
              } else { /* found an entry point into regular grid! */
                path.push([p, q + cell.leftbottom]);
                d_x = 1;
                d_y = 0;
                d_o = 0;
                closed = true;
                //console.log("found entry from bottom at " + p + "," + q);
                break;
              }
            } else {
              //console.log("we came from bottom right and proceed to the right");
              console.log("wtf");
              break;
            }
          } else {
            console.log("where did we came from???");
            break;
          }

        }

        p += d_x;
        q += d_y;
        //console.log("going on to  " + p + "," + q + " via " + d_x + " " + d_y + " " + d_o);

        if((p === i) && (q === j)){ /* bail out, once we've closed a circle path */
          break;
        }

      }

      //console.log("exit with " + p + "," + q + " " + d_x + " " + d_y + " " + d_o);
      return { path: path, i: p, j: q, x: d_x, y: d_y, o: d_o };
    }

    function deleteEdge(cell, edgeIdx){
      delete cell.edges[edgeIdx];
      for(var k = edgeIdx + 1; k < cell.edges.length; k++){
        cell.edges[k-1] = cell.edges[k];
      }
      cell.edges.pop();
    }

    function getStartXY(cell){

      if(cell.edges.length > 0){
        var e = cell.edges[cell.edges.length - 1];
        //console.log("starting with edge " + e);
        var cval = cell.cval_real;
        switch(e){
          case 0:   if(cval & Node1){ /* node 1 within range */
                      return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                    } else { /* node 1 below or above threshold */
                      return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                    }
          case 1:   if(cval & Node2){
                      return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                    } else {
                      return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                    }
          case 2:   if(cval & Node2){
                      return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                    } else {
                      return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                    }
          case 3:   if(cval & Node3){
                      return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                    } else {
                      return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                    }
          case 4:   if(cval & Node1){
                      return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                    } else {
                      return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                    }
          case 5:   if(cval & Node2){
                      return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                    } else {
                      return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                    }
          case 6:   if(cval & Node2){
                      return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                    } else {
                      return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                    }
          case 7:   if(cval & Node3){
                      return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                    } else {
                      return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                    }
          case 8:   if(cval & Node2){
                      return {p: [cell.bottomright], x: 0, y: 1, o: 1};
                    } else {
                      return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                    }
          case 9:   if(cval & Node3){
                      return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                    } else {
                      return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                    }
          case 10:  if(cval & Node3){
                      return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                    } else {
                      return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                    }
          case 11:  if(cval & Node0){
                      return {p: [1, cell.righttop], x: -1, y: 0, o: 1};
                    } else {
                      return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                    }
          case 12:  if(cval & Node2){
                      return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                    } else {
                      return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                    }
          case 13:  if(cval & Node3){
                      return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                    } else {
                      return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                    }
          case 14:  if(cval & Node3){
                      return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                    } else {
                      return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                    }
          case 15:  if(cval & Node0){
                      return {p: [1, cell.rightbottom], x: -1, y: 0, o: 0};
                    } else {
                      return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                    }
          case 16:  if(cval & Node2){
                      return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                    } else {
                      return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                    }
          case 17:  if(cval & Node0){
                      return {p: [cell.bottomright, 0], x: 0, y: 1, o: 1};
                    } else {
                      return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                    }
          case 18:  if(cval & Node3){
                      return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                    } else {
                      return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                    }
          case 19:  if(cval & Node0){
                      return {p: [cell.bottomleft, 0], x: 0, y: 1, o: 0};
                    } else {
                      return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                    }
          case 20:  if(cval & Node0){
                      return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                    } else {
                      return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                    }
          case 21:  if(cval & Node1){
                      return {p: [0, cell.leftbottom], x: 1, y: 0, o: 0};
                    } else {
                      return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                    }
          case 22:  if(cval & Node0){
                      return {p: [cell.topleft, 1], x: 0, y: -1, o: 0};
                    } else {
                      return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                    }
          case 23:  if(cval & Node1){
                      return {p: [0, cell.lefttop], x: 1, y: 0, o: 1};
                    } else {
                      return {p: [cell.topright, 1], x: 0, y: -1, o: 1};
                    }
          default:  console.log("edge index out of range!");
                    console.log(cell);
                    break;
        }
      }

      return null;
    }

    function getExitXY(cell, x, y, o){

      var e, id_x, x, y, d_x, d_y, cval = cell.cval;
      var d_o;

      switch(x){
        case -1:  switch(o){
                    case 0:   e = isoBandEdgeRB[cval];
                              d_x = isoBandNextXRB[cval];
                              d_y = isoBandNextYRB[cval];
                              d_o = isoBandNextORB[cval];
                              break;
                    default:  e = isoBandEdgeRT[cval];
                              d_x = isoBandNextXRT[cval];
                              d_y = isoBandNextYRT[cval];
                              d_o = isoBandNextORT[cval];
                              break;
                  }
                  break;
        case 1:   switch(o){
                    case 0:   e = isoBandEdgeLB[cval];
                              d_x = isoBandNextXLB[cval];
                              d_y = isoBandNextYLB[cval];
                              d_o = isoBandNextOLB[cval];
                              break;
                    default:  e = isoBandEdgeLT[cval];
                              d_x = isoBandNextXLT[cval];
                              d_y = isoBandNextYLT[cval];
                              d_o = isoBandNextOLT[cval];
                              break;
                  }
                  break;
        default:  switch(y){
                    case -1:  switch(o){
                                case 0:   e = isoBandEdgeTL[cval];
                                          d_x = isoBandNextXTL[cval];
                                          d_y = isoBandNextYTL[cval];
                                          d_o = isoBandNextOTL[cval];
                                          break;
                                default:  e = isoBandEdgeTR[cval];
                                          d_x = isoBandNextXTR[cval];
                                          d_y = isoBandNextYTR[cval];
                                          d_o = isoBandNextOTR[cval];
                                          break;
                              }
                              break;
                    case 1:   switch(o){
                                case 0:   e = isoBandEdgeBL[cval];
                                          d_x = isoBandNextXBL[cval];
                                          d_y = isoBandNextYBL[cval];
                                          d_o = isoBandNextOBL[cval];
                                          break;
                                default:  e = isoBandEdgeBR[cval];
                                          d_x = isoBandNextXBR[cval];
                                          d_y = isoBandNextYBR[cval];
                                          d_o = isoBandNextOBR[cval];
                                          break;
                              }
                              break;
                    default:  break;
                  }
                  break;
      }

      id_x = cell.edges.indexOf(e);
      if(typeof cell.edges[id_x] !== 'undefined'){
        deleteEdge(cell, id_x);
      } else {
        //console.log("wrong edges...");
        //console.log(x + " " + y + " " + o);
        //console.log(cell);
        return null;
      }

      cval = cell.cval_real;

      switch(e){
          case 0:   if(cval & Node1){ /* node 1 within range */
                      x = cell.topleft;
                      y = 1;
                    } else { /* node 1 below or above threshold */
                      x = 1;
                      y = cell.righttop;
                    }
                    break;
          case 1:   if(cval & Node2){
                      x = 1;
                      y = cell.rightbottom;
                    } else {
                      x = cell.topleft;
                      y = 1;
                    }
                    break;
          case 2:   if(cval & Node2){
                      x = cell.topleft;
                      y = 1;
                    } else {
                      x = cell.bottomright;
                      y = 0;
                    }
                    break;
          case 3:   if(cval & Node3){
                      x = cell.bottomleft;
                      y = 0;
                    } else {
                      x = cell.topleft;
                      y = 1;
                    }
                    break;
          case 4:   if(cval & Node1){
                      x = cell.topright;
                      y = 1;
                    } else {
                      x = 1;
                      y = cell.righttop;
                    }
                    break;
          case 5:   if(cval & Node2){
                      x = 1;
                      y = cell.rightbottom;
                    } else {
                      x = cell.topright;
                      y = 1;
                    }
                    break;
          case 6:   if(cval & Node2){
                      x = cell.topright;
                      y = 1;
                    } else {
                      x = cell.bottomright;
                      y = 0;
                    }
                    break;
          case 7:   if(cval & Node3){
                      x = cell.bottomleft;
                      y = 0;
                    } else {
                      x = cell.topright;
                      y = 1;
                    }
                    break;
          case 8:   if(cval & Node2){
                      x = 1;
                      y = cell.righttop;
                    } else {
                      x = cell.bottomright;
                      y = 0;
                    }
                    break;
          case 9:   if(cval & Node3){
                      x = cell.bottomleft;
                      y = 0;
                    } else {
                      x = 1;
                      y = cell.righttop;
                    }
                    break;
          case 10:  if(cval & Node3){
                      x = 1;
                      y = cell.righttop;
                    } else {
                      x = 0;
                      y = cell.leftbottom;
                    }
                    break;
          case 11:  if(cval & Node0){
                      x = 0;
                      y = cell.lefttop;
                    } else {
                      x = 1;
                      y = cell.righttop;
                    }
                    break;
          case 12:  if(cval & Node2){
                      x = 1;
                      y = cell.rightbottom;
                    } else {
                      x = cell.bottomright;
                      y = 0;
                    }
                    break;
          case 13:  if(cval & Node3){
                      x = cell.bottomleft;
                      y = 0;
                    } else {
                      x = 1;
                      y = cell.rightbottom;
                    }
                    break;
          case 14:  if(cval & Node3){
                      x = 1;
                      y = cell.rightbottom;
                    } else {
                      x = 0;
                      y = cell.leftbottom;
                    }
                    break;
          case 15:  if(cval & Node0){
                      x = 0;
                      y = cell.lefttop;
                    } else {
                      x = 1;
                      y = cell.rightbottom;
                    }
                    break;
          case 16:  if(cval & Node2){
                      x = 0;
                      y = cell.leftbottom;
                    } else {
                      x = cell.bottomright;
                      y = 0;
                    }
                    break;
          case 17:  if(cval & Node0){
                      x = 0;
                      y = cell.lefttop;
                    } else {
                      x = cell.bottomright;
                      y = 0;
                    }
                    break;
          case 18:  if(cval & Node3){
                      x = cell.bottomleft;
                      y = 0;
                    } else {
                      x = 0;
                      y = cell.leftbottom;
                    }
                    break;
          case 19:  if(cval & Node0){
                      x = 0;
                      y = cell.lefttop;
                    } else {
                      x = cell.bottomleft;
                      y = 0;
                    }
                    break;
          case 20:  if(cval & Node0){
                      x = 0;
                      y = cell.leftbottom;
                    } else {
                      x = cell.topleft;
                      y = 1;
                    }
                    break;
          case 21:  if(cval & Node1){
                      x = cell.topright;
                      y = 1;
                    } else {
                      x = 0;
                      y = cell.leftbottom;
                    }
                    break;
          case 22:  if(cval & Node0){
                      x = 0;
                      y = cell.lefttop;
                    } else {
                      x = cell.topleft;
                      y = 1;
                    }
                    break;
          case 23:  if(cval & Node1){
                      x = cell.topright;
                      y = 1;
                    } else {
                      x = 0;
                      y = cell.lefttop;
                    }
                    break;
          default:  console.log("edge index out of range!");
                    console.log(cell);
                    return null;
      }

      if((typeof x === 'undefined') || (typeof y === 'undefined') || (typeof d_x === 'undefined') || (typeof d_y === 'undefined') || (typeof d_o === 'undefined')){
        console.log("undefined value!");
        console.log(cell);
        console.log(x + " " + y + " " + d_x + " " + d_y + " " + d_o);
      }
      return {p: [x, y], x: d_x, y: d_y, o: d_o};
    }

    /*
    function BandGrid2Areas(grid){
      var areas = [];
      var area_idx = 0;
      var rows = grid.rows;
      var cols = grid.cols;

      grid.cells.forEach(function(g, j){
        g.forEach(function(gg, i){
          if(typeof gg !== 'undefined'){
            var a = polygon_table[gg.cval](gg);
            if((typeof a === 'object') && isArray(a)){
              if((typeof a[0] === 'object') && isArray(a[0])){
                if((typeof a[0][0] === 'object') && isArray(a[0][0])){
                  a.forEach(function(aa,k){
                    aa.forEach(function(aaa){
                      aaa[0] += i;
                      aaa[1] += j;
                    });
                    areas[area_idx++] = aa;
                  });
                } else {

                  a.forEach(function(aa,k){
                    aa[0] += i;
                    aa[1] += j;
                  });
                  areas[area_idx++] = a;
                }
              } else {
                console.log("bandcell polygon with malformed coordinates");
              }
            } else {
              console.log("bandcell polygon with null coordinates");
            }
          }
        });
      });

      return areas;
    }*/

  var isolines = function(data, geoTransform, intervals){
      var lines = { "type": "FeatureCollection",
      "features": []
      };
      for(var i=0; i<intervals.length; i++){
          var value = intervals[i];
          var coords = projectedIsoline(data, geoTransform, value);
         
          lines.features.push({"type": "Feature",
           "geometry": {
             "type": "MultiLineString",
            "coordinates": coords},
            "properties": [{"value": value}]}
          );
      }

      return lines;
    };

   var projectedIsoline = function(data, geoTransform, value){
      if(typeof(geoTransform) != typeof(new Array()) || geoTransform.length != 6)
          throw new Error("GeoTransform must be a 6 elements array");
      var coords = isoline(data, value);

      for(var i = 0; i<coords.length; i++){
          for(var j = 0; j<coords[i].length; j++){
              var coordsGeo = applyGeoTransform$1(coords[i][j][0], coords[i][j][1], geoTransform);
              coords[i][j][0]= coordsGeo[0];
              coords[i][j][1]= coordsGeo[1];
          }
      }

      return coords;
    };

    /**
      Xgeo = GT(0) + Xpixel*GT(1) + Yline*GT(2)
      Ygeo = GT(3) + Xpixel*GT(4) + Yline*GT(5)
    */
    var applyGeoTransform$1 = function(x, y, geoTransform){
      var xgeo = geoTransform[0] + x*geoTransform[1] + y*geoTransform[2];
      var ygeo = geoTransform[3] + x*geoTransform[4] + y*geoTransform[5];
      return [xgeo, ygeo];
    };

   var isoline  = function(data, threshold, options){
      var defaultSettings = {
      successCallback:  null,
      progressCallback: null,
      verbose:          false
      };

      var settings = {};

      /* process options */
      options = options ? options : {};

      var optionKeys = Object.keys(defaultSettings);

      for(var i = 0; i < optionKeys.length; i++){
        var key = optionKeys[i];
        var val = options[key];
        val = ((typeof val !== 'undefined') && (val !== null)) ? val : defaultSettings[key];

        settings[key] = val;
      }

      if(settings.verbose)
        console.log("computing isocontour for " + threshold);

      var ret = ContourGrid2Paths(computeContourGrid(data, threshold));

      if(typeof settings.successCallback === 'function')
        settings.successCallback(ret);

      return ret;
    };

    /*
      Thats all for the public interface, below follows the actual
      implementation
    */

    /*
    ################################
    Isocontour implementation below
    ################################
    */

    /* assume that x1 == 1 &&  x0 == 0 */
    function interpolateX$1(y, y0, y1){
      return (y - y0) / (y1 - y0);
    }

    /* compute the isocontour 4-bit grid */
    function computeContourGrid(data, threshold){
      var rows = data.length - 1;
      var cols = data[0].length - 1;
      var ContourGrid = { rows: rows, cols: cols, cells: [] };

      for(var j = 0; j < rows; ++j){
        ContourGrid.cells[j] = [];
        for(var i = 0; i < cols; ++i){
          /* compose the 4-bit corner representation */
          var cval = 0;

          var tl = data[j+1][i];
          var tr = data[j+1][i+1];
          var br = data[j][i+1];
          var bl = data[j][i];

          if(isNaN(tl) || isNaN(tr) || isNaN(br) || isNaN(bl)){
            continue;
          }
          cval |= ((tl >= threshold) ? 8 : 0);
          cval |= ((tr >= threshold) ? 4 : 0);
          cval |= ((br >= threshold) ? 2 : 0);
          cval |= ((bl >= threshold) ? 1 : 0);

          /* resolve ambiguity for cval == 5 || 10 via averaging */
          var flipped = false;
          if(cval == 5 || cval == 10){
            var average = (tl + tr + br + bl) / 4;
            if(cval == 5 && (average < threshold)){
              cval = 10;
              flipped = true;
            } else if(cval == 10 && (average < threshold)){
              cval = 5;
              flipped = true;
            }
          }

          /* add cell to ContourGrid if it contains edges */
          if(cval !== 0 && cval !== 15){
            var top, bottom, left, right;
            top = bottom = left = right = 0.5;
            /* interpolate edges of cell */
            if(cval == 1){
              left    = 1 - interpolateX$1(threshold, tl, bl);
              bottom  = 1 - interpolateX$1(threshold, br, bl);
            } else if(cval == 2){
              bottom  = interpolateX$1(threshold, bl, br);
              right   = 1 - interpolateX$1(threshold, tr, br);
            } else if(cval == 3){
              left    = 1 - interpolateX$1(threshold, tl, bl);
              right   = 1 - interpolateX$1(threshold, tr, br);
            } else if(cval == 4){
              top     = interpolateX$1(threshold, tl, tr);
              right   = interpolateX$1(threshold, br, tr);
            } else if(cval == 5){
              top     = interpolateX$1(threshold, tl, tr);
              right   = interpolateX$1(threshold, br, tr);
              bottom  = 1 - interpolateX$1(threshold, br, bl);
              left    = 1 - interpolateX$1(threshold, tl, bl);
            } else if(cval == 6){
              bottom  = interpolateX$1(threshold, bl, br);
              top     = interpolateX$1(threshold, tl, tr);
            } else if(cval == 7){
              left    = 1 - interpolateX$1(threshold, tl, bl);
              top     = interpolateX$1(threshold, tl, tr);
            } else if(cval == 8){
              left    = interpolateX$1(threshold, bl, tl);
              top     = 1 - interpolateX$1(threshold, tr, tl);
            } else if(cval == 9){
              bottom  = 1 - interpolateX$1(threshold, br, bl);
              top     = 1 - interpolateX$1(threshold, tr, tl);
            } else if(cval == 10){
              top     = 1 - interpolateX$1(threshold, tr, tl);
              right   = 1 - interpolateX$1(threshold, tr, br);
              bottom  = interpolateX$1(threshold, bl, br);
              left    = interpolateX$1(threshold, bl, tl);
            } else if(cval == 11){
              top     = 1 - interpolateX$1(threshold, tr, tl);
              right   = 1 - interpolateX$1(threshold, tr, br);
            } else if(cval == 12){
              left    = interpolateX$1(threshold, bl, tl);
              right   = interpolateX$1(threshold, br, tr);
            } else if(cval == 13){
              bottom  = 1 - interpolateX$1(threshold, br, bl);
              right   = interpolateX$1(threshold, br, tr);
            } else if(cval == 14){
              left    = interpolateX$1(threshold, bl, tl);
              bottom  = interpolateX$1(threshold, bl, br);
            } else {
              console.log("Illegal cval detected: " + cval);
            }
            ContourGrid.cells[j][i] = {
                                        cval:     cval,
                                        flipped:  flipped,
                                        top:      top,
                                        right:    right,
                                        bottom:   bottom,
                                        left:     left
                                      };
          }

        }
      }

      return ContourGrid;
    }

    function isSaddle(cell){
      return cell.cval == 5 || cell.cval == 10;
    }

    function isTrivial(cell){
      return cell.cval === 0 || cell.cval == 15;
    }

    function clearCell(cell){
      if((!isTrivial(cell)) && (cell.cval != 5) && (cell.cval != 10)){
        cell.cval = 15;
      }
    }

    function getXY(cell, edge){
      if(edge === "top"){
        return [cell.top, 1.0];
      } else if(edge === "bottom"){
        return [cell.bottom, 0.0];
      } else if(edge === "right"){
        return [1.0, cell.right];
      } else if(edge === "left"){
        return [0.0, cell.left];
      }
    }

    function ContourGrid2Paths(grid){
      var paths = [];
      var path_idx = 0;
      var rows = grid.rows;
      var cols = grid.cols;
      var epsilon = 1e-7;

      grid.cells.forEach(function(g, j){
        g.forEach(function(gg, i){
          if((typeof gg !== 'undefined') && (!isSaddle(gg)) && (!isTrivial(gg))){
            var p = tracePath(grid.cells, j, i);
            var merged = false;
            /* we may try to merge paths at this point */
            if(p.info == "mergeable"){
              /*
                search backwards through the path array to find an entry
                that starts with where the current path ends...
              */
              var x = p.path[p.path.length - 1][0],
                  y = p.path[p.path.length - 1][1];

              for(var k = path_idx - 1; k >= 0; k--){
                if((Math.abs(paths[k][0][0] - x) <= epsilon) && (Math.abs(paths[k][0][1] - y) <= epsilon)){
                  for(var l = p.path.length - 2; l >= 0; --l){
                    paths[k].unshift(p.path[l]);
                  }
                  merged = true;
                  break;
                }
              }
            }
            if(!merged)
              paths[path_idx++] = p.path;
          }
        });
      });

      return paths;
    }

    /*
      construct consecutive line segments from starting cell by
      walking arround the enclosed area clock-wise
     */
    function tracePath(grid, j, i){
      var maxj = grid.length;
      var p = [];
      var dxContour = [0, 0, 1, 1, 0, 0, 0, 0, -1, 0, 1, 1, -1, 0, -1, 0];
      var dyContour = [0, -1, 0, 0, 1, 1, 1, 1, 0, -1, 0, 0, 0, -1, 0, 0];
      var dx, dy;
      var startEdge = ["none", "left", "bottom", "left", "right", "none", "bottom", "left", "top", "top", "none", "top", "right", "right", "bottom", "none"];
      var nextEdge  = ["none", "bottom", "right", "right", "top", "top", "top", "top", "left", "bottom", "right", "right", "left", "bottom", "left", "none"];
      
      var startCell   = grid[j][i];
      var currentCell = grid[j][i];

      var cval = currentCell.cval;
      var edge = startEdge[cval];

      var pt = getXY(currentCell, edge);

      /* push initial segment */
      p.push([i + pt[0], j + pt[1]]);
      edge = nextEdge[cval];
      pt = getXY(currentCell, edge);
      p.push([i + pt[0], j + pt[1]]);
      clearCell(currentCell);

      /* now walk arround the enclosed area in clockwise-direction */
      var k = i + dxContour[cval];
      var l = j + dyContour[cval];
      var prev_cval = cval;

      while((k >= 0) && (l >= 0) && (l < maxj) && ((k != i) || (l != j))){
        currentCell = grid[l][k];
        if(typeof currentCell === 'undefined'){ /* path ends here */
          //console.log(k + " " + l + " is undefined, stopping path!");
          break;
        }
        cval = currentCell.cval;
        if((cval === 0) || (cval === 15)){
          return { path: p, info: "mergeable" };
        }
        edge  = nextEdge[cval];
        dx    = dxContour[cval];
        dy    = dyContour[cval];
        if((cval == 5) || (cval == 10)){
          /* select upper or lower band, depending on previous cells cval */
          if(cval == 5){
            if(currentCell.flipped){ /* this is actually a flipped case 10 */
              if(dyContour[prev_cval] == -1){
                edge  = "left";
                dx    = -1;
                dy    = 0;
              } else {
                edge  = "right";
                dx    = 1;
                dy    = 0;
              }
            } else { /* real case 5 */
              if(dxContour[prev_cval] == -1){
                edge  = "bottom";
                dx    = 0;
                dy    = -1;
              }
            }
          } else if(cval == 10){
            if(currentCell.flipped){ /* this is actually a flipped case 5 */
              if(dxContour[prev_cval] == -1){
                edge  = "top";
                dx    = 0;
                dy    = 1;
              } else {
                edge  = "bottom";
                dx    = 0;
                dy    = -1;
              }
            } else {  /* real case 10 */
              if(dyContour[prev_cval] == 1){
                edge  = "left";
                dx    = -1;
                dy    = 0;
              }
            }
          }
        }
        pt = getXY(currentCell, edge);
        p.push([k + pt[0], l + pt[1]]);
        clearCell(currentCell);
        k += dx;
        l += dy;
        prev_cval = cval;
      }

      return { path: p, info: "closed" };
    }

  exports.isoband = isoband;
  exports.projectedIsoband = projectedIsoband;
  exports.isobands = isobands;
  exports.isoline = isoline;
  exports.projectedIsoline = projectedIsoline;
  exports.isolines = isolines;

  Object.defineProperty(exports, '__esModule', { value: true });

}));