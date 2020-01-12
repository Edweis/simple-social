const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

const testUser = {
  email: 'batman@mail.com',
  password: '123123',
};

describe('Health', () => {
  it('should validate health check', done => {
    chai
      .request(app)
      .get('/health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body.message).to.equals('up');
        done();
      });
  });
});

describe('User connexion', () => {
  let token = null;
  it('should create a user', done => {
    chai
      .request(app)
      .post('/api/users')
      .send({ user: testUser })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user.email).to.equals(testUser.email);
        expect(res.body.user.token).to.not.be.undefined;
        token = res.body.user.token;
        done();
      });
  });

  it('should connect with token', done => {
    chai
      .request(app)
      .get('/api/users/current')
      .set({ Authorization: `Token ${token}` })
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
});
