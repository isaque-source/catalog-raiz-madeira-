import heroImg from "./assets/images/hero_table_1783273603095.jpg";
import portaOvosImg from "./assets/images/porta_ovos_real_1783277387313.jpg";
import boleiraImg from "./assets/images/boleira_1783273630684.jpg";
import portaXicarasImg from "./assets/images/porta_xicaras_1783273669257.jpg";
import sapateiraImg from "./assets/images/sapateira_1783273642801.jpg";
import suporteCoadorImg from "./assets/images/suporte_coador_1783273655461.jpg";
import portaGuardanapoImg from "./assets/images/porta_guardanapo_1783273681612.jpg";
import prateleiraMultUsoImg from "./assets/images/prateleira_mult_uso_1783273696566.jpg";
import portaRetratoImg from "./assets/images/porta_retrato_1783273709817.jpg";
import paozeiraImg from "./assets/images/paozeira_1783273725147.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  dimensions?: string;
  features: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "porta-ovos",
    name: "Porta ovos",
    price: 35.00,
    description: "Lindo organizador de ovos feito em madeira pinus, com acabamento liso e natural. Comporta até 12 ovos de forma elegante e segura. Acompanha uma charmosa tag de coração que dá aquele toque rústico e artesanal irresistível à sua cozinha.",
    category: "Cozinha",
    image: portaOvosImg,
    dimensions: "24cm x 12cm x 15cm",
    features: ["Capacidade para 12 ovos", "Madeira pinus maciça", "Acompanha tag de coração", "Acabamento atóxico"]
  },
  {
    id: "boleira",
    name: "Boleira",
    price: 35.00,
    description: "Boleira de madeira pinus com base torneada de alta qualidade. Perfeita para servir bolos, tortas e pães de queijo fresquinhos, trazendo o clima acolhedor do café da tarde de fazenda diretamente para a sua mesa.",
    category: "Servir",
    image: boleiraImg,
    dimensions: "28cm diâmetro x 12cm altura",
    features: ["Design rústico e sofisticado", "Superfície lixada e selada", "Estabilidade garantida", "Fácil de higienizar"]
  },
  {
    id: "porta-xicaras",
    name: "Porta xícaras",
    price: 30.00,
    description: "Suporte vertical organizador para canecas e xícaras, super prático e decorativo. Mantém suas canecas favoritas sempre organizadas e ao alcance das mãos na sua bancada ou cantinho especial de café.",
    category: "Café & Chá",
    image: portaXicarasImg,
    dimensions: "15cm x 15cm x 35cm",
    features: ["Comporta até 6 xícaras grandes", "Gancho resistente de madeira", "Base estável antiderrapante", "Otimização de espaço"]
  },
  {
    id: "sapateira",
    name: "Sapateira",
    price: 50.00,
    description: "Sapateira modular compacta com 3 prateleiras em madeira pinus maciça. Ideal para organizar sapatos no hall de entrada, quarto ou closet, mantendo o ambiente sempre limpo, arejado e incrivelmente harmônico.",
    category: "Organização",
    image: sapateiraImg,
    dimensions: "50cm largura x 26cm profundidade x 45cm altura",
    features: ["Três andares espaçosos", "Design minimalista e leve", "Fácil montagem e transporte", "Excelente ventilação para calçados"]
  },
  {
    id: "suporte-coador",
    name: "Suporte de coador",
    price: 20.00,
    description: "Tradicional suporte de coador de café ('mancebo') feito em madeira pinus rústica. Permite passar aquele cafezinho fresco passado na hora de forma tradicional diretamente na sua xícara favorita.",
    category: "Café & Chá",
    image: suporteCoadorImg,
    dimensions: "12cm x 12cm x 28cm",
    features: ["Madeira pinus tratada", "Inclui mancebo estável", "Ideal para café individual", "Fácil de limpar"]
  },
  {
    id: "porta-guardanapo",
    name: "Porta guardanapo/papel toalha",
    price: 25.00,
    description: "Suporte integrado duplo para guardanapos de papel e rolo de papel toalha. Possui detalhes decorativos vazados em formato de coração que expressam carinho e hospitalidade para servir no dia a dia.",
    category: "Cozinha",
    image: portaGuardanapoImg,
    dimensions: "22cm x 14cm x 30cm",
    features: ["Suporte duplo funcional", "Delicado detalhe de coração", "Perfeito para a mesa de almoço", "Estrutura firme"]
  },
  {
    id: "prateleira-mult-uso",
    name: "Prateleira mult uso",
    price: 50.00,
    description: "Prateleira organizadora multifuncional de dois andares, extremamente versátil. Perfeita para exibir temperos e xícaras na cozinha, cosméticos no banheiro ou pequenos vasinhos decorativos na sala.",
    category: "Organização",
    image: prateleiraMultUsoImg,
    dimensions: "35cm largura x 15cm profundidade x 32cm altura",
    features: ["Dois níveis amplos", "Madeira pinus lixada", "Multiuso em qualquer cômodo", "Deixa temperos organizados"]
  },
  {
    id: "porta-retrato",
    name: "Porta retrato + foto",
    price: 18.00,
    description: "Moldura rústica flutuante produzida artesanalmente com pinus de reflorestamento. Acompanha um pequeno pregador de madeira para você pendurar fotos polaroids ou lembretes com muito amor e estilo minimalista.",
    category: "Decoração",
    image: portaRetratoImg,
    dimensions: "15cm x 15cm x 4cm",
    features: ["Moldura flutuante", "Pregador de madeira incluso", "Visual estilo escandinavo", "Ótima opção para presente"]
  },
  {
    id: "paozeira",
    name: "Pãozeira",
    price: 90.00,
    description: "Nossa campeã de vendas: pãozeira clássica com tampa deslizante retrátil. Preserva seus pães franceses, pães de forma ou bolos protegidos e fresquinhos por muito mais tempo, além de conferir beleza rústica incomparável.",
    category: "Cozinha",
    image: paozeiraImg,
    dimensions: "36cm x 22cm x 18cm",
    features: ["Porta deslizante de pinus", "Ventilação natural adequada", "Espaço para múltiplos pães", "Durabilidade excelente"]
  }
];

export const HERO_IMAGE = heroImg;
export const PHONE_NUMBER = "557581531003"; // For WhatsApp budget submission
export const INSTAGRAM_HANDLE = "@raiz_e_madeira";
export const INSTAGRAM_URL = "https://www.instagram.com/raiz_e_madeira?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
export const ADDRESS_REPRESENTATION = "Ateliê Raiz & Madeira, SP";
