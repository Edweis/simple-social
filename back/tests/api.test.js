const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app');
const { createUser, logout, login } = require('./helpers');

const { expect } = chai;
chai.use(chaiHttp);
let header = null;
const testUser = {
  email: 'batman@mail.com',
  password: '123123',
  username: 'Bruce Wayne',
};
const loginTest = () =>
  login(testUser, h => {
    header = h;
  });

const TEST_BIO = 'Here is my test bio for a user';

beforeAll(async () => {
  // FIXME route to another database for tests
  try {
    await mongoose.connection.collections.users.drop();
    await mongoose.connection.collections.posts.drop();
  } catch (err) {
    console.debug('table didn\'t exist. nothing to drop.');
  }
});

describe('Before All', () => {
  createUser(testUser);
  loginTest();
});

describe('Users', () => {
  it('should connect with token', async () => {
    const res = await chai
      .request(app)
      .get('/api/users/current')
      .set(header);
    expect(res).to.have.status(200);
    expect(res.body.user.email).to.equals(testUser.email);
  });

  it('should not connect without token', async () => {
    const res = await chai
      .request(app)
      .get('/api/users/current')
      .set({ Authorization: 'Token XXX' });
    expect(res).to.have.status(401);
  });

  it('should be able to edit bio', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/current')
      .send({ bio: TEST_BIO })
      .set(header);
    expect(res).to.have.status(200);
    expect(res.body.user.email).to.equals(testUser.email);
    expect(res.body.user.bio).to.equals(TEST_BIO);
  });
});

describe('Health', () => {
  const checkHealth = async (isConnected, headerToSet = {}) => {
    const res = await chai
      .request(app)
      .get('/health')
      .set(headerToSet);
    expect(res).to.have.status(200);
    expect(res.body.status).to.equals('success');
    expect(res.body.message).to.equals('up');
    expect(res.body.isConnected).to.equals(isConnected);
  };
  loginTest();
  it('should validate health check', async () => {
    await checkHealth(false);
  });

  it('should show if user is connected', async () => {
    await checkHealth(true, header);
  });

  logout();

  it('should shouw not connected when token is revoked', async () => {
    await checkHealth(true, header);
  });
});

describe('Posts', () => {
  const listPosts = async () => {
    const response = await chai
      .request(app)
      .get('/api/posts')
      .set(header);
    expect(response).to.have.status(200);
    return response.body;
  };
  const post = {
    title: 'Here is a title',
    description: 'Here is the description',
  };
  loginTest();

  it('should have no post', async () => {
    const posts = await listPosts();
    expect(posts.length).to.equals(0);
  });

  it('should not post if not authenticated', async () => {
    const res = await chai
      .request(app)
      .post('/api/posts')
      .send({ post });
    expect(res).to.have.status(401);
  });

  it('should post a status', async () => {
    const res = await chai
      .request(app)
      .post('/api/posts')
      .set(header)
      .send({ post });

    expect(res).to.have.status(200);
    expect(res.body.title).to.equals(post.title);
    expect(res.body.authorEmail).to.equals(testUser.email);
  });

  it('should have one post', async () => {
    const posts = await listPosts();
    expect(posts.length).to.equals(1);
  });
});

describe('Follow', () => {
  const alice = {
    email: 'alice@mail.com',
    password: '123123',
    username: 'Alice',
  };
  const bob = {
    email: 'bob@mail.com',
    password: '123123',
    username: 'Bob',
  };
  loginTest();
  createUser(alice);
  createUser(bob);

  const getSubsciptions = async () => {
    const res = await chai
      .request(app)
      .get('/api/users/current')
      .set(header);
    expect(res).to.have.status(200);
    console.debug('should follow no one', res.body.user);
    return res.body.user.subscriptions;
  };
  it('should follow no one', async () => {
    const subscriptions = await getSubsciptions();

    expect(subscriptions.length).to.equals(0);
  });

  it('should follow alice', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/current')
      .send({ subscription: alice.username })
      .set(header);
    expect(res).to.have.status(200);
    expect(res.body.user.subscriptions).to.eql([alice.username]);
  });

  it('should fail if user doesnt exist', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/current')
      .send({ subscription: 'xxx' })
      .set(header);
    expect(res).to.have.status(400);
  });

  it('should follow alice', async () => {
    const subscriptions = await getSubsciptions();
    expect(subscriptions.length).to.equals(1);
    expect(subscriptions).to.eql([alice.username]);
  });
});
