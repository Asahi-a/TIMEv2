var Ak;//加速度
var RAk;//実質加速度
var Ag;//減速度
var RAg;//実質減速度
var Vs;//初速度
var Vf;//終速度
var Vh;//最高速度(制限速度)
var Xe;//駅間距離
var Ts;//駅間所要時間
var S;//勾配
var K;//定数
var Fr;//空走時間
var Err = 0;//エラーの種類

Ak = prompt('加速度km/h/s');
Ag = prompt('減速度km/h/s(正の数で)');
Vs = prompt('初速度km/h');
Vf = prompt('終速度km/h');
Vh = prompt('最高速度(制限速度)km/h');
Xe = prompt('駅間距離m');
S = prompt('勾配‰(2桁正の数で入力。登りはそのままで下りは100の位に1。考慮しないときや平坦時は0 例)下り20‰→120)(Ver2.0)');
K = prompt('動力集中方式→30、動力分散方式→31(ver2.0)');
Fr = prompt('空走時間s 参考)電車:新式は2秒､旧式は4秒、客車列車:5両で6秒､10両で8秒､15両で11.3秒(いずれも機関車含む)、気動車:電磁式ブレーキがある時4秒､ない時客車列車と同じ(ver2.0)');


Ak = Ak / 3.6;
Ag = Ag / 3.6;
Vs = Vs / 3.6;
Vf = Vf / 3.6;
Vh = Vh / 3.6;
if (S >= 100){
  S = S - 100;
  S = -1*S;
}

if (Vs > Vf && Xe < ((1.8 * ((Vs * Vs) - (Vf * Vf))) / (3.6 * Ag + (S) / K)) + Vh * Fr) {
  Err = 1;
}

if (Vh < Vs || Vh < Vf){
  Err = 3;
}

if ((-3.6 * Ak + (S / K)) > 0) {
　Err = 4;
}
  
if ((3.6 * Ag + (S / K)) < 0) {
  Err = 5;
}

if (Err !== 1 && Err !== 3) {

  var Xk = ((1.8 * ((Vs * Vs) - (Vh * Vh))) / (-3.6 * Ak + (S / K)));
  var Xg = ((1.8 * ((Vh * Vh) - (Vf * Vf))) / (3.6 * Ag + (S / K))) + (Vh * Fr); 
  
  while (Xk + Xg > Xe) {
    Vh = Vh - 0.01;
    if (Vh < Vs || Vh < Vf) {
      if (Vs >= Vf) {
        Vh = Vs;
      } else {
        Vh = Vf;
      }
      if (Xk + Xg <= Xe) {
        ;
      } else {
        Err = 2;
      }
    }
  }
  
  //while文でVhが変化したのでもう一回
  Xk = ((1.8 * ((Vs * Vs) - (Vh * Vh))) / (-3.6 * Ak + (S / K)));
  Xg = ((1.8 * ((Vh * Vh) - (Vf * Vf))) / (3.6 * Ag + (S / K))) + (Vh * Fr);
  

  if (Err == 0) {
    if (Vs == Vh || Xk == 0) {
      RAk = 1;
    } else {
      RAk = ((Vh * Vh) - (Vs * Vs)) / (2 * Xk);
    }

    if (Vf == Vh || Xg == 0) {
      RAg = 1;
    } else {
      RAg = ((Vh * Vh) - (Vf * Vf)) / (2 * Xg);
    }

    Ts = ((Vh - Vs) / RAk) + ((Vh - Vf) / RAg) + ((Xe - Xk - Xg) / Vh);

    //m/s→km/h、四捨五入
    Vh = Vh * 3.6;
    Ts = Math.round(Ts);
    Vh = Math.round(Vh);


  }
}



if (Err == 0){
  hTs = document.getElementById('hTs');
  hTs.innerHTML = '<h1>駅間所要時間は' + Ts + '秒です。</h1><h2>駅間最高速度は' + Vh + 'km/hです。</h2>' + Xk + '\n' + Xg + '\n' + RAk + '\n' + RAg;
}

if (Err == 1){
  var hTs = document.getElementById('hTs');
  hTs.innerHTML = '<h1>所定キョリ内で終速度まで減速できません！</h1><h2>初速度をもう少し低く設定するか、次の区間と統合するなどしてください</h2>';
}

if (Err == 2){
  var hTs = document.getElementById('hTs');
  hTs.innerHTML = '<h1>所定キョリ内で終速度まで減速又は加速できません！</h1><h2>値を設定し直してください。もしくは次の区間と統合するなどしてください</h2>';
}

if (Err == 3){
  hTs = document.getElementById('hTs');
    hTs.innerHTML = '<h1>初速度または終速度を最高速度よりも小さく設定しないでください！</h1>';
}

if (Err == 4){
  var hTs = document.getElementById('hTs');
  hTs.innerHTML = '<h1>勾配がきつすぎて登れません！</h1><h2>加速度を強くしてください。/h2>';
}

if (Err == 5){
  var hTs = document.getElementById('hTs');
  hTs.innerHTML = '<h1>勾配がきつすぎて止まれません！</h1><h2>減速度を強くしてください。/h2>';
}
