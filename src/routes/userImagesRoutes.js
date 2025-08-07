const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const userImages = require('../controllers/userImagesController');
const authenticateToken = require('../middleware/authMiddleware');

// Upload múltiplas imagens
router.post('/upload-images', upload.array('images'), userImages.uploadImages);

// Upload imagem de perfil
router.post('/upload-profile-image', upload.single('image'), userImages.uploadProfileImage);

// Buscar imagens do usuário
router.get('/user-images/:userId', userImages.getUserImages);

// Excluir imagem por ID
router.delete('/delete-image/:imageId', authenticateToken, userImages.deleteImage);

module.exports = router;
