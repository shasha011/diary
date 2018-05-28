"use strict";

var DictItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.date = obj.date;
		this.value = obj.value;
		this.author = obj.author;
	} else {
	    this.date = "";
	    this.author = "";
	    this.value = "";
	}
};

DictItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var DiaryDictionary = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new DictItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

DiaryDictionary.prototype = {
    init: function () {
        // todo
    },

    save: function (date, value) {

        date = date.trim();
        value = value.trim();
        if (date === "" || value === ""){
            throw new Error("empty date / value");
        }
        if (value.length > 64 || date.length > 64){
            throw new Error("date / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var dictItem = this.repo.get(date);
        if (dictItem){
            throw new Error("value has been occupied");
        }

        dictItem = new DictItem();
        dictItem.author = from;
        dictItem.date = date;
        dictItem.value = value;

        this.repo.put(date, dictItem);
    },

    get: function (date) {
        date = date.trim();
        if ( date === "" ) {
            throw new Error("empty date")
        }
        return this.repo.get(date);
    }
};
module.exports = DiaryDictionary;
