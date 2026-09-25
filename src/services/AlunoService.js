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
}

module.exports = new AlunoService();