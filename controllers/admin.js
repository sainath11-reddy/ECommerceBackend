const Product = require('../models/productSequelize');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!(editMode === 'true')){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId).then((product)=>{
    if(!product){
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing:true,
      product:product
    });
  })
  
};
exports.postEditProduct = (req,res,next)=>{
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(id,title, imageUrl, description, price);
  // product.save();

  Product.findByPk(id).then(product=>{
    product.title=title;
    product.description=description;
    product.imageURL=imageUrl;
    product.price=price;
    return product.save();
  }).then(result=>{
    console.log("DB Updated");
    res.redirect('/admin/products');})
  .catch(err => {console.log(err)})
  
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save().then((resolve)=>res.redirect('/')).catch(err=>{console.log(err)});
  Product.create({
    title: title,
    price:price,
    imageURL: imageUrl,
    description:description
  }).then(resolve =>{
    console.log("Created with sequilize");
    console.log(resolve);
    res.redirect('/admin/add-product');
  })
  .catch();
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err =>{console.log(err)});
};

exports.postDeleteProduct = (req,res,next)=>{
    const productId = req.body.productId;
    // Product.deleteProductById(productId);
    Product.findByPk(productId).then(product=>{
      return product.destroy();
    }).then(result =>{
      console.log("Destroyed Product");
      res.redirect('/admin/products');
    }).catch(err => console.log(err))
    

}
