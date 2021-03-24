const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const { expect } = chai;
chai.use(chaiHttp);
const app = require('../server');

describe('GET /', () => {
  it('should return status 200', async () => {
    const res = await chai.request(app).get('/').send();
    expect(res.status).to.equal(StatusCodes.OK);
  });
});

describe('DELETE /', () => {
  it('should return status 405', async () => {
    const res = await chai.request(app).delete('/').send();
    expect(res.status).to.equal(StatusCodes.METHOD_NOT_ALLOWED);
  });
});
