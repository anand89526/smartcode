const mongoose = require('mongoose');
const Problem = require('./models/problem');

const companiesList = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Uber', 'Netflix', 'LinkedIn', 'Adobe', 'Bloomberg'];

mongoose.connect('mongodb://127.0.0.1:27017/smartcode').then(async () => {
  const problems = await Problem.find();
  for (const p of problems) {
    const numCompanies = Math.floor(Math.random() * 4) + 1;
    const shuffled = [...companiesList].sort(() => 0.5 - Math.random());
    await Problem.updateOne({ _id: p._id }, { $set: { companies: shuffled.slice(0, numCompanies) } });
  }
  console.log('Updated companies');
  process.exit(0);
}).catch(console.error);
