import bcrypt from 'bcrypt';
import {
  createUser,
  getUserByUsername,
  getUsernameById,
} from '../../database/users';

test('test username match by id', async () => {
  const data = await getUsernameById(1);
  console.log(data);
  expect(data).toEqual({ id: 1, username: 'negin' });
});

test('create user', async () => {
  const passwordHash = await bcrypt.hash('123', 12);
  const data = await createUser('kian', passwordHash);
  console.log(data);
  expect(data.username).toEqual('kian');
});

test('test username match by username', async () => {
  const data = await getUserByUsername('kian');
  console.log(data);
  expect(data).toEqual({ id: 7, username: 'kian' });
});
