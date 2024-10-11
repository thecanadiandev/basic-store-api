const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  //const products = await Product.find({ featured: true })
  const search = req.query.name
  // const products = await Product.find({
  //   name: { $regex: search, $options: 'i' }
  // })
  const products = await Product.find({ price: { $gt: 30 } }).sort('-name price').limit(10)
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;

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

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating']

    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')

      if (options.includes(field)) {
        queryObject[field] = {
          [operator]: Number(value),
        }
      }
    })
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

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    results = results.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  results = results.skip(skip).limit(limit);

  // once query is ready, call await
  const products = await results;
  res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts,
}