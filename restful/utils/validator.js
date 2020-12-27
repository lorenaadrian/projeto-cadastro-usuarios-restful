module.exports = {
    user: (app,req,res) =>{
        req.assert('_name', 'Nome é um campo obrigatório').notEmpty();
        req.assert('_email', 'O campo e-mail está inválido').notEmpty().isEmail();
        let errors = req.validationErrors();
        if(errors){
            app.utils.error.send(errors, req,res);
            return false;
        } else {
            return true;
        }
    }
};