var AWS = require('aws-sdk');
var region = 'us-east-1';
var esDomain = 'vpc-photos2-3vnjuwr5z4zxqdrrncumqpwjqe.us-east-1.es.amazonaws.com';
AWS.config.update({region: region});

var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
var es = new AWS.ES({apiVersion: '2015-01-01'});

async function getLabelsFromImage(s3Bucket,objectKey) {
    return new Promise((resolve,reject) => {
        var params = {
          Image: {
           S3Object: {
            Bucket: s3Bucket, 
            Name: objectKey
           }
          }, 
          MaxLabels: 123, 
          MinConfidence: 70
         };
         
         rekognition.detectLabels(params, function(err, data) {
           if (err) {
               console.log(err, err.stack);
               reject(err);
           }
           else{
               console.log(data);
               resolve(data);
           }     
         });
    });
}

async function writeTagsToSearch(tagInfo){
    return new Promise((resolve,reject) => {
        var endpoint = new AWS.Endpoint(esDomain);
        var request = new AWS.HttpRequest(endpoint, region);
        
        request.method = 'PUT';
        request.path += 'photos/_doc/' + tagInfo.objectKey.replace(/\//g,'');
        request.body = JSON.stringify(tagInfo);
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
        
    })
}

exports.handler = async (event) => {
    // TODO implement
    console.log("event: " + JSON.stringify(event) );
    let record = event.Records[0];
    let s3Bucket = record.s3.bucket.name;
    let objectKey = record.s3.object.key;
    let labels = await getLabelsFromImage(s3Bucket,objectKey);
    let esObject = {
        'objectKey' : objectKey,
        'bucket' : s3Bucket,
        'createdTimestamp' : new Date(),
        'labels' : labels.Labels.map((label)=>label.Name)
        
    }
    let esResponse = await writeTagsToSearch(esObject);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
