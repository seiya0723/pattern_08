window.addEventListener("load" , function (){

    //canvas取得
    const canvas        = document.querySelector('#canvas');
    const ctx           = canvas.getContext('2d');

    //TODO:ここは新規作成時にのみコントローラを2個追加する。
    //解決策:新規作成時のみこの部分のスクリプトを読み込ませるか、JavaScriptがアクセスしているURLを判定して分岐させるか、個数を判定して分岐か

    // 読み込み時コントローラ2個を追加する。
    function control_add() {
        let init            = $("#init_control").clone();
        let control_area    = $("#control_area");

        init.removeAttr("id");
        control_area.append(init);
    }

    //↑とりあえずコントローラが0個のときだけ(新規作成時のみ)追加している。
    if ( Number($("#control_area > .control").length) == 0){
        control_add();
        control_add();
    }


    function linear(x,b){
        return -x+b;
    }

    //垂直方向への平行四辺形の描画
    function draw_para_vertical(color,x_start,x_end,b,size){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle   = color;

        //一次関数(y=1x+b)で平行四辺形を描画
        ctx.moveTo(x_start, linear(x_start, b) );
        ctx.lineTo(x_end,   linear(x_end,   b) );
        ctx.lineTo(x_end,   linear(x_end,   b+size) );
        ctx.lineTo(x_start, linear(x_start, b+size) );
        
        ctx.fill();
        ctx.closePath();
    }

    //水平方向の背景ベタ塗り
    function draw_horizontal(color,y_start,y_end){
        ctx.beginPath();
        ctx.fillStyle   = color;

        ctx.moveTo( 0 ,y_start);
        ctx.lineTo( 0 ,y_end);
        ctx.lineTo( 300  ,y_end);
        ctx.lineTo( 300  ,y_start);

        ctx.fill();
        ctx.closePath();
    }

    //描画開始
    function draw(){
        //canvasの全領域を初期化してから描画開始
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //コントローラを全て取得、ループで順次描画させる
        let controls    = document.querySelectorAll("#control_area > .control");
        let size        = Number($("[name='size']").val());

        //色と本数の配列を作る
        let colors      = [];
        let numbers     = [];
        
        //コントローラの上から順に追加していく。
        for (let control of controls){
            //色と本数を取得し、配列へ追加していく
            colors.push($(control).find("[name='color']").val());
            numbers.push($(control).find("[name='number']").val());
        }
        let length      = colors.length;

        let y_start     = 0;
        let y_end       = 0;

        let x_start     = 0;
        let x_end       = 0;

        //水平方向に描画するループ(背景ベタ塗り)
        while (y_start < 300){
            for (let i=0;i<length;i++){
                //線の太さを考慮して描画する領域を決定
                let b   = -300;
                y_end   = y_start + numbers[i]*2*size;

                while (b < 600){
                    //背景ベタ塗り
                    draw_horizontal(colors[i],y_start,y_end);
                    b += size*2;
                }
                y_start   = y_end;
            }
            //色と本数を逆順にして描画
            colors.reverse();
            numbers.reverse();
        }

        //垂直方向に描画するループ
        while (x_start < 300){
            for (let i=0;i<length;i++){
                //線の太さを考慮して描画する領域を決定
                let b   = -300;
                x_end   = x_start + numbers[i]*2*size;

                while (b < 600){
                    //平行四辺形を描画する。←ただの線だと表現できない
                    draw_para_vertical(colors[i],x_start,x_end,b,size)
                    b += size*2;
                }
                x_start = x_end;
            }
            //色と本数を逆順にして描画
            colors.reverse();
            numbers.reverse();
        }
    }

    draw();

    $(document).on("input", "[name='color']"    ,function() { draw(); });

    //テキストボックス、スライダーの双方を同期させ、描画する必要があるため、以下のイベントは廃止
    /*
    $(document).on("input", "[name='number']"   ,function() { draw(); });
    $(document).on("input", "[name='size']"     ,function() { draw(); });
    */

    $("#control_add").on("click",function() { control_add();draw(); });

    //削除処理
    $(document).on("click", ".control_delete", function(){ control_delete(this);draw(); });


    function control_delete(elem){
        //コントローラが2個以下の場合は削除しない
        if ( Number($("#control_area > .control").length) > 2){
            $(elem).parent().remove();
        }
    }

    //糸の太さと本数を同期させた上で描画する。
    $(document).on("input", ".number" , function(){ synchro_slider(this);draw(); });
    $(document).on("input", ".size" , function(){ synchro_slider(this);draw(); });


    //スライダーとテキストボックスの同期
    function synchro_slider(elem){

        let type    = $(elem).prop("type");

        if (type === "number"){
            //そのコントローラのrangeに対して値を入れて同期させる。
            $(elem).parent().find("[type='range']").val($(elem).val());
        }
        else if (type === "range"){
            //そのコントローラのnumberに対して値を入れて同期させる。
            $(elem).parent().find("[type='number']").val($(elem).val());
        }

    }


});


