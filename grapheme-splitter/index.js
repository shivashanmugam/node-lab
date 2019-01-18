var langText = {
    'tamil' :['சிங்கம் காட்டில் அரசன்', 'பசிபிக் கடல் உலகிலேயே மிகப் பெரிய கடல் ஆகும்'],    
    'urdu' : ['شیر جنگل کا بادشاہ ہے', 'دنیا میں پیسیفٹی سمندر کا سب سے بڑا سمندر ہے'],
    'hindi' : ['जंगल का राजा शेर है', 'प्रशांत महासागर दुनिया का सबसे बड़ा महासागर है'],// the length is invalid for the secnond one in array
    'telugu' : ['సింహం అడవి రాజు','పసిఫిక్ సముద్రం ప్రపంచంలోనే అతిపెద్ద సముద్రం'],
    'kannanda' : ['ಸಿಂಹ ಕಾಡಿನ ರಾಜ', 'ಪೆಸಿಫಿಕ್ ಸಮುದ್ರವು ವಿಶ್ವದಲ್ಲೇ ಅತಿ ದೊಡ್ಡ ಸಾಗರವಾಗಿದೆ'],
    'marathi' : ['शेर जंगलचा राजा आहे', 'पॅसिफिक समुद्र जगातील सर्वात मोठे महासागर आहे'],
    'malayalam' : ['സിംഹം കാട്ടിലെ രാജാവ്', 'പസിഫിക് സമുദ്രം ലോകത്തിലെ ഏറ്റവും വലിയ സമുദ്രമാണ്'],
    'bengali' : ['সিংহ জঙ্গলের রাজা', 'প্রশান্ত মহাসাগর বিশ্বের বৃহত্তম সমুদ্র'],
    'gujrati' : ['સિંહ જંગલનો રાજા છે', 'પેસિફિક દરિયામાં વિશ્વનું સૌથી મોટું સમુદ્ર છે']
}

var GraphemeSplitter =  require('grapheme-splitter')
// var beforeSplitString = "க,கா,கி,கீ,கு,கூ,கெ,கே,கை,கொ,கோ,கௌ   ர்,ச,சி,சீ,சு";
// var string  = beforeSplitString.split(",").join("").split(" ").join("");
// var jsLength = string.length
// console.log(string);
// console.log(jsLength)
// var splitter = new GraphemeSplitter();
// var graphemeCount = splitter.countGraphemes(string);
// console.log(graphemeCount);
// or do this if you just need their number



var splitter = new GraphemeSplitter();
Object.keys(langText).forEach(function(language){
    console.log(language);
    langText[language].forEach(function(sentence){
        console.log(`"${sentence}" character length is ${splitter.countGraphemes(sentence)} `)
    })
})
