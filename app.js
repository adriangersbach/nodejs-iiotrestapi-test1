// https://www.youtube.com/watch?v=xWRp1K8ga9s

const request = require('request-promise');

const settings = require('./confidential/settings');

const host = settings.host;

const auth = "Basic " + new Buffer(settings.username + ":" + settings.password).toString("base64");

const headers = {
  "Authorization" : auth,
  "Api-Key" : settings.apikey,
  "Accept" : "application/json",
  "Content-Type" : "application/json"
}

const urls = [
  `${host}/v1/assets?per_page=1`,
  `${host}/v1/instrumentations?per_page=1`
];

exports.AppName = (version) => {
    return `iiotrestapi-${version}`;
}

function getEdgeDevices()
{
  const urls = [
    `${host}/v1/edm/edge_devices`
  ];

  console.log('get edgeDevices');
  return Promise.all(urls.map((url) => {
    return request.get({
      url : url, headers : headers
    });
  }));
}

// function getEdgeDevices2()
// {
  // const url = `${host}/v1/edm/edge_devices`;

  // return new Promise((resolve, reject) => {
    // return request.get({
      // url : url, headers : headers
    // });
  // });
// }

function getAssetsAndInstrumentations()
{
  console.log('get assets and instrumentations');
  return Promise.all(urls.map((url) => {
    return request.get({
      url : url, headers : headers
    });
  }));
}

function deleteAssets(assetsJSON)
{
  console.log('delete assets', assetsJSON.assets.length);
  return Promise.all(assetsJSON.assets.map((asset) => {
    const id = asset["id"];
    return request.delete({
      url : `${host}/v1/assets/${id}`, headers : headers
    });
  }));
}

function deleteInstrumentations(instrumentationsJSON)
{
  console.log('delete instrumentations', instrumentationsJSON.instrumentations.length);
  return Promise.all(instrumentationsJSON.instrumentations.map((instrumentation) => {
    const id = instrumentation["id"];
    return request.delete({
      url : `${host}/v1/instrumentations/${id}`, headers : headers
    });
  }));
}

function logEdgeDevices(edgeDevicesJSON)
{
  for (var i = 0; i < edgeDevicesJSON['edge_devices'].length; i++)
  {
    const item = edgeDevicesJSON['edge_devices'][i];
    console.log('id:', item['id']);
    console.log('serial_number:', item['serial_number']);
    console.log('name:', item['name']);
    console.log('description:', item['description']);
    console.log('last_seen_at:', item['last_seen_at']);
    console.log('log_level:', item['log_level']);
    console.log('apply_timestamp:', item['apply_timestamp']);
  }
}

(async function main()
{
  console.log("begin");

  try
  {
    var edgeDevices = await getEdgeDevices();
    var edgeDevicesJSON = JSON.parse(edgeDevices[0]);
    logEdgeDevices(edgeDevicesJSON);

    var result_get1 = await getAssetsAndInstrumentations();

    var assetsJSON = JSON.parse(result_get1[0]);
    console.log('assets count', assetsJSON['pagination']['total_count']);

    var instrumentationsJSON = JSON.parse(result_get1[1]);
    console.log('instrumentations count', instrumentationsJSON['pagination']['total_count']);

    const result_delete1 = await deleteAssets(assetsJSON);
    const result_delete2 = await deleteInstrumentations(instrumentationsJSON);

    result_get1 = await getAssetsAndInstrumentations()

    assetsJSON = JSON.parse(result_get1[0]);
    console.log('assets count', assetsJSON['pagination']['total_count']);
    instrumentationsJSON = JSON.parse(result_get1[1]);
    console.log('instrumentations count', instrumentationsJSON['pagination']['total_count']);
  }
  catch (e)
  {
    console.log(e.message);
  }

  console.log("end");
})();
