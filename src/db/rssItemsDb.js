








// const util = require('util');
// const db = require('./dbPgConfig');



// class rssItemsDb {

//     static async getAllrssItems(model) {
//         const conn = await db.connect();
//         // const query = 'SELECT id, title, link, description, image, lang, score, likes, views, date_update, date_delete, pub_date 
//         // FROM rss_items;';
//         const query = 'SELECT i.id, title, link, description, image, i.lang, i.score, i.likes, i.views, date_update, date_delete, pub_date, name as source_name FROM rss_items i, rss_source s where i.source_id = s.id;'
//         const result = await conn.query(query);
//         conn.release();
//         return result;

//     };

//     static async getFilterrssItems(model) {
//         const conn = await db.connect();
//         const sources = model.sources;
//         const keywords = model.keywords;

//         let sql_keyword = ''

//         console.log('Sources:', sources)
//         console.log('Keywords:', keywords)
//         let query, result

//         if (sources.length && keywords.length) {
//             console.log('possui valores')
//             query = 'SELECT i.id, i.title, i.link, i.description, i.image, i.lang, i.score, i.likes, i.views, i.date_update, i.date_delete, i.pub_date, s.name as source_name FROM rss_items i JOIN rss_source s ON i.source_id = s.id JOIN rss_item_keywords ik ON i.id = ik.rss_item_id WHERE i.source_id = ANY($1::int[]) GROUP BY i.id, s.name HAVING COUNT(DISTINCT CASE WHEN ik.rss_keyword_id = ANY($2::int[]) THEN ik.rss_keyword_id END) = array_length($2::int[], 1); '

//             result = await conn.query(query, [sources, keywords]);
//         }
//         else if (sources.length && keywords.length == 0) {
//             console.log('NÃO possui valores das keywords')
//             // TODO: REMOVER DO VETOR POSSIVEIS ID DUPLICADOS
//             // const query = 'SELECT id, title, link, description, image, lang, score, likes, views, date_update, date_delete, pub_date 
//             // FROM rss_items where source_id = ANY($1::int[]);'

//             query = 'SELECT i.id, title, link, description, image, i.lang, i.score, i.likes, i.views, date_update, date_delete, pub_date, name as source_name FROM rss_items i, rss_source s where i.source_id = s.id and source_id = ANY($1::int[]);'
//             result = await conn.query(query, [sources]);
//         }
//         else if (sources.length == 0 && keywords.length) {

//             query = 'SELECT i.id, i.title, i.link, i.description, i.image, i.lang, i.score, i.likes, i.views, i.date_update, i.date_delete, i.pub_date, s.name as source_name FROM rss_items i JOIN rss_source s ON i.source_id = s.id JOIN rss_item_keywords ik ON i.id = ik.rss_item_id WHERE i.source_id = i.source_id GROUP BY i.id, s.name HAVING COUNT(DISTINCT CASE WHEN ik.rss_keyword_id = ANY($1::int[]) THEN ik.rss_keyword_id END) = array_length($1::int[], 1);'
//             result = await conn.query(query, [keywords]);
//         }
//         else if (sources.length == 0 && keywords.length == 0) {
//             query = 'SELECT i.id, title, link, description, image, i.lang, i.score, i.likes, i.views, date_update, date_delete, pub_date, name as source_name FROM rss_items i, rss_source s where i.source_id = s.id;'
//             result = await conn.query(query);
//         }
//         // let formattedQuery;        
//         // formattedQuery = query.replace('$1', typeof sources === 'string' ? `'${sources}'` : sources);

//         // const formattedQuery = query.replace('$1', `(${sources.map(id => typeof id === 'string' ? `'${id}'` : id).join(', ')})`);
//         // console.log('Query formatada:', formattedQuery);


//         console.log(query)
//         conn.release();
//         return result;

//     };


// }



// module.exports = rssItemsDb;
