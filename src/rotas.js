const express = require("express");
const rotas = express();
const {
  listarcontas,
  cadastrarContas,
  substituirUsuario,
  excluirUsuario,
} = require("./controllers/controladores");
const {
  depositar,
  sacar,
  transferir,
  apresentarSaldo,
  apresentarExtrato,
} = require("./controllers/controladoresSaldo");
const {
  validarSenha,
  validarCadastro,
  validacaoGeral,
  saldoZero,
  encontrarCadastro,
  validarSenhaBody,
  validarSenhaQuery
} = require("./intermediarios/intermediarios");


//listar todas as contas:
rotas.get("/contas", validarSenha, listarcontas);

//criar contas:
rotas.post(`/contas`, validacaoGeral, validarCadastro, cadastrarContas);

//substituir conta:
rotas.put(
  `/contas/:numeroConta/usuario`,
  validacaoGeral,
  validarCadastro,
  substituirUsuario
);

//excluir contas
rotas.delete(`/contas/:numeroConta`, saldoZero, excluirUsuario);

//depositar dinheiro
rotas.post(`/transacoes/depositar`, encontrarCadastro, depositar);

//sacar dinheiro
rotas.post(`/transacoes/sacar`, encontrarCadastro, validarSenhaBody, sacar);

//transferir dinheiro
rotas.post(
  `/transacoes/transferir`,
  encontrarCadastro,
  validarSenhaBody,
  transferir
);

//ver saldo
rotas.get(`/contas/saldo`, validarSenhaQuery, apresentarSaldo);

//extrato
rotas.get("/contas/extrato", validarSenhaQuery, apresentarExtrato);

module.exports = rotas;
