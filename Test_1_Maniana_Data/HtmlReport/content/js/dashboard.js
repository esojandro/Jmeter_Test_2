/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.81828093767037, "KoPercent": 0.1817190623296384};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8348900599672906, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9432314410480349, 500, 1500, "confirmation_6"], "isController": false}, {"data": [0.9290393013100436, 500, 1500, "confirmation_7"], "isController": false}, {"data": [0.9399563318777293, 500, 1500, "confirmation_8"], "isController": false}, {"data": [0.9486899563318777, 500, 1500, "purchase_20"], "isController": false}, {"data": [0.9409190371991247, 500, 1500, "confirmation_9"], "isController": false}, {"data": [0.9410480349344978, 500, 1500, "confirmation_2"], "isController": false}, {"data": [0.9410480349344978, 500, 1500, "confirmation_3"], "isController": false}, {"data": [0.9279475982532751, 500, 1500, "confirmation_4"], "isController": false}, {"data": [0.925764192139738, 500, 1500, "confirmation_5"], "isController": false}, {"data": [0.9268558951965066, 500, 1500, "confirmation_1"], "isController": false}, {"data": [0.9530567685589519, 500, 1500, "purchase_19"], "isController": false}, {"data": [0.9508733624454149, 500, 1500, "purchase_17"], "isController": false}, {"data": [0.9486899563318777, 500, 1500, "purchase_18"], "isController": false}, {"data": [0.9399563318777293, 500, 1500, "purchase_15"], "isController": false}, {"data": [0.9497816593886463, 500, 1500, "purchase_16"], "isController": false}, {"data": [0.9443231441048034, 500, 1500, "purchase_13"], "isController": false}, {"data": [0.9486899563318777, 500, 1500, "purchase_14"], "isController": false}, {"data": [0.9530567685589519, 500, 1500, "purchase_11"], "isController": false}, {"data": [0.9541484716157205, 500, 1500, "purchase_12"], "isController": false}, {"data": [0.9497816593886463, 500, 1500, "purchase_10"], "isController": false}, {"data": [0.936542669584245, 500, 1500, "confirmation_19"], "isController": false}, {"data": [0.9399563318777293, 500, 1500, "confirmation_18"], "isController": false}, {"data": [0.9465065502183406, 500, 1500, "confirmation_17"], "isController": false}, {"data": [0.9312227074235808, 500, 1500, "confirmation_16"], "isController": false}, {"data": [0.9235807860262009, 500, 1500, "confirmation_15"], "isController": false}, {"data": [0.9355895196506551, 500, 1500, "confirmation_14"], "isController": false}, {"data": [0.9432314410480349, 500, 1500, "confirmation_13"], "isController": false}, {"data": [0.9312227074235808, 500, 1500, "confirmation_12"], "isController": false}, {"data": [0.9399563318777293, 500, 1500, "confirmation_11"], "isController": false}, {"data": [0.9312227074235808, 500, 1500, "confirmation_10"], "isController": false}, {"data": [0.9519650655021834, 500, 1500, "purchase_9"], "isController": false}, {"data": [0.9389978213507625, 500, 1500, "purchase_8"], "isController": false}, {"data": [0.9497816593886463, 500, 1500, "purchase_7"], "isController": false}, {"data": [0.9465065502183406, 500, 1500, "purchase_6"], "isController": false}, {"data": [0.6230936819172114, 500, 1500, "reserve_20"], "isController": false}, {"data": [0.9422657952069716, 500, 1500, "purchase_1"], "isController": false}, {"data": [0.9410480349344978, 500, 1500, "purchase_5"], "isController": false}, {"data": [0.9477124183006536, 500, 1500, "purchase_4"], "isController": false}, {"data": [0.9389978213507625, 500, 1500, "purchase_3"], "isController": false}, {"data": [0.9455337690631809, 500, 1500, "purchase_2"], "isController": false}, {"data": [0.9442013129102844, 500, 1500, "confirmation_20"], "isController": false}, {"data": [0.6184782608695653, 500, 1500, "reserve_6"], "isController": false}, {"data": [0.6296296296296297, 500, 1500, "reserve_15"], "isController": false}, {"data": [0.6173913043478261, 500, 1500, "reserve_5"], "isController": false}, {"data": [0.6241830065359477, 500, 1500, "reserve_14"], "isController": false}, {"data": [0.6271739130434782, 500, 1500, "reserve_4"], "isController": false}, {"data": [0.6173913043478261, 500, 1500, "reserve_13"], "isController": false}, {"data": [0.6217391304347826, 500, 1500, "reserve_3"], "isController": false}, {"data": [0.6260869565217392, 500, 1500, "reserve_12"], "isController": false}, {"data": [0.6228260869565218, 500, 1500, "reserve_11"], "isController": false}, {"data": [0.6141304347826086, 500, 1500, "reserve_9"], "isController": false}, {"data": [0.6152173913043478, 500, 1500, "reserve_10"], "isController": false}, {"data": [0.633695652173913, 500, 1500, "reserve_8"], "isController": false}, {"data": [0.6217391304347826, 500, 1500, "reserve_7"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "reserve_19"], "isController": false}, {"data": [0.6100217864923747, 500, 1500, "reserve_18"], "isController": false}, {"data": [0.6187363834422658, 500, 1500, "reserve_17"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "reserve_16"], "isController": false}, {"data": [0.6326086956521739, 500, 1500, "reserve_2"], "isController": false}, {"data": [0.6358695652173914, 500, 1500, "reserve_1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27515, 50, 0.1817190623296384, 493.8769761948014, 5, 3478, 444.0, 939.0, 1040.0, 1210.9900000000016, 53.22492973303389, 83.08927063203517, 36.74859487225243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["confirmation_6", 458, 1, 0.2183406113537118, 377.2947598253273, 219, 2435, 359.0, 507.30000000000007, 578.05, 679.6099999999993, 0.898185390955783, 1.344558587476001, 0.703766112303571], "isController": false}, {"data": ["confirmation_7", 458, 1, 0.2183406113537118, 375.81877729257627, 224, 2012, 353.5, 518.1, 574.05, 809.299999999999, 0.8997770203235661, 1.3505672413877783, 0.7131746639342652], "isController": false}, {"data": ["confirmation_8", 458, 1, 0.2183406113537118, 374.36026200873386, 224, 1862, 351.5, 509.20000000000005, 592.1499999999999, 976.1999999999994, 0.9013565613050384, 1.346497842918939, 0.7139634497946363], "isController": false}, {"data": ["purchase_20", 458, 1, 0.2183406113537118, 369.2794759825329, 219, 1669, 354.0, 494.20000000000005, 565.1499999999999, 909.8899999999991, 0.9137138878525928, 1.5547740179071963, 0.6134514725407032], "isController": false}, {"data": ["confirmation_9", 457, 0, 0.0, 374.0175054704595, 226, 1859, 355.0, 513.5999999999999, 580.7999999999997, 759.820000000002, 0.9029568378728156, 1.355919062984697, 0.7142838398881677], "isController": false}, {"data": ["confirmation_2", 458, 0, 0.0, 368.7882096069871, 222, 1046, 349.0, 517.2, 574.4499999999996, 776.1999999999994, 0.8919147345093105, 1.3354036048058238, 0.6986093621592516], "isController": false}, {"data": ["confirmation_3", 458, 0, 0.0, 372.02620087336265, 223, 1660, 352.0, 515.0, 566.2999999999997, 812.529999999999, 0.8932733396915672, 1.3332132022093888, 0.7076254983216993], "isController": false}, {"data": ["confirmation_4", 458, 1, 0.2183406113537118, 372.85589519650654, 224, 1005, 360.0, 531.2, 599.0, 770.0599999999979, 0.8942151309790874, 1.338102323080122, 0.6961383341533559], "isController": false}, {"data": ["confirmation_5", 458, 1, 0.2183406113537118, 381.41048034934465, 217, 1152, 369.5, 533.1, 601.05, 778.3999999999987, 0.8964765340416411, 1.3438699196400783, 0.6984474153142854], "isController": false}, {"data": ["confirmation_1", 458, 0, 0.0, 384.71397379912634, 224, 1491, 365.0, 542.1, 627.0999999999999, 857.0199999999993, 0.8899822586506081, 1.3315633124974497, 0.6914862624777262], "isController": false}, {"data": ["purchase_19", 458, 1, 0.2183406113537118, 370.5021834061137, 143, 1290, 351.0, 495.30000000000007, 577.05, 850.239999999998, 0.9139636889011282, 1.555089947097866, 0.6136191845817519], "isController": false}, {"data": ["purchase_17", 458, 0, 0.0, 369.1397379912664, 218, 1157, 355.0, 496.5000000000001, 582.2999999999997, 845.0599999999979, 0.9123560499365534, 1.5468900803939067, 0.613880193756138], "isController": false}, {"data": ["purchase_18", 458, 0, 0.0, 372.23580786026173, 219, 1760, 352.0, 496.4000000000001, 555.1999999999998, 948.7699999999842, 0.9120108644787698, 1.5513938906224176, 0.6136479351815161], "isController": false}, {"data": ["purchase_15", 458, 0, 0.0, 376.82969432314417, 223, 1508, 354.0, 529.3000000000001, 614.05, 899.41, 0.9103702702487816, 1.5436823837638047, 0.6125440587904399], "isController": false}, {"data": ["purchase_16", 458, 0, 0.0, 368.28820960698727, 217, 1724, 349.0, 498.70000000000016, 550.0, 798.8199999999968, 0.9104372285336594, 1.5495168271858941, 0.6125891117770422], "isController": false}, {"data": ["purchase_13", 458, 0, 0.0, 373.88646288209605, 224, 1764, 356.5, 506.0, 580.2999999999997, 691.0499999999998, 0.9077701557678091, 1.5375275719080812, 0.6107945676992387], "isController": false}, {"data": ["purchase_14", 458, 0, 0.0, 372.92358078602604, 216, 1520, 356.5, 503.1, 587.3999999999996, 843.7799999999982, 0.9082165838761811, 1.5401621385972217, 0.6110949475495008], "isController": false}, {"data": ["purchase_11", 458, 0, 0.0, 370.2729257641923, 221, 1311, 346.0, 498.1, 617.0999999999999, 797.8199999999999, 0.9056502291809205, 1.5350589092846945, 0.6093681717828654], "isController": false}, {"data": ["purchase_12", 458, 0, 0.0, 361.06113537117886, 219, 792, 348.0, 492.20000000000005, 545.0, 672.4799999999991, 0.9067134409379138, 1.5404183477820166, 0.6100835554748268], "isController": false}, {"data": ["purchase_10", 458, 0, 0.0, 368.8034934497817, 214, 1114, 358.5, 502.1, 578.05, 718.4299999999993, 0.904995257666772, 1.532163809946056, 0.6089274731761777], "isController": false}, {"data": ["confirmation_19", 457, 0, 0.0, 382.25382932166315, 218, 3478, 356.0, 514.2, 583.4999999999998, 875.6800000000009, 0.9139104367771959, 1.3664481193343052, 0.7228100239926487], "isController": false}, {"data": ["confirmation_18", 458, 1, 0.2183406113537118, 373.4650655021835, 149, 1152, 358.5, 522.2, 574.2499999999998, 804.709999999999, 0.912441478234884, 1.3652594724325133, 0.7228216206793505], "isController": false}, {"data": ["confirmation_17", 458, 1, 0.2183406113537118, 374.0196506550215, 151, 1283, 362.5, 503.30000000000007, 565.3499999999997, 741.5099999999965, 0.9124905613012355, 1.3684867997680918, 0.7230686872040134], "isController": false}, {"data": ["confirmation_16", 458, 1, 0.2183406113537118, 378.9213973799127, 219, 2382, 353.5, 523.1, 578.3499999999997, 993.069999999996, 0.9103503656308947, 1.3659389982021575, 0.7135191656827727], "isController": false}, {"data": ["confirmation_15", 458, 1, 0.2183406113537118, 389.51965065502196, 219, 2534, 363.0, 542.5000000000001, 613.0999999999999, 991.7799999999982, 0.910469806395951, 1.3612318775756058, 0.7091496562380104], "isController": false}, {"data": ["confirmation_14", 458, 1, 0.2183406113537118, 382.7270742358081, 224, 1827, 365.0, 529.0, 591.4499999999996, 905.2499999999992, 0.9085318680446728, 1.3589040276427764, 0.7071946722937454], "isController": false}, {"data": ["confirmation_13", 458, 1, 0.2183406113537118, 371.6877729257642, 33, 1423, 359.0, 508.20000000000005, 577.3499999999997, 758.119999999999, 0.908303040038712, 1.3580620943127932, 0.7181216682333902], "isController": false}, {"data": ["confirmation_12", 458, 1, 0.2183406113537118, 382.393013100437, 224, 1325, 371.5, 519.0, 570.1499999999999, 789.3999999999955, 0.9065052638662647, 1.3534799015115677, 0.7084623775574631], "isController": false}, {"data": ["confirmation_11", 458, 1, 0.2183406113537118, 375.44104803493457, 218, 1310, 358.5, 521.5000000000001, 594.4499999999996, 808.8699999999998, 0.9060963667118396, 1.3551626812687327, 0.7024627076058679], "isController": false}, {"data": ["confirmation_10", 458, 1, 0.2183406113537118, 388.28384279475983, 223, 3277, 361.0, 526.1, 591.4999999999995, 1000.9899999999988, 0.9048075308434663, 1.356661457150054, 0.7085014619160979], "isController": false}, {"data": ["purchase_9", 458, 1, 0.2183406113537118, 364.9213973799125, 215, 1550, 354.5, 493.20000000000005, 549.1999999999998, 642.299999999999, 0.9029790422113129, 1.532138977814909, 0.6062442855276907], "isController": false}, {"data": ["purchase_8", 459, 1, 0.2178649237472767, 372.25490196078437, 5, 1087, 363.0, 513.0, 571.0, 788.3999999999993, 0.9028608296091144, 1.5317127253955671, 0.6061678094216183], "isController": false}, {"data": ["purchase_7", 458, 0, 0.0, 370.4650655021833, 219, 2691, 358.5, 497.5000000000001, 583.4499999999996, 745.6399999999999, 0.8999272984496886, 1.525450761892598, 0.6055174888982767], "isController": false}, {"data": ["purchase_6", 458, 0, 0.0, 373.82532751091685, 222, 1201, 366.5, 512.1, 569.1999999999998, 761.3499999999989, 0.8986347814826297, 1.522715667442344, 0.6046478168374335], "isController": false}, {"data": ["reserve_20", 459, 1, 0.2178649237472767, 730.7581699346413, 377, 2191, 721.0, 1061.0, 1155.0, 1328.5999999999992, 0.9149386153928954, 1.3653709220199213, 0.56256687000297], "isController": false}, {"data": ["purchase_1", 459, 1, 0.2178649237472767, 372.1895424836606, 145, 1505, 356.0, 508.0, 591.0, 708.1999999999996, 0.890066163523964, 1.512941666852501, 0.5975776541520907], "isController": false}, {"data": ["purchase_5", 458, 0, 0.0, 375.0414847161571, 220, 1669, 359.0, 517.1, 579.6499999999994, 718.2299999999999, 0.896308110805601, 1.5216761958521288, 0.6030823128369717], "isController": false}, {"data": ["purchase_4", 459, 1, 0.2178649237472767, 369.2483660130719, 107, 1310, 360.0, 501.0, 545.0, 847.1999999999996, 0.8957688096813288, 1.522513098057411, 0.601406328977438], "isController": false}, {"data": ["purchase_3", 459, 1, 0.2178649237472767, 377.7080610021785, 97, 2869, 359.0, 508.0, 584.0, 878.5999999999927, 0.8941459737132772, 1.5195702790943215, 0.6003167801881407], "isController": false}, {"data": ["purchase_2", 459, 1, 0.2178649237472767, 372.11982570806146, 193, 3292, 350.0, 508.0, 550.0, 727.5999999999992, 0.8919462500364357, 1.5211113074591192, 0.5988399172666414], "isController": false}, {"data": ["confirmation_20", 457, 0, 0.0, 371.09409190371963, 222, 985, 358.0, 514.2, 590.6999999999998, 740.4600000000003, 0.9132365342573608, 1.366913900604095, 0.7163581558317247], "isController": false}, {"data": ["reserve_6", 460, 2, 0.43478260869565216, 738.3847826086951, 367, 3141, 706.5, 1068.1000000000004, 1142.8, 2115.2299999999964, 0.9009203096815639, 1.3491809520475373, 0.5527432227780074], "isController": false}, {"data": ["reserve_15", 459, 1, 0.2178649237472767, 729.6688453159036, 378, 1797, 724.0, 1066.0, 1139.0, 1395.5999999999995, 0.9110233829334953, 1.348873452103789, 0.560159517167531], "isController": false}, {"data": ["reserve_5", 460, 2, 0.43478260869565216, 726.4565217391307, 380, 2406, 708.5, 1051.0, 1096.85, 1529.1599999999953, 0.8987569800202416, 1.3398050246865096, 0.5514159513244943], "isController": false}, {"data": ["reserve_14", 459, 1, 0.2178649237472767, 735.0675381263617, 377, 1921, 725.0, 1068.0, 1158.0, 1302.3999999999996, 0.9089162905918253, 1.347993001691099, 0.5588639326075204], "isController": false}, {"data": ["reserve_4", 460, 1, 0.21739130434782608, 730.2869565217387, 372, 2864, 708.5, 1053.4, 1132.75, 1939.6799999999944, 0.8969746604658418, 1.3362549754063198, 0.5515240190558366], "isController": false}, {"data": ["reserve_13", 460, 2, 0.43478260869565216, 731.8152173913041, 373, 1986, 720.5, 1062.0000000000005, 1170.6999999999998, 1361.7599999999989, 0.9108423906048587, 1.3610039661245834, 0.5588307345448857], "isController": false}, {"data": ["reserve_3", 460, 1, 0.21739130434782608, 736.3260869565217, 365, 2631, 710.0, 1064.8000000000002, 1162.9, 1602.969999999997, 0.8951889432489131, 1.3224694826926895, 0.5504260327026144], "isController": false}, {"data": ["reserve_12", 460, 2, 0.43478260869565216, 732.3282608695649, 368, 3080, 723.0, 1082.9, 1141.85, 1421.2399999999998, 0.9092130958310602, 1.3522151321719125, 0.5578311104555552], "isController": false}, {"data": ["reserve_11", 460, 2, 0.43478260869565216, 727.0978260869566, 373, 2841, 702.5, 1056.9, 1143.9, 1445.7099999999987, 0.9082078295412366, 1.3579446189426485, 0.5572143476599828], "isController": false}, {"data": ["reserve_9", 460, 2, 0.43478260869565216, 732.9260869565226, 375, 2393, 702.0, 1057.9, 1142.85, 1634.6699999999978, 0.906191454614583, 1.3508147227546643, 0.5559772376033993], "isController": false}, {"data": ["reserve_10", 460, 2, 0.43478260869565216, 733.0173913043479, 376, 2151, 720.5, 1085.6000000000001, 1158.6999999999998, 1405.1299999999992, 0.9073729973686183, 1.348838932416492, 0.55670215160822], "isController": false}, {"data": ["reserve_8", 460, 1, 0.21739130434782608, 737.0826086956519, 376, 2350, 719.5, 1078.8000000000002, 1147.3999999999999, 1817.7499999999995, 0.9041342521433878, 1.3486905992395444, 0.5559262468453576], "isController": false}, {"data": ["reserve_7", 460, 2, 0.43478260869565216, 735.3891304347825, 375, 2359, 713.5, 1068.5000000000002, 1155.55, 1899.2299999999977, 0.9025465547247331, 1.3464027173763757, 0.5537409757607389], "isController": false}, {"data": ["reserve_19", 459, 1, 0.2178649237472767, 726.2396514161223, 370, 1739, 712.0, 1044.0, 1114.0, 1426.3999999999983, 0.9148620232602175, 1.3623194318487588, 0.5625197759185993], "isController": false}, {"data": ["reserve_18", 459, 1, 0.2178649237472767, 732.8453159041396, 362, 1746, 732.0, 1057.0, 1126.0, 1452.9999999999995, 0.9130258352495604, 1.356803447319006, 0.5613907618792817], "isController": false}, {"data": ["reserve_17", 459, 1, 0.2178649237472767, 730.9259259259254, 374, 2817, 720.0, 1039.0, 1125.0, 1370.9999999999984, 0.9127534929226804, 1.3578416107961437, 0.5612233071803274], "isController": false}, {"data": ["reserve_16", 459, 1, 0.2178649237472767, 726.281045751634, 368, 1723, 712.0, 1052.0, 1119.0, 1339.6, 0.9111933854109799, 1.3570251316416369, 0.56026404632396], "isController": false}, {"data": ["reserve_2", 460, 1, 0.21739130434782608, 739.7195652173916, 376, 2634, 719.5, 1058.0, 1131.6, 1996.0299999999975, 0.8931171730899913, 1.327067001990098, 0.5491521605912048], "isController": false}, {"data": ["reserve_1", 460, 1, 0.21739130434782608, 731.2608695652165, 376, 2658, 702.5, 1051.2000000000003, 1158.6, 1388.739999999999, 0.8898225577755984, 1.3228497637376029, 0.5471263960300373], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 50, 100.0, 0.1817190623296384], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27515, 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 50, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["confirmation_6", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_7", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_8", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["purchase_20", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["confirmation_4", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_5", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["purchase_19", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["confirmation_18", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_17", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_16", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_15", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_14", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_13", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_12", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_11", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["confirmation_10", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["purchase_9", 458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["purchase_8", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["reserve_20", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["purchase_1", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["purchase_4", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["purchase_3", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["purchase_2", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["reserve_6", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_15", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_5", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_14", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_4", 460, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_13", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_3", 460, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_12", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_11", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_9", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_10", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_8", 460, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_7", 460, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_19", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_18", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_17", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_16", 459, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_2", 460, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["reserve_1", 460, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
