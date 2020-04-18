console.log('Debug - Jogo em Javascript com Canvas');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

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

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 34,
    altura: 24,
    x: 10,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY,
            flappyBird.largura, flappyBird.altura,
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura
        );
    }
};

function loop() {
    planoDeFundo.desenha();
    chao.desenha();
    flappyBird.desenha();

    flappyBird.y = flappyBird.y + 1;

    requestAnimationFrame(loop);
}

loop();