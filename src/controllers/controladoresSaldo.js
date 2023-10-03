let { contas, saques, depositos, transferencias } = require("../bancodedados");
const {format} = require('date-fns');
// let data = new Date();
// const dataFormatada = format(data, "yyyy-MM-dd HH:mm:ss")
// data = dataFormatada;

const depositar = async (req, res) => {
  let { numero_conta, valor } = req.body;
  valor = Number(valor);
  let data = new Date();
const dataFormatada = format(data, "yyyy-MM-dd HH:mm:ss")
data = dataFormatada;
  if (!numero_conta || !valor) {
    return res
      .status(400)
      .json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "Deposite um valor válido (maior que 0)" });
  }
  const itemConta = contas.find(
    (item) => Number(item.numero) === Number(numero_conta)
  );
  let deposito = valor;
  let movimentoConta = Number(itemConta.saldo.valor);
  console.log(movimentoConta);
  if (Number(itemConta.saldo) !== 0) {
    deposito += movimentoConta;
  }
  itemConta.saldo = {
    data,
    numero_conta,
    valor: deposito,
  };
  let depositoExtrato = {
    data,
    numero_conta,
    valor,
  };
  depositos.push(depositoExtrato);
  res.status(204).send();
};

const sacar = async (req, res) => {
  let { numero_conta, valor, senha } = req.body;
  valor = Number(valor);
  let data = new Date();
const dataFormatada = format(data, "yyyy-MM-dd HH:mm:ss")
data = dataFormatada;
  if (!numero_conta || !valor || !senha) {
    return res.status(400).json({
      mensagem: "O número da conta, o valor e a senha são obrigatórios!",
    });
  }
  if (valor <= 0) {
    return res
      .status(400)
      .json({ mensagem: "Deposite um valor válido (maior que 0)" });
  }
  let saque = 0;
  const itemConta = contas.find(
    (item) => Number(item.numero) === Number(numero_conta)
  );
  let temSaldo1 = Number(itemConta.saldo.valor);
  let temSaldo2 = Number(itemConta.saldo);
  if (
    temSaldo1 <= 0 ||
    temSaldo1 < valor ||
    temSaldo2 <= 0 ||
    temSaldo2 < valor
  ) {
    return res.status(403).json({ mensagem: "Saldo indisponível!" });
  } else {
    saque = temSaldo1 -= valor;
  }
  saque = Number(saque);
  itemConta.saldo = {
    data,
    numero_conta,
    valor: saque,
  };
  let saqueExtrato = {
    data,
    numero_conta,
    valor,
  };
  saques.push(saqueExtrato);
  res.status(204).send();
};

const transferir = async (req, res) => {
  let { numero_conta_origem, numero_conta_destino, valor } = req.body;
  let data = new Date();
const dataFormatada = format(data, "yyyy-MM-dd HH:mm:ss")
data = dataFormatada;
  valor = Number(valor);
  if (!valor || valor <= 0) {
    return res.status(400).json({
      mensagem: "Digite um valor válido para transferência (maior que 0)",
    });
  }
  const contaOrigem = contas.find(
    (item) => Number(item.numero) === Number(numero_conta_origem)
  );
  const contaDestino = contas.find(
    (item) => Number(item.numero) === Number(numero_conta_destino)
  );
  let temSaldo1 = Number(contaOrigem.saldo.valor);
  let temSaldo2 = Number(contaOrigem.saldo);
  if (
    temSaldo1 <= 0 ||
    temSaldo1 < valor ||
    temSaldo2 <= 0 ||
    temSaldo2 < valor
  ) {
    return res.status(403).json({ mensagem: "Saldo indisponível!" });
  }
  const transferenciaER = {
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };
  let movimentoDebito = Number(contaOrigem.saldo.valor);
  let movimentoCredito = Number(contaDestino.saldo.valor);
  let tranfEnv = (movimentoDebito -= valor);
  let tranfRec = (movimentoCredito += valor);
  contaOrigem.saldo = {
    data,
    numero_conta_origem,
    valor: tranfEnv,
  };
  contaDestino.saldo = {
    data,
    numero_conta_destino,
    valor: tranfRec,
  };
  transferencias.push(transferenciaER);
  res.status(204).send();
};

const apresentarSaldo = async (req, res) => {
  const { numero_conta } = req.query;
  if (!numero_conta) {
    return res.status(400).json({
      mensagem: "O número da conta é obrigatório!",
    });
  }
  const itemConta = contas.find(
    (item) => Number(item.numero) === Number(numero_conta)
  );
  if (!itemConta) {
    return res
      .status(400)
      .json({ mensagem: "Numero de conta inválido/inexistente!" });
  }
  let contaZerada = Number(itemConta.saldo);
  let movimentoConta = Number(itemConta.saldo.valor);
  if (Number(itemConta.saldo !== 0)) {
    return res.status(201).json({ saldo: movimentoConta});
  } else {
    return res.status(201).json({ saldo: contaZerada });
  }
};

const apresentarExtrato = async (req, res) => {
  const { numero_conta } = req.query;
  const itemConta = contas.find(
    (item) => Number(item.numero) === Number(numero_conta)
  );
  if (!itemConta) {
    return res
      .status(400)
      .json({ mensagem: "Numero de conta inválido/inexistente!" });
  }
  const saquesConta = saques.filter(
    (saque) => saque.numero_conta === numero_conta
  );
  const depositosConta = depositos.filter(
    (deposito) => deposito.numero_conta === numero_conta
  );
  const transferenciasEnviadasConta = transferencias.filter(
    (transferencia) => transferencia.numero_conta_origem === numero_conta
  );
  const transferenciasRecebidasConta = transferencias.filter(
    (transferencia) => transferencia.numero_conta_destino === numero_conta
  );
  const extrato = {
    saques: saquesConta,
    depositos: depositosConta,
    transferenciasEnviadas: transferenciasEnviadasConta.map(
      ({ data, numero_conta_origem, numero_conta_destino, valor }) => ({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor,
      })
    ),
    transferenciasRecebidas: transferenciasRecebidasConta.map(
      ({ data, numero_conta_origem, numero_conta_destino, valor }) => ({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor,
      })
    ),
  };
  itemConta.extrato = extrato;
  res.status(201).json(itemConta.extrato);
};

module.exports = {
  depositar,
  sacar,
  transferir,
  apresentarSaldo,
  apresentarExtrato,
};
