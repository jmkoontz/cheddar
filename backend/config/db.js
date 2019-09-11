import mongoose from 'mongoose';

// URL of our cluster
const dbURL = 'mongodb+srv://cheddar-server:CheddarCS407@' +
  'cluster0-wgv5g.mongodb.net/test?retryWrites=true&w=majority';

const options = {
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  poolSize: 10
};

// prevent deprecation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// connection
mongoose.connect(dbURL, options).then(() => {
  console.log('Database connection established');
}).catch((err) => {
  console.log('Error connecting database instance: ', err);
});
