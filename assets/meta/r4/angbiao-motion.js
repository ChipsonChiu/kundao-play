(function(global){
  'use strict';
  const BASE_FIRE_SECONDS=0.5;
  function pathAt(progress){
    const p=Math.max(0,Math.min(1,progress));
    const angle=Math.PI+2*Math.PI*p;
    return {x:530+350*Math.cos(angle),y:330+170*Math.sin(angle),angle};
  }
  function isFireAlive(now,born,lifetime=BASE_FIRE_SECONDS){
    return now>=born && now-born<lifetime;
  }
  function flightState(seconds,flightSeconds=2.4,pauseSeconds=0.8){
    const cycle=flightSeconds+pauseSeconds;
    const phase=((seconds%cycle)+cycle)%cycle;
    const visible=phase<flightSeconds;
    const progress=visible?phase/flightSeconds:1;
    return {visible,progress,leg:visible?(progress<0.5?'outbound':'return'):'rest',point:pathAt(progress)};
  }
  global.AngbiaoMotion=Object.freeze({BASE_FIRE_SECONDS,pathAt,isFireAlive,flightState});
})(globalThis);
