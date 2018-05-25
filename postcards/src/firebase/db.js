import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, avatarURL) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    avatarURL,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

  