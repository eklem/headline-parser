var sw = require('stopword')

var findKeywords = function( headline, body, n, keywordArgs, returnNonMatched ){
  keywordArgs = keywordArgs || { language:'en', return_changed_case:true };
  
  // Set returnNonMatched to false if not given
  returnNonMatched = returnNonMatched || false;

  // Extract keywords from headline. Returns an array
  var stopwordWrapper = function(headline, keywordArgs){
    var languageArray = sw[keywordArgs.language]
    var newArray = sw.removeStopwords(headline, languageArray)
    if (newArray === ['']) {
      newArray === []
    }
    return newArray
  }

  keywordArray = stopwordWrapper(headline, keywordArgs)

  // if no N is given, set n to max length. // todo: just set to infinity?
  n = n || keywordArray.length;

  // Create object to track each mention of keyword in summary
  keywordCount = {};
  keywordArray.map(function(word){ keywordCount[word] = 0; });

  // Iterate over summary to count mentions of each keyword
  for ( var i = 0; i < body.length; i++ ) {
    for (word in keywordCount) {
      // console.log(word, body[i]);
      if (word === body[i]){
        keywordCount[word] += 1;
      }
    }
  }

  // If no keywords have been mentioned, and 'returnNonMatched == true' return non matched keywords from headline
  var aboveZero = Object.keys(keywordCount).filter(function(key){ return keywordCount[key] > 0; })

  if (Object.keys(keywordCount).length > 1 && aboveZero.length < 1 && !returnNonMatched) {
    return [];
  }
  else if (Object.keys(keywordCount).length > 1 && aboveZero.length < 1 && returnNonMatched) {
    var nonMatchedKeys = keywordArray;
    return nonMatchedKeys;
  } 
  else {
    // Sort keywords by highest number of mentions
    var sortedKeys = Object.keys(keywordCount).sort(function(a,b){return keywordCount[a] - keywordCount[b];});

    // Return last n important words, will return maximum if n is greater than max.
    return sortedKeys.slice(-n);
  }
}

module.exports = {
  findKeywords: findKeywords
}
