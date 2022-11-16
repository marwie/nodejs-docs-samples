// Copyright 2017 Google LLC
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

'use strict';

// sample-metadata:
//   title: Read Time Series Aggregate
//   description: Aggregates time series data that matches 'compute.googleapis.com/instance/cpu/utilization'.
//   usage: node metrics.readTimeSeriesAggregate.js your-project-id

function main(projectId) {
  // [START monitoring_read_timeseries_align]
  // Imports the Google Cloud client library
  const monitoring = require('@google-cloud/monitoring');

  // Creates a client
  const client = new monitoring.MetricServiceClient();

  async function readTimeSeriesAggregate() {
    /**
     * TODO(developer): Uncomment and edit the following lines of code.
     */
    // const projectId = 'YOUR_PROJECT_ID';

    const request = {
      name: client.projectPath(projectId),
      filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
      interval: {
        startTime: {
          // Limit results to the last 20 minutes
          seconds: Date.now() / 1000 - 60 * 20,
        },
        endTime: {
          seconds: Date.now() / 1000,
        },
      },
      // Aggregate results per matching instance
      aggregation: {
        alignmentPeriod: {
          seconds: 600,
        },
        perSeriesAligner: 'ALIGN_MEAN',
      },
    };

    // Writes time series data
    const [timeSeries] = await client.listTimeSeries(request);
    console.log('CPU utilization:');
    timeSeries.forEach(data => {
      console.log(data.metric.labels.instance_name);
      console.log(`  Now: ${data.points[0].value.doubleValue}`);
      if (data.points.length > 1) {
        console.log(`  10 min ago: ${data.points[1].value.doubleValue}`);
      }
      console.log('=====');
    });
  }
  readTimeSeriesAggregate();
  // [END monitoring_read_timeseries_align]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
