var electron = require('electron')
var request = require('request')
var client = require('cheerio-httpcli');

var lastSubmission = "1111-11-11 11:11";

function hukidasi(){
    setInterval('defaultSay()', 60000);
    aojCheck(false);
    setTimeout(setInterval('aojCheck(true)', 6000), 30000);
}

function say(str, time){
    document.getElementById("box").innerText = str;
    electron.ipcRenderer.send('show', time);
    ipcRenderer.on('reply', (event, arg) => {
        console.log(arg)
    })
}
function test(memo){
    electron.ipcRenderer.send('test', memo);
}

// 定期的に何か発言する
function defaultSay(){
    var ary = ['今日もがんばえぇ〜',
               'あ、カステラの紙まで一緒に食べちゃった☆' ,
               'お兄ちゃんだ～い好き☆',
               'お兄ちゃん、寂しいよぉ…ぎゅーってしてくれる？',
               'どうしたの？寂しいって？それじゃ抱きしめてあげる♪',
               'いい子いい子して～',
               '愛さえあれば関係ないよね？',
               'おにーちゃーん！'];
    var random = ary[Math.floor(Math.random() * ary.length)];
    say(random, 5000);
}

// AOJの提出結果
var Aoj = function(id, author, problem, status, percent, language, time, memory, size, date) {
    this.id = id;
    this.author = author;
    this.problem = problem;
    this.status = status;
    this.percent = percent;
    this.language = language;
    this.time = time;
    this.memory = memory;
    this.size = size;
    this.date = date;
};

function aojSay(result){
    switch(result.status){
        case "Accepted":
            say(result.problem + "の問題をACしたね!おめでとう!!",6000);
            break;
        case "Compile Error":
            say("Compile Errorが出てるよ。お兄ちゃん大丈夫?", 6000);
            break;
        case "Wrong Answer":
            say("はいプロ 世界一WAが上手 WA界のtourist AC時代の終焉を告げる者 実質CE", 10000);
            break;
        case "Runtime Error":
            say("REを出すなんてお兄ちゃんらしくないよ〜。バグを一緒に探そっか♪", 6000);
            break;
        case "Time Limit Exceeded":
            say("はい時間切れだよ〜。嘘解法投げたんじゃないのお兄ちゃん!ダメだよ!", 8000);
            break;
        case "Presentation Error":
            say("Presentation Errorなんてエラー出す人見たことないよ!大丈夫?", 6000);
            break;
        case "Memory Limit Exceeded":
            say("う〜メモリが足りない見たいだよぅ....頑張ってメモリ節約しよ☆", 6000);
            break;
        case "Output Limit Exceeded":
            say("出力しすぎだよ~。ちゃんとサンプル通ったの?お兄ちゃん!", 6000);
            break;
        default:
            say("未対応の結ががきちゃった。てへっ!", 6000);
            break;
    }
}

// aojのsubmissionをみて反応
function aojCheck(isSay){
    client.fetch('http://judge.u-aizu.ac.jp/onlinejudge/status.jsp', {}, function (err, $, res, body) {
        $('tr').each(function (idx) {
            if($(this).attr('class') === 'dat'){

                var id = $(this).attr('id');
                var row = [];
                $("#" + id + " > td").each(function (idx2){
                    row.push($(this).text());
                });
                result = new Aoj(row[0], row[1], row[2], row[3].substring(2), row[4], row[5], row[6], row[7], row[8], row[9]);
                
                if(result.author === "base64g"){
                    test(result);
                    if(lastSubmission < result.date){
                        lastSubmission = result.date;
                        if(isSay){
                            test(result.status);
                            aojSay(result);
                        }
                    }
                }
            }
        });
    });
}
