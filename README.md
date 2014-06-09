json_numeric_key_decoder_js
========================

after json string.
```text
{ "0": 4, "1": "honda", 
  "2": [ {"0": "italy"}, {"0": "russia"} ], 
  "3": {"0": "JP", "1": "FW"} } 
```

decoder.js
```
var plays_key = new JsonObjKey();
plays_key.add("country");

var info_key = new JsonObjKey();
info_key.add("from");
info_key.add("pos");

var obj_key = new JsonObjKey();
obj_key.add("number");
obj_key.add("name");
obj_key.add_array("plays", plays_key);
obj_key.add_object("info", info_key);

var before = obj_key.decode(obj); 
```

before json string.
```text
{ "number": 4, "name": "honda", 
  "plays": [ {"country": "italy"}, {"country": "russia"} ], 
  "info": {"from": "JP", "pos": "FW"} }
```
