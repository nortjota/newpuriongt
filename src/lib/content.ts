// All page copy and product data in one place.

// TODO: add the WhatsApp number (e.g. https://wa.me/5547999999999). The design left it empty.
export const WHATSAPP_URL = 'https://wa.me/';
export const INSTAGRAM_URL = 'https://instagram.com/puriongt';

export const MARQUEE = ['Exala presença', 'Deixa memória', 'Luxo em cada detalhe', 'A diferença que você pode cheirar'];

export const MANIFESTO_WORDS =
  'Você gasta horas cuidando do seu carro. Polimento, detalhamento, acessórios premium. E o cheiro? Aceita qualquer coisa pendurada no retrovisor. A Purion GT nasceu para acabar com essa contradição.'.split(
    ' ',
  );

/* ---------- Fragrance ---------- */
export const NOTE_COLORS: Record<string, string> = {
  Maçã: 'oklch(0.74 0.17 135)',
  Abacaxi: 'oklch(0.86 0.16 95)',
  Tangerina: 'oklch(0.73 0.18 55)',
  Rosa: 'oklch(0.7 0.15 0)',
  Jasmim: 'oklch(0.94 0.04 95)',
  Baunilha: 'oklch(0.85 0.08 80)',
  Musk: 'oklch(0.84 0.02 300)',
  Couro: 'oklch(0.5 0.07 45)',
  Patchouli: 'oklch(0.54 0.08 70)',
  Âmbar: 'oklch(0.74 0.15 65)',
  'Musgo de carvalho': 'oklch(0.54 0.08 135)',
};

export type Level = { k: string; band: string; glow: string; t: string; notes: string[] };
export const LEVELS: Level[] = [
  { k: 'Saída', band: 'oklch(0.8 0.15 90 / .22)', glow: 'oklch(0.8 0.16 95)', t: 'Abertura fresca e frutada que desperta os sentidos.', notes: ['Maçã', 'Abacaxi', 'Tangerina'] },
  { k: 'Corpo', band: 'oklch(0.7 0.14 0 / .22)', glow: 'oklch(0.72 0.15 0)', t: 'Coração floral, sofisticado e elegante, que revela personalidade.', notes: ['Rosa', 'Jasmim', 'Baunilha'] },
  { k: 'Fundo', band: 'oklch(0.6 0.1 55 / .28)', glow: 'oklch(0.66 0.13 60)', t: 'Base amadeirada, intensa e marcante, que fixa e deixa rastro.', notes: ['Musk', 'Couro', 'Patchouli', 'Âmbar', 'Musgo de carvalho'] },
];

// [name, width %, color, dark text?]
export const ACCORDS: [string, number, string, boolean][] = [
  ['frutado', 96, 'oklch(0.66 0.19 35)', true],
  ['amadeirado', 90, 'oklch(0.45 0.08 55)', false],
  ['couro', 84, 'oklch(0.4 0.05 40)', false],
  ['doce', 78, 'oklch(0.58 0.17 20)', false],
  ['floral', 72, 'oklch(0.74 0.12 350)', true],
  ['âmbar', 68, 'oklch(0.72 0.14 70)', true],
  ['cítrico', 62, 'oklch(0.82 0.15 110)', true],
  ['almiscarado', 58, 'oklch(0.72 0.03 300)', true],
  ['musgo', 50, 'oklch(0.45 0.07 135)', false],
];

// [label, icon, %, color]
export const SEASONS: [string, string, number, string][] = [
  ['Inverno', 'snowflake', 82, 'var(--ice-400)'],
  ['Primavera', 'flower-2', 70, 'oklch(0.78 0.14 140)'],
  ['Verão', 'sun', 56, 'var(--sun-400)'],
  ['Outono', 'leaf', 90, 'oklch(0.7 0.13 55)'],
  ['Dia', 'sun-medium', 68, 'var(--sun-600)'],
  ['Noite', 'moon', 94, 'var(--ice-600)'],
];

// [label, level, segments of 5]
export const PERFORMANCE: [string, string, number][] = [
  ['Fixação', 'Alta', 5],
  ['Projeção', 'Marcante', 4],
  ['Rastro', 'Presente', 4],
  ['Doçura', 'Equilibrada', 3],
];

