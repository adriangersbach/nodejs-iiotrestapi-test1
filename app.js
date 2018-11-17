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
  `${host}/v1/assets/`,
  `${host}/v1/instrumentations/`
];

(async function main()
{
  console.log("begin");
  
  try
  {
    console.log('get assets and instrumentations');
    const result_get1 = await Promise.all(urls.map((url) => {
      return request.get({
        url : url, headers : headers
      });
    }));

    const assetsJSON = JSON.parse(result_get1[0]);
    const instrumentationsJSON = JSON.parse(result_get1[1]);
   
    console.log('delete assets', assetsJSON.assets.length);
    //const result_delete1 = await Promise.all(assetsJSON.assets.map((asset) => {
      //const id = asset["id"];
      // return request.delete({
        // url : `${host}/v1/assets/${id}`, headers : headers
      // });
    //}));
    
    console.log('delete instrumentations', instrumentationsJSON.instrumentations.length);
    // const result_delete2 = await Promise.all(instrumentationsJSON.instrumentations.map((instrumentation) => {
      // const id = instrumentation["id"];
      // return request.delete({
        // url : `${host}/v1/instrumentations/${id}`, headers : headers
      // });
    // }));
  }
  catch (e)
  {
    console.log(e.message);
  }
  
  console.log("end");
})();
