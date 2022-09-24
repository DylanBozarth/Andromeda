exports = async function(payload, response) {
      
    const collection = context.services.get("mongodb-atlas").db("pets").collection("my_pets");
  
    petList.forEach(pets => {
      pets._id = pets._id.toString();
    });
  
    const responseData = {
      pets: petList,
      page: page.toString(),
      filters: {},
      entries_per_page: petsPerPage.toString(),
      total_results: petList.length.toString(),
    };
    
    return responseData;
  };


  /* 
  exports = async function(payload, response) {

  const {petsPerPage = 20, page = 0} = payload.query;

  let query = {};
    if (payload.query.breed) {
    query = { "breed": { $eq: payload.query.breed } }
  } else if (payload.query.name) {
    query = { $text: { $search: payload.query.name } }
  }
    
  const collection = context.services.get("mongodb-atlas").db("pets").collection("my_pets");
  let petList = await collection.find(query).toArray()

  petList.forEach(pets => {
    pets._id = pets._id.toString();
  });

  const responseData = {
    pets: petList,
    page: page.toString(),
    filters: {},
    entries_per_page: petsPerPage.toString(),
    total_results: petList.length.toString(),
  };
  
  return responseData;
};
*/