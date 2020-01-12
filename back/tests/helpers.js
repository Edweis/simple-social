const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

const header = null;
const createUser = user =>
  it(`should create user ${user.username}`, async () => {
    const res = await chai
      .request(app)
      .post('/api/users')
      .send({ user });

    expect(res).to.have.status(200);
    expect(res.body.user.email).to.equals(user.email);
    expect(res.body.user.token).to.not.be.undefined;
  });

const logout = () =>
  it('should logout', async () => {
    const res = await chai.request(app).get('/api/users/logout');
    expect(res).to.have.status(200);
  });

const login = (user, setHeader) =>
  it(`should login user ${user.username}`, async () => {
    const userToPost = { username: user.username, password: user.password };
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .send({ user: userToPost });
    expect(res).to.have.status(200);
    expect(res.body.user.email).to.equals(user.email);
    expect(res.body.user.username).to.equals(user.username);
    expect(res.body.user.token).to.not.be.undefined;
    const { token } = res.body.user;
    setHeader({ Authorization: `Token ${token}` });
  });

module.exports = { header, createUser, logout, login };
