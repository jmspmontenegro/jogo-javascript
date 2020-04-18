console.log('Debug - Jogo em Javascript com Canvas');

let frames = 0;
const sprites = new Image();
sprites.src = './sprites.png';

const audioHit = new Audio();
audioHit.src = './audio/hit.wav';

const audioPulo = new Audio();
audioPulo.src = './audio/pulo.wav';

const audioInicio = new Audio();
audioInicio.src = './audio/iniciar.wav';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//
// [OBJETOS]
//

function criaChao() {

    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY, //X e Y da seleção no Photoshop
                chao.largura, chao.altura, //Tamanho do recorte
                chao.x, chao.y, //Onde no canvas vai ser colocado
                chao.largura, chao.altura //Qual o tamanho no canvas
            );
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura
            );
        },
        atualiza() {
            const movimentoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoChao;

            chao.x = movimentacao % repeteEm;
        }
    };

    return chao;
}


const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura
        );
    }
};

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 276,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        );
    }
};

function fazColisao(flappyBird, chao) {
    if (flappyBird.y >= chao.y - flappyBird.altura) {
        return true;
    }
    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 34,
        altura: 24,
        x: 10,
        y: 50,
        gravidade: 0.20,
        velocidade: 0,
        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                audioHit.play();
                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);
                return;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        animacao: [
            { spriteX: 0, spriteY: 0 },
            { spriteX: 0, spriteY: 26 },
            { spriteX: 0, spriteY: 52 }
        ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloFrames = 7;
            if ((frames % intervaloFrames) == 0) {
                const baseIncremento = 1;
                const incremento = flappyBird.frameAtual + baseIncremento;
                const baseRepeticao = flappyBird.animacao.length;

                flappyBird.frameAtual = incremento % baseRepeticao;
            }

        },
        desenha() {
            flappyBird.atualizaFrameAtual();
            const { spriteX, spriteY } = flappyBird.animacao[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura
            );
        },
        pulo: 6,
        pula() {
            flappyBird.velocidade = -flappyBird.pulo;
            audioPulo.play();
        }
    };

    return flappyBird;
}

//
// [ TELAS ]
//
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        },
        atualiza() {
            globais.chao.atualiza();
        },
        click() {
            audioInicio.play();
            mudaParaTela(Telas.JOGO);
        }
    }
}
Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    atualiza() {
        globais.flappyBird.atualiza();
        globais.chao.atualiza();
    },
    click() {
        globais.flappyBird.pula();
    }
}

function loop() {
    telaAtiva.atualiza();
    telaAtiva.desenha();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

//
// [ MAIN ]
//

window.addEventListener('click', function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});
mudaParaTela(Telas.INICIO);
loop();