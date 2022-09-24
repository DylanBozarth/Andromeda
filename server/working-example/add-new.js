exports = async function(payload, response) {

    if (payload.body) {
        const body =  EJSON.parse(payload.body.text());
        const reviews = context.services.get("mongodb-atlas").db("pets").collection("my_pets");
        
        const reviewDoc = {
            pet: body.pet,
            breed: body.breed,
            user: body.user,
           image: body.image,
            desc: body.desc,
            
        };
    
        return await reviews.insertOne(reviewDoc);
    }
  
    return  {};
  };