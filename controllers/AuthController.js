const { where } = require('sequelize')
const User = require('../models/User')

const bcrypt = require('bcryptjs')


module.exports = class AuthController {

    static login(req, res){
        res.render('auth/login')
    }

    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){
        const {name, email, password, passwordconfirm} = req.body

        if(password != passwordconfirm){
            req.flash('message', 'As Senhas não são iguais')
            res.render('auth/register')

            return
        }

        const checkifUserExist = await User.findOne({where: {email:email}})

        if(checkifUserExist){
            req.flash('message', 'O email já está em uso')
            res.render('auth/register')

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt) 

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createdUser = await User.create(user)

            req.session.userid = createdUser.id

            
            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() =>{
                res.redirect('/')
            })
            
            
        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res){

        req.session.destroy()
        res.redirect('/login')
    }

    static async loginPost(req, res){
        const {email, password} = req.body;

        const user = await User.findOne({where: {email: email}})

        if(!user){
            req.flash('message', 'Usuário não encontrado')
            res.render('auth/login')

            return
        }

        //Verificando Senhas
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            req.flash('message', 'Senha inválida')
            res.render('auth/login')

            return
        }

            
            req.session.userid = user.id

            
            req.flash('message', 'Login realizado com sucesso!')

            req.session.save(() =>{
                res.redirect('/')
            })

        

    }

}