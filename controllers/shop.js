const Product = require('../models/productSequelize');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

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
  req.user
  .getCart()
  .then(cart => {
    return cart
      .getProducts()
      .then(products => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        });
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
  
};
exports.postCart = (req,res,next) =>{
  const productId = req.body.productId;
  let product;
  let fetchedCart;
  let newQuantity =1;
  req.user.getCart().then(cart =>{
    fetchedCart = cart;
    return cart.getProducts({ where: { id: productId } })
  }).then(products =>{
    console.log(products);
    if(products.length > 0 ){
      product = products[0];
    }
    if(product){
      const oldQuantity = product['cart-item'].quantity;
      newQuantity = oldQuantity+1;
      return product
      
    }
    return Product.findByPk(productId)
  }).then(product =>{
    fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
    res.redirect('/');

  }).catch(err => console.log(err))

  // Product.findById(productId, (product)=>{
  //   Cart.addProduct(productId, product.price);
  // })
  // console.log(productId);
  // res.redirect('/');
  
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

exports.postCartDeleteItem = (req, res, next)=>{
  let fetchedCart;
  const productId = req.body.productId
  req.user.getCart().then(cart =>{
    fetchedCart = cart;
    return cart.getProducts({where:{id:productId}})
  }).then((products)=>{
    const product = products[0];
    return product['cart-item'].destroy();
  }).then(result => res.redirect('/cart')
  ).catch(err => console.log(err));
}