# DSA-Search-Engine
# INTRODUCTION
This repository is a part of a project whose problem statement is based on creating a Search Engine for Data Structures and Algorith Problems with the help of Tf-Idf Algorithm.
# TF-IDF
This Algorithm is based on the vector space model wherein each document is tokenized into a vector who's indices correspond to a unique term in an input query/document. Subsequently, we caclulate the TF-IDF for each term formula in the document vector, where TF-IDF is defined to be:
![image](https://user-images.githubusercontent.com/72646890/170714852-db0a93f6-98d2-4229-9791-f31b4c0a5dc8.png)
Ranking the similarity measure for each document, one can determine which is the most relevant to a given query.
# Data Scrapping
Use scrapper.py and scrap data from different websites
# TF-IDF Matrix
Use tf-idf-vector.py to make keywords.txt, df.txt and tf-idf-mat.txt file to use them in our app.js file
doc = 0

tf_idf = {}

for i in range(1843):
    
    tokens = processed_text[i]
    
    counter = Counter(tokens)
    words_count = len(tokens)
    
    for token in np.unique(tokens):
        
        tf = counter[token]/words_count
        df = doc_freq(token)
        idf = np.log((1843+1)/(df+1))
        
        tf_idf[doc, token] = tf*idf

    doc += 1
Using this code we can create tf-idf matrix and than transfer it to a txt file.
# Top 10 Search Results
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
Using above code we can find top 10 results for our query after doing preprocessing on our query and finding it's tf-idf values.
# Packages
Apart from package.json install-
node - 16.15.0
npm - 8.5.5
