let { contas} = require("../bancodedados");

//listar todas as contas:
const listarcontas = async (req, res) => {
  return res.status(200).json(contas);
};

//criar contas:
const cadastrarContas = async (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const numeroConta = (dado) => {
    dado = 0;
    if (contas.length > 0) {
      const numerosCadastrados = contas.map((num) => num.numero);
      const ultimoNumeroCadastrado = Math.max(...numerosCadastrados);
      return ultimoNumeroCadastrado + 1;
    }
    return (dado + 1);
  };
  const correntista = {
    numero: numeroConta(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };
  contas.push(correntista);
  res.status(201).send();
};

//alterar ou substituir usuario:
const substituirUsuario = async (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;
  if (!numeroConta) {
    return res
      .status(400)
      .json({ mensagem: "Favor digitar o número da conta!" });
  }
  const numeroExistente = await contas.find(
    (item) => Number(item.numero) === Number(numeroConta)
  );
  if (numeroExistente === undefined) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }  
  numeroExistente.usuario.nome = nome;
  numeroExistente.usuario.cpf = cpf;
  numeroExistente.usuario.data_nascimento = data_nascimento;
  numeroExistente.usuario.telefone = telefone;
  numeroExistente.usuario.email = email;
  numeroExistente.usuario.senha = senha;
 return res.status(201).send();
};

//excluir contas
const excluirUsuario = async (req, res) => {
  const { numeroConta } = req.params;
  if (!numeroConta) {
    return res
      .status(400)
      .json({ mensagem: "Faltou informar o número da conta!" });
  }

  const numeroExistente = contas.findIndex(item => Number(item.numero) === Number(numeroConta));

  if (numeroExistente === -1) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }
  contas.splice(numeroExistente, 1);
  return res.status(204).send();
};

module.exports = {
  listarcontas,
  cadastrarContas,
  substituirUsuario,
  excluirUsuario
};
