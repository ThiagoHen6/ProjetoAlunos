const alunoService = require("../services/AlunoService");

class AlunoController{
    
    async findMany(request, response){
        try{
            let {page, pageSize, orderBy, order} = request.query;
            page ||= 1;
            pageSize ||= 10;

            const {alunos, total} = await alunoService.findMany(page, pageSize, orderBy, order);
            return response.status(200).json({alunos, total});
        }catch(error){
            return response.status(error.statusCode || 500).json({error: error.message});
        }
    }

    async create(request, response){
        try{
            const aluno = await alunoService.create(request.body);
            return response.status(201).json({aluno});
        }catch(error){
            return response.status(400).json({error: error.message});
        }
    }
    async findById(request, response){
        try{
            const { id } = request.params;
            const aluno = await alunoService.findById(id);
            return response.status(200).json({aluno});
        }catch(error){
            return response.status(error.statusCode || 500).json({error: error.message});
        }
    }

}

module.exports = new AlunoController();