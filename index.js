const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();//everytime u run ur code the database will be deleted, done on purpose
  })
  .then(() => {
    let createRecipe = Recipe.create({ title: 'Gazpacho', cuisine: 'Spanish' })
    createRecipe
      .then((result) => {
        console.log(result.title)
      })
      .catch(() => {
        console.log('Error on create')
      })
    console.log('THIS IS WORKING!')

    let insertMany = Recipe.insertMany(data)
    insertMany
      .then((resultMany) => {
        console.log("Insert many is working")
        resultMany.forEach((elem)=>{
          console.log(elem.title)
        })
      })
      .catch(()=>{
        console.log('Insert many is failing')
      })

      Promise.all([createRecipe, insertMany])
        .then(()=>{
          console.log('Promise all is working')
           let findandupdate = Recipe.findOneAndUpdate({title: 'Rigatoni alla Genovese'}, {duration: 100})
           findandupdate
            .then(()=>{
              console.log('Congrats you have changed the duration')
            })
            .catch(()=>{
              console.log('Update not working')
            })

            let deleteone = Recipe.deleteOne({title: 'Carrot Cake'})
            deleteone
              .then(()=>{
                console.log('Carrot Cake deleted')
              })
              .catch(()=>{
                console.log('Deleting not working')
              })

              Promise.all([findandupdate, deleteone])
                .then(()=>{
                  mongoose.connection.close()
                })
                .catch(()=>{
                  console.log('Last promise not working')
                })
              
        })
        .catch(()=>{
          console.log('Promise all not working')
        })


  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
