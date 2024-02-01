const express = require('express')

const userController = require('../controllers/users')

const router = express.Router()

//DELETE
router.delete("/:id", userController.deleteUser);

//GET
router.get("/:id",  userController.singleUser);

//GET ALL
router.get("/",  userController.allUsers);


module.exports = router;