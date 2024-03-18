


// const self: Worker = <any>globalThis;

const factorial2 = (n) => {
  if (n === 0 || n === 1) {
    return 1;
  }

  return n * factorial2(n - 1);
};


// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event) => {

  // console.log (window.requestAnimationFrame, 'asdasdasd');

  const result = '2222' // factorial2(event.data);
  // eslint-disable-next-line no-restricted-globals
  self.postMessage(result);
})
//window.self.onmessage =
