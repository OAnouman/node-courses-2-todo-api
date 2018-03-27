const { SHA256 } = require('crypto-js');

const jwt = require('jsonwebtoken');

let data = {
    id: 4,
};

let token = jwt.sign(data, '123abc');

console.log(token);

let decoded = jwt.verify(token, '123ab');

console.log(decoded);