const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  //const products = await Product.find({ featured: true })
  const search = req.query.name
  // const products = await Product.find({
  //   name: { $regex: search, $options: 'i' }
  // })
  const products = await Product.find({}).sort('-name price')
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query;

  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }
  // dont call await here. 
  let results = Product.find(queryObject);

  // since we need to chain the sort,
  if (sort) {
    const sortList = sort.split(',').join(' ');
    results = results.sort(sortList);
  } else {
    results = results.sort('createdAt');
  }

  // once query is ready, call await
  const products = await results;
  res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts,
}