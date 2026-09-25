const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");


class AlunoService{

    async findMany(page, pageSize, orderBy, order){
    const camposValidos = ["id", "nome", "email", "createdAt", "updatedAt"];
    const campo = camposValidos.includes(orderBy) ? orderBy : "id";
    const direcao = (order === "asc" || order === "desc") ? order : "asc";

    const [alunos, total] = await Promise.all([
        prisma.aluno.findMany({
            skip: (page - 1) * pageSize,
            take: Number(pageSize),
            orderBy: { [campo]: direcao }
        }),
        prisma.aluno.count()
    ]);

    return { alunos, total };
}

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }

        const novoAluno = await prisma.aluno.create({data: aluno});

        return novoAluno;
    }

    async findById(id){
        const aluno = await prisma.aluno.findUnique({
            where: { id: Number(id) }
        });

        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
    }

    async update(id, dados){
        await this.findById(id); 

        const { nome, email } = dados;
        if(!nome && !email){
            throw new AlunoInvalidoError("Envie ao menos um campo (nome ou email) para atualizar");
        }

        try{
            const alunoAtualizado = await prisma.aluno.update({
                where: { id: Number(id) },
                data: dados
            });
            return alunoAtualizado;
        }catch(error){
            if(error.code === "P2002"){
                throw new AlunoInvalidoError("Este e-mail já está em uso por outro aluno", 409);
            }
            throw error;
        }
    }
}

module.exports = new AlunoService();