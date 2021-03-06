﻿var fs = require('fs');
var dbapi = require('../util/dbapi.js');
var err = JSON.parse(fs.readFileSync('./config/err.json'))
try {
	var DBconfig = JSON.parse(fs.readFileSync('./config/config.json'))
} catch(exception) {
	console.log(err.DBConfigErr)
}

exports.db = function(database, _ENV) {
	this.ysh = dbapi.proapi;
	this.api = dbapi.proapi;
	this.replace = dbapi.replace;
	var mysql = require('mysql');
	var mysql = require('mysql');
	var obj = new Object()
	for(var k in DBconfig) {
		if(k == _ENV) {
			obj.host = DBconfig[k].host
			obj.user = DBconfig[k].username
			obj.port = DBconfig[k].port
			obj.password = DBconfig[k].password
			obj.allowMultiQueries = DBconfig[k].allowMultiQueries
			obj.database = database
		}
	}

	var pool = mysql.createPool(obj);
	//获取一行数据
	this.getRow = function(sql, callback) {
		poolQuery(sql, function(rows, errs) {
			if(rows) {
				callback && callback(rows[0], errs);
			} else {
				callback && callback(null, errs);
			}
		});
	}

	//获取表
	this.getAll = function(sql, callback, param) {
		poolQuery(sql, callback, param)
	}

	this.exec = function(sql, callback) {
		conn.query(sql, function(errs, rows, fields) {
			conn.release();
		});
	}

	function poolQuery(selectSQL, callback, param) {
		var errObj = new Object()
		pool.getConnection(function(errs, conn, fields) {
			if(errs) {
				errObj = err.DBGetConnectionFail
				return
			}
			var x = selectSQL.indexOf(":", 0);
			var sql = selectSQL;
			var key = null;
			if(x > 0 && x < 15) {
				key = selectSQL.substring(0, x);
				key = key.trim();
				sql = selectSQL.substring(x + 1, sql.length).trim();

			}
			conn.query(sql, function(errs, rows) {
				if(errs) {
					errObj = err.SQLExecuteFail
					errObj.sql = sql
				}
				if(key) {
					var r = {};
					r[key] = rows;
					callback && callback(r, errObj, param);
				} else {
					callback && callback(rows, errObj, param);
				}
				conn.release();
			});
		});
	}
}