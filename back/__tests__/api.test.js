const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

const testUser = {
  email: 'batman@mail.com',
  password: '123123',
  username: 'Bruce Wayne',
};

beforeAll(async () => {
  // FIXME route to another database for tests
  await Promise.all([
    mongoose.connection.collections.users.drop(() => {}),
    mongoose.connection.collections.posts.drop(() => {}),
  ]);
});

let header = null;
const createUser = () =>
  it('should create a user', async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .send({ user: testUser });

    expect(res).to.have.status(200);
    expect(res.body.user.email).to.equals(testUser.email);
    expect(res.body.user.token).to.not.be.undefined;

    const { token } = res.body.user;
    header = { Authorization: `Token ${token}` };
  });

const logout = () =>
  it('should logout', async () => {
    const res = await chai.request(app).get('/api/users/logout');
    expect(res).to.have.status(200);
  });

describe('Users', () => {
  createUser();
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

  logout();
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
  createUser();
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
  createUser();

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
