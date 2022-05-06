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
var Err = 0;//エラーの有無(0or1)

Ak = prompt('加速度km/h/s');
Ag = prompt('減速度km/h/s(正の数で)');
Vs = prompt('初速度km/h');
Vf = prompt('終速度km/h');
Vh = prompt('最高速度(制限速度)km/h');
Xe = prompt('駅間距離m');
S = prompt('勾配‰ (登りは正で下りが負。考慮しないときや平坦時は0)(Ver2.0)');
K = prompt('動力集中方式→30、動力分散方式→31(ver2.0)');
Fr = prompt('空走時間s 参考)電車:新式は2秒､旧式は4秒、客車列車:5両で6秒､10両で8秒､15両で11.3秒(いずれも機関車含む)、気動車:電磁式ブレーキがある時4秒､ない時客車列車と同じ(ver2.0)');


Ak = Ak / 3.6;
Ag = Ag / 3.6;
Vs = Vs / 3.6;
Vf = Vf / 3.6;
Vh = Vh / 3.6;

if (Vs > Vf && Xe < ((1.8 * ((Vs * Vs) - (Vf * Vf))) / (3.6 * Ag + S / K)) + Vh * Fr) {
  Err = 1;
  let hTs = document.getElementById('hTs');
  hTs.innerHTML = '<h1>所定キョリ内で終速度まで減速できません！</h1><h2>初速度をもう少し低く設定するか、次の区間と統合するなどしてください</h2>';
}

if (Err = 0) {

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
        Err = 1;
        let hTs = document.getElementById('hTs');
        hTs.innerHTML = '<h1>所定キョリ内で終速度まで減速又は加速できません！</h1><h2>値を設定し直してください。もしくは次の区間と統合するなどしてください</h2>';
      }
    }
  }

  if (Err = 0) {

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

    Xe = ((Vh - Vs) / RAk) + ((Vh - Vs) / RAg) + ((Xe - Xk - Xg) / Vh);

    //m/s→km/h、四捨五入
    Vh = Vh * 3.6;
    Ts = Math.round(Ts);
    Vh = Math.round(Vh);

    let hTs = document.getElementById('hTs');
    hTs.innerHTML = '<h1>駅間所要時間は' + Ts + '秒です。</h1><h2>駅間最高速度は' + Vh + 'km/hです。</h2>' + Xk + '\n' + Xg + '\n' + RAg + '\n' + RAk;

  }
}

