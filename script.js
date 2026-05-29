let dia = 1;
let produtividade = 50;
let sustentabilidade = 50;
let aguaRecursos = 100;

// Variáveis de renderização visual
let nivelVerdeGrama = 80;
let quantidadeArvores = 1;
let alturaPlantas = 0;
let modoEfeitoEspecial = "nenhum"; // trator, drone, chuva

function atualizarInterface() {
    document.getElementById("dia-val").innerText = dia;
    document.getElementById("prod-val").innerText = produtividade + "%";
    document.getElementById("sust-val").innerText = sustentabilidade + "%";
    document.getElementById("agua-val").innerText = aguaRecursos + " Litros";
}

// Mecânica Ativa: Executa efeitos diretos no ecossistema
function executarAcao(tipo) {
    if (aguaRecursos <= 0 && tipo === 'drone') {
        document.getElementById("feedback-texto").innerText = "❌ Sem água restante no reservatório para o Drone!";
        return;
    }

    modoEfeitoEspecial = tipo;

    if (tipo === "trator") {
        produtividade = constrain(produtividade + 15, 0, 100);
        sustentabilidade = constrain(sustentabilidade - 10, 0, 100);
        nivelVerdeGrama = constrain(nivelVerdeGrama - 20, 20, 200);
        document.getElementById("feedback-texto").innerText = "🚜 Você passou o trator pesado e jogou adubo químico. O solo sofreu, mas a produção acelerou!";
    }
    else if (tipo === "direto") {
        sustentabilidade = constrain(sustentabilidade + 15, 0, 100);
        nivelVerdeGrama = constrain(nivelVerdeGrama + 25, 20, 200);
        document.getElementById("feedback-texto").innerText = "🌱 Plantio Direto aplicado! A palhada velha protege a umidade natural da terra.";
    }
    else if (tipo === "drone") {
        aguaRecursos = constrain(aguaRecursos - 25, 0, 150);
        alturaPlantas = constrain(alturaPlantas + 4, 0, 15);
        produtividade = constrain(produtividade + 5, 0, 100);
        document.getElementById("feedback-texto").innerText = "🛸 Os sensores IoT e o Drone liberaram irrigação de precisão cirúrgica nas mudas!";
    }
    else if (tipo === "ilpf") {
        quantidadeArvores = constrain(quantidadeArvores + 1, 0, 6);
        sustentabilidade = constrain(sustentabilidade + 10, 0, 100);
        document.getElementById("feedback-texto").innerText = "🌳 Nova árvore nativa integrada ao pasto. Isso vai proteger a fazenda contra a seca extrema!";
    }

    atualizarInterface();
}

// Passagem de ciclos (O ambiente reage de forma autônoma)
function passarDia() {
    dia++;
    modoEfeitoEspecial = "chuva"; // Efeito visual de transição de ciclo
   
    // Natureza cobrando o preço: Se sustentabilidade estiver baixa, perde recursos
    if (sustentabilidade < 40) {
        aguaRecursos = constrain(aguaRecursos - 15, 0, 150);
        alturaPlantas = constrain(alturaPlantas - 2, 0, 15); // Plantas secam
    } else {
        aguaRecursos = constrain(aguaRecursos + 20, 0, 150); // Ecossistema equilibrado recupera água
        alturaPlantas = constrain(alturaPlantas + 1, 0, 15);
    }

    // Checagem de Finais/Metas no Dia 5
    if (dia >= 6) {
        finalizarSimulacao();
        return;
    }

    setTimeout(() => { modoEfeitoEspecial = "nenhum"; }, 1000);
    atualizarInterface();
}

function finalizarSimulacao() {
    let titulo = document.querySelector(".painel-comando h2");
    let texto = document.getElementById("feedback-texto");
    let grade = document.querySelector(".grade-botoes");
    let btnDia = document.getElementById("btn-passar-dia");

    grade.style.display = "none";
    btnDia.innerText = "🔄 Reiniciar Simulação";
    btnDia.onclick = () => { location.reload(); };

    titulo.innerText = "Fim do Ciclo de Avaliação!";
    if (produtividade >= 70 && sustentabilidade >= 70) {
        texto.innerText = "🏆 SUCESSO TOTAL! Abigail transformou a Alvorada em uma fazenda do futuro tecnológica e 100% ecológica. O solo está rico e lucrativo!";
    } else if (produtividade > sustentabilidade) {
        texto.innerText = "⚠️ Alerta de Degradação: Você lucrou muito, mas o solo virou poeira e os rios secaram. A fazenda quebrará no próximo ano.";
    } else {
        texto.innerText = "📉 Alerta de Falência: A natureza está linda, mas as plantações não renderam o suficiente para pagar os custos operacionais.";
    }
}

