const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  try{
    // find all tags
      Tag.findAll({
        include: {
          model: Product,
          attributes: ['product_name', 'price', 'stock', 'category_id']
        }
      })
        .then(tagData => res.json(tagData))
  }catch (err){
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  try{
    // find a tag by id
      Tag.findOne({
        where: {
          id: req.params.id
        },
        include: {
          model: Product,
          attributes: ['product_name', 'price', 'stock', 'category_id']
        }
      })
        .then(tagData => res.json(tagData))
  }catch (err){
      res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  try{
    Tag.create({
        tag_name: req.body.tag_name
      })
        .then(tagData => res.json(tagData))
  }catch (err){
    res.status(500).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag by id
  try{
    Tag.update(req.body, {
        where: {
          id: req.params.id
        }
      })
        .then(tagData => {
          if (!tagData){
            res.status(404).json({message:'Id not found'});
            return;
          }
          res.json(tagData);
        })
  }catch (err){
      res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by id
  try{
    Tag.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(tagData => {
        if (!tagData) {
          res.status(404).json({message: 'Id not found'});
          return;
        }
        res.json(tagData);
      })
  }catch (err){
      res.status(500).json(err);
  }
});

module.exports = router;
