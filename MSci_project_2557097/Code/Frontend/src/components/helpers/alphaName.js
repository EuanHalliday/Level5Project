let nodeLabelCounter = 0;

export function getAlphabetName(num) {
  let result = '';
  let n = num;
  do {
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return result;
}

export function getNextNodeLabel() {
  return `Node ${getAlphabetName(nodeLabelCounter++)}`;
}
