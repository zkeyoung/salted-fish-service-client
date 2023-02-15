import { randomString } from './index';

describe('randomString()', () => {
  it('should return spec length string', () => {
    const str = randomString(6);
    expect(typeof str).toBe('string');
    expect(str).toHaveLength(6);
    expect(str).toMatch(/^[0-9a-zA-Z]{6}$/);
  });

  it('should return spec type string', () => {
    let str = randomString(6, { ingoreNumber: true });
    expect(str).toMatch(/^([0-9a-zA-Z]{6}$/);

    str = randomString(6, { ingoreNumber: true, ingoreLowerCase: true });
    expect(str).toMatch(/^[A-Z]{6}$/);

    str = randomString(6, { ingoreNumber: true, ingoreUpperCase: true });
    expect(str).toMatch(/^[a-z]{6}$/);

    str = randomString(6, { ingoreLowerCase: true, ingoreUpperCase: true });
    expect(str).toMatch(/^[0-9]{6}$/);
  });
});
