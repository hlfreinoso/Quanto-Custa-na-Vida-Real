# Produto

## Visao Geral

O Quanto custa na vida real transforma precos em comparacoes reais da vida do usuario, como horas de trabalho e equivalencias tangiveis do cotidiano.

## Proposta de Valor

Antes de comprar, o usuario entende quanto aquele valor representa na propria vida.

## Fluxo Atual

1. Home amigavel com botao `Iniciar`.
2. Se nao houver perfil salvo, abrir onboarding.
3. Onboarding coleta renda mensal liquida e preferencias de comparacao.
4. Se ja houver perfil salvo, pular onboarding.
5. Calculadora coleta produto e preco.
6. Resultado mostra horas do trabalho e comparacoes sorteadas.
7. Usuario pode fazer `Novo comparativo` ou `Mudar preferencias`.

## Preferencias de Comparacao

As preferencias devem ser opcionais, sem itens pre-selecionados.

As opcoes precisam ser diretas, tangiveis e com preco de referencia claro. Evitar categorias amplas como `Mercado` ou `Delivery`, porque variam demais para comparacao imediata.

Exemplos atuais:

- Cafe;
- Cerveja lata;
- Bombons;
- Hamburguer;
- Netflix;
- Gasolina;
- Onibus;
- Cinema;
- Acai;
- Pizza;
- Pao frances;
- Refrigerante 2L;
- Uber curto.

## Resultado

O resultado deve sempre mostrar:

```text
Essa compra custa:
52 horas do seu trabalho
6 meses de Netflix
180 cafes
250 bombons
```

As comparacoes, exceto horas de trabalho, devem ser sorteadas usando as preferencias do usuario e fallback local quando necessario.

## Posicionamento

O app deve ser simples, visual, brasileiro, compartilhavel e levemente provocativo. Ele nao deve parecer um controle financeiro complexo.

## Publico-Alvo

- jovens adultos;
- trabalhadores CLT;
- autonomos;
- estudantes;
- pessoas tentando economizar;
- consumidores de marketplace;
- usuarios de WhatsApp, Instagram e TikTok.

## Viralidade

A tela de resultado e os cards compartilhaveis sao o centro do produto. O app deve facilitar o compartilhamento como imagem e texto em etapa futura.
