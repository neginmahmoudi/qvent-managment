import {
  deleteCookie,
  getParsedCookie,
  setStringifiedCookie,
  stringifyCookieValue,
} from '../cookie';

test('stringify a cookie value', () => {
  expect(stringifyCookieValue([{ id: '1', stars: 2 }])).toBe(
    '[{"id":"1","stars":2}]',
  );
});
test('set, gets and delete a cookie', () => {
  const cookieKey = 'diet';
  const cookieValue = [{ id: '1', stars: 2 }];
  // First make sure that the return of the function is undefined
  // Use .toBe to compare primitive values
  expect(getParsedCookie(cookieKey)).toBe(undefined);
});
