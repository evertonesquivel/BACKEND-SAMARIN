const rssItemsDb = require('../db/rssItemsDb');


class rssItems {
    constructor(_id, _title, _link, _description, _imagem, _lang, _score, _like, _view, _date_update, _date_delete) {
        this.id = _id;
        this.title = _title; 
        this.link  = _link;
        this.description  = _description;
        this.imagem  = _imagem;
        this.lang = _lang;
        this.score = _score;
        this.like = _like;
        this.view = _view;
        this.date_update = _date_update;
        this.date_delete = _date_delete;

    }

    static getAllrssItems(model) {
        return rssItemsDb.getAllrssItems(model)
        
    }

    static getFilterrssItems(model) {
        return rssItemsDb.getFilterrssItems(model)
        
    }

    
    static buscarPorKeywords(model) {

        return rssItemsDb.buscarPorKeywords(model);
    }
}

module.exports = rssItems;
