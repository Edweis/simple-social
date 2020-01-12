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

beforeAll(done => {
  // FIXME route to another database for tests
  mongoose.connection.collections.users.drop(() => {
    done();
  });
});

const createUser = () => {
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
};

let header = null;
describe('User connexion', () => {
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

  it.skip('should logout', done => {
    chai
      .request(app)
      .post('/api/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Health', () => {
  createUser();
  it('should validate health check', done => {
    chai
      .request(app)
      .get('/health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body.message).to.equals('up');
        expect(res.body.isConnected).to.equals(false);
        done();
      });
  });

  it('should shouw if user is connected', done => {
    chai
      .request(app)
      .get('/health')
      .set(header)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body.message).to.equals('up');
        expect(res.body.isConnected).to.equals(true);
        done();
      });
  });
});
