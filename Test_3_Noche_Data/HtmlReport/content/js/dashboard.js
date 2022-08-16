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

    var data = {"OkPercent": 91.10084082008754, "KoPercent": 8.899159179912463};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.38196844045150885, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5430937554056392, 500, 1500, "/purchase.php-29"], "isController": false}, {"data": [0.5886294949848889, 500, 1500, "/confirmation.php-30"], "isController": false}, {"data": [0.022658610271903322, 500, 1500, "/reserve.php-26"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 69456, 6181, 8.899159179912463, 7321.107175765962, 12, 240017, 4646.0, 28165.400000000023, 46391.600000000035, 142411.82000000004, 68.89553482420509, 113.20244091658111, 43.69396560542487], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/purchase.php-29", 23124, 1307, 5.652136308597129, 5839.84526898461, 22, 240017, 1004.0, 15333.800000000003, 27457.95, 105739.38000000027, 22.950198149414486, 40.00569895121743, 14.526978403487886], "isController": false}, {"data": ["/confirmation.php-30", 22831, 803, 3.517147737725023, 6307.979720555391, 35, 240011, 935.0, 14306.100000000028, 32087.15000000004, 131060.65000000053, 22.6725416067107, 34.89228818847574, 17.31840793599781], "isController": false}, {"data": ["/reserve.php-26", 23501, 4071, 17.32266712054806, 9762.850644653397, 12, 160630, 7731.5, 23605.0, 29413.150000000012, 48096.840000000026, 23.311362069564098, 38.36641945120197, 11.876364292108695], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&Atilde;&sup3;n ya que la parte conectada no respondi&Atilde;&sup3; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&Atilde;&sup3;n establecida ya que el host conectado no ha podido responder", 154, 2.491506228765572, 0.2217231052752822], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, 0.16178611875101118, 0.014397604238654688], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1000, 16.178611875101115, 1.4397604238654689], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 3457, 55.929461252224556, 4.977251785302926], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to blazedemo.com:443 [blazedemo.com/216.239.38.21, blazedemo.com/216.239.34.21, blazedemo.com/216.239.32.21, blazedemo.com/216.239.36.21] failed: Connection timed out: connect", 1, 0.016178611875101116, 0.0014397604238654688], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1559, 25.22245591328264, 2.2445865008062658], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 69456, 6181, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 3457, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1559, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1000, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&Atilde;&sup3;n ya que la parte conectada no respondi&Atilde;&sup3; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&Atilde;&sup3;n establecida ya que el host conectado no ha podido responder", 154, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/purchase.php-29", 23124, 1307, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 683, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 293, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 260, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&Atilde;&sup3;n ya que la parte conectada no respondi&Atilde;&sup3; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&Atilde;&sup3;n establecida ya que el host conectado no ha podido responder", 71, "", ""], "isController": false}, {"data": ["/confirmation.php-30", 22831, 803, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 330, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 293, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 119, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&Atilde;&sup3;n ya que la parte conectada no respondi&Atilde;&sup3; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&Atilde;&sup3;n establecida ya que el host conectado no ha podido responder", 58, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3], "isController": false}, {"data": ["/reserve.php-26", 23501, 4071, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 2481, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1180, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 377, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Se produjo un error durante el intento de conexi&Atilde;&sup3;n ya que la parte conectada no respondi&Atilde;&sup3; adecuadamente tras un periodo de tiempo, o bien se produjo un error en la conexi&Atilde;&sup3;n establecida ya que el host conectado no ha podido responder", 25, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
