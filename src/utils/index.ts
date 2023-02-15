import crypto from 'node:crypto';

type RandomeStringOpts = {
  ingoreNumber?: boolean;
  ingoreUpperCase?: boolean;
  ingoreLowerCase?: boolean;
};

function randomString(len: number, opts: RandomeStringOpts = {}) {
  const { ingoreLowerCase, ingoreNumber, ingoreUpperCase } = opts;
  const literal = `${ingoreNumber ? '' : '1234567890'}${
    ingoreLowerCase ? '' : 'qwertyuiopasdfghjklzxcvbnm'
  }${ingoreUpperCase ? '' : 'QWERTYUIOPASDFGHJKLZXCVBNM'}`;
  let res = '';
  for (let i = 0; i < len; i++) {
    res += literal[crypto.randomInt(literal.length)];
  }
  return res;
}

export { randomString };
