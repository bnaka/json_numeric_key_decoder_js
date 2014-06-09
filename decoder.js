// json numeric decorder
//
// { "0": 4, "1": "honda",
//   "2": {"0": "japan", "1": "left"},
//   "3": [ "FW", "MF" ],
//   "4": [ 
//   	{"0": "holland", "1": "vvv"},
//   	{"0": "russia",  "1": "cska"},
//   	{"0": "italy",   "1": "milan"} ] }
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// { "number": 4, "name": "honda", 
//   "info": {"from": "japan", "foot": "left"},
//   "position": [ "FW", "MF" ], 
//   "plays": [ 
//   	{"country": "holland", "team": "vvv"},
//   	{"country": "russia",  "team": "cska"},
//   	{"country": "italy",   "team": "milan"} ] }

// with node.js
var util = (typeof require === "function") ? require("util") : (void 0);
function p(v){ if( typeof console === "object" ) { return console.log(v); } }
function pp(v){ if( typeof util === "object" ) { return p(util.inspect(v)); } }
function pv(n,v){ if( typeof util === "object" ) { return p(n + "=" + util.inspect(v)); } }
function exit(v){ if( typeof process === "object" ) { process.exit(v); } }

function decode(json_obj, json_key)
{
	var undefined;//undefinedの上書き防止
	p("decode:");
	pv("\tjson_obj", json_obj);
	pv("\tjson_key", json_key);
	if( json_obj === undefined ) { return exit(1); }
	if( json_key === undefined ) { return exit(1); }

	var obj = {};
	var num = 0;
	while( true )
	{
		// jsonのkeyは文字列リテラルなので
		// カウントアップされる数値を文字列に変換
		var num_s = String(num);
		// 数値のkeyがjson内にあるか確認 無ければループ終了
		if( !(num_s in json_obj) ) { break; }

		// json_keyの中に対になるキーが必要
		if( !(num in json_key) )
		{
			p("Error: json_key not found num idx.");
			pv("num", num);
			pv("json_key", json_key);
			return exit(1);
		}

		// 見通しやすくするため変数に入れる
		var val = json_obj[num_s]
		p(num_s + ":" + val);

		// 実際にkeyとなる文字列
		// 見通しやすくするため変数に入れる
		var key = json_key[num];

		// 変換対象のオブジェクトにより振り分け
		if( val instanceof Array )
		{ // 配列の場合
			// 配列としてキーを追加
			obj[key.name] = [];
			// 配列内のオブジェクトを再帰decodeして追加していく
			val.forEach(function(v){
				obj[key.name].push( decode(v, key.array) );
			});
			//!@note json的に配列内に配列がある事は無い
		}
		else if( val instanceof Object )
		{ // オブジェクトの場合(ArrayもObjectなので次点で確認)
			// オブジェクトとしてキーを追加
			// オブジェクトなので、そのまま再帰decodeする
			obj[key.name] = decode(val, key.object);
		}
		else
		{
			// 他のリテラルなのでそのままキーを追加
			obj[key.name] = val;
		}

		num++;
	}
	return obj;
}

// 変換用json objのkey名定義クラス
function JsonObjKey(){
	this.idx_cnt = 0;
};
JsonObjKey.prototype.add = function(name){
	this[this.idx_cnt++] = {"name": name};
};
JsonObjKey.prototype.add_array = function(name, array_key){
	this[this.idx_cnt++] = {"name": name, "array": array_key};
};
JsonObjKey.prototype.add_object = function(name, object_key){
	this[this.idx_cnt++] = {"name": name, "object": object_key};
};
JsonObjKey.prototype.decode = function(json_obj){
	var undefined;//undefinedの上書き防止
	p("decode:");
	pv("\tjson_obj", json_obj);
	if( json_obj === undefined ) { return exit(1); }

	var obj = {};
	var num = 0;
	while( true )
	{
		// jsonのkeyは文字列リテラルなので
		// カウントアップされる数値を文字列に変換
		var num_s = String(num);
		// 数値のkeyがjson内にあるか確認 無ければループ終了
		if( !(num_s in json_obj) ) { break; }

		// 自身の中に対になるキーが必要
		if( !(num in this) )
		{
			p("Error: key not found num idx.");
			pv("num", num);
			pv("json_key", this);
			return exit(1);
		}

		// 見通しやすくするため変数に入れる
		var val = json_obj[num_s]
		p(num_s + ":" + val);

		// 実際にkeyとなる文字列
		// 見通しやすくするため変数に入れる
		var key = this[num];

		// 変換対象のオブジェクトにより振り分け
		if( val instanceof Array )
		{ // 配列の場合
			// 配列としてキーを追加
			obj[key.name] = [];

			if("array" in key)
			{ // // keyがarray持ちならdecode後追加
				val.forEach(function(v){
					obj[key.name].push( key.array.decode(v) );
				});
			}
			else
			{ // // keyがarray持ちで無ければ、ただの配列なのでそのまま追加
				val.forEach(function(v){
					obj[key.name].push( v );
				});
			}
		}
		else if( val instanceof Object )
		{ // オブジェクトの場合(ArrayもObjectなので次点で確認)
			// オブジェクトとしてキーを追加
			// オブジェクトなので、そのまま再帰decodeする
			obj[key.name] = key.object.decode(val);
		}
		else
		{
			// 他のリテラルなのでそのままキーを追加
			obj[key.name] = val;
		}

		num++;
	}
	return obj;
};

// 変換元のjson文字列
var json_str = '{ \
	 "0": 4 \
	,"1": "honda" \
	,"2": { \
		 "0": "japan" \
		,"1": "left" \
	} \
	,"3": [ \
		 "FW" \
		,"MF" \
		] \
	,"4": [ \
		 {"0": "holland", "1": "vvv"} \
		,{"0": "russia",  "1": "cska"} \
		,{"0": "italy",   "1": "milan"} \
		] \
}';
//p(json_str);

var obj = JSON.parse(json_str);
//pp(obj);

/*
var a = {};

a.number = obj["0"];
a.name = obj["1"];
a.plays = [];
obj["2"].forEach(function(play){
	var c = {};
	c.country = play["0"];
	a.plays.push(c);
});
pp(a);
*/

// 変換するキーを定義
var info_key = new JsonObjKey();
info_key.add("from");
info_key.add("foot");

var plays_key = new JsonObjKey();
plays_key.add("country");
plays_key.add("team");

var obj_key = new JsonObjKey();
obj_key.add("number");
obj_key.add("name");
obj_key.add_object("info", info_key);
obj_key.add("position");
obj_key.add_array("plays", plays_key);

// 変換してみる
//var before = decode(obj, obj_key);
var before = obj_key.decode(obj);
pv("before", before);

// 結果ちゃんと取れてるか確認
pv("number", before.number);
pv("name", before.name);
pv("info.from", before.info.from);
pv("info.foot", before.info.foot);
before.position.forEach(function (v) {
	pv("position", v);
});
before.plays.forEach(function (v) {
	pv("plays.country", v.country);
	pv("plays.team", v.team);
});

