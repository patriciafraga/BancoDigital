const {
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");

//transferir dinheiro
const transferir = async (req, res) => {
  let { numero_conta_origem, numero_conta_destino, valor } = req.body;
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


    if (temSaldo1 <= 0 || temSaldo1 < valor || temSaldo2 <= 0 || temSaldo2 < valor) {
      return res.status(403).json({ mensagem: "Saldo indisponível!" });
    }
  

  const transferenciaER = {
    data: new Date(),
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };
  contaOrigem.saldo.valor = Number(contaOrigem.saldo.valor);
  contaDestino.saldo.valor = Number(contaDestino.saldo.valor);
  let tranfEnv = (contaOrigem.saldo.valor -= valor);
  let tranfRec = (contaDestino.saldo.valor += valor);
  contaOrigem.saldo = {
    data: new Date(),
    numero_conta_origem,
    valor: tranfEnv,
  };
  contaDestino.saldo = {
    data: new Date(),
    numero_conta_destino,
    valor: tranfRec,
  };
  transferencias.push(transferenciaER);
  res.status(200).json(transferencias);
};
module.exports = transferir;
