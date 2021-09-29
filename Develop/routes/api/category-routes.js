const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    Category.findAll({
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
    }).then(found => {
      if(!found){
        res.status(404).json({
          message: 'No categories found'
        });
        return;
      }else{
        res.json(found);
      }
      
    })
  }catch (err) {
    res.status(500).json(err);
  }
  
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    Category.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
    .then(found => {
      if(!found) {
        res.status(404).json({
          message: 'No categories found'
        });
        return;
      }else{
        res.json(found);
      }
      
    })
  }catch (err) {
    res.status(500).json(err);
  }
  
});

router.post('/', (req, res) => {
  // create a new category
  try{
    Category.create({
      category_name: req.body.category_name
    }).then(found => 
        res.json(found)
      )
  }catch (err) {
      res.status(500).json(err);
    }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  try{
    Category.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(found => {
        if(!found) {
          res.status(404).json({
            message:'Cannot find the id related to this category'
          });
          return;
        }else{
          res.json(found);
        }
        
      })

  }catch (err){
    res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  try{
    Category.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(found => {
        if(!found){
          res.status(404).json({
            message: 'Cannot find the id related to this category'
          });
          return;
        }else{
          res.json(found);
        }
        
      })
  }catch (err){
    res.status(500).json(err);
  }
});

module.exports = router;
