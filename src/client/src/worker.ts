


// const self: Worker = <any>globalThis;

const factorial = (n: number): number => {
  if (n === 0 || n === 1) {
    return 1;
  }

  return n * factorial(n - 1);
};

// eslint-disable-next-line no-restricted-globals
(self as any).addEventListener('message', (event:any) => {

  // console.log (window.requestAnimationFrame, 'asdasdasd');

  const result = factorial(event.data);
  // eslint-disable-next-line no-restricted-globals
  (self as any).postMessage(result);
})
//window.self.onmessage =
