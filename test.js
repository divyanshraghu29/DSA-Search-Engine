let array=[];
const fs = require('fs');
for (let i = 0; i < 1843; i++) {
    array[i]=[]
    for (let j = 0; j < 15076; j++) {
        array[i][j]=0.000000000000000;
    }
    
}
// console.log(array)


function csvToArray(csv) {
rows = csv.split("\n");
for (var j = 0; j < rows.length; j++) {
    row = rows[j];
    elements=row.split(' ')
    
    array[parseInt(elements[0])][parseInt(elements[1])]=parseFloat(elements[2])
}
}

fs.readFile("tfidf_mat.txt", (err, data) => {
if (err) {
    console.log(err);
}
var csv = data.toString();

csvToArray(csv);
console.log(array);
});


// let string = "";
// let tfidf = [];
// let tf_idf = [];
// function csvToArray(csv) {
// rows = csv.split("\n");
// for (var j = 0; j < rows.length; j++) {
//     row = rows[j];
//     for (var i = 0; i < row.length; i++) {
//     if (row[i] == " ") {
//         tfidf.push(parseFloat(string));
//         string = "";
//     } else {
//         string = string.concat(row[i]);
//     }
//     }
//     tfidf.push(parseFloat(string));
//     tf_idf.push(tfidf);
//     tfidf = [];
// }
// return tf_idf;
// }

// fs.readFile("tfidf_matrix.csv", (err, data) => {
// if (err) {
//     console.log(err);
// }
// var csv = data.toString();

// array = csvToArray(csv);
// console.log(array);
// });