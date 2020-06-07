// ECMAScript5.1

function transform(line) {
    var values = line.split(',');

    var obj = new Object();
    obj.location = values[0];
    obj.name = values[1];
    obj.age = values[2];
    // timestamp of input data is JST.
    // BigQueryIO in Apache beam can't support timestamp JST.
    // so convert timestamp JST to UST
    obj.createdAt = convert_JST2UST(values[3]);

    var jsonString = JSON.stringify(obj);

    return jsonString;
}

function convert_JST2UST(input) {
    //eg. 2001/09/09 10:23:14.009
    var year = input.substring(0,4);
    var month = input.substring(5,7);
    var day = input.substring(8,10);
    var hour = input.substring(11,13);
    var minute = input.substring(14,16);
    var second = input.substring(17,19);
    var millsec = input.substring(20,24);
    var TIMEZONE = "+09:00"; // Japan/Tokyo
    var jst = year+"-"+month+"-"+day+"T"+hour+":"+minute+":"+second+"."+millsec+TIMEZONE;
    var ust = new Date(jst);
    return ust.toISOString();
}

// test
// var text = 'Tokyo,jiro,21,2001/09/09 10:23:14.009';
// console.log(transform(text));