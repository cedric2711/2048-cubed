import Manager from './manager/manager';
import Controller from './controller/Controller';
import WebGLActuator from './webgl-actuator/webgl-actuator';

const init = () => {
  new Manager([4, 4], Controller, WebGLActuator);
};

window.requestAnimationFrame(init);
