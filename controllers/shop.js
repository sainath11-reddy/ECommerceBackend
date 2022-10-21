const Product = require('../models/productSequelize');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products =>{
      res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });    
  })
  .catch(err =>{ console.log(err)})

  // Product.fetchAll().then(([rows, fieldData])=>{
  //   res.render('shop/product-list', {
  //     prods: rows,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //   });
  // }).catch();
};



exports.getProductDetails = (req,res,next)=>{
  const productId =req.params.productId;
  Product.findAll({where:{id: productId}}).then(product=>{
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].pageTitle,
      path: '/products'
      
    });
  }).catch(err=>{console.log(err)});
}
  

//   Product.findByPk(productId).then((product) =>{
//     // console.log(product);
//     res.render('shop/product-detail', {
//       product: product,
//       pageTitle: product.pageTitle,
//       path: '/products'
      
//     });
//   }).catch(err=>{console.log(err)});
// }

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products =>{
    res.render('shop/index', {
    prods: products,
    pageTitle: 'All Products',
    path: '/'
  });    
}).catch(err =>{ console.log(err)})
  // Product.fetchAll().then(([rows, fieldData]) => {
  //   res.render('shop/index', {
  //     prods: rows,
  //     pageTitle: 'Shop',
  //     path: '/'
  //   });
  // }).catch(err =>{console.log(err)})
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};
exports.postCart = (req,res,next) =>{
  const productId = req.body.productId;
  Product.findById(productId, (product)=>{
    Cart.addProduct(productId, product.price);
  })
  console.log(productId);
  res.redirect('/');
  
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
