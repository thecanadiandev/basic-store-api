
// http://localhost:3000/api/v1/products/static
const getAllProductsStatic = async (req, res) => {
  throw new Error('Dynamic error')
  res.status(200).json({ msg: 'all products' })
}

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: 'actual products' })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts,
}