/* ---------- Drive scene ---------- */
export const DRIVE_STEPS = [
  { time: '00:00', title: 'Porta abre.', body: 'A primeira nota chega antes de você sentar.', label: 'Porta abre' },
  { time: '00:15', title: 'Saída.', body: 'Maçã, abacaxi e tangerina acordam o habitáculo.', label: 'Saída' },
  { time: '02:00', title: 'Na estrada.', body: 'Rosa, jasmim e baunilha assumem o caminho.', label: 'Estrada' },
  { time: 'Chegada', title: 'Deixa memória.', body: 'Couro e âmbar ficam depois que você sai do carro.', label: 'Rastro' },
];
// Particle palette per step
export const DRIVE_PALETTE = [
  ['var(--paper-0)', 'var(--ice-200)', 'var(--ice-400)'],
  ['oklch(0.74 0.17 135)', 'oklch(0.86 0.16 95)', 'oklch(0.73 0.18 55)'],
  ['oklch(0.7 0.15 0)', 'oklch(0.94 0.04 95)', 'oklch(0.85 0.08 80)'],
  ['oklch(0.55 0.08 45)', 'oklch(0.74 0.15 65)', 'oklch(0.84 0.02 300)'],
];

/* ---------- Comparison ---------- */
// [criterion, common, Purion GT, common score out of 5]
export const COMPARE_ROWS: [string, string, string, number][] = [
  ['Duração', '2 a 5 dias', 'Até 700 borrifadas', 1],
  ['Qualidade', 'Artificial, enjoativo', 'Alta perfumaria', 1],
  ['Design', 'Papelão no retrovisor', 'Vidro colecionável', 1],
  ['Ambiente', 'Disfarça mau cheiro', 'Atmosfera sofisticada', 2],
  ['Impressão', 'Esquecível', '“Que cheiro é esse?”', 1],
  ['Status', 'Igual ao táxi', 'Declara seu padrão', 1],
  ['Resíduo', 'Mancha o retrovisor', 'Zero resíduo', 1],
  ['Fixação', 'Evapora em horas', 'Constante por meses', 1],
  ['Custo', 'Gasto contínuo', 'Um investimento', 2],
  ['Exclusividade', 'Todo carro igual', 'Fragrância única', 1],
];

/* ---------- Quiz ---------- */
export type QuizQuestion = { q: string; o: [string, string, 1 | 2 | 3][] };
export const QUIZ: QuizQuestion[] = [
  { q: 'Onde você mais dirige?', o: [['Cidade, no dia a dia', 'building-2', 1], ['Estrada, longas distâncias', 'route', 3], ['À noite, sem pressa', 'moon', 2]] },
  { q: 'O que te marca num ambiente?', o: [['Frescor', 'wind', 1], ['Elegância', 'flower-2', 2], ['Intensidade', 'flame', 3]] },
  { q: 'Seu carro é…', o: [['Extensão do escritório', 'briefcase', 1], ['Um refúgio', 'armchair', 2], ['Uma declaração', 'crown', 3]] },
  { q: 'Qual horário é o seu?', o: [['Manhã cedo', 'sunrise', 1], ['Fim de tarde', 'sunset', 2], ['Madrugada', 'moon-star', 3]] },
  { q: 'Como quer ser lembrado?', o: [['Leve e luminoso', 'sparkles', 1], ['Sofisticado', 'gem', 2], ['Marcante', 'zap', 3]] },
];
export const QUIZ_RESULTS: Record<1 | 2 | 3, { title: string; body: string }> = {
  1: { title: 'Abertura luminosa.', body: 'Seu tempo é a saída: maçã, abacaxi e tangerina recebem você a cada porta aberta.' },
  2: { title: 'Elegância no habitáculo.', body: 'Seu tempo é o corpo: rosa, jasmim e baunilha. Sofisticado, sem pedir atenção.' },
  3: { title: 'Presença que fica.', body: 'Seu tempo é o fundo: couro, âmbar e musgo de carvalho fixam e deixam rastro.' },
};

/* ---------- Videos ---------- */
export type Video = { t: 'Influencers' | 'UGC' | 'Clientes'; h: string; title: string; img: string; pos: string; src: string };
// TODO: replace `src` with real MP4 (9:16) files from influencers, UGC and customers.
export const VIDEOS: Video[] = [
  { t: 'Influencers', h: '@creator', title: 'Primeira impressão no carro', img: '/assets/hero-banner.png', pos: '72% center', src: '' },
  { t: 'UGC', h: '@cliente', title: 'Unboxing Purion GT', img: '/assets/product-studio.png', pos: 'center', src: '' },
  { t: 'Clientes', h: 'Gilson · Itajaí/SC', title: '“Todo mundo pergunta o que é”', img: '/assets/hero-street.png', pos: 'left center', src: '' },
  { t: 'Influencers', h: '@creator', title: 'Teste de fixação', img: '/assets/hero-street.png', pos: 'right center', src: '' },
  { t: 'UGC', h: '@cliente', title: 'POV: entrando no carro', img: '/assets/hero-banner.png', pos: '58% center', src: '' },
  { t: 'Clientes', h: 'Marcos · BH/MG', title: '“O frasco fica bonito no porta-luvas”', img: '/assets/product-studio.png', pos: 'center', src: '' },
  { t: 'Influencers', h: '@creator', title: 'Review completo', img: '/assets/hero-banner.png', pos: '85% center', src: '' },
  { t: 'UGC', h: '@cliente', title: 'Antes e depois do habitáculo', img: '/assets/hero-street.png', pos: 'center', src: '' },
];
export const VIDEO_TABS = ['Todos', 'Influencers', 'UGC', 'Clientes'];

