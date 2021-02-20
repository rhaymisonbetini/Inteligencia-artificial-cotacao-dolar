const tf = require('@tensorflow/tfjs');
const fs = require('fs');

let arquivo = fs.readFileSync('cotacao-do-dolar.csv', { encoding: 'utf-8' });

arquivo = arquivo.toString().trim();

//transformando em array com a quebra de linha
const linhas = arquivo.split('\r\n');

let x = [];
let y = [];
let qtdLinhas = 0;

for (let i = 1; i < linhas.length; i++) {

    let diaAnterior = [];

    if (qtdLinhas == (linhas.length - 2)) {
        diaAnterior = ['01.01.2019', 3.8813, 3.8813, 3.8813, 3.8813]
    } else {
        diaAnterior = linhas[i + 1].split(';');
    }

    let diaAtual = linhas[i].split(';')

    //4 constantes sao as representacoes de cada coluna;
    const FechamentoX = Number(diaAnterior[1]);
    const AberturaX = Number(diaAnterior[2]);
    const MaximaX = Number(diaAnterior[3]);
    const MinimaX = Number(diaAnterior[4]);

    x.push([FechamentoX, AberturaX, MaximaX, MinimaX])

    const FechamentoY = Number(diaAtual[1]);
    const AberturaY = Number(diaAtual[2]);
    const MaximaY = Number(diaAtual[3]);
    const MinimaY = Number(diaAtual[4]);

    y.push([FechamentoY, AberturaY, MaximaY, MinimaY])

    qtdLinhas++;

}

const model = tf.sequential();

//4 dados de entrada e 4 colunas
const inputLayer = tf.layers.dense({ units: 4, inputShape: [4] })

model.add(inputLayer);
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

const X = tf.tensor(x, [qtdLinhas, 4]);
const Y = tf.tensor(y);

const arrInput = [[3.9285, 3.9708, 3.9781, 3.9251]]; // 08.05.2019

const input = tf.tensor(arrInput, [1, 4]);

model.fit(X, Y, { epochs: 20000 }).then(() => {

    let ouput = model.predict(input).dataSync();
    console.log(`PREÇO DAS COTAÇÕES: `);
    console.log(`Fechamento: R$ ${Number(ouput[0]).toFixed(4)}`);
    console.log(`Abertura: R$ ${Number(ouput[1]).toFixed(4)}`);
    console.log(`Maxima: R$ ${Number(ouput[2]).toFixed(4)}`);
    console.log(`Minima: R$ ${Number(ouput[3]).toFixed(4)}`);

})