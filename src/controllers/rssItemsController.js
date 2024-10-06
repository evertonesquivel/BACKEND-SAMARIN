const db = require('../db/dbMySqlConfig');

// Função para obter todos os itens
const getAllItems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar itens:', err);
    res.status(500).json({ message: 'Erro ao buscar itens' });
  }
};

module.exports = { getAllItems };


// const rssItems = require('../models/rssItems');

// exports.getAllrssItems = async (req, res) => {
//   try {
//     model = req.body

//     rssitems = await rssItems.getAllrssItems(model);

//     // console.log(rssitems.rows)
//     res.json(rssitems.rows);
//   } catch (error) {
//     console.error('Erro:', error);    
//   }
// };

// exports.getFilterRssItems = async (req, res) => {
//   try {
//     const model = req.body; 
    
//     rssitems = await rssItems.getFilterrssItems(model);


//     res.json(rssitems.rows);
//   } catch (error) {
//     console.error('Erro:', error);
    
//   }
// };


// exports.buscarPorKeywords = async (req, res) => {
//   try {
//     model = req.body
    
//     rssItems = await rssItems.buscarPorKeywords(model);   

//     console.log(rssItems.rows)
  
//     res.json(rssItems.rows);
//     // Respondendo ao cliente com sucesso
//    // res.status(200).json({ message: 'Cliente localizado  com sucesso' });
    

//   } catch (error) {
//     console.error('Erro ao localizar rssItems:', error);    
//     res.status(500).send({ error: 'Erro ao localizar o rssItems. Verifique os dados informados.' + error });
    
//   }
// };