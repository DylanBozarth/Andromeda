import axios from 'axios';

export const SectorACall = async () => {
const data = JSON.stringify({
    'collection': 'sectors',
    'database': 'andromeda',
    'dataSource': 'Cluster0'
});

const config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-zrkhi/endpoint/data/v1/action/findOne',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': `${process.env.MONGO_API_KEY}`,
    },
    data: data
};
            
axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log('mongo success')
    })
    .catch(function (error) {
        console.log(error);
        console.log('mongo error')
        console.log(`${process.env.MONGO_API_KEY}`)
    });
}

/* curl --location --request POST 'https://data.mongodb-api.com/app/data-zrkhi/endpoint/data/v1/action/findOne' \
         --header 'Content-Type: application/json' \
         --header 'Access-Control-Request-Headers: *' \
         --header 'api-key: ' \
         --data-raw '{
         "collection":"sectors",
         "database":"andromeda",
         "dataSource":"Cluster0"
     }' */