/* ---------- Reviews ---------- */
export type Review = { n: string; c: string; q: string; tag: string; s: number };
export const REVIEWS: Review[] = [
  { n: 'Gilson', c: 'Itajaí/SC', q: 'Tô usando há um tempinho e gostei bastante do cheiro. É bem diferente desses de loja, mais suave mesmo. Todo mundo que entra no carro pergunta o que é.', tag: 'Impressão', s: 5 },
  { n: 'Marcos', c: 'Belo Horizonte/MG', q: 'Comprei meio na dúvida mas valeu a pena. O cheiro dura bem mais que os outros que eu já usei e o frasco é bonito, fica até bem no porta-luvas.', tag: 'Fixação', s: 5 },
  { n: 'Carlos', c: 'Brasília/DF', q: 'Gostei demais, sinceramente. Comprei mais por curiosidade e acabou sendo um dos melhores que já usei no carro. Recomendo.', tag: 'Fragrância', s: 5 },
  { n: 'Felipe', c: 'Itajaí/SC', q: 'Chegou certinho, embalagem bonita. O cheiro é suave e dura bastante, gostei bem mais do que eu esperava.', tag: 'Entrega', s: 5 },
  { n: 'Rodrigo', c: 'São Paulo/SP', q: 'Muito bom, superou minha expectativa. O carro fica com um cheiro discreto e agradável, nada enjoativo.', tag: 'Fragrância', s: 5 },
];

/* ---------- Offer ---------- */
export type PlanId = 'un' | 'k2' | 'k3' | 'sub';
export type Plan = { id: PlanId; t: string; d: string; unit?: number; fixed?: number; units?: number; qty?: boolean; badge?: string; bt?: 'ink' | 'signal' };
// Kit and subscription discounts were set in the design (10% / 15% / 15%) and still need confirmation.
export const PLANS: Plan[] = [
  { id: 'un', t: 'Unidade', d: '1 frasco · 60 ml', unit: 97.9, qty: true },
  { id: 'k2', t: 'Kit 2 frascos', d: 'Economize 10%', fixed: 176.22, units: 2, badge: '−10%', bt: 'ink' },
  { id: 'k3', t: 'Kit 3 frascos', d: 'Economize 15% · melhor custo', fixed: 249.65, units: 3, badge: '−15%', bt: 'ink' },
  { id: 'sub', t: 'Assinatura', d: '15% off em toda entrega · cancele quando quiser', unit: 83.22, qty: true, badge: 'Recorrente', bt: 'signal' },
];
export const LIST_PRICE = 149.9;
export const FREQUENCIES = [30, 60, 90];

export const SEALS = [
  { i: 'shield-check', t: 'Compra segura', d: 'Pagamento protegido' },
  { i: 'truck', t: 'Envio no mesmo dia', d: 'Rastreio após aprovação' },
  { i: 'map-pin', t: 'Frete seguro', d: 'Para todo o Brasil' },
  { i: 'rotate-ccw', t: 'Garantia de 7 dias', d: '100% de volta, sem perguntas' },
  { i: 'receipt', t: 'Nota fiscal emitida', d: 'Em todo pedido' },
];

/* ---------- FAQ ---------- */
export const FAQ: [string, string][] = [
  ['Quanto tempo dura o Purion GT?', 'Até 700 borrifadas, com tecnologia de liberação controlada e fixação constante por meses.'],
  ['Onde coloco o frasco no carro?', 'Borrife de 2 a 3 vezes no carpete, nos bancos de tecido ou no ar do habitáculo. Guarde o frasco no porta-luvas ou no console, longe do sol direto.'],
  ['Mancha o interior do carro?', 'Não. Zero resíduo no retrovisor, no painel e no estofado.'],
  ['Qual a política de devolução?', 'Garantia de 7 dias: 100% do dinheiro de volta, sem perguntas.'],
  ['O envio é imediato?', 'Sim. Envio no mesmo dia, com código de rastreio logo após a aprovação do pagamento. Frete seguro para todo o Brasil.'],
  ['Como funciona a assinatura?', 'Você escolhe a frequência (30, 60 ou 90 dias) e recebe com 15% de desconto em toda entrega. Pause ou cancele quando quiser pelo WhatsApp.'],
  ['Vale a pena comprar o kit?', 'Os kits de 2 e 3 frascos saem com até 15% de desconto. Ideal para mais de um carro ou para presentear.'],
  ['Quais as formas de pagamento?', 'Cartão em até 3× sem juros. Compra segura e nota fiscal emitida em todo pedido.'],
];
