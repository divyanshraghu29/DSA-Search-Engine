// var fs = require('fs');

const fs = require('fs');
const { exit, mainModule } = require("process");

var strings = "";
var keyword = "";
var keywords = [];
var df = [];

fs.readFile("./keywords.txt", (err, data) => {
  if (err) {
    console.log(err);
  }
  strings = data.toString();
  for (var i = 0; i < strings.length; i++) {
    if (strings[i] == "\n") {
      keyword = keyword.replace(/[\r\n]+/gm, "");
      keywords.push(keyword);
      keyword = "";
    } else {
      keyword = keyword.concat(strings[i]);
    }
  }
  keywords.push(keyword);
});

keyword = "";

fs.readFile("./DF.txt", (err, data) => {
  if (err) {
    console.log(err);
  }
  strings = data.toString();
  for (var i = 0; i < strings.length; i++) {
    if (strings[i] == "\n") {
      keyword = keyword.replace(/[\r\n]+/gm, "");
      df.push(parseInt(keyword));
      keyword = "";
    } else {
      keyword = keyword.concat(strings[i]);
    }
  }
  df.push(parseInt(keyword));
});

let string = "";
let tfidf = [];
let tf_idf = [];
function csvToArray(csv) {
  rows = csv.split("\n");
  for (var j = 0; j < rows.length; j++) {
    row = rows[j];
    for (var i = 0; i < row.length; i++) {
      if (row[i] == " ") {
        tfidf.push(parseFloat(string));
        string = "";
      } else {
        string = string.concat(row[i]);
      }
    }
    tfidf.push(parseFloat(string));
    tf_idf.push(tfidf);
    tfidf = [];
  }
  return tf_idf;
}
var array;
fs.readFile("./tfidf_matrix.csv", (err, data) => {
  if (err) {
    console.log(err);
  }
  var csv = data.toString();

  array = csvToArray(csv);
  console.log(array);
});

let doc_freq = new Map();
setTimeout(function () {
  for (var i = 0; i < 15076; i++) {
    doc_freq.set(keywords[i], df[i]);
  }
  console.log(doc_freq);

  function calculateMagnitude(vector) {
    let magnitude = 0
    for (let i = 0; i < vector.length; i++){
      if (isNaN(vector[i]) && vector[i]>0) {
        magnitude += 0;
      } else {
        magnitude += vector[i] * vector[i];
      }
    }
    return Math.sqrt(magnitude);
  }

  function calculateTermFrequency(term, doc) {
    let numOccurences = 0;
    for (let i = 0; i < doc.length; i++){
      if (doc[i].toLowerCase() == term.toLowerCase()){
        numOccurences++;
      }
    }
    return (numOccurences * 1.0 / (doc.length))
  }

  function createVectorSpaceModel(query) {
    query = Array.isArray(query) ? query: query.split(" ");
    let termFrequencyModel = new Map();
    let tidf_query = new Map();
    for (let i = 0; i < query.length; i++){
      // termFrequencyModel.set(query[i], calculateTermFrequency(query[i], query));
      for (let j = 0; j < keywords.length; j++) {
        if (query[i].toLowerCase() == keywords[j].toLowerCase()){
          var tidf_value=calculateTermFrequency(query[i], query)*(Math.log((1843+1) / (df[j] + 1)));
          tidf_query.set(query[i],tidf_value);
        }
        
      }
    }
    return tidf_query
  }

  // var s=;
  const { StemmerEn, StopwordsEn } = require('@nlpjs/lang-en');

  const stemmer = new StemmerEn();
  stemmer.stopwords = new StopwordsEn();
  const input = "Rooks Defenders";
  console.log(stemmer.tokenizeAndStem(input, false));
  // output: ['develop']
  var q=stemmer.tokenizeAndStem(input, false)

  let tf_idf_query = createVectorSpaceModel(stemmer.tokenizeAndStem(input, false));
  console.log(tf_idf_query)
  let ranking = [];
  for(let i = 0; i < array.length; i++) {
    var si = 0;
    for (let k = 0; k < q.length; k++){
      for (let j = 0; j < keywords.length; j++) {
        if (q[k].toLowerCase() == keywords[j].toLowerCase()){
            var toAdd = tf_idf_query.get(q[k]) * array[i][j];
            if (isNaN(toAdd)) {
              si += 0;
            } else {
              si += toAdd;
            }
          }
      }
        
    }
    // let query_mag = calculateMagnitude(q);
    let doc_mag = calculateMagnitude(array[i]);
    let similarity = 1.0 * si / (q.length * doc_mag);
    ranking.push({
      similarityIndex: similarity,
      index: i,
      });
  }
    
  // }
  ranking.sort((a, b) => {
    return b.similarityIndex - a.similarityIndex;
  })

  for (let i = 0; i < 10; i++) {
    console.log(ranking[i]);
    
  }


}, 1000);
// TfIdf = require('tf-idf-search');
// tf_idf = new TfIdf();



// module.exports = TfIdf