var AWS = require('aws-sdk');
var region = 'us-east-1';
var esDomain = 'vpc-photos2-3vnjuwr5z4zxqdrrncumqpwjqe.us-east-1.es.amazonaws.com';
AWS.config.update({region: region});

var lexruntime = new AWS.LexRuntime({apiVersion: '2016-11-28'});

async function searchForTerms(terms){
    return new Promise((resolve, reject)=>{
        var endpoint = new AWS.Endpoint(esDomain);
        var request = new AWS.HttpRequest(endpoint, region);
        
        request.method = 'POST';
        request.path += 'photos/_search'; 
        request.body = JSON.stringify({
              "size": 20,
              "query": {
                "query_string": {
                  "default_field": "labels",
                  "query": terms.length?terms.join(" OR "):'*'
                }
              }
        });
        request.headers['host'] = esDomain;
        request.headers['Content-Type'] = 'application/json';
        
        var credentials = new AWS.EnvironmentCredentials('AWS');
        var signer = new AWS.Signers.V4(request, 'es');
        signer.addAuthorization(credentials, new Date());
        
        var client = new AWS.HttpClient();
        client.handleRequest(request, null, function(response) {
        console.log(response.statusCode + ' ' + response.statusMessage);
        var responseBody = '';
        response.on('data', function (chunk) {
          responseBody += chunk;
        });
        response.on('end', function (chunk) {
          console.log('Response body: ' + responseBody);
          resolve(responseBody);
        });
        }, function(error) {
            console.log('Error: ' + error);
            reject(error);
        });
    });
}

async function disambiguateQuery(userText){
    return new Promise((resolve,reject)=>{
        let params = {
              botAlias: 'photobott', /* required */
              botName: 'photoBott', /* required */
              inputText: userText, /* required */
              userId: '993f6f2a', /* required */
        };
        console.log(userText)
        lexruntime.postText(params, function (err, data) {
            if (err){ 
                console.log(err, err.stack); // an error occurred
                reject(err);
            }else{
                console.log(data);           // successful response
                resolve(data);
            }     
        });
    })
    
}

exports.handler = async (event) => {
    // TODO implement
    console.log(JSON.stringify(event));
    let query = event.queryStringParameters.q;
    let lexResponse = query?await disambiguateQuery(query):{};
    let terms = [];
    for (var key in lexResponse.slots) {
        if (lexResponse.slots[key]){
            terms.push(lexResponse.slots[key]);
        }
    }
    console.log(terms);
    let photos = await searchForTerms(terms);
    const response = {
        statusCode: 200,
        headers: {
              'Access-Control-Allow-Origin':'*'
                },
        body: JSON.stringify(photos),
    };
    return response;
};
