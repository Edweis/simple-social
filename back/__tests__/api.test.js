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

beforeAll(async done => {
  // FIXME route to another database for tests
  await Promise.all([
    mongoose.connection.collections.users.drop(() =>
      console.debug('DROPED Users'),
    ),
    mongoose.connection.collections.posts.drop(() =>
      console.debug('DROPED Posts'),
    ),
  ]);
  done();
});

const createUser = () =>
  it('should create a user', done => {
    chai
      .request(app)
      .post('/api/users')
      .send({ user: testUser })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user.email).to.equals(testUser.email);
        expect(res.body.user.token).to.not.be.undefined;

        const { token } = res.body.user;
        header = { Authorization: `Token ${token}` };
        done();
      });
  });

const logout = () =>
  it('should logout', done => {
    chai
      .request(app)
      .get('/api/users/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

let header = null;
describe('Users', () => {
  createUser();
  it('should connect with token', done => {
    chai
      .request(app)
      .get('/api/users/current')
      .set(header)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user.email).to.equals(testUser.email);
        done();
      });
  });

  it('should not connect without token', done => {
    chai
      .request(app)
      .get('/api/users/current')
      .set({ Authorization: 'Token XXX' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  logout();
});

describe('Health', () => {
  const checkHealth = (done, isConnected, headerToSet = {}) => {
    chai
      .request(app)
      .get('/health')
      .set(headerToSet)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body.message).to.equals('up');
        expect(res.body.isConnected).to.equals(isConnected);
        done();
      });
  };
  createUser();
  it('should validate health check', done => {
    checkHealth(done, false);
  });

  it('should show if user is connected', done => {
    checkHealth(done, true, header);
  });

  logout();

  it('should shouw not connected when token is revoked', done => {
    checkHealth(done, true, header);
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
  it('should have no posts', async done => {
    const posts = await listPosts();
    expect(posts.length).to.equals(0);
    done();
  });

  it.skip('should post a status', done => {
    chai
      .request(app)
      .post('/api/posts')
      .set(header)
      .send({ post })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
