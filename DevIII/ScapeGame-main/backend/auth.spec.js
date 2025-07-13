const request = require('supertest');
const server = require('./index');
const {describe} = require("node:test");

describe('Auth API', () => {
  it('should log in a user and return 200 status', async () => {
    const user = {
      email: "test@test.com",
      userPassword: "password123",
    }

    const res = await request(server)
      .post('/auth/login')
        .send(user);

    expect(res.statusCode).toBe(200);
  });
  it('should return 401 status if user does not exist', async () => {
    const user = {
      email: "tst@test.com",
      userPassword: "password123",
    }

      const res = await request(server)
      .post('/auth/login')
          .send(user);

      expect(res.statusCode).toBe(401);
  });
  it('should return 401 status if password is incorrect', async () => {
    const user = {
      email: "test@test.com",
      userPassword: "password",
    }

      const res = await request(server)
      .post('/auth/login')
      .send(user);

      expect(res.statusCode).toBe(401);
  });
    it('should return 201 status if user is created', async () => {
      const user = {
        userFName: "test",
        userLName: "test",
        userBirth: "1990-01-01",
        email: "test2@test.com",
        userPassword: "password123",
      }
      const res = await request(server)
        .post('/auth/signup')
        .send(user);

      expect(res.statusCode).toBe(201);

    });
});

describe('Commentaire API', () => {
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VySWQiOjUsImlhdCI6MTcxMzI2NjExNywiZXhwIjoxNzEzMjY5NzE3fQ.ixDC0mBVIyDKXRqRUm60ESMw-GUl0EcFYFI2ujRUT1A';
  it('should return 401 status if no authorization for fetch', async () => {
    const res = await request(server)
        .get('/commentaire/1');

    expect(res.statusCode).toBe(401);
  });
  it('should return 401 status if no authorization for create', async () => {
    const commentaire = {
      levelId: 1,
      userId: 1,
      commentaryText: "test pour le test",
    }

    const res = await request(server)
      .post('/commentaire')
      .send(commentaire);

    expect(res.statusCode).toBe(401);
  });
  it('should return 401 status if no authorization for delete', async () => {
    const res = await request(server)
      .delete('/commentaire/1');

    expect(res.statusCode).toBe(401);
  });
  it('should return 200 status if authorization for fetch is provided', async () => {
    const res = await request(server)
      .get('/commentaire/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
    it('should return 201 status if authorization for create is provided', async () => {
        const commentaire = {
        levelId: 1,
        userId: 1,
        commentaryText: "test pour le test",
        }

        const res = await request(server)
        .post('/commentaire')
        .send(commentaire)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(201);
    });
    it('should return 200 status if authorization for delete is provided', async () => {
        const res = await request(server)
        .delete('/commentaire/22')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});
