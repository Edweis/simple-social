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

const follow = async (username, localHeader) => {
  return chai
    .request(app)
    .post('/api/users/current')
    .send({ subscription: username })
    .set(localHeader);
};

const unfollow = async (username, localHeader) =>
  chai
    .request(app)
    .delete('/api/users/current')
    .send({ subscription: username })
    .set(localHeader);

const getSubsciptions = async localHeader => {
  const res = await chai
    .request(app)
    .get('/api/users/current')
    .set(localHeader);
  expect(res).to.have.status(200);
  return res.body.user.subscriptions;
};

const postStatus = async (post, localHeader) =>
  chai
    .request(app)
    .post('/api/posts')
    .set(localHeader)
    .send({ post });

const listPosts = async localHeader => {
  const response = await chai
    .request(app)
    .get('/api/posts')
    .set(localHeader);
  expect(response).to.have.status(200);
  return response.body;
};

module.exports = {
  header,
  createUser,
  logout,
  login,
  follow,
  unfollow,
  getSubsciptions,
  postStatus,
  listPosts,
};
