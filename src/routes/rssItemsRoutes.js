const express = require('express');
const router = express.Router();

// Importa o controlador correto
const rssItemsController = require('../controllers/rssItemsController');

// Define a rota POST e garante que o controlador existe
router.post('/rssItems', rssItemsController.createRssItem); // Supondo que você tenha uma função createRssItem

module.exports = router;
