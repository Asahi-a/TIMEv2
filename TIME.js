//加速度　Ak(m/s/s)
//減速度 -Ag(m/s/s)
//初速度　Vz(m/s)
//終速度　Vf(m/s)
//制限速度Vh(m/s)
//駅間距離Xe(m/s)
//所要時間Ts(s)

/*var Ak = hAk/3.6;
var Ag = hAg/3.6;
var Vz = hVz/3.6;
var Vf = hVf/3.6;
var Vh = hVh/3.6;
var Xe = hXe;
var Ts; //この段階ではまだ宣言だけ(終盤で値決定):*/

var Ak;
var Ag;
var Vz;
var Vf;
var Vh;
var Xe;
var Ts; 
var Err = 0;
//ver2.0勾配アプデに必要な3変数
var S;
var K;
var t;

//仮動作用　内部計算ではm/s/sやm/sを使うので3.6で変換
Ak = prompt('加速度km/h/s')/3.6;
Ag = prompt('減速度km/h/s(正の数で)')/3.6;
Vz = prompt('初速度km/h')/3.6;
Vf = prompt('終速度km/h')/3.6;
Vh = prompt('最高速度(制限速度)km/h')/3.6;
Xe = prompt('駅間距離m');
S = prompt('勾配‰(Ver2.0β)')
K = prompt('動力集中方式→31、動力分散方式→30(ver2.0β)')
t = prompt('空走時間s 参考)電車:新式は2秒､旧式は4秒、客車列車:5両で6秒､10両で8秒､15両で11.3秒(いずれも機関車含む)、気動車:電磁式ブレーキがある時4秒､ない時客車列車と同じ(ver2.0β)')


//Vz>Vfの時に所定キョリ内で減速しきるのか。

if (Vz>Vf) {
    if (  Xe<((Vz*Vz)-(Vf*Vf))/(2*Ag)  ) {
        Err = 1;
};}


if (Err == 0) {    
//加速にかかる距離Xk(m)と減速にかかる距離Xg(m)を変数にする。
var Xk = ((Vh*Vh)-(Vz*Vz))/(2*Ak);
var Xg = ((Vh*Vh)-(Vf*Vf))/(2*Ag);

//制限速度まで加速しきる時
if (Xk+Xg<=Xe) {Ts = (Vh-Vz)/Ak + (Vh-Vf)/Ag + (Xe-Xk-Xg)/Vh;}
else{
    //加速しきらない時制限速度を微減させ続ける。
    //そもそもVhがVzやVfより低くなったらエラーなのでwhileの条件式に追加(Ver1.2)
    while (Xe<Xk+Xg && Vf<=Vh && Vz<=Vh){
        Vh = Vh - 0.01;
        Xk = ((Vh*Vh)-(Vz*Vz))/(2*Ak);
        Xg = ((Vh*Vh)-(Vf*Vf))/(2*Ag);
    }
    if (Vf>Vh || Vz>Vh) {Err = 2;}
    else {Ts = (Vh-Vz)/Ak + (Vh-Vf)/Ag + (Xe-Xk-Xg)/Vh;}
}

}

//値に3.6をかけたり四捨五入する(四捨五入はあくまで最終的な値なので最後にする)
Vh = Vh*3.6;
Ts = Math.round(Ts) ;
Vh = Math.round(Vh) ;

//値を表示

if (Xk < 0){hTs.innerHTML ='何かしらの値が原因で不可能な数値が出ました。';}
else if (Xg <0){hTs.innerHTML ='何かしらの値が原因で不可能な数値が出ました。';}

else if (Err == 0){
let hTs = document.getElementById('hTs');
hTs.innerHTML ='<h1>駅間所要時間は'+Ts+'秒です。</h1><h2>駅間最高速度は'+Vh+'km/hです。</h2>'+Xk+'\n'+Xg;
// alert ('駅間所要時間は'+Ts+'秒です。\n駅間最高速度は'+Vh+'km/hです。\n'+Xk+'\n'+Xg);
}

else if (Err == 1){
let hTs = document.getElementById('hTs');
hTs.innerHTML = '<h1>所定キョリ内で終速度まで減速できません！</h1><h2>初速度をもう少し低く設定してください</h2>';
//alert ('所定キョリ内で終速度まで減速できません！\n初速度をもう少し低く設定してください');
}

else if (Err == 2){
let hTs = document.getElementById('hTs');
hTs.innerHTML = '<h1>所定キョリ内で終速度まで減速又は加速できません！</h1><h2>値を設定し直してください</h2>';
}
