import Controller from './Controller';

// const container = document.querySelector('.container');
const port = 7070;
const root = document.getElementById('root');
const controller = new Controller(port);
controller.bindToDOM(root);
controller.init();
