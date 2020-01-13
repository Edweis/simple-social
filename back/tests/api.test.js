const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app');
const {
  createUser,
  logout,
  login,
  follow,
  unfollow,
  postStatus,
  getSubsciptions,
  listPosts,
} = require('./helpers');

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

const postDummy = {
  title: 'Here is a title',
  description: 'Here is the description',
};

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

  it('should get the list of users', async () => {
    const res = await chai
      .request(app)
      .get('/api/users/list')
      .set(header);
    expect(res).to.have.status(200);
    expect(res.body.users.map(u => u.email)).to.eql([testUser.email]);
    expect(res.body.users.filter(u => !!u.salt).length).to.eql(0);
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
  loginTest();

  it('should have no post', async () => {
    const posts = await listPosts(header);
    expect(posts.length).to.equals(0);
  });

  it('should not post if not authenticated', async () => {
    const res = await postStatus(postDummy, {});
    expect(res).to.have.status(401);
  });

  it('should post a status', async () => {
    const res = await postStatus(postDummy, header);
    expect(res).to.have.status(200);
    expect(res.body.title).to.equals(postDummy.title);
    expect(res.body.authorUsername).to.equals(testUser.username);
  });

  it('should have one post', async () => {
    const posts = await listPosts(header);
    expect(posts.length).to.equals(1);
  });
});

describe('Follow', () => {
  loginTest();
  createUser(alice);
  createUser(bob);

  it('should follow no one', async () => {
    const subscriptions = await getSubsciptions(header);

    expect(subscriptions.length).to.equals(0);
  });

  it('should follow alice', async () => {
    const res = await follow(alice.username, header);
    expect(res).to.have.status(200);
    expect(res.body.user.subscriptions).to.eql([alice.username]);
  });

  it('should fail if user doesnt exist', async () => {
    const res = await follow('xxx', header);
    expect(res).to.have.status(400);
  });

  it('should follow alice', async () => {
    const subscriptions = await getSubsciptions(header);
    expect(subscriptions.length).to.equals(1);
    expect(subscriptions).to.eql([alice.username]);
  });

  it('should unfollow', async () => {
    const res = await unfollow(alice.username, header);
    expect(res).to.have.status(200);
  });

  it('should follow no one', async () => {
    const subscriptions = await getSubsciptions(header);

    expect(subscriptions.length).to.equals(0);
  });
});

describe('Timeline', () => {
  // everyone create one post, and test user follows alice
  const postTest = { title: 'From Batman', description: 'Hello' };
  const postAlice = { title: 'From Alice', description: 'Hi all' };
  const postBob = { title: 'From Bob', description: 'Hi everyone' };
  let otherUserHeader;
  it('should setup posts', async () => {
    await follow(alice.username, header);
    await postStatus(postTest, header);
  });
  logout();
  login(alice, h => {
    otherUserHeader = h;
  });

  it('alice should post a status', async () => {
    await postStatus(postAlice, otherUserHeader);
  });
  logout();
  login(bob, h => {
    otherUserHeader = h;
  });
  it('bob should post a status', async () => {
    await postStatus(postBob, otherUserHeader);
  });
  loginTest();

  it('should display posts on timeline', async () => {
    const res = await chai
      .request(app)
      .get('/api/posts/timeline')
      .set(header);
    expect(res).to.have.status(200);
    expect(res.body.posts.length).to.equals(3);
    expect(res.body.posts.map(p => p.title)).to.eql([
      postDummy.title,
      postTest.title,
      postAlice.title,
    ]);
  });
});
