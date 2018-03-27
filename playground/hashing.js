const { SHA256 } = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

let password = '123abc!';

// bcrypt.genSalt(10)
//     .then((salt) => {

//         bcrypt.hash(password, salt)
//             .then(hash => console.log('Hash :', hash));



//     })
//     .catch(e => {});

let HashedPassword = '$2a$10$rKob7sRf0gMGhO69rMii7.FTnW9Ab4HsAA2ENMtCBdyGCkqMoSK9i';

bcrypt.compare(password, HashedPassword)
    .then(isEqual => {

        console.log(isEqual);

    })
    .catch(e => {});