const router = require('express').Router();

const {submitContentController,getContentController} = require('../controllers/content.controller');


router.post('/temps/api/share_content',submitContentController);
router.get('/temps/api/share_content',getContentController );


module.exports = router;