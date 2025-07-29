const { readFileSync } = require('fs');

// ==== Classe de serviço ====

class ServicoCalculoFatura {
  getPeca(pecas, apresentacao) {
    return pecas[apresentacao.id];
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    const peca = this.getPeca(pecas, apre);

    switch (peca.tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }

    return total;
  }

  calcularCredito(pecas, apre) {
    let creditos = 0;
    const peca = this.getPeca(pecas, apre);

    creditos += Math.max(apre.audiencia - 30, 0);
    if (peca.tipo === "comedia") {
      creditos += Math.floor(apre.audiencia / 5);
    }

    return creditos;
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      total += this.calcularCredito(pecas, apre);
    }
    return total;
  }

  calcularTotalFatura(pecas, apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      total += this.calcularTotalApresentacao(pecas, apre);
    }
    return total;
  }
}

// ==== Funções de apresentação ====

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

function gerarFaturaStr(fatura, pecas, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

// function gerarFaturaHTML(...) { ... }
// >>> HTML TEMPORARIAMENTE COMENTADO CONFORME INSTRUÇÃO <<<

// ==== Execução principal ====

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const calc = new ServicoCalculoFatura();

const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);

// const faturaHTML = gerarFaturaHTML(faturas, pecas); // comentado
// console.log(faturaHTML);
