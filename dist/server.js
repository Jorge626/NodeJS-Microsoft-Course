/*
    Express is a package that allows you to stand up a 
    REST and API endpoint as well as create a server-side based '
    applciation. 
    In package.json, add to dependencies:
    npm install body-parser : Helps manage information sent to API we will create
    npm install cors : Control where requests come from
    npm install express : REST, API, server-side 
    npm install nodemon --save-dev: Allows us to restart our application everytime we make a change

    Create script for nodemon: 
    "watch" : nodemon <file location>

    You can create a nodemon.json file to add configurations or create 
    a new section in package.json file called:
    "nodemonConfig" : {
        "delay" : 2000,
        "ignore" : [""]
    }
    
    Configuring Routes:
    A route is how a client/user can request something from our application
    Client specifies a URL, maybe send information, that causes a function to 
    execute in response.

    Allowing client to send information to the server:
    REST endpoint. REST defines the different operations available by methods/verbs
    This is traditionally done using 'post'

    Modifying & Deleting items, use: put
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const package = require('../package.json');
const { restart } = require('nodemon');
const port = process.env.port || process.env.PORT || 5000;
const apiRoot = '/api';
const app = express();

// sample database
const db = {
    'jorge': {
        'user': 'jorge',
        'currency': 'USD',
        'balance': 100,
        'decription': 'A sample account',
        'transactions': []
    }
}

// configure app
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: /http:\/\/localhost/ }));
app.options('*', cors());

// configure routes
const router = express.Router();
router.get('/', (req, res) => { // first parameter specifies path ('/' means the default), second parameter is the handler
    res.send(`${package.description} - v${package.version}`)
});

router.get('/accounts/:user', (req, res) => {
    const user = req.params.user;
    const account = db[user];

    if (!account) {
        return res 
                .status(404)
                .json({error: 'User does not exist'});
    }
    return res.json(account);
});

router.post('/accounts', (req, res) => {
    const body = req.body;
    // validate required values
    if (!body.user || !body.currency) {
        return res
                .status(400)
                .json({error: 'user and currency are required'});
    }

    // check account doesn't exist
    if (db[body.user]) {
        return res 
                .status(400)
                .json({error: 'Account already exists'});
    }

    // balance
    let balance = body.balance;
    if(balance && typeof(balance) !== 'number') {
        balance = parseFloat(balance);
        if (isNan(balance)) {
            return res
                    .status(400)
                    .json({error: 'balance must be a number'});
        }
    }

    const account = {
        user : body.user,
        currency : body.currency,
        description : body.description || `${body.user}'s account`,
        balance : balance || 0,
        transactions : []
    };

    db[account.user] = account;

    return res
            .status(201)
            .json(account);
})

router.put('/accounts/:user', (req, res) => {
    const body = req.body;
    const user = req.params.user;
    const account = db[user];

    if (!account) {
        return res
                .status(400)
                .json({error : 'Can only edit currency and description'});
    }

    // validate only certain items editable
    if (body.user || body.balance || body.transactions) {
        return res
                .status(400)
                .json({ error: 'Can only edit currency and description'})
    }

    if (body.description) {
        account.decription = body.decription;
    }
    if (body.currency) {
        account.currency = body.currency;
    }

    return res
            .status(201)
            .json(account);
});

router.delete('accounts/:user', (req, res) => {
    const user = req.params.user;
    const account = db[user];

    if(!account) {
        return res
                .status(404)
                .json({error: "User not found"});
    }

    delete db[user];
    return res.status(204)
});

// register all out routes
app.use(apiRoot, router);

app.listen(port, () => {
    console.log('Server up!!');
});