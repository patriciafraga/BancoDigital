const validarSenha = async (req, res, next) => {
  const { senha_banco } = req.query;
  if (!senha_banco) {
    return res.status(400).json({ mensagem: "A senha não foi digitada" });
  }
  if (senha_banco !== "Cubos123Bank") {
    return res.status(401).json({ mensagem: "A senha informada é inválida!" });
  }
  next();
};

const validacaoGeral = async (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios!" });
  }
  next();
};

const validarCadastro = async (req, res, next) => {
  const { cpf, email } = req.body;
  const { contas } = require("../bancodedados");
  const validarCpfEmail = contas.some((item) => {
    if (
      Number(item.usuario.cpf) === Number(cpf) ||
      item.usuario.email === email
    ) {
      return true;
    }
  });
  if (validarCpfEmail === true) {
    return res.status(400).json({
      mensagem: "Já existe uma conta com o cpf ou com e-mail informado!",
    });
  }
  next();
};

const saldoZero = async (req, res, next) => {
  const { numeroConta } = req.params;
  const { contas } = require("../bancodedados");
  const itemConta = contas.find(
    (item) => Number(item.numero) === Number(numeroConta)
  );
  if (!itemConta) {
    return res.status(403).json({
      mensagem: "Conta inexistente!",
    });
  }
  if (Number(itemConta.saldo !== 0)) {
    if (Number(itemConta.saldo.valor) !== 0) {
      return res.status(403).json({
        mensagem:
          "Não é possível excluir conta corrente enquanto houver saldo!",
      });
    }
  }
  next();
};

const encontrarCadastro = async (req, res, next) => {
  const { numero_conta, numero_conta_destino, numero_conta_origem } = req.body;
  let contaAValidar = numero_conta || numero_conta_destino || numero_conta_origem;
  const { contas } = require("../bancodedados");
  const contaExistente = await contas.find((item) => {
    return Number(item.numero) === Number(contaAValidar);
  });
  if (!contaExistente) {
    return res
      .status(400)
      .json({ mensagem: "Numero de conta inválido/inexistente!" });
  }
  next();
};

const validarSenhaBody = async (req, res, next) => {
  const { senha } = req.body;
  const { contas } = require("../bancodedados");
  if (!senha) {
    return res.status(400).json({ mensagem: "Obrigatório digitar a senha!" });
  }
  const senhaValida = await contas.find((item) => {
    return item.usuario.senha === senha;
  });
  if (!senhaValida) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }
  next();
};

const validarSenhaQuery = async (req, res, next) => {
  const { senha } = req.query;
  const { contas } = require("../bancodedados");
  if (!senha) {
    return res.status(400).json({ mensagem: "Obrigatório digitar a senha!" });
  }
  const senhaValida = await contas.find((item) => {
    return item.usuario.senha === senha;
  });
  if (!senhaValida) {
    return res.status(401).json({ mensagem: "Senha inválida!" });
  }
  next();
};

module.exports = {
  validarSenha,
  validacaoGeral,
  validarCadastro,
  saldoZero,
  encontrarCadastro,
  validarSenhaBody,
  validarSenhaQuery
};
