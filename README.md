json_numeric_key_decoder_js
========================

after json string.
```text
{ "0": 4, "1": "honda",
  "2": {"0": "japan", "1": "left"},
  "3": [ "FW", "MF" ],
  "4": [ 
  	{"0": "holland", "1": "vvv"},
  	{"0": "russia",  "1": "cska"},
  	{"0": "italy",   "1": "milan"} ] }
```

decoder.js
```
var obj = JSON.parse(json_str);

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

//var before = decode(obj, obj_key);
var before = obj_key.decode(obj);
```

before json string.
```text
{ "number": 4, "name": "honda", 
  "info": {"from": "japan", "foot": "left"},
  "position": [ "FW", "MF" ], 
  "plays": [ 
  	{"country": "holland", "team": "vvv"},
  	{"country": "russia",  "team": "cska"},
  	{"country": "italy",   "team": "milan"} ] }
```
