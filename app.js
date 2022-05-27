const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { result } = require('lodash');
const Question = require('./models/question');
const { json } = require('express/lib/response');

const app = express();


const dbUI = 'mongodb+srv://hackathon:gayatrima@cluster0.vy5ek.mongodb.net/search-engine?retryWrites=true&w=majority';

const PORT= process.env.PORT || 3000;

mongoose.connect(dbUI,{useNewUrlParser:true , useUnifiedTopology: true})
    .then((result) =>{ app.listen(PORT)})
    .catch((err) =>{ console.log(err)});

app.use(morgan('dev'));

app.set('view engine','ejs');


app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

var keywords = [];
var problem_url = [];
var problem_title = [];
var df = [];

let array=[];
const fs = require('fs');
const { exit, mainModule } = require("process");

var strings = "";
var keyword = "";
var url = ""
var titles = ""

fs.readFile("problem_titles.txt", (err, data) => {
    if (err) {
        console.log(err);
    }
    strings = data.toString();
    for (var i = 0; i < strings.length; i++) {
        if (strings[i] == "\n") {
        titles = titles.replace(/[\r\n]+/gm, "");
        problem_title.push(titles);
        titles = "";
        } else {
        titles = titles.concat(strings[i]);
        }
    }
    problem_title.push(titles);
    });

fs.readFile("./problem_urls.txt", (err, data) => {
    if (err) {
        console.log(err);
    }
    strings = data.toString();
    for (var i = 0; i < strings.length; i++) {
        if (strings[i] == "\n") {
        url = url.replace(/[\r\n]+/gm, "");
        problem_url.push(url);
        url = "";
        } else {
        url = url.concat(strings[i]);
        }
    }
    problem_url.push(url);
});


fs.readFile("keywords.txt", (err, data) => {
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

fs.readFile("DF.txt", (err, data) => {
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
// console.log(array);
});

app.get('/',(req,res) => {

    // res.sendFile('index.html',{root: __dirname});
    // document.body.style.backgroundImage=url("../Images/s.jpg");
    res.render('index',{title: 'Home',});
    
    // Question.find()
    //     .then((result) =>{ 
    //         res.render('index',{title: 'Home',});
    //     })
    //     .catch((err) =>{ 
    //         console.log(err)
    //     });
})

app.get('/search',(req,res) => {
    res.render('search',{title: 'Results',});
    // const question = new Question({
    //     body: 'sum of subarray'
    // });

    // question.save()
    //     .then((result) =>{ 
    //         res.send(result)
    //     })
    //     .catch((err) =>{ 
    //         console.log(err)
    //     });
})

app.post('/search',(req,res) => {
    console.log(req.body)
    const question_body = new Question(req.body);
    // question=String(question)
    const question=question_body.body;
    console.log(question)

    var fs = require('fs');
    
    let doc_freq = new Map();
    // setTimeout(function () {
    for (var i = 0; i < 15076; i++) {
        doc_freq.set(keywords[i], df[i]);
    }
    // console.log(doc_freq);

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
    // const input = question;
    console.log(stemmer.tokenizeAndStem(question.toString(), false));
    // output: ['develop']
    var q=stemmer.tokenizeAndStem(question.toString(), false)

    let tf_idf_query = createVectorSpaceModel(stemmer.tokenizeAndStem(question.toString(), false));
    // console.log(tf_idf_query)
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
    // var pro_1="";
    var statements=[];
    for (let i = 0; i < 10; i++) {
        if (ranking[i].index < 900) {
            statements[i]=fs.readFileSync("problems-1/problem"+String(ranking[i].index+1)+".txt").toString()
        }
        else{
            statements[i]=fs.readFileSync("problems-2/problem"+String(ranking[i].index+1)+".txt").toString()
        }
        
        
        
        
    }
    
    
    //   res.json(arr);
    
    
    res.render('search',{title_1: String(problem_title[ranking[0].index]),url_1: String(problem_url[ranking[0].index]),statement_1: String(statements[0]),
        title_2: String(problem_title[ranking[1].index]),url_2: String(problem_url[ranking[1].index]),statement_2: String(statements[1]),
        title_3: String(problem_title[ranking[2].index]),url_3: String(problem_url[ranking[2].index]),statement_3: String(statements[2]),
        title_4: String(problem_title[ranking[3].index]),url_4: String(problem_url[ranking[3].index]),statement_4: String(statements[3]),
        title_5: String(problem_title[ranking[4].index]),url_5: String(problem_url[ranking[4].index]),statement_5: String(statements[4]),
        title_6: String(problem_title[ranking[5].index]),url_6: String(problem_url[ranking[5].index]),statement_6: String(statements[5]),
        title_7: String(problem_title[ranking[6].index]),url_7: String(problem_url[ranking[6].index]),statement_7: String(statements[6]),
        title_8: String(problem_title[ranking[7].index]),url_8: String(problem_url[ranking[7].index]),statement_8: String(statements[7]),
        title_9: String(problem_title[ranking[8].index]),url_9: String(problem_url[ranking[8].index]),statement_9: String(statements[8]),
        title_10: String(problem_title[ranking[9].index]),url_10: String(problem_url[ranking[9].index]),statement_10: String(statements[9]),
    });

    // question_body.save()
    //   .then((result) =>{ 
    //       res.redirect('/search')
    //   })
    //   .catch((err) =>{ 
    //       console.log(err)
    //   });
    // }, 2000);
    // TfIdf = require('tf-idf-search');
    // tf_idf = new TfIdf();
    


    // module.exports = TfIdf
    
    
})