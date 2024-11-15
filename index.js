const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const conn = require('./db/conn')
const app = express();
const Thought = require('./models/Thought')
const User = require('./models/User')
const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')
const ThoughtController = require('./controllers/ThoughtController')
const { FORCE } = require('sequelize/lib/index-hints')



//Configurações iniciais do projeto
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            //expires: new Date(Date.now + 360000),
            httponly: true,
        }
    })
)

//Flash Messages. Mensagens de alteração do sistema

app.use(flash())

//Public Path
app.use(express.static('public'))

//Salvar a seção
app.use((req, res, next) =>{

    if(req.session.userid){
        res.locals.session = req.session
    }

    next();

})

//Routes
app.use('/thoughts', thoughtsRoutes )
app.use('/', authRoutes )
app.get('/', ThoughtController.showThoughts)



conn.sync().then(() => app.listen(3000, () =>{console.log('Servidor rodando ')}))