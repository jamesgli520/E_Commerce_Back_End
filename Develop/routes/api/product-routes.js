const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products
router.get('/', (req, res) => {
  try{
    Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        }
      ]
    })
      .then(productData => 
        res.json(productData)
        )
  }
  catch (err){
    res.status(500).json(err);
  }
});

// get a product by id
router.get('/:id', (req, res) => {
  try{
    Product.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        }
      ]
    })
    .then(productData => {
        if (!productData) {
          res.status(404).json({
            message: 'Id not found'
          });
          return;
        }else{
          res.json(productData);
        }
        
      })
  }catch (err){
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
    Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds
    })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const pTagIdArray = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(pTagIdArray);
      }
      else{
        res.status(200).json(product);
      }
    })
    .then((pTagIds) => 
      res.status(200).json(pTagIds))
    .catch((err) => {
      res.status(400).json(err);
    })
    
  
});

// update
router.put('/:id', (req, res) => {
    Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((product) => {
        // find all related tags from ProductTag
        return ProductTag.findAll({ 
          where: { product_id: req.params.id } 
        });
      })
      .then((productTags) => {
        // list of current tag_id
        const pTagId = productTags.map(({ tag_id }) => tag_id);
        const newPTags = req.body.tagIds
          .filter((tag_id) => !pTagId.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // find out the one to be removed
        const remove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
       
        return Promise.all([
          ProductTag.destroy({ where: { id: remove } }),
          ProductTag.bulkCreate(newPTags),
        ]);
      })
      .then((updatedProductTags) => 
        res.json(updatedProductTags)
        )
  .catch((err) => {
    res.status(400).json(err);
  }) 
    
  
  
});

//delete by id
router.delete('/:id', (req, res) => {
  try{
    Product.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(productData => {
      if (!productData) {
        res.status(404).json({message: 'Id not found'});
        return;
      }else{
        res.json(productData);
      }
      
    })
  }catch (err){
    res.status(500).json(err);
  }
});

module.exports = router;
