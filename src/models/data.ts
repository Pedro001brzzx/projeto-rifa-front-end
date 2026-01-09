/**
 * Dados Mockados da Aplicação
 * Model Layer - MVC Pattern
 */

import type { Campaign, FAQ } from './types';

export const campaigns: Campaign[] = [
    {
        id: 1,
        title: "EDIÇÃO 132 - KIT MUDANÇA DE VIDA - 3 GANHADORES",
        subtitle: "1º GM CRUZE LT 2022 + R$400.000,00 // 2º GM CRUZE LT 2022 + R$200.000,00 // 3º HONDA CB1000R 2012 + R$200.000,00",
        image: "https://s3.incrivelsorteios.com/redimensiona?key=600x600/20251217_6942e0d73bf2a.jpeg",
        status: "active"
    },
    {
        id: 2,
        title: "EDIÇÃO 135 - HONDA/ CB300F TWISTER 2026",
        subtitle: "HONDA/ CB300F TWISTER 2026",
        badge: "EDIÇÃO SELECT: APENAS 10 MIL PARTICIPANTES",
        code: "GIROS_LTP10M/135",
        date: "17/12",
        image: "https://s3.incrivelsorteios.com/redimensiona?key=600x600/20251217_6943170d88ec8.jpeg",
        status: "active"
    },
    {
        id: 3,
        title: "EDIÇÃO 129 - KIT MUDANÇA DE VIDA",
        subtitle: "HILUX SRV + COROLLA GLI + 300 MIL NA CONTA",
        date: "18/12",
        image: "https://s3.incrivelsorteios.com/redimensiona?key=600x600/20251216_6941909e6e0b4.jpeg",
        status: "concluded"
    },
    {
        id: 4,
        title: "EDIÇÃO 130 - VW/POLO TRACK 2026",
        subtitle: "VW/POLO TRACK 2026",
        code: "GIROS_LTP10M/130",
        date: "17/12",
        image: "https://s3.incrivelsorteios.com/redimensiona?key=600x600/20251216_6941b3602a1d3.jpeg",
        status: "concluded"
    },
    {
        id: 5,
        title: "EDIÇÃO 133 - 100 MIL",
        subtitle: "R$100.000,00",
        date: "18/12",
        image: "https://s3.incrivelsorteios.com/redimensiona?key=600x600/20251217_6942d8ad1dbf6.jpeg",
        status: "concluded"
    },
    {
        id: 6,
        title: "EDIÇÃO 134 - HONDA/ CG TITAN 2026",
        subtitle: "HONDA/ CG TITAN 2026",
        code: "GIROS_LTP10M/134",
        date: "17/12",
        image: "https://s3.incrivelsorteios.com/redimensiona?key=600x600/20251217_6943162f8a9ca.jpeg",
        status: "concluded"
    }
];

export const faqs: FAQ[] = [
    {
        question: "Como é o processo do sorteio?",
        answer: "Sorteio será realizado com base na extração da Loteria Federal, conforme Condições de Participação constantes no título"
    },
    {
        question: "Como o prêmio será entregue?",
        answer: "Não há necessidade de se preocupar com os trâmites relacionados à entrega do prêmio, pois nós cuidaremos de tudo."
    },
    {
        question: "Onde encontro minhas compras?",
        answer: "Existem duas formas de você conseguir acessar suas compras, a primeira é logando no site, abrindo o menu do site e clicando em 'Entrar' e a segunda forma é visitando a campanha e clicando em 'Compras' logo a baixo do nome 'Chances'"
    },
    {
        question: "Quem são os ganhadores?",
        answer: "Para visualizar os ganhadores, acesse o menu e clique em GANHADORES (ícone de 3 linhas no canto superior direito > ganhadores)"
    }
];
