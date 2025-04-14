const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const conn = require('./db/conn')

// models
const Tought = require('./models/Tought')
const User = require('./models/User')

// routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authsRoutes = require('./routes/authRoutes')

//controller
const ToughtsController = require('./controllers/ToughtsController')

const app = express()

// templete engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// receber respostas do body
app.use(
    express.urlencoded({
        extended:true
    })
)

// receber dados do json
app.use(express.json())

// session middleware
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: () => {},
        path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}))

// flash messages
app.use(flash())

// public path
app.use(express.static('public'))

// set sessions to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

// routes views
app.use('/toughts', toughtsRoutes)
app.use('/', authsRoutes)
app.get('/', ToughtsController.showTougths)



conn.sync().then(() => {
    app.listen(3003)
}).catch((err) => {
    console.log(err)
})