// --- ENGINE GRÁFICA INTERATIVA COMPATÍVEL COM SNES ZELDA ---
function setup() {
    let canvas = createCanvas(800, 300);
    canvas.parent('canvas-holder');
    noStroke();
    noSmooth();
    atualizarInterface();
}

function draw() {
    scale(4); // Pixel perfeito 16-bits

    // Cores dinâmicas com base no nível ecológico do solo
    let corCeu = color(95, 140, 215);
    let corMontanha = color(68, 108, 91);
    let corSolo = (sustentabilidade < 40) ? color(130, 95, 75) : color(85, 55, 40);

    background(corCeu);

    // Montanhas de Fundo
    fill(corMontanha);
    rect(0, 32, 200, 43); rect(40, 20, 50, 55); rect(120, 15, 60, 60);

    // Terreno e Subsolo
    fill(corSolo); rect(0, 45, 200, 30);

    // Camada Dinâmica de Grama
    let gVerde = 40 + (nivelVerdeGrama * 0.7);
    let gVermelho = 140 - (nivelVerdeGrama * 0.4);
    fill(gVermelho, gVerde, 45);
    rect(0, 45, 200, 4);

    // Desenho das Árvores Compradas (Limite de 6 no canvas)
    for (let i = 0; i < quantidadeArvores; i++) {
        desenharArvoreZelda(60 + (i * 14), 45);
    }

    // Canteiros de Cultivo Ativos
    for (let px = 150; px < 200; px += 16) {
        fill(60, 35, 20); rect(px, 48, 12, 25); // Sulco da terra
        // Plantas crescendo
        fill(45, 195, 80);
        rect(px + 4, 65 - alturaPlantas, 4, alturaPlantas);
    }

    // Cabana da Sede da Fazenda
    fill(140, 45, 45); rect(8, 22, 24, 23);
    fill(55); rect(16, 33, 7, 12); // Porta

    // --- SPRITE DA ABIGAIL (ESTILO LINK RETRÔ COMPACTO) ---
    let bx = 38;
    let by = 31;

    fill(140, 55, 15); rect(bx - 1, by + 1, 9, 6); // Cabelo Ruivo Traseiro
    fill(215, 45, 45); rect(bx - 1, by - 1, 9, 3); // Boné de Trabalho
    fill(245, 200, 170); rect(bx, by + 3, 7, 5);  // Rosto
    fill(15, 15, 15); rect(bx + 1, by + 5, 1, 2); rect(bx + 5, by + 5, 1, 2); // Olhos
    fill(235, 95, 135); rect(bx, by + 8, 7, 4);   // Camisa Rosa
    fill(40, 75, 145); rect(bx, by + 11, 7, 4);   // Jardineira Jeans
    fill(80, 50, 30); rect(bx, by + 15, 3, 2); rect(bx + 4, by + 15, 3, 2); // Botas

    // --- RENDERIZADOR DE PARTICULAS E EFEITOS ESPECIAIS ---
    if (modoEfeitoEspecial === "trator") {
        fill(240, 240, 240, 180); // Fumaça cinza de poluição
        rect(bx + 10, 42 - (frameCount % 10), 4, 4);
    }
    else if (modoEfeitoEspecial === "drone") {
        fill(0, 190, 255, 150); // Partículas de água azul brilhante caindo
        for (let i = 0; i < 3; i++) {
            rect(150 + (i * 15) + (frameCount % 5), 30 + (frameCount % 15), 1, 3);
        }
    }
    else if (modoEfeitoEspecial === "chuva") {
        fill(255, 255, 255, 100); // Overlay piscante de virada de dia
        rect(0, 0, 200, 75);
    }
}

function desenharArvoreZelda(x, y) {
    fill(80, 50, 30); rect(x, y - 6, 2, 6);
    fill(35, 95, 55); rect(x - 4, y - 13, 10, 7);
    fill(55, 145, 80); rect(x - 2, y - 11, 6, 4);
}