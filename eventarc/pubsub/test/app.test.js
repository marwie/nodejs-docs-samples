// Copyright 2019 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// NOTE:
// This app can only be fully tested when deployed, because
// Pub/Sub requires a live endpoint URL to hit. Nevertheless,
// these tests mock it and partially test it locally.

'use strict';

import assert from 'assert';
import path from 'path';
import supertest from 'supertest';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let request;

describe('Unit Tests', () => {
  before(() => {
    const app = createRequire(path.join(__dirname, '..', 'app'));
    request = supertest(app);
  });

  describe('should fail', () => {
    it('on a Bad Request with an empty payload', async () => {
      await request.post('/').type('json').send('').expect(400);
    });

    it('on a Bad Request with an invalid payload', async () => {
      await request
        .post('/')
        .type('json')
        .send({nomessage: 'invalid'})
        .expect(400);
    });

    it('on a Bad Request with an invalid mimetype', async () => {
      await request.post('/').type('text').send('{message: true}').expect(400);
    });
  });

  describe('should succeed', () => {
    const data = Buffer.from('Events').toString('base64');

    it('with empty Pub/Sub Message', async () => {
      await request
        .post('/')
        .type('json')
        .send({message: {data: ''}})
        .expect(res => {
          assert.equal(res.text, 'Hello, World! ID: ');
        });
    });

    it('with a minimally valid Pub/Sub Message', async () => {
      await request
        .post('/')
        .type('json')
        .send({message: {data}})
        .expect(res => {
          assert.equal(res.text, 'Hello, Events! ID: ');
        });
    });

    it('with CloudEvent HTTP headers', async () => {
      await request
        .post('/')
        .type('json')
        .set('ce-id', 1234)
        .send({message: {data}})
        .expect(res => {
          assert.equal(res.text, 'Hello, Events! ID: 1234');
        });
    });
  });
});
