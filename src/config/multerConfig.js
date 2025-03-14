const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Pasta 'uploads' na raiz do projeto
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Extrai a extensão do arquivo
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nome do arquivo: campo-timestamp.ext
  },
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceita o arquivo
  } else {
    cb(new Error('Tipo de arquivo não suportado. Apenas imagens são permitidas.'), false); // Rejeita o arquivo
  }
};

// Configuração do Multer
const upload = multer({
  storage: storage, // Define onde e como os arquivos serão salvos
  fileFilter: fileFilter, // Filtra os tipos de arquivos permitidos
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de tamanho do arquivo (5MB)
  },
});

module.exports = upload;