//Ajax実行前にセッションIDを送信するスクリプト。これを事前に実行していなければPUT、PATCH、DELETEが実行できない。(Forbiddenになってしまう)
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }   
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }   
});



window.addEventListener("load" , function (){

    //送信処理
    $("#pattern_submit").on("click", function(){ send(); });

    
    //編集処理
    $("#pattern_mod_submit").on("click", function(){ edit(); });


});

function send(){

    let form_elem   = "#pattern_form";

    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    let method  = $(form_elem).prop("method");

    //===================canvasの画像化処理==================================================

    //TODO:何も描いていない場合、そのまま送信されてしまう問題がある。
    let context = document.getElementById('canvas').getContext('2d');
    var base64  = context.canvas.toDataURL('image/png');

    // Base64からバイナリへ変換
    var bin     = atob(base64.replace(/^.*,/, ''));
    var buffer  = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }

    //ファイル名は日付
    let dt          = new Date();
    let filename    = dt.toLocaleString().replace(/\/| |:/g,"");

    //バイナリでファイルを作る
    var file    = new File( [buffer.buffer], filename + ".png", { type: 'image/png' });

    data.append("img",file);
    for (let v of data.entries() ){ console.log(v); }

    //===================canvasの画像化処理==================================================

    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done( function(data, status, xhr ) {

        //バリデーションの結果に寄らず、正常に通信と処理を完了した場合、doneが実行される

        console.log("リダイレクト");
        if (!data.error){
            //リダイレクト
            //window.location.replace("");
        }
        else{
            console.log("正常な値を入力してください");
        }

    }).fail( function(xhr, status, error) {
        //ネットに繋がっていない時、サーバー側でエラーが発生した時にこのfailが実行される。
        console.log(status + ":" + error );
    });

}

function edit(){

    let form_elem   = "#pattern_form";

    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    //TODO:methodはPUTで直接指定する。仮にformタグにmethod="PUT"としても.prop("method")でPUTは取れないので直接文字列で指定する。
    let method  = "PUT";

    //===================canvasの画像化処理==================================================

    //TODO:何も描いていない場合、そのまま送信されてしまう問題がある。
    let context = document.getElementById('canvas').getContext('2d');
    var base64  = context.canvas.toDataURL('image/png');

    // Base64からバイナリへ変換
    var bin     = atob(base64.replace(/^.*,/, ''));
    var buffer  = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }

    //ファイル名は日付
    let dt          = new Date();
    let filename    = dt.toLocaleString().replace(/\/| |:/g,"");

    //バイナリでファイルを作る
    var file    = new File( [buffer.buffer], filename + ".png", { type: 'image/png' });

    data.append("img",file);
    for (let v of data.entries() ){ console.log(v); }

    //===================canvasの画像化処理==================================================

    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done( function(data, status, xhr ) {

        //バリデーションの結果に寄らず、正常に通信と処理を完了した場合、doneが実行される
        console.log("リダイレクト");
        if (!data.error){
            //リダイレクト
            //window.location.replace("");
        }
        else{
            console.log("正常な値を入力してください");
        }

    }).fail( function(xhr, status, error) {
        //ネットに繋がっていない時、サーバー側でエラーが発生した時にこのfailが実行される。
        console.log(status + ":" + error );
    });

}

