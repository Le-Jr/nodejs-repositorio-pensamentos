    const flash = require('connect-flash/lib/flash')
    const Thought = require('../models/Thought')
    const User = require('../models/User')
    const { where, or } = require('sequelize')

    const{ Op } = require('sequelize')

    module.exports = class ThoughtController {

        static async showThoughts(req, res){

            let search = ''

            if(req.query.search){
                search = req.query.search
            }

            let order = 'DESC'

            if(req.query.order === 'old'){
                order = 'ASC'
            }else{
                order = 'DESC'
            }

            const thoughtsData = await Thought.findAll(

                {
                    include: User,
                    where: {title: {[Op.like]: `%${search}%` }},
                    order: [['createdAt', order]]
                }

            )
            const thoughts = thoughtsData.map((result) => result.get({plain:true}))
           
            let thoughtsQty = thoughts.length

            if(thoughtsQty === 0 ){
                thoughtsQty = false
            }

            res.render('thoughts/home', { thoughts, search, thoughtsQty })
        }


        static async dashboard(req, res){
            
            const UserId =req.session.userid


            const user = await User.findOne({where: {id : UserId}, include: Thought, plain: true })

            if(!user){
                res.redirect('/login')
            }


            const thoughts = user.Thoughts.map((result) => result.dataValues)

            let emptyThought = false

            if (thoughts.length === 0) {
                emptyThought = true
            }
            res.render('thoughts/dashboard', { thoughts, emptyThought })
        }

        static async createThought(req, res){

            res.render('thoughts/create')

        }

        static async createThoughtSave(req, res){

            const thought = {
                title: req.body.title,
                UserId: req.session.userid
            }

            try {
                await Thought.create(thought)

                req.flash('message', 'Pensamento criado com sucesso')

                req.session.save(() =>{
                    res.redirect('/thoughts/dashboard')
                })
            } catch (err) {
                console.log(err)
                
            }
        }

        static async removeThought(req, res){
            const id = req.body.id

           try {
            await Thought.destroy({where:{id:id}})

            req.flash('message', 'Pensamento removido com sucesso')

            req.session.save(() =>{
                res.redirect('/thoughts/dashboard')
            })

           } catch (err) {
            console.log(err)
            
           }
        }

        static async updateThought(req, res){
            const id = req.params.id

            const thought = await Thought.findOne({raw: true, where: {id:id}})

            res.render('thoughts/edit', { thought })
        }

        static async updateThoughtSave(req, res){
            const thought ={ title: req.body.title}
            const id = req.body.id

           
            try {
                await Thought.update(thought,{where:{id:id}})

                req.flash('message', 'pensamento atualizado com sucesosso')

                req.session.save(() =>{
                    res.redirect('/thoughts/dashboard')
                })

            } catch (err) {
                console.log(err)                
            }

        }
    }