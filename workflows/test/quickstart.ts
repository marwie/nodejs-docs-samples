// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import assert from 'assert';
import * as cp from 'child_process';
import {describe, it} from 'mocha';

const execSync = (cmd: string) => cp.execSync(cmd, {encoding: 'utf-8'});
const project = process.env.GCLOUD_PROJECT as string;
const location = 'us-central1';

describe('Quickstart', () => {
  it('should run quickstart', async () => {
    const output = execSync(
      `node --loader ts-node/esm ./quickstart.ts ${project} ${location}`
    );
    assert(output.match(/name: projects.*/));
  });
});
