const express = require('express')
const router = express.Router()

const { 

  create, 
  categoryById, 
  read, 
  remove, 
  update, 
  list

} = require(`../controllers/category`);
const { requireSignin, isAuth, isAdmin } = require(`../controllers/auth`);
const { userById } = require(`../controllers/user`);

// C.R.U.D OPERATION

// Read
router.get('ctaegory/:categorybyId', read)
// Create
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)
// Update
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update)
// Remove
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove)
// gets all the categories
router.get('/categories', list)


router.param('categoryId', categoryById)
router.param('userId', userById)


module.exports = router;