const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const { expect } = chai;
chai.use(chaiHttp);
const app = require('../server');

const getFunction = async () => {
  const res = await (await chai.request(app).get('/').set('date-validation', ((new Date()).getTime() / 1000)));
  if (res.status === StatusCodes.OK) {
    return -1;
  }
  return 1;
};

describe('GET /', () => {
  const average = [];
  const iterations = 1000;
  for (let index = 0; index < iterations; index += 1) {
    // eslint-disable-next-line no-loop-func
    (async () => {
      average.push(await getFunction());
    })();
  }
  it('should return close to 0, fails if error exceeds 50% in either direction', async () => {
    let averageSum = 0;
    average.forEach((element) => {
      averageSum += element;
    });
    averageSum /= iterations;
    expect(Math.round(averageSum)).to.be.equal(0);
  });
});

describe('DELETE /', () => {
  it('should return status 405', async () => {
    const res = await chai.request(app).delete('/').send();
    expect(res.status).to.equal(StatusCodes.METHOD_NOT_ALLOWED);
  });
});

describe('Get / Out Of Spec', () => {
  it('return 401 for out of spec date', async () => {
    const res = await (await chai.request(app).get('/').set('date-validation', '1616425184'));
    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
  });
});

describe('Get / Out Of Spec, Query & Header', () => {
  it('return 401 for out of spec date', async () => {
    const res = await (await chai.request(app).get('/?date-validation=1616425183').set('date-validation', '1616425184'));
    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
  });
});

describe('Get / In Spec, Query & Header EPOCH', () => {
  it('OK OR INTERNAL_SERVER_ERROR', async () => {
    const res = await (await chai.request(app).get(`/?date-validation=${(new Date()).getTime() / 1000}`).set('date-validation', ((new Date()).getTime() / 1000)));
    expect(res.status).to.satisfy((code) => {
      if ((code === StatusCodes.OK) || (code === StatusCodes.INTERNAL_SERVER_ERROR)) {
        return true;
      }
      return false;
    });
  });
});

describe('Get / In Spec, Header NOT EPOCH FORMAT ', () => {
  it('return 401 for out of spec date', async () => {
    const res = await (await chai.request(app).get('/').set('date-validation', 'Fri, 26 Mar 2021 02:48:31 GMT'));
    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
  });
});

describe('Get / No Date', () => {
  it('return 401 for not date', async () => {
    const res = await (await chai.request(app).get('/'));
    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
  });
});

describe('Get / Both In Spec but different, Query & Header EPOCH', () => {
  it('OK OR INTERNAL_SERVER_ERROR', async () => {
    const res = await (await chai.request(app).get(`/?date-validation=${((new Date()).getTime() / 1000) + 1}`).set('date-validation', ((new Date()).getTime() / 1000)));
    expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
  });
});
