"use strict";

/* ============================================================
   JAVASCRIPT — Tape-rupi
   §1   Constantes e configuração
   §2   Listas de conteúdo
   §3   Motor legado de cruzadinha (reserva)
   §4   Caça-palavras — motor adaptativo
   §5   Estado global, persistência e saudação
   §6   Utilidades
   §6.2 Imagens das categorias
   §7   Áudio
   §8   Geradores de questão
   §9   Montagem da fase
   §10  Fluxo de telas
   §11  Render
   §12  Verificação
   §13  Conclusão
   §14  Seletor e continuar
   §15  Clima — Open-Meteo
   §16  Bind e boot
   ============================================================ */

/* ---------- §1 CONSTANTES ---------- */
const ASSET = { images:"assets/imagens/", audio:"assets/audio/", home:"assets/tela-de-inicio/" };
const QS_PER_FASE = 30;
const TOTAL_FASES = 9;
const SAVE_KEY = "tape-rupi-progresso";
const SAVE_VERSION = 8;

const FASES_INFO = {
  1:{nome:"Fase 1",nivel:"Fácil",    icone:"1️⃣", bonus:0},
  2:{nome:"Fase 2",nivel:"Médio",    icone:"2️⃣", bonus:2},
  3:{nome:"Fase 3",nivel:"Difícil",  icone:"3️⃣", bonus:4},
  4:{nome:"Fase 4",nivel:"Avançado", icone:"4️⃣", bonus:6},
  5:{nome:"Fase 5",nivel:"Desafio",  icone:"5️⃣", bonus:8},
  6:{nome:"Fase 6",nivel:"Mestre",   icone:"6️⃣", bonus:10},
  7:{nome:"Fase 7",nivel:"Xamã",     icone:"7️⃣", bonus:12},
  8:{nome:"Fase 8",nivel:"Sagrado",  icone:"8️⃣", bonus:14},
  9:{nome:"Fase 9",nivel:"Nhanderu", icone:"9️⃣", bonus:16}
};

/* ---------- §2 LISTAS DE CONTEÚDO ---------- */
const NUMBER_VOCABULARY = [
  {value:0,  word:"DJERE",     audio:"numero-0.mp3"},
  {value:1,  word:"PETEĨ",     audio:"numero-1.mp3"},
  {value:2,  word:"MÕKÕI",     audio:"numero-2.mp3"},
  {value:3,  word:"MBOAPY",    audio:"numero-3.mp3"},
  {value:4,  word:"IRUNDY",    audio:"numero-4.mp3"},
  {value:5,  word:"NIRUI",     audio:"numero-5.mp3"},
  {value:6,  word:"YPÉ",       audio:"numero-6.mp3"},
  {value:7,  word:"TXA'I",     audio:"numero-7.mp3"},
  {value:8,  word:"IPOKÁ",     audio:"numero-8.mp3"},
  {value:9,  word:"TSYTA",     audio:"numero-9.mp3"},
  {value:10, word:"TEĨ-DJERE", audio:"numero-10.mp3"}
];

const VOCABULARY = [
  {word:"KUTXÁ",meaning:"colher",category:"OBJETOS",audio:"kutxa.mp3",file:"kutxa.png"},
  {word:"KUTXÁ RAKWÁ",meaning:"garfo",category:"OBJETOS",audio:"kutxa_rakwa.mp3",file:"kutxa-rakwa.png"},
  {word:"KARÓ",meaning:"copo",category:"OBJETOS",audio:"karo.mp3",file:"karo.png"},
  {word:"DJAPEPÓ",meaning:"panela",category:"OBJETOS",audio:"djapepo.mp3",file:"djapepo.png"},
  {word:"ADJAKÁ",meaning:"cesto",category:"OBJETOS",audio:"adjaka.mp3",file:"adjaka.png"},
  {word:"IRYMPẼ",meaning:"peneira",category:"OBJETOS",audio:"irympe.mp3",file:"irympe.png"},
  {word:"TIPITI",meaning:"espremedor",category:"OBJETOS",audio:"tipiti.mp3",file:"tipiti.png"},
  {word:"ATXÁ",meaning:"machado",category:"OBJETOS",audio:"atxa.mp3",file:"atxa.png"},
  {word:"ANGWAPÚ",meaning:"tambor",category:"OBJETOS",audio:"angwapu.mp3",file:"angwapu.png"},
  {word:"GWYRAPÁ",meaning:"arco",category:"OBJETOS",audio:"gwyrapa.mp3",file:"gwyrapa.png"},
  {word:"GWYRARAKWÁ",meaning:"lança",category:"OBJETOS",audio:"gwywarakwa.mp3",file:"gwywarakwa.png"},
  {word:"KANGWAÁ",meaning:"cocar",category:"OBJETOS",audio:"kangwaa.mp3",file:"kangwaa.png"},
  {word:"KYÁ",meaning:"rede",category:"OBJETOS",audio:"kya.mp3",file:"kya.png"},
  {word:"MBARAKÁ",meaning:"maraca",category:"OBJETOS",audio:"mbaraka.mp3",file:"mbaraka.png"},
  {word:"MBO'Y",meaning:"colar",category:"OBJETOS",audio:"mbo-y.mp3",file:"mbo-y.png"},
  {word:"MIMBY",meaning:"flauta",category:"OBJETOS",audio:"mimby.mp3",file:"mimby.png"},
  {word:"PETỸNGWÁ",meaning:"cachimbo",category:"OBJETOS",audio:"petyngwa.mp3",file:"petyngwa.png"},
  {word:"TAMBEÓ",meaning:"roupa tradicional",category:"OBJETOS",audio:"tambeo.mp3",file:"tambeo.png"},
  {word:"U'Y",meaning:"flecha",category:"OBJETOS",audio:"u-y.mp3",file:"u-y.png"},
  {word:"AKADJU",meaning:"caju",category:"ALIMENTOS",audio:"akadju.mp3",file:"akadju.png"},
  {word:"PAKOWÁ",meaning:"banana",category:"ALIMENTOS",audio:"pakowa.mp3",file:"pakowa.png"},
  {word:"TSANDIÁ",meaning:"melancia",category:"ALIMENTOS",audio:"tsandia.mp3",file:"tsandia.png"},
  {word:"AWATI",meaning:"milho",category:"ALIMENTOS",audio:"awati.mp3",file:"awati.png"},
  {word:"MANDI'O",meaning:"mandioca",category:"ALIMENTOS",audio:"mandio.mp3",file:"mandio.png"},
  {word:"KAMBY",meaning:"leite",category:"ALIMENTOS",audio:"kamby.mp3",file:"kamby.png"},
  {word:"TSO'O",meaning:"carne",category:"ALIMENTOS",audio:"tsoo.mp3",file:"tsoo.png"},
  {word:"ANDAÍ",meaning:"abóbora",category:"ALIMENTOS",audio:"andai.mp3",file:"andai.png"},
  {word:"AROI",meaning:"arroz",category:"ALIMENTOS",audio:"aroi.mp3",file:"aroi.png"},
  {word:"AREMÁ",meaning:"trigo",category:"ALIMENTOS",audio:"arema.mp3",file:"arema.png"},
  {word:"AWATI-KU'I",meaning:"fubá",category:"ALIMENTOS",audio:"awati-kui.mp3",file:"awati-kui.png"},
  {word:"DJETY",meaning:"batata-doce",category:"ALIMENTOS",audio:"djety.mp3",file:"djety.png"},
  {word:"EÍ",meaning:"mel de abelhas",category:"ALIMENTOS",audio:"ei.mp3",file:"ei.png"},
  {word:"KANÃ",meaning:"cana-de-açúcar",category:"ALIMENTOS",audio:"kana.mp3",file:"kana.png"},
  {word:"KANÃ-KU'I",meaning:"açúcar",category:"ALIMENTOS",audio:"kana-kui.mp3",file:"kana-kui.png"},
  {word:"KARÁ",meaning:"cará",category:"ALIMENTOS",audio:"kara.mp3",file:"kara.png"},
  {word:"KUMANDÁ",meaning:"feijão",category:"ALIMENTOS",audio:"kumanda.mp3",file:"kumanda.png"},
  {word:"MANDUWI",meaning:"amendoim",category:"ALIMENTOS",audio:"manduwi.mp3",file:"manduwi.png"},
  {word:"MBA'E'Ũ",meaning:"café",category:"ALIMENTOS",audio:"mba-e-u.mp3",file:"mba-e-u.png"},
  {word:"NHANDY",meaning:"óleo",category:"ALIMENTOS",audio:"nhandy.mp3",file:"nhandy.png"},
  {word:"TADJÁ",meaning:"inhame",category:"ALIMENTOS",audio:"tadja.mp3",file:"tadja.png"},
  {word:"TSAÁ",meaning:"sal",category:"ALIMENTOS",audio:"tsaa.mp3",file:"tsaa.png"},
  {word:"YTSÓ",meaning:"larva do coqueiro",category:"ALIMENTOS",audio:"ytso.mp3",file:"ytso.png"},
  {word:"YWYRÁ'Á",meaning:"fruta",category:"ALIMENTOS",audio:"ywyra-a.mp3",file:"ywyra-a.png"},
  {word:"YY RE'Ẽ",meaning:"suco",category:"ALIMENTOS",audio:"yy-ree.mp3",file:"yy-ree.png"},
  {word:"PIRÁ",meaning:"peixe",category:"ANIMAIS",audio:"pira.mp3",file:"pira.png"},
  {word:"KATXURU",meaning:"cachorro",category:"ANIMAIS",audio:"katxuru.mp3",file:"katxuru.png"},
  {word:"KA'I",meaning:"macaco",category:"ANIMAIS",audio:"kai.mp3",file:"kai.png"},
  {word:"KAPI'I'UWÁ",meaning:"capivara",category:"ANIMAIS",audio:"kapiiuwa.mp3",file:"kapiiuwa.png"},
  {word:"MBOÍ",meaning:"cobra",category:"ANIMAIS",audio:"mboi.mp3",file:"mboi.png"},
  {word:"NHANDU",meaning:"aranha",category:"ANIMAIS",audio:"nhandu.mp3",file:"nhandu.png"},
  {word:"TAY",meaning:"formiga",category:"ANIMAIS",audio:"tay.mp3",file:"tay.png"},
  {word:"TXIWI",meaning:"gato",category:"ANIMAIS",audio:"txiwi.mp3",file:"txiwi.png"},
  {word:"DJAKARÉ",meaning:"jacaré",category:"ANIMAIS",audio:"djakare.mp3",file:"djakare.png"},
  {word:"TSUGWAI",meaning:"porco",category:"ANIMAIS",audio:"tsugwai.mp3",file:"tsugwai.png"},
  {word:"POPO'I",meaning:"borboleta",category:"ANIMAIS",audio:"popoi.mp3",file:"popoi.png"},
  {word:"KURURU",meaning:"sapo",category:"ANIMAIS",audio:"kururu.mp3",file:"kururu.png"},
  {word:"AKUTI",meaning:"cutia",category:"ANIMAIS",audio:"akuti.mp3",file:"akuti.png"},
  {word:"ANDIRÁ",meaning:"morcego frugívoro",category:"ANIMAIS",audio:"andira.mp3",file:"andira.png"},
  {word:"ANGUDJÁ",meaning:"rato",category:"ANIMAIS",audio:"angudja.mp3",file:"angudja.png"},
  {word:"DJAGWARETÉ",meaning:"onça",category:"ANIMAIS",audio:"djagwarete.mp3",file:"djagwarete.png"},
  {word:"DJAGWATIRI",meaning:"jaguatirica",category:"ANIMAIS",audio:"djagwatiri.mp3",file:"djagwatiri.png"},
  {word:"DJAITXÁ",meaning:"paca",category:"ANIMAIS",audio:"djaitxa.mp3",file:"djaitxa.png"},
  {word:"GWAIRAKÁ",meaning:"lontra",category:"ANIMAIS",audio:"gwairaka.mp3",file:"gwairaka.png"},
  {word:"GWATSU",meaning:"veado",category:"ANIMAIS",audio:"gwatsu.mp3",file:"gwatsu.png"},
  {word:"IRARA",meaning:"papa-mel",category:"ANIMAIS",audio:"irara.mp3",file:"irara.png"},
  {word:"KAGWARÉ",meaning:"tamanduá-mirim",category:"ANIMAIS",audio:"kagware.mp3",file:"kagware.png"},
  {word:"KAITITU",meaning:"cateto",category:"ANIMAIS",audio:"kaititu.mp3",file:"kaititu.png"},
  {word:"KARADJÁ",meaning:"bugio",category:"ANIMAIS",audio:"karadja.mp3",file:"karadja.png"},
  {word:"MBARAKADJÁ",meaning:"gato do mato",category:"ANIMAIS",audio:"mbarakadja.mp3",file:"mbarakadja.png"},
  {word:"MBORÉ",meaning:"anta",category:"ANIMAIS",audio:"mbore.mp3",file:"mbore.png"},
  {word:"MBYKU",meaning:"gambá",category:"ANIMAIS",audio:"mbyku.mp3",file:"mbyku.png"},
  {word:"PEREÁ",meaning:"preá",category:"ANIMAIS",audio:"perea.mp3",file:"perea.png"},
  {word:"TADJATSU",meaning:"queixada",category:"ANIMAIS",audio:"tadjatsu.mp3",file:"tadjatsu.png"},
  {word:"TAĨDJÁ",meaning:"preguiça",category:"ANIMAIS",audio:"taidja.mp3",file:"taidja.png"},
  {word:"TAPITI",meaning:"lebre",category:"ANIMAIS",audio:"tapiti.mp3",file:"tapiti.png"},
  {word:"TATU",meaning:"tatu",category:"ANIMAIS",audio:"tatu.mp3",file:"tatu.png"},
  {word:"TSUTSUARÃ",meaning:"suçuarana",category:"ANIMAIS",audio:"tsutsuara.mp3",file:"tsutsuara.png"},
  {word:"AMBERÉ",meaning:"lagartixa",category:"ANIMAIS",audio:"ambere.mp3",file:"ambere.png"},
  {word:"JABUTI",meaning:"jabuti",category:"ANIMAIS",audio:"jabuti.mp3",file:"jabuti.png"},
  {word:"KARUMBÉ",meaning:"cágado",category:"ANIMAIS",audio:"karumbe.mp3",file:"karumbe.png"},
  {word:"KAWY",meaning:"vespa",category:"ANIMAIS",audio:"kawy.mp3",file:"kawy.png"},
  {word:"KY",meaning:"piolho",category:"ANIMAIS",audio:"ky.mp3",file:"ky.png"},
  {word:"KYDJU",meaning:"grilo",category:"ANIMAIS",audio:"kydju.mp3",file:"kydju.png"},
  {word:"MBARIGWI",meaning:"mosquito",category:"ANIMAIS",audio:"mbarigwi.mp3",file:"mbarigwi.png"},
  {word:"MBERU",meaning:"mosca",category:"ANIMAIS",audio:"mberu.mp3",file:"mberu.png"},
  {word:"MUÃ",meaning:"vagalume",category:"ANIMAIS",audio:"mua.mp3",file:"mua.png"},
  {word:"NHAKYRÃ",meaning:"cigarra",category:"ANIMAIS",audio:"nhakyra.mp3",file:"nhakyra.png"},
  {word:"TARAWÉ",meaning:"barata",category:"ANIMAIS",audio:"tarawe.mp3",file:"tarawe.png"},
  {word:"TUKU",meaning:"gafanhoto",category:"ANIMAIS",audio:"tuku.mp3",file:"tuku.png"},
  {word:"PYNTÃ",meaning:"vermelho",category:"CORES",audio:"pynta.mp3",file:"pynta.png"},
  {word:"IDJU",meaning:"amarelo",category:"CORES",audio:"idju.mp3",file:"idju.png"},
  {word:"OWY",meaning:"verde",category:"CORES",audio:"owy.mp3",file:"owy.png"},
  {word:"OWY-REI",meaning:"azul",category:"CORES",audio:"owy-rei.mp3",file:"owy-rei.png"},
  {word:"UŨ",meaning:"preto",category:"CORES",audio:"uu.mp3",file:"uu.png"},
  {word:"MORÕTI",meaning:"branco",category:"CORES",audio:"moroti.mp3",file:"moroti.png"},
  {word:"POTYGWÁ",meaning:"rosa",category:"CORES",audio:"potygwa.mp3",file:"potygwa.png"},
  {word:"PUNTÃ-REGWÁ",meaning:"roxo",category:"CORES",audio:"punta-regwa.mp3",file:"punta-regwa.png"},
  {word:"YWY-RAMIGWÁ",meaning:"marrom",category:"CORES",audio:"ywy-ramigwa.mp3",file:"ywy-ramigwa.png"},
  {word:"NARÃ",meaning:"laranja",category:"CORES",audio:"nara.mp3",file:"nara.png"},
  {word:"AKÃ",meaning:"cabeça",category:"CORPO",audio:"aka.mp3",file:"aka.png"},
  {word:"AWY",meaning:"cabelo",category:"CORPO",audio:"awy.mp3",file:"awy.png"},
  {word:"KUPÉ",meaning:"costas",category:"CORPO",audio:"kupe.mp3",file:"kupe.png"},
  {word:"POAPY",meaning:"pulso",category:"CORPO",audio:"poapy.mp3",file:"poapy.png"},
  {word:"NAMBI",meaning:"orelha",category:"CORPO",audio:"nambi.mp3",file:"nambi.png"},
  {word:"APYTSÃ-KWÁ",meaning:"ouvido",category:"CORPO",audio:"apytsangwa.mp3",file:"apytsangwa.png"},
  {word:"APYTÉ",meaning:"testa",category:"CORPO",audio:"apyte.mp3",file:"apyte.png"},
  {word:"RETSÁ",meaning:"olho",category:"CORPO",audio:"retsa.mp3",file:"retsa.png"},
  {word:"ROWÁ",meaning:"rosto",category:"CORPO",audio:"rowa.mp3",file:"rowa.png"},
  {word:"APYINGWÁ",meaning:"nariz",category:"CORPO",audio:"apyingwa.mp3",file:"apyingwa.png"},
  {word:"DJURU",meaning:"boca",category:"CORPO",audio:"djuru.mp3",file:"djuru.png"},
  {word:"RAĨ",meaning:"dente",category:"CORPO",audio:"rai.mp3",file:"rai.png"},
  {word:"APENKŨ",meaning:"língua",category:"CORPO",audio:"apenku.mp3",file:"apenku.png"},
  {word:"ATI'Y",meaning:"ombro",category:"CORPO",audio:"atiy.mp3",file:"atiy.png"},
  {word:"POTI'Á",meaning:"peito",category:"CORPO",audio:"potia.mp3",file:"potia.png"},
  {word:"PÓ",meaning:"mão",category:"CORPO",audio:"po.mp3",file:"po.png"},
  {word:"KWÃ",meaning:"dedo da mão",category:"CORPO",audio:"kwa.mp3",file:"kwa.png"},
  {word:"RYÉ",meaning:"barriga",category:"CORPO",audio:"rye.mp3",file:"rye.png"},
  {word:"PURU'Ã",meaning:"umbigo",category:"CORPO",audio:"purua.mp3",file:"purua.png"},
  {word:"TYMÃ",meaning:"perna",category:"CORPO",audio:"tyma.mp3",file:"tyma.png"},
  {word:"TÃKÃ",meaning:"joelho",category:"CORPO",audio:"taka.mp3",file:"taka.png"},
  {word:"ADJU'Y",meaning:"pescoço",category:"CORPO",audio:"adjuy.mp3",file:"adjuy.png"},
  {word:"DJYWÁ",meaning:"braço",category:"CORPO",audio:"djywa.mp3",file:"djywa.png"},
  {word:"PY",meaning:"pé",category:"CORPO",audio:"py.mp3",file:"py.png"},
  {word:"PYTSÃ",meaning:"dedo do pé",category:"CORPO",audio:"pytsa.mp3",file:"pytsa.png"},
  {word:"NHE'Ẽ",meaning:"espírito",category:"CORPO",audio:"nhe-e.mp3",file:"nhe-e.png"},
  {word:"REMBÉ",meaning:"lábio",category:"CORPO",audio:"rembe.mp3",file:"rembe.png"},
  {word:"REMBIYTÁ",meaning:"queixo",category:"CORPO",audio:"rembiyta.mp3",file:"rembiyta.png"},
  {word:"KANGWÉ",meaning:"osso",category:"CORPO",audio:"kangwe.mp3",file:"kangwe.png"},
  {word:"RAGWÉ",meaning:"pelo",category:"CORPO",audio:"ragwe.mp3",file:"ragwe.png"},
  {word:"POAPẼ",meaning:"unha da mão",category:"CORPO",audio:"poape.mp3",file:"poape.png"},
  {word:"PYSÃPẼ",meaning:"unha do pé",category:"CORPO",audio:"pysape.mp3",file:"pysape.png"},
  {word:"PYTU'Ũ",meaning:"cérebro",category:"CORPO",audio:"pytu-u.mp3",file:"pytu-u.png"},
  {word:"TXETSY",meaning:"minha mãe",category:"PARENTESCO",audio:"txetsy.mp3"},
  {word:"TXERU",meaning:"meu pai",category:"PARENTESCO",audio:"txeru.mp3"},
  {word:"NHANERAMÕI",meaning:"nosso avô",category:"PARENTESCO",audio:"nhaneramoi.mp3"},
  {word:"TXERA'Y",meaning:"meu filho (pai)",category:"PARENTESCO",audio:"txeray.mp3"},
  {word:"TXEMEMBY",meaning:"meu filho (mãe)",category:"PARENTESCO",audio:"txememby.mp3"},
  {word:"TXERADJY",meaning:"minha filha (pai)",category:"PARENTESCO",audio:"txeradjy.mp3"},
  {word:"TXERYWY",meaning:"irmão mais novo",category:"PARENTESCO",audio:"txerywy.mp3"},
  {word:"TXERYKE'Y",meaning:"irmão mais velho",category:"PARENTESCO",audio:"txerykey.mp3"},
  {word:"TXINDY",meaning:"irmã mais nova",category:"PARENTESCO",audio:"txindy.mp3"},
  {word:"TXEKYPY'Y",meaning:"irmã mais velha",category:"PARENTESCO",audio:"txekypy.mp3"},
  {word:"TXETUTY",meaning:"meu tio",category:"PARENTESCO",audio:"txetuty.mp3"},
  {word:"TXETSY'Y",meaning:"minha tia",category:"PARENTESCO",audio:"txetsyy.mp3"},
  {word:"TXERAPITXÁ",meaning:"meu amigo",category:"PARENTESCO",audio:"txerapitxa.mp3"},
  {word:"TXEIRŨ",meaning:"meu colega",category:"PARENTESCO",audio:"txeiru.mp3"},
  {word:"TXEMẼ",meaning:"meu marido",category:"PARENTESCO",audio:"txeme.mp3"},
  {word:"TXEREMBIREKÓ",meaning:"minha esposa",category:"PARENTESCO",audio:"txerembireko.mp3"},
  {word:"TXETXAÍ",meaning:"minha avó",category:"PARENTESCO",audio:"txetxai.mp3"},
  {word:"TXERAMAMINÓ",meaning:"meu neto",category:"PARENTESCO",audio:"txeramamino.mp3"},
  {word:"TXERATYWY",meaning:"meu sogro",category:"PARENTESCO",audio:"txeratywy.mp3"},
  {word:"TXERA'YTXÓ",meaning:"minha sogra",category:"PARENTESCO",audio:"txeraytxo.mp3"},
  {word:"TOWADJÁ",meaning:"cunhado",category:"PARENTESCO",audio:"towadja.mp3"},
  {word:"TSANGÁ",meaning:"madrinha",category:"PARENTESCO",audio:"tsanga.mp3"},
  {word:"KWARAY",meaning:"sol",category:"NATUREZA",audio:"kwaray.mp3",file:"kwaray.png"},
  {word:"JASY",meaning:"lua",category:"NATUREZA",audio:"jasy.mp3",file:"jasy.png"},
  {word:"TATÁ",meaning:"fogo",category:"NATUREZA",audio:"tata.mp3",file:"tata.png"},
  {word:"YY",meaning:"água",category:"NATUREZA",audio:"yy.mp3",file:"yy.png"},
  {word:"YBY",meaning:"terra",category:"NATUREZA",audio:"yby.mp3",file:"yby.png"},
  {word:"OKY",meaning:"chuva",category:"NATUREZA",audio:"oky.mp3",file:"oky.png"},
  {word:"YWYRÁ",meaning:"árvore",category:"NATUREZA",audio:"ywyra.mp3",file:"ywyra.png"},
  {word:"YYWYRU",meaning:"vento",category:"NATUREZA",audio:"yywyru.mp3",file:"yywyru.png"},
  {word:"YWYTY",meaning:"serra",category:"NATUREZA",audio:"ywyty.mp3",file:"ywyty.png"},
  {word:"PARANÁ",meaning:"rio",category:"GEOGRAFIA",audio:"parana.mp3",file:"parana.png"},
  {word:"PARAGWATSU",meaning:"mar",category:"GEOGRAFIA",audio:"paragwatsu.mp3",file:"paragwatsu.png"},
  {word:"YY KWÁ",meaning:"lago",category:"GEOGRAFIA",audio:"yy-kwa.mp3",file:"yy-kwa.png"},
  {word:"YY KWÁTY",meaning:"lagoa",category:"GEOGRAFIA",audio:"yy-kwaty.mp3",file:"yy-kwaty.png"},
  {word:"YY AKÃ",meaning:"cachoeira",category:"GEOGRAFIA",audio:"yy-aka.mp3",file:"yy-aka.png"},
  {word:"KA'AGWY",meaning:"mata",category:"GEOGRAFIA",audio:"ka-agwy.mp3",file:"ka-agwy.png"},
  {word:"TAPÉ",meaning:"estrada",category:"GEOGRAFIA",audio:"tape.mp3",file:"tape.png"},
  {word:"OKÁ RUTSU",meaning:"campo",category:"GEOGRAFIA",audio:"oka-rutsu.mp3",file:"oka-rutsu.png"},
  {word:"ARY PORÃ",meaning:"bom dia",category:"SAUDAÇÕES",audio:"ary-pora.mp3",file:"ary-pora.png"},
  {word:"KA'ARU PORÃ",meaning:"boa tarde",category:"SAUDAÇÕES",audio:"kaaru-pora.mp3",file:"kaaru-pora.png"},
  {word:"PYNTŨ PORÃ",meaning:"boa noite",category:"SAUDAÇÕES",audio:"pyntu-pora.mp3",file:"pyntu-pora.png"},
  {word:"ADJIWYMA",meaning:"tchau",category:"SAUDAÇÕES",audio:"adjiwyma.mp3",file:"adjiwyma.png"},
  {word:"NDERA'EWÉ",meaning:"tudo bem?",category:"SAUDAÇÕES",audio:"nderaewe.mp3",file:"nderaewe.png"},
  {word:"PEMAẼ PORÃ",meaning:"bem-vindos",category:"SAUDAÇÕES",audio:"pemae-pora.mp3",file:"pemae-pora.png"},
  {word:"WEI",meaning:"bem, bastante",category:"ADVÉRBIOS",audio:"wei.mp3"},
  {word:"ARIENTÉ",meaning:"bastante",category:"ADVÉRBIOS",audio:"ariente.mp3"},
  {word:"ETÉ",meaning:"muito",category:"ADVÉRBIOS",audio:"ete.mp3"},
  {word:"MBARIÍ",meaning:"pouco",category:"ADVÉRBIOS",audio:"mbarii.mp3"},
  {word:"MBENGWÉ",meaning:"devagar",category:"ADVÉRBIOS",audio:"mbengwe.mp3"},
  {word:"MBENGWE'I",meaning:"lentamente",category:"ADVÉRBIOS",audio:"mbengwei.mp3"},
  {word:"PETEREMÉ",meaning:"rápido",category:"ADVÉRBIOS",audio:"petereme.mp3"},
  {word:"WOÍ",meaning:"rapidamente",category:"ADVÉRBIOS",audio:"woi.mp3"},
  {word:"PÁ",meaning:"completamente",category:"ADVÉRBIOS",audio:"pa.mp3"},
  {word:"TENGWÁ",meaning:"certamente",category:"ADVÉRBIOS",audio:"tengwa.mp3"},
  {word:"RAMĨ",meaning:"talvez",category:"ADVÉRBIOS",audio:"rami.mp3"},
  {word:"DJIWY",meaning:"novamente",category:"ADVÉRBIOS",audio:"djiwy.mp3"},
  {word:"YMÃ",meaning:"antigamente",category:"ADVÉRBIOS",audio:"yma.mp3"},
  {word:"KWEÉ",meaning:"ontem",category:"ADVÉRBIOS",audio:"kwee.mp3"},
  {word:"KO'AỸ",meaning:"hoje",category:"ADVÉRBIOS",audio:"ko-ay.mp3"},
  {word:"KO'ẼRO",meaning:"amanhã",category:"ADVÉRBIOS",audio:"ko-ero.mp3"},
  {word:"KO'Ẽ",meaning:"cedo, manhã",category:"ADVÉRBIOS",audio:"ko-e.mp3"},
  {word:"RIRÉ",meaning:"depois de",category:"ADVÉRBIOS",audio:"rire.mp3"},
  {word:"MBOWÉ",meaning:"antes de",category:"ADVÉRBIOS",audio:"mbowe.mp3"},
  {word:"TERI",meaning:"ainda",category:"ADVÉRBIOS",audio:"teri.mp3"},
  {word:"MOMBYRY",meaning:"longe",category:"ADVÉRBIOS",audio:"mombyry.mp3"},
  {word:"DJAWÉ",meaning:"perto",category:"ADVÉRBIOS",audio:"djawe.mp3"},
  {word:"OKÁ-PY",meaning:"fora",category:"ADVÉRBIOS",audio:"oka-py.mp3"},
  {word:"PY-PY",meaning:"dentro",category:"ADVÉRBIOS",audio:"py-py.mp3"},
  {word:"UPÉ-PY",meaning:"ali, lá",category:"ADVÉRBIOS",audio:"upe-py.mp3"},
  {word:"APY",meaning:"aqui",category:"ADVÉRBIOS",audio:"apy.mp3"},
  {word:"IDJYPYE'YWA",meaning:"sempre",category:"ADVÉRBIOS",audio:"idjypyeywa.mp3"},
  {word:"E'ỸWA",meaning:"nunca",category:"ADVÉRBIOS",audio:"eywa.mp3"},
  {word:"RYAÉ",meaning:"frequentemente",category:"ADVÉRBIOS",audio:"ryae.mp3"}
];

const CARDINAIS = [
  {word:"NHANDÉ ROWAI-REGWÁ", meaning:"Leste (onde o sol nasce)"},
  {word:"NHANDÉ KUPÉ-REGWÁ",  meaning:"Oeste (onde o sol se põe)"},
  {word:"NHANDÉ YKÉ-REGWÁ",   meaning:"Norte"},
  {word:"NHANDÉ DJODJÁ-REGWÁ",meaning:"Sul"}
];

const MESES = [
  {word:"DJATSYTEĨ",meaning:"Janeiro"},{word:"DJATSYKÕE",meaning:"Fevereiro"},
  {word:"DJATSYAPY",meaning:"Março"},{word:"DJATSYRUNDY",meaning:"Abril"},
  {word:"DJATSYPÓ",meaning:"Maio"},{word:"DJATSYPOTEĨ",meaning:"Junho"},
  {word:"DJATSYPOKÕE",meaning:"Julho"},{word:"DJATSYPOAPY",meaning:"Agosto"},
  {word:"DJATSYPO RUNDY",meaning:"Setembro"},{word:"DJATSYPÁ",meaning:"Outubro"},
  {word:"DJATSYPATEĨ",meaning:"Novembro"},{word:"DJATSYPÃKÕE",meaning:"Dezembro"}
];

const DIAS = [
  {word:"ARYTEĨ",meaning:"Domingo"},{word:"ARYKÕE",meaning:"Segunda-feira"},
  {word:"ARYAPY",meaning:"Terça-feira"},{word:"ARYNDY",meaning:"Quarta-feira"},
  {word:"ARYNŨI",meaning:"Quinta-feira"},{word:"ARYPÁ",meaning:"Sexta-feira"},
  {word:"ARYNE'Õ",meaning:"Sábado"}
];

const FRASES_COTIDIANO = [
  {word:"Ndera'eweiry?",meaning:"Tudo bem?"},
  {word:"Reikó porã?",meaning:"Você está bem?"},
  {word:"Pemaẽ porã!",meaning:"Bem-vindos!"},
  {word:"Adjiwyma",meaning:"Tchau"},
  {word:"Pedjapytsaká porã!",meaning:"Prestem atenção!"},
  {word:"Pendu!",meaning:"Ouçam!"},
  {word:"Pedju woí!",meaning:"Venham logo!"},
  {word:"Ma'erã ndouwui?",meaning:"Por que não veio?"},
  {word:"Peporaí!",meaning:"Cantem!"},
  {word:"Pedjapó porã!",meaning:"Façam direitinho!"},
  {word:"Pekarú porã!",meaning:"Comam direitinho!"},
  {word:"Txe'uí",meaning:"Estou com sede"},
  {word:"Txenhimbyayi",meaning:"Estou com fome"},
  {word:"Txerypeyi",meaning:"Estou com sono"},
  {word:"Tereó porã Nhanderú rewé!",meaning:"Vai com Deus!"}
];

const FRASES_POSPOSICAO = [
  {frase:"Txerendá opytá karugwa__.",resp:"-py",distratores:["-gwi","-rupi","-arõ"]},
  {frase:"Kweé txetsy oú tekoá narãi__.",resp:"-gwi",distratores:["-py","-rupi","-arõ"]},
  {frase:"Kowá tudjá ndodjaywuweiry Português__.",resp:"-rupi",distratores:["-py","-arõ","-mbyté-py"]},
  {frase:"Amono'õ awati ryru ywyra__.",resp:"-arõ",distratores:["-gwi","-py","-mbyté-py"]},
  {frase:"Ndekytsé oĩ angu'a__.",resp:"-arõ",distratores:["-gwi","-py","-mbyté-py"]},
  {frase:"Mitãngwé onhimangá ywyrá__.",resp:"-gwypy",distratores:["-arõ","-py","-gwi"]},
  {frase:"Tuwitxá oikó nhandetekoá__.",resp:"-mbyté-py",distratores:["-arõ","-py","-rupi"]},
  {frase:"Txera'y Piaçaguera__ oikó.",resp:"-py",distratores:["-arõ","-rupi","-gwi"]},
  {frase:"Kweé txetuty oú narãi__.",resp:"-gwi",distratores:["-py","-arõ","-rupi"]},
  {frase:"Tapeó põrã tá__.",resp:"-rupi",distratores:["-py","-gwi","-arõ"]}
];

const VERBOS_IRREGULARES = [
  {base:"ir",conjugacoes:["aá","reó","oó","djaá","roó","peó"],pessoa:["eu","você","ele/ela","nós (incl.)","nós (excl.)","vocês"]},
  {base:"vir",conjugacoes:["adju","redju","oú","djadju","rodju","pedju"],pessoa:["eu","você","ele/ela","nós (incl.)","nós (excl.)","vocês"]},
  {base:"dizer",conjugacoes:["a'e","ere","e'i","dja'e","ro'e","pedje"],pessoa:["eu","você","ele/ela","nós (incl.)","nós (excl.)","vocês"]},
  {base:"ter",conjugacoes:["arekó","rerekó","ogwerekó","djarekó","rogwerekó","perekó"],pessoa:["eu","você","ele/ela","nós (incl.)","nós (excl.)","vocês"]},
  {base:"trazer",conjugacoes:["aru","reru","ogweru","djagweru","rogweru","pegweru"],pessoa:["eu","você","ele/ela","nós (incl.)","nós (excl.)","vocês"]}
];

const VERBOS_REGULARES = [
  {base:"gwatá",classe:"1ª",conjug:["agwatá","regwatá","ogwatá","djagwatá","rogwatá","pegwatá"]},
  {base:"karu",classe:"1ª",conjug:["akaru","rekaru","okaru","djakaru","rokaru","pekaru"]},
  {base:"kwaá",classe:"1ª",conjug:["aikwaá","reikwaá","oikwaá","djaikwaá","roikwaá","peikwaá"]}
];

const CLASSES_ADV = [
  {classe:"intensidade",exemplos:["WEI","ARIENTÉ","ETÉ","MBARIÍ"]},
  {classe:"modo",exemplos:["MBENGWÉ","MBENGWE'I","PETEREMÉ","WOÍ","PÁ","TENGWÁ","RAMĨ","DJIWY"]},
  {classe:"tempo",exemplos:["YMÃ","KWEÉ","KO'AỸ","KO'ẼRO","KO'Ẽ","MBOWÉ","RIRÉ","TERI"]},
  {classe:"lugar",exemplos:["MOMBYRY","DJAWÉ","OKÁ-PY","PY-PY","UPÉ-PY","APY"]},
  {classe:"frequência",exemplos:["RYAÉ","IDJYPYE'YWA","E'ỸWA"]}
];

const INTERROGATIVAS = [
  {palavra:"Mawã?", significado:"Quem?"},
  {palavra:"Mba'ewa?", significado:"O que?"},
  {palavra:"Marũ?", significado:"Quando?"},
  {palavra:"Ma'erã?", significado:"Por quê?"},
  {palavra:"Mamõ?", significado:"Onde?"},
  {palavra:"Maraingwá / Marãi?", significado:"Qual ou como?"},
  {palavra:"Mbowy?", significado:"Quanto?"},
  {palavra:"Maã?", significado:"Cadê?"}
];

const FRASES_ORDENAR = [
  {tokens:["Txeé","aikó","karugwá-py"], pt:"Eu moro em karugwá.", nivel:2},
  {tokens:["Katxuru","oikó","oká-py"], pt:"O cachorro mora fora.", nivel:2},
  {tokens:["Txeru","omoendy","tatá"], pt:"Meu pai acendeu o fogo.", nivel:2},
  {tokens:["Txedjaryi","omombe'u","txewy"], pt:"Minha avó me contou.", nivel:2},
  {tokens:["Nhaneramõi","oendá-py","oké"], pt:"Nosso avô dormiu em casa.", nivel:2},
  {tokens:["Petsy","oóta","Barão-py"], pt:"Tua mãe vai para Barão.", nivel:4},
  {tokens:["Kweé","txetuty","oú","São Paulo-gwi"], pt:"Ontem meu tio veio de São Paulo.", nivel:4},
  {tokens:["Nhandé","nhaporandu","Nhanderu-upé"], pt:"Nós falamos com Nhanderu.", nivel:4},
  {tokens:["Yy","opytá","tapé","koty","rowai-py"], pt:"A água fica ao lado da estrada.", nivel:6},
  {tokens:["Mitãngwé","onhimangá","ywyrá-gwypy"], pt:"As crianças brincam debaixo da árvore.", nivel:4},
  {tokens:["Txekywy","oó","ka'agwy-py","odjaya","djedjy"], pt:"Meu irmão foi à mata colher mel.", nivel:6},
  {tokens:["Tuwitxá","oikó","nhandetekoá-mbyté-py"], pt:"O chefe mora no meio da nossa aldeia.", nivel:4},
  {tokens:["Oré","roetxá","nderu","oporaei"], pt:"Nós vimos teu pai cantar.", nivel:6},
  {tokens:["Ko'ẽ","py'i","eté","o'owy"], pt:"Cedo da manhã ela veio.", nivel:6},
  {tokens:["Aipyý","manduwi","adjoká","ãwã"], pt:"Peguei amendoim para assar.", nivel:6}
];

const PARES_LIGAR = [
  {a:"WEI",b:"bastante"}, {a:"PETEREMÉ",b:"rápido"}, {a:"MBENGWE'I",b:"lentamente"},
  {a:"KWEÉ",b:"ontem"}, {a:"KO'ẼRO",b:"amanhã"}, {a:"MOMBYRY",b:"longe"},
  {a:"DJAWÉ",b:"perto"}, {a:"APY",b:"aqui"}, {a:"PY-PY",b:"dentro"},
  {a:"OKÁ-PY",b:"fora"}, {a:"DJIWY",b:"novamente"}, {a:"YMÃ",b:"antigamente"},
  {a:"RYAÉ",b:"frequentemente"}, {a:"E'ỸWA",b:"nunca"}, {a:"IDJYPYE'YWA",b:"sempre"},
  {a:"MBOWÉ",b:"antes de"}, {a:"RIRÉ",b:"depois de"}, {a:"TERI",b:"ainda"},
  {a:"ETÉ",b:"muito"}, {a:"MBARIÍ",b:"pouco"},
  {a:"-py",b:"em, para"}, {a:"-rupi",b:"por, pelo"}, {a:"-arõ",b:"em cima, sobre"},
  {a:"-gwypy",b:"embaixo, debaixo"}, {a:"-mbyté-py",b:"entre, no meio"}, {a:"-gwi",b:"de (origem)"},
  {a:"Mawã?",b:"Quem?"}, {a:"Mba'ewa?",b:"O que?"}, {a:"Marũ?",b:"Quando?"},
  {a:"Ma'erã?",b:"Por quê?"}, {a:"Mamõ?",b:"Onde?"}, {a:"Mbowy?",b:"Quanto?"}, {a:"Maã?",b:"Cadê?"}
];

/* ---------- §3 MOTOR LEGADO (RESERVA) ---------- */
function cwNormalize(s){
  return String(s).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Z]/g,"");
}

/* ---------- §4 CAÇA-PALAVRAS — MOTOR ADAPTATIVO ---------- */
const SEARCH_DIFICULDADE = {
  1:{size:7, dirs:["H"],                       n:4},
  2:{size:8, dirs:["H","V"],                   n:4},
  3:{size:8, dirs:["H","V"],                   n:5},
  4:{size:9, dirs:["H","V"],                   n:5},
  5:{size:9, dirs:["H","V","D"],               n:6},
  6:{size:10,dirs:["H","V","D"],               n:6},
  7:{size:10,dirs:["H","V","D"],               n:7},
  8:{size:11,dirs:["H","V","D"],               n:7},
  9:{size:11,dirs:["H","V","D"],               n:8}
};
const SEARCH_LIMITE = {
  1:{min:3, max:5}, 2:{min:3, max:6}, 3:{min:4, max:6}, 4:{min:4, max:7}, 5:{min:4, max:8},
  6:{min:5, max:9}, 7:{min:5, max:10}, 8:{min:6, max:12}, 9:{min:6, max:20}
};
const SEARCH_POOL_EXTRA = [
  "YY","TAY","KY","PY","MUA","TATA","TATU","TUKU","KAI","OWY","MBOI",
  "PIRA","OKY","JASY","YBY","UU","AWY","PO","KYA","UY","EIA"
];

function searchClean(s){
  return String(s).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Z]/g,"");
}
function searchPoolTotal(){
  const set = new Set();
  for(const v of VOCABULARY){
    const w = searchClean(v.word);
    if(w.length >= 3) set.add(w);
  }
  for(const w of SEARCH_POOL_EXTRA) set.add(w);
  return [...set];
}
function searchPoolForFase(fase, naUsar){
  const lim = SEARCH_LIMITE[fase] || SEARCH_LIMITE[9];
  const vistas = new Set(naUsar.map(w => searchClean(w)));
  const total = searchPoolTotal();
  const candidatas = [];
  for(const w of total){
    if(w.length < lim.min || w.length > lim.max) continue;
    if(vistas.has(w)) continue;
    candidatas.push(w);
  }
  if(candidatas.length < 8){
    for(const w of total){
      if(vistas.has(w)) continue;
      candidatas.push(w);
    }
  }
  return candidatas;
}
function searchDirs(fase){
  const cfg = SEARCH_DIFICULDADE[fase] || SEARCH_DIFICULDADE[9];
  const dirs = [];
  if(cfg.dirs.includes("H")) dirs.push([0,1], [0,-1]);
  if(cfg.dirs.includes("V")) dirs.push([1,0], [-1,0]);
  if(cfg.dirs.includes("D")) dirs.push([1,1], [-1,-1], [1,-1], [-1,1]);
  return dirs;
}
function searchPlaceOne(G, size, word, dirs, tentativas){
  for(let t = 0; t < tentativas; t++){
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    const endR = r + dir[0] * (word.length - 1);
    const endC = c + dir[1] * (word.length - 1);
    if(endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
    let colide = false;
    for(let i = 0; i < word.length; i++){
      const rr = r + dir[0] * i;
      const cc = c + dir[1] * i;
      if(G[rr][cc] && G[rr][cc] !== word[i]){ colide = true; break; }
    }
    if(colide) continue;
    for(let i = 0; i < word.length; i++){
      G[r + dir[0] * i][c + dir[1] * i] = word[i];
    }
    return {word, r, c, dr:dir[0], dc:dir[1], len:word.length};
  }
  return null;
}
function buildSearchGrid(fase, palavrasProibidas){
  const cfg = SEARCH_DIFICULDADE[fase] || SEARCH_DIFICULDADE[9];
  const dirs = searchDirs(fase);
  const pool = shuffle(searchPoolForFase(fase, palavrasProibidas || []));
  const size = cfg.size;
  const G = Array.from({length:size}, () => Array.from({length:size}, () => ""));
  const placed = [];
  const usadas = new Set();
  for(const w of pool){
    if(placed.length >= cfg.n) break;
    if(usadas.has(w)) continue;
    const enc = searchPlaceOne(G, size, w, dirs, 60);
    if(enc){ placed.push(enc); usadas.add(w); }
  }
  if(placed.length < 2){
    for(const w of pool){
      if(placed.length >= cfg.n) break;
      if(usadas.has(w)) continue;
      const enc = searchPlaceOne(G, size, w, [[0,1]], 120);
      if(enc){ placed.push(enc); usadas.add(w); }
    }
  }
  const alfabeto = "ABCDEGIKMNOPRSTUWY";
  for(let i = 0; i < size; i++){
    for(let j = 0; j < size; j++){
      if(!G[i][j]) G[i][j] = alfabeto[Math.floor(Math.random()*alfabeto.length)];
    }
  }
  return { G, placed, size, words: placed.map(p => p.word) };
}

/* ---------- §5 ESTADO GLOBAL E SAUDAÇÃO ---------- */
const state = {
  index:0, score:0, fase:1, answered:false, sound:true, time:null,
  questions:[], salvar:true, acertos:0, erros:0
};
const $ = id => document.getElementById(id);

function periodNow(){
  const h = new Date().getHours();
  if(h >= 5 && h < 12) return {name:"manhã",icon:"☀",title:"Ko'ẽ Porã!",desc:"A luz da manhã abre o caminho para novas descobertas.",msg:"A jornada começa com a luz do dia."};
  if(h >= 12 && h < 18) return {name:"tarde",icon:"◉",title:"Ka'aru Porã!",desc:"O caminho continua. Observe cada detalhe e descubra.",msg:"A tarde convida a explorar."};
  return {name:"noite",icon:"☾",title:"Pyntũ Porã!",desc:"Quando a noite chega, a atenção ilumina o caminho.",msg:"A noite também guarda descobertas."};
}

function aplicarSaudacao(){
  const p = periodNow();
  const g = $("greeting");        if(g) g.textContent = p.title;
  const d = $("period-desc");     if(d) d.textContent = p.desc;
  const i = $("period-icon");     if(i) i.textContent = p.icon;
  const home = $("home");
  const naHome = home && home.classList.contains("active");
  const chip = $("time-chip");
  if(naHome && chip) chip.textContent = "JORNADA DA " + p.name.toUpperCase();
  state.time = p;
  return p;
}

function lerProgresso(){
  try{
    const bruto = localStorage.getItem(SAVE_KEY);
    if(!bruto) return null;
    const d = JSON.parse(bruto);
    if(!d || d.v !== SAVE_VERSION) return null;
    if(typeof d.fase !== "number" || typeof d.index !== "number" || typeof d.score !== "number") return null;
    if(typeof d.concluidas !== "number") d.concluidas = 0;
    return d;
  }catch(e){ return null; }
}
function salvarProgresso(){
  if(!state.salvar) return;
  try{
    const atual = lerProgresso();
    const concluidas = Math.max(atual ? atual.concluidas : 0, state.fase > 1 ? state.fase - 1 : 0);
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      v:SAVE_VERSION, fase:state.fase, index:state.index, score:state.score, concluidas, data:new Date().toISOString()
    }));
  }catch(e){}
}
function apagarProgresso(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} }
function faseDesbloqueada(n){
  if(n === 1) return true;
  const p = lerProgresso();
  if(!p) return false;
  return n <= (p.concluidas || 0) + 1;
}
function registrarConclusao(fase){
  const p = lerProgresso() || {v:SAVE_VERSION,concluidas:0,index:0,score:0,fase:1};
  p.concluidas = Math.max(p.concluidas || 0, fase);
  p.v = SAVE_VERSION;
  p.fase = Math.min(fase + 1, TOTAL_FASES);
  p.index = 0; p.score = 0;
  p.data = new Date().toISOString();
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(p)); }catch(e){}
}

/* ---------- §6 UTILIDADES ---------- */
function shuffle(a){
  const out = [...a];
  for(let i=out.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; }
  return out;
}
function pickN(item, list, n){
  const seen = new Set([item.word]);
  const others = shuffle(list.filter(x => !seen.has(x.word))).slice(0, n - 1);
  return shuffle([item, ...others]);
}
function pickMeanings(item, list, n){
  const seen = new Set([item.meaning]);
  const outros = shuffle(list.filter(x => !seen.has(x.meaning)));
  const out = [item.meaning];
  for(const o of outros){ if(out.length >= n) break; if(seen.has(o.meaning)) continue; seen.add(o.meaning); out.push(o.meaning); }
  while(out.length < n){ out.push("—"); }
  return shuffle(out);
}
function numberWord(n){ return NUMBER_VOCABULARY.find(v => v.value === n); }

const FACIL = VOCABULARY.filter(v => v.file);
const COM_AUDIO = VOCABULARY.filter(v => v.audio);
const ANIMAIS_COUNT = VOCABULARY.filter(v => v.category === "ANIMAIS" && v.file);
const CATS_BASE = ["OBJETOS","ALIMENTOS","ANIMAIS","CORPO","PARENTESCO","NATUREZA","GEOGRAFIA"];
const PARENTESCO = VOCABULARY.filter(v => v.category === "PARENTESCO");

/* ---------- §6.2 IMAGENS DAS CATEGORIAS ---------- */
const CATEGORIA_ARQUIVO = {
  "OBJETOS":    "objetos.png",
  "ALIMENTOS":  "alimentos.png",
  "ANIMAIS":    "animais.png",
  "CORES":      "cores.png",
  "CORPO":      "corpo.png",
  "PARENTESCO": "parentesco.png",
  "NATUREZA":   "natureza.png",
  "GEOGRAFIA":  "geografia.png",
  "SAUDAÇÕES":  "saudacoes.png",
  "ADVÉRBIOS":  "adverbios.png"
};
const CATEGORIA_EMOJI = {
  "OBJETOS":"🏺","ALIMENTOS":"🍌","ANIMAIS":"🐾","CORES":"🎨",
  "CORPO":"👁️","PARENTESCO":"👪","NATUREZA":"🌿","GEOGRAFIA":"🗺️",
  "SAUDAÇÕES":"👋","ADVÉRBIOS":"💬"
};
const CATEGORIA_FALLBACK = "📂";

function imagemCategoria(cat){
  const chave = String(cat || "").toUpperCase();
  const arq = CATEGORIA_ARQUIVO[chave];
  return arq ? `${ASSET.images}categorias/${arq}` : null;
}
function emojiCategoria(cat){
  const chave = String(cat || "").toUpperCase();
  return CATEGORIA_EMOJI[chave] || CATEGORIA_FALLBACK;
}

/* ---------- §7 ÁUDIO ---------- */
let audioCtx = null;
function beep(freq, dur, type="sine", vol=.18){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g).connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur);
  }catch(e){}
}
function audio(file){
  if(!state.sound || !file) return;
  const a = new Audio(ASSET.audio + file);
  a.volume = .85;
  a.play().catch(() => {});
}
const sfx = {
  acerto(){ if(!state.sound) return; beep(660,.10,"triangle"); setTimeout(()=>beep(880,.14,"triangle"),90); },
  erro(){ if(!state.sound) return; beep(220,.12,"sawtooth",.14); },
  clique(){ if(!state.sound) return; beep(520,.05,"sine",.10); }
};

/* ---------- §8 GERADORES DE QUESTÃO ---------- */
const CROSS_DIFICULDADE = {
  1:{size:6,  n:4, dirs:["H","V"]}, 2:{size:7,  n:4, dirs:["H","V"]},
  3:{size:7,  n:5, dirs:["H","V"]}, 4:{size:8,  n:5, dirs:["H","V"]},
  5:{size:8,  n:6, dirs:["H","V"]}, 6:{size:9,  n:6, dirs:["H","V"]},
  7:{size:9,  n:7, dirs:["H","V"]}, 8:{size:10, n:7, dirs:["H","V"]},
  9:{size:10, n:8, dirs:["H","V"]}
};

function clarificarSignificado(palavra){
  const item = VOCABULARY.find(v => searchClean(v.word) === palavra);
  if(item) return item.meaning;
  return palavra.toLowerCase();
}

function buildCrossGrid(fase, poolPalavras){
  const cfg = CROSS_DIFICULDADE[fase] || CROSS_DIFICULDADE[9];
  const size = cfg.size;
  const G = Array.from({length:size}, () => Array.from({length:size}, () => ""));
  const placed = [];
  const dirs = [[0,1],[1,0]];

  const tentar = (word, permitirDiagonal) => {
    const locais = dirs.slice();
    if(permitirDiagonal) locais.push([1,1],[1,-1]);
    for(let tent = 0; tent < 80; tent++){
      const dir = locais[Math.floor(Math.random() * locais.length)];
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      const endR = r + dir[0] * (word.length - 1);
      const endC = c + dir[1] * (word.length - 1);
      if(endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
      let colide = false;
      let toques = 0;
      for(let i = 0; i < word.length; i++){
        const rr = r + dir[0] * i, cc = c + dir[1] * i;
        if(G[rr][cc]){
          toques++;
          if(G[rr][cc] !== word[i]){ colide = true; break; }
        }
      }
      if(colide) continue;
      if(placed.length > 0 && toques === 0) continue;
      for(let i = 0; i < word.length; i++){
        G[r + dir[0] * i][c + dir[1] * i] = word[i];
      }
      return {r, c, dr:dir[0], dc:dir[1], len:word.length, word};
    }
    return null;
  };

  const fila = shuffle(poolPalavras.slice());
  if(fila.length === 0) return null;
  const primeira = fila.shift();
  const linhaInicial = Math.floor(size / 2);
  const colInicial = Math.max(0, Math.floor((size - primeira.length) / 2));
  for(let i = 0; i < primeira.length; i++){
    G[linhaInicial][colInicial + i] = primeira[i];
  }
  placed.push({r:linhaInicial, c:colInicial, dr:0, dc:1, len:primeira.length, word:primeira});

  for(const w of fila){
    if(placed.length >= cfg.n) break;
    const permitirD = fase >= 5 && Math.random() < 0.2;
    const enc = tentar(w, permitirD);
    if(enc) placed.push(enc);
  }
  if(placed.length < 3) return null;

  const ordenadas = placed.slice().sort((a,b) => a.r !== b.r ? a.r - b.r : a.c - b.c);
  ordenadas.forEach((p, idx) => { p.num = idx + 1; });

  let minR = size, minC = size, maxR = 0, maxC = 0;
  for(let i = 0; i < size; i++){
    for(let j = 0; j < size; j++){
      if(G[i][j]){
        if(i < minR) minR = i;
        if(i > maxR) maxR = i;
        if(j < minC) minC = j;
        if(j > maxC) maxC = j;
      }
    }
  }
  const recorte = [];
  for(let i = minR; i <= maxR; i++){
    const linha = [];
    for(let j = minC; j <= maxC; j++) linha.push(G[i][j] || "");
    recorte.push(linha);
  }

  const words = ordenadas.map(p => ({
    word: p.word,
    clue: clarificarSignificado(p.word),
    r: p.r - minR, c: p.c - minC,
    dr: p.dr, dc: p.dc, num: p.num,
    dir: p.dr === 0 ? "H" : "V"
  }));

  return {grid: recorte, rows: recorte.length, cols: recorte[0].length, words};
}

function qCrossDinamica(fase, usadas){
  const lim = SEARCH_LIMITE[fase] || SEARCH_LIMITE[9];
  const pool = searchPoolForFase(fase, [...(usadas || new Set())]);
  const curtidas = pool.filter(w => w.length >= lim.min && w.length <= 10);
  const escolhidas = shuffle(curtidas.length ? curtidas : pool).slice(0, 12);
  let resultado = buildCrossGrid(fase, escolhidas);
  if(!resultado && usadas && usadas.size > 0){
    const ampliado = searchPoolForFase(fase, []);
    const curt2 = ampliado.filter(w => w.length >= 3 && w.length <= 10);
    resultado = buildCrossGrid(fase, shuffle(curt2).slice(0, 12));
  }
  if(!resultado) return null;
  return {
    type:"cross", kind:"CRUZADINHA",
    prompt:"Complete a cruzadinha em Tupi:",
    hint:"Os números indicam onde cada palavra começa. As setas mostram a direção.",
    puzzle: resultado,
    _words: resultado.words.map(w => w.word),
    target: "cross::" + resultado.words.map(w => w.word).sort().join(",")
  };
}

function qSearch(fase, usadas){
  const grid = buildSearchGrid(fase, [...(usadas || new Set())]);
  const finalGrid = grid.words.length >= 2 ? grid : buildSearchGrid(fase, []);
  return {
    type:"search", kind:"CAÇA-PALAVRAS",
    prompt:"Encontre as palavras Tupi escondidas:",
    hint:"Toque no início e depois no fim de cada palavra.",
    grid: finalGrid,
    words: finalGrid.words,
    _words: finalGrid.words,
    target: "search::" + finalGrid.words.slice().sort().join(",")
  };
}

/* §8.3 Geradores simples */
function qWord(fase){
  const item = shuffle(FACIL)[0];
  return {type:"word",kind:"VOCABULÁRIO",prompt:"Como se diz isto na língua Tupi?",hint:"Observe a imagem e escolha a palavra.",target:item.word,imageItem:item,choices:pickN(item,FACIL,fase>=5?4:3).map(x=>x.word)};
}
function qMeaning(fase){
  const item = shuffle(FACIL)[0];
  return {type:"meaning",kind:"TRADUÇÃO",prompt:`O que significa «${item.word}»?`,hint:"Escolha o significado em português.",target:item.meaning,targetWord:item.word,audioItem:item,choices:pickMeanings(item,FACIL,fase>=5?4:3)};
}
function qReverse(fase){
  const item = shuffle(FACIL)[0];
  return {type:"reverse",kind:"PALAVRA EM TUPI",prompt:`Como se diz «${item.meaning}» em Tupi?`,hint:"Escolha a palavra correta.",target:item.word,targetMeaning:item.meaning,choices:pickN(item,FACIL,fase>=5?4:3).map(x=>x.word)};
}
function qAudio(fase){
  const item = shuffle(COM_AUDIO)[0];
  return {type:"audio",kind:"ESCUTE E ESCOLHA",prompt:"Ouça a pronúncia e escolha a palavra certa.",hint:"Toque no alto-falante para ouvir.",target:item.word,audioItem:item,choices:pickN(item,COM_AUDIO,fase>=5?4:3).map(x=>x.word)};
}
function qCount(fase){
  const n = 1 + Math.floor(Math.random()*7);
  const animal = shuffle(ANIMAIS_COUNT)[0];
  return {type:"count",kind:"CONTE E DESCUBRA",prompt:"Quantos animais aparecem na imagem?",hint:"Toque em cada figura para marcar que já contou.",target:n,countItem:animal,choices:shuffle(pickN(numberWord(n),NUMBER_VOCABULARY,Math.min(4,(fase>=5?4:3)+1))).map(x=>x.value)};
}
function qNumber(fase){
  const n = shuffle(NUMBER_VOCABULARY)[0];
  const qtdOpcoes = (fase >= 5) ? 4 : 3;
  return {
    type:"number", kind:"NÚMEROS",
    prompt:"Qual é a palavra Tupi para este número?",
    hint:"Observe o algarismo.",
    target:n.value,
    choices:shuffle(pickN(n,NUMBER_VOCABULARY,qtdOpcoes)).map(x=>x.value)
  };
}
function qCategory(){
  const cats = CATS_BASE.filter(c => c !== "PARENTESCO" && VOCABULARY.some(v => v.category === c && v.file));
  if(cats.length < 3) return null;
  const cat = shuffle(cats)[0];
  const item = shuffle(VOCABULARY.filter(v => v.category === cat && v.file))[0];
  if(!item) return null;
  const choices = shuffle([cat, ...shuffle(cats.filter(c => c !== cat)).slice(0, 3)]);
  return {
    type:"category", kind:"CATEGORIA",
    prompt:`A palavra «${item.word}» pertence a qual categoria?`,
    hint:"Escolha entre as categorias.",
    target:cat,
    targetWord:item.word,
    imageItem:item,
    choices,
    categorias: choices
  };
}
function qOdd(){
  const cats = CATS_BASE.filter(c => c !== "PARENTESCO" && VOCABULARY.filter(v=>v.category===c).length >= 4);
  if(cats.length < 2) return null;
  const [catA, catB] = shuffle(cats);
  const intru = shuffle(VOCABULARY.filter(v => v.category === catB))[0];
  const grupo = shuffle(VOCABULARY.filter(v => v.category === catA)).slice(0,3);
  if(!intru || grupo.length < 3) return null;
  return {type:"odd",kind:"INTRUSO",prompt:`Três palavras são de «${catA.toLowerCase()}». Qual NÃO pertence?`,hint:"Escolha a de outra categoria.",target:intru.word,choices:shuffle([...grupo.map(x=>x.word),intru.word])};
}
function qGap(){
  const item = shuffle(FRASES_POSPOSICAO)[0];
  return {type:"gap",kind:"POSPOSIÇÃO",prompt:"Complete a frase com a posposição correta:",hint:"As posposições vêm depois da palavra.",sentence:item.frase,target:item.resp,choices:shuffle([item.resp,...item.distratores])};
}
function qVerb(){
  const v = shuffle(VERBOS_IRREGULARES)[0];
  const i = Math.floor(Math.random()*v.conjugacoes.length);
  const certa = v.conjugacoes[i];
  const erradas = shuffle(VERBOS_IRREGULARES.filter(x=>x.base!==v.base).map(x=>x.conjugacoes[Math.floor(Math.random()*x.conjugacoes.length)])).slice(0,3);
  return {type:"verb",kind:"VERBO IRREGULAR",prompt:`Como se conjuga «${v.pessoa[i]}» do verbo ${v.base.toUpperCase()}?`,hint:"Verbos irregulares (vol. 2, p.29).",target:certa,targetBase:v.base,choices:shuffle([certa,...erradas])};
}
function qChooseVerb(){
  const v = shuffle(VERBOS_REGULARES)[0];
  const i = Math.floor(Math.random()*v.conjug.length);
  const certa = v.conjug[i];
  const opcoes = [certa, ...VERBOS_REGULARES.filter(x=>x.base!==v.base).map(x=>x.conjug[Math.floor(Math.random()*x.conjug.length)])];
  return {type:"choose-verb",kind:"CONJUGAÇÃO",prompt:`Qual é a forma correta em «${["eu","você","ele/ela","nós (incl.)","nós (excl.)","vocês"][i]}» para o verbo ${v.base.toUpperCase()}?`,hint:"Verbos da 1ª conjugação (vol. 1, p.39).",target:certa,targetBase:v.base,choices:shuffle(opcoes).slice(0,4)};
}
function qAdv(){
  const grupo = shuffle(CLASSES_ADV)[0];
  const p = shuffle(grupo.exemplos)[0];
  return {type:"adv",kind:"ADVÉRBIO",prompt:`O advérbio «${p}» pertence a qual classe?`,hint:"Classes de advérbios (vol. 2, p.10).",target:grupo.classe,targetWord:p,choices:shuffle(CLASSES_ADV.map(c=>c.classe))};
}
function qInterrog(){
  const item = shuffle(INTERROGATIVAS)[0];
  const distr = shuffle(INTERROGATIVAS.filter(x=>x.palavra!==item.palavra)).slice(0,2).map(x=>x.significado);
  return {type:"interrog",kind:"PALAVRA INTERROGATIVA",prompt:"Qual significado corresponde a esta palavra interrogativa?",hint:"Fazendo Perguntas (vol. 2, p.43).",target:item.significado,targetWord:item.palavra,choices:shuffle([item.significado,...distr])};
}
function qPictureSort(){
  const cats = CATS_BASE.filter(c => c !== "PARENTESCO" && VOCABULARY.filter(v=>v.category===c && v.file).length >= 1);
  if(cats.length < 3) return null;
  const [cA, cB, cC] = shuffle(cats).slice(0,3);
  const iA = shuffle(VOCABULARY.filter(v=>v.category===cA && v.file))[0];
  const iB = shuffle(VOCABULARY.filter(v=>v.category===cB && v.file))[0];
  const iC = shuffle(VOCABULARY.filter(v=>v.category===cC && v.file))[0];
  if(!iA || !iB || !iC) return null;
  const alvo = shuffle([iA,iB,iC])[0];
  return {type:"picture-sort",kind:"QUAL É ESTA PALAVRA?",prompt:`Qual figura corresponde a «${alvo.word}»?`,hint:"Três imagens — escolha a da palavra.",target:alvo.word,targetItem:alvo,items:[iA,iB,iC]};
}
function qGreeting(){
  const item = shuffle(FRASES_COTIDIANO)[0];
  return {type:"greeting",kind:"FRASE DO COTIDIANO",prompt:`O que significa «${item.word}»?`,hint:"Frases do dia a dia (vol. 2, p.7).",target:item.meaning,targetWord:item.word,choices:pickMeanings(item,FRASES_COTIDIANO,4)};
}
function qCardinal(){
  const item = shuffle(CARDINAIS)[0];
  return {type:"cardinal",kind:"PONTO CARDEAL",prompt:"Este ponto cardeal corresponde a qual direção?",hint:"Vol. 2, p.17.",target:item.meaning,targetWord:item.word,choices:shuffle(CARDINAIS.map(c=>c.meaning))};
}
function qMonthDay(){
  const isMes = Math.random() < 0.5;
  const arr = isMes ? MESES : DIAS;
  const item = shuffle(arr)[0];
  return {type:isMes ? "month" : "day",kind:isMes ? "MÊS" : "DIA DA SEMANA",prompt:`«${item.word}» corresponde a qual ${isMes ? "mês" : "dia da semana"}?`,hint:"Calendário Tupi (vol. 2, p.46).",target:item.meaning,targetWord:item.word,choices:pickMeanings(item,arr,4)};
}

let _filaParentesco = [];
let _faseFilaParentesco = 0;
function _resetarFilaParentesco(){
  _filaParentesco = shuffle(PARENTESCO.slice());
}
function qParentesco(fase){
  if(PARENTESCO.length < 4) return null;
  if(_faseFilaParentesco !== fase){
    _faseFilaParentesco = fase;
    _resetarFilaParentesco();
  }
  if(_filaParentesco.length === 0) _resetarFilaParentesco();
  const item = _filaParentesco.shift();
  const outros = shuffle(
    PARENTESCO.filter(x => x.meaning !== item.meaning)
  ).slice(0, 3);
  return {
    type:"parentesco",kind:"PARENTESCO",
    prompt:"O que significa esta palavra em português?",
    hint:"Termo de parentesco (vol. 2, p.35).",
    target:item.meaning,targetWord:item.word,audioItem:item,
    choices:shuffle([item.meaning, ...outros.map(x => x.meaning)])
  };
}

function qOrder(fase){
  const nivelFase = fase || 1;
  const viaveis = FRASES_ORDENAR.filter(f => (f.nivel || 2) <= nivelFase);
  if(viaveis.length === 0) return null;
  const base = shuffle(viaveis)[0];
  return {
    type:"order",kind:"ORDENE A FRASE",
    prompt:"Ordene as palavras para formar a frase correta:",
    hint:"Toque nas palavras na ordem certa. Sujeito + complemento + verbo.",
    target: base.tokens.join("|"),
    tokens: shuffle(base.tokens),
    translation: base.pt,
    audio: base.audio || null
  };
}

function qMatch(){
  const selecionados = shuffle(PARES_LIGAR).slice(0, 4);
  return {
    type:"match",kind:"LIGUE AS PALAVRAS",
    prompt:"Ligue cada palavra Tupi ao seu significado:",
    hint:"Toque num item da esquerda e depois no seu correspondente da direita.",
    pairs: selecionados,
    target: selecionados.map(p=>p.a+"="+p.b).join("|")
  };
}

const GERADORES_SIMPLES = {
  word:qWord, meaning:qMeaning, reverse:qReverse, audio:qAudio,
  count:qCount, number:qNumber, category:qCategory, odd:qOdd,
  gap:qGap, verb:qVerb, "choose-verb":qChooseVerb, adv:qAdv,
  interrog:qInterrog, "picture-sort":qPictureSort, greeting:qGreeting,
  cardinal:qCardinal, "month-day":qMonthDay, parentesco:qParentesco,
  order:qOrder, match:qMatch
};

/* ---------- §9 MONTAGEM DA FASE ---------- */
const FASES_DISTRIBUICAO = {
  1:{word:12, number:5, count:6, category:4, "picture-sort":3},
  2:{word:8, number:3, count:4, category:3, "picture-sort":3, meaning:4, audio:3, order:2},
  3:{word:6, meaning:5, reverse:4, audio:3, count:3, category:2, "picture-sort":3, order:2, match:2},
  4:{meaning:4, reverse:4, audio:3, gap:3, cardinal:2, count:2, word:3, odd:3, parentesco:2, order:2, match:2},
  5:{meaning:4, reverse:4, odd:3, gap:4, "picture-sort":3, count:2, audio:2, category:2, parentesco:2, order:1, match:1, search:2},
  6:{meaning:3, reverse:3, audio:3, gap:4, verb:4, greeting:2, adv:3, "picture-sort":2, order:2, match:2, cross:1},
  7:{meaning:3, reverse:3, audio:2, adv:3, gap:3, interrog:3, "month-day":3, "picture-sort":2, parentesco:2, order:2, match:2, search:2},
  8:{meaning:3, reverse:3, adv:3, gap:3, "month-day":3, greeting:3, verb:3, "choose-verb":3, parentesco:2, order:2, cross:2, search:2},
  9:{meaning:2, reverse:2, audio:2, adv:3, gap:3, interrog:3, verb:3, "choose-verb":3, cardinal:2, "month-day":2, order:2, match:2, cross:1, search:2}
};

const NIVEIS_FASE = {
  1:["word","number","count","category","picture-sort"],
  2:["word","number","count","category","picture-sort","meaning","audio","order"],
  3:["word","meaning","reverse","audio","count","category","picture-sort","order","match"],
  4:["meaning","reverse","audio","gap","cardinal","count","word","odd","parentesco","order","match"],
  5:["meaning","reverse","odd","gap","picture-sort","count","audio","category","parentesco","order","match","search"],
  6:["meaning","reverse","audio","gap","verb","greeting","adv","picture-sort","order","match","cross"],
  7:["meaning","reverse","audio","adv","gap","interrog","month","day","picture-sort","parentesco","order","match","search"],
  8:["meaning","reverse","adv","gap","month","day","greeting","verb","choose-verb","parentesco","order","cross","search"],
  9:["meaning","reverse","audio","adv","gap","interrog","verb","choose-verb","cardinal","month","day","order","match","cross","search"]
};

function tipoPermitido(fase, tipo){
  const lista = NIVEIS_FASE[fase] || NIVEIS_FASE[9];
  return lista.includes(tipo);
}

function montarFase(fase){
  const dist = FASES_DISTRIBUICAO[fase];
  const pool = [];
  const palavrasUsadas = new Set();

  for(const [tipo, qtd] of Object.entries(dist)){
    if(!tipoPermitido(fase, tipo)) continue;
    for(let i = 0; i < qtd; i++){
      let q = null;
      if(tipo === "search"){
        q = qSearch(fase, palavrasUsadas);
        if(q && q._words) q._words.forEach(w => palavrasUsadas.add(w));
      }
      else if(tipo === "cross"){
        q = qCrossDinamica(fase, palavrasUsadas);
        if(q && q._words) q._words.forEach(w => palavrasUsadas.add(w));
      }
      else if(GERADORES_SIMPLES[tipo]){
        q = GERADORES_SIMPLES[tipo](fase);
      }
      if(q) pool.push(q);
    }
  }

  const vistos = new Set();
  const unicos = [];
  for(const q of pool){
    const chave = q.type + "::" + q.target;
    if(vistos.has(chave)) continue;
    vistos.add(chave); unicos.push(q);
  }

  let guard = 0;
  const tiposPermitidos = Object.keys(GERADORES_SIMPLES).filter(t => tipoPermitido(fase, t));
  while(unicos.length < QS_PER_FASE && guard++ < 400){
    const t = tiposPermitidos[Math.floor(Math.random() * tiposPermitidos.length)];
    if(!t) break;
    const q = GERADORES_SIMPLES[t](fase);
    if(!q) continue;
    if(!tipoPermitido(fase, q.type)) continue;
    const chave = q.type + "::" + q.target;
    if(vistos.has(chave)) continue;
    vistos.add(chave); unicos.push(q);
  }

  if(unicos.length === 0) throw new Error("Nenhum gerador produziu questão para a fase " + fase);
  return shuffle(unicos).slice(0, QS_PER_FASE);
}

/* ---------- §10 FLUXO DE TELAS ---------- */
function screen(id){
  ["home","game","finish"].forEach(x => {
    const el = $(x);
    if(el) el.classList.toggle("active", x === id);
  });
  if(id === "home"){
    aplicarSaudacao();
    atualizarSeletorFase();
    atualizarBotaoContinuar();
  }
}
function safeBind(id, event, handler){
  const el = $(id);
  if(!el){ console.warn("[safeBind] ausente:", id); return; }
  el.addEventListener(event, handler);
}
function start(fase){
  const alvo = fase || 1;
  if(!faseDesbloqueada(alvo)) return;
  state.index = 0; state.score = 0; state.acertos = 0; state.erros = 0;
  state.fase = alvo;
  state.time = periodNow();
  state.questions = montarFase(alvo);
  atualizarHUDInicio();
  screen("game");
  salvarProgresso();
  render();
}
function rejogarFase(){
  state.index = 0; state.score = 0; state.acertos = 0; state.erros = 0;
  state.questions = montarFase(state.fase);
  atualizarHUDInicio();
  screen("game");
  salvarProgresso();
  render();
}
function continuarSalvo(){
  const p = lerProgresso();
  if(!p){ start(1); return; }
  const fase = Math.min(Math.max(p.fase || 1, 1), TOTAL_FASES);
  state.fase = fase;
  state.score = Math.max(0, p.score | 0);
  state.acertos = Math.max(0, p.acertos | 0);
  state.erros = Math.max(0, p.erros | 0);
  state.time = periodNow();
  state.questions = montarFase(fase);
  state.index = Math.min(Math.max(0, p.index | 0), state.questions.length - 1);
  atualizarHUDInicio();
  screen("game");
  render();
}
function atualizarHUDInicio(){
  const chip = $("time-chip"); if(chip) chip.textContent = "FASE " + state.fase + " · " + (state.time ? state.time.name.toUpperCase() : "");
  const pl = $("period-label"); if(pl) pl.textContent = FASES_INFO[state.fase].nome + " · 30 DESAFIOS";
  const g = $("greeting"); if(g && state.time) g.textContent = state.time.title;
  const d = $("period-desc"); if(d && state.time) d.textContent = state.time.desc;
  const i = $("period-icon"); if(i && state.time) i.textContent = state.time.icon;
  const m = $("period-message"); if(m && state.time) m.textContent = state.time.msg;
}

/* ---------- §11 RENDER ---------- */
function createImage(item, className){
  const img = document.createElement("img");
  img.className = className || "visual-image";
  img.alt = item.meaning || "Imagem Tupi";
  img.onerror = function(){
    const wrap = document.createElement("div");
    wrap.className = "visual-card";
    const w = document.createElement("span");
    w.className = "number-visual";
    w.style.fontSize = "34px";
    w.textContent = item.word || "?";
    const lab = document.createElement("span");
    lab.className = "visual-label";
    lab.textContent = "PALAVRA TUPI";
    wrap.append(w, lab);
    this.replaceWith(wrap);
  };
  img.src = ASSET.images + item.file;
  return img;
}
function limparAnswers(box){
  box.innerHTML = "";
  box.style.display = "";
  box.style.gridTemplateColumns = "";
  box.style.flexDirection = "";
  box.style.gap = "";
  box.classList.remove("two-cols");
  box.setAttribute("data-kind","");
}
function render(){
  try{
    const q = state.questions[state.index];
    if(!q){ finish(); return; }
    state.answered = false;
    $("qnum").textContent = "DESAFIO " + String(state.index + 1).padStart(2,"0");
    $("qkind").textContent = q.kind;
    $("prompt").textContent = q.prompt;
    $("hint").textContent = q.hint || "";
    $("progress-text").textContent = `${state.index + 1} / ${state.questions.length}`;
    $("progress-fill").style.width = (state.index / state.questions.length * 100) + "%";
    $("score").textContent = state.score;
    atualizarEstrelas();
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("next").disabled = true;
    $("next").textContent = state.index === state.questions.length - 1 ? "VER RESULTADO →" : "PRÓXIMO DESAFIO →";
    const ans = $("answers");
    if(ans) limparAnswers(ans);
    visual(q);
    answers(q);
  }catch(e){
    console.error("[render]", e);
    showBootError("Erro ao renderizar: " + e.message);
  }
}
function atualizarEstrelas(){
  const totalPts = QS_PER_FASE * (10 + FASES_INFO[state.fase].bonus);
  const ratio = state.score / totalPts;
  $("stars").textContent = ratio >= .85 ? "★ ★ ★" : ratio >= .6 ? "★ ★ ☆" : ratio >= .35 ? "★ ☆ ☆" : "☆ ☆ ☆";
}
function mostrarTraducao(q){
  const el = $("order-translation");
  if(!el || !q.translation){ if(el) el.style.display="none"; return; }
  el.innerHTML = "<strong>Tradução da frase</strong>" + q.translation +
    (q.audio ? '<br><button type="button" class="order-listen">🔊 OUVIR</button>' : "");
  el.style.display = "";
  if(q.audio){
    const btn = el.querySelector(".order-listen");
    if(btn) btn.addEventListener("click", () => audio(q.audio));
  }
}

function visual(q){
  const box = $("visual");
  box.innerHTML = "";
  $("listen").disabled = true;
  $("listen").onclick = null;
  const enableAudio = (item) => {
    if(!item || !item.audio) return;
    $("listen").disabled = false;
    $("listen").onclick = () => audio(item.audio);
  };
  if(q.type === "word" && q.imageItem){
    const card = document.createElement("div");
    card.className = "visual-card";
    card.append(createImage(q.imageItem, "visual-image"));
    const lab = document.createElement("span");
    lab.className = "visual-label";
    lab.textContent = "OBSERVE A IMAGEM";
    card.append(lab);
    box.append(card);
    enableAudio(q.imageItem);
  }
  else if(q.type === "audio" && q.audioItem){
    const card = document.createElement("div");
    card.className = "visual-card";
    const big = document.createElement("span");
    big.className = "number-visual";
    big.style.fontSize = "64px";
    big.textContent = "🔊";
    const lab = document.createElement("span");
    lab.className = "visual-label";
    lab.textContent = "OUÇA E ESCOLHA";
    card.append(big, lab);
    box.append(card);
    enableAudio(q.audioItem);
  }
  else if(q.type === "number"){
    const card = document.createElement("div");
    card.className = "visual-card";
    const n = document.createElement("span");
    n.className = "number-visual";
    n.textContent = String(q.target);
    const lab = document.createElement("span");
    lab.className = "visual-label";
    lab.textContent = "NÚMERO";
    card.append(n, lab);
    box.append(card);
    enableAudio(numberWord(q.target));
  }
  else if(q.type === "count"){
    const wrap = document.createElement("div");
    wrap.className = "visual-count";
    for(let i = 0; i < q.target; i++){
      const figurinha = document.createElement("button");
      figurinha.type = "button";
      figurinha.className = "count-animal";
      figurinha.setAttribute("aria-label", "Marcar figura " + (i + 1));
      figurinha.dataset.counted = "0";
      const bubble = document.createElement("div");
      bubble.className = "count-bubble";
      const img = createImage(q.countItem, "count-animal-image");
      img.alt = "Animal " + (i + 1);
      bubble.append(img);
      const check = document.createElement("span");
      check.className = "count-check";
      check.textContent = "✓";
      const badge = document.createElement("span");
      badge.className = "count-badge";
      badge.textContent = String(i + 1);
      figurinha.append(bubble, check, badge);
      figurinha.addEventListener("click", () => {
        const marcado = figurinha.dataset.counted === "1";
        figurinha.dataset.counted = marcado ? "0" : "1";
        figurinha.classList.toggle("selected", !marcado);
        if(!marcado){
          const val = Number(badge.textContent);
          beep(620 + val * 40, .07, "sine", .14);
        } else beep(380, .05, "sine", .10);
      });
      wrap.append(figurinha);
    }
    box.append(wrap);
    const note = document.createElement("span");
    note.className = "visual-note";
    note.textContent = "TOQUE EM CADA FIGURA PARA MARCAR";
    box.append(note);
  }
  else if(q.type === "gap"){
    const s = document.createElement("div");
    s.className = "gap-sentence";
    s.innerHTML = q.sentence.replace("_", "<span class='blank'>___</span>");
    box.append(s);
  }
  else if(q.type === "interrog"){
    const s = document.createElement("div");
    s.className = "interrog-sentence";
    s.textContent = q.targetWord;
    box.append(s);
  }
  else if(q.type === "picture-sort"){
    const grid = document.createElement("div");
    grid.className = "sort-grid";
    q.items.forEach(item => {
      const b2 = document.createElement("div");
      b2.className = "sort-item";
      b2.append(createImage(item, "sort-item-img"));
      const n = document.createElement("span");
      n.textContent = "?";
      b2.append(n);
      grid.append(b2);
    });
    box.append(grid);
  }
  else if(q.type === "verb" || q.type === "choose-verb"){
    const card = document.createElement("div");
    card.className = "visual-card";
    const w = document.createElement("span");
    w.className = "number-visual";
    w.style.fontSize = "44px";
    w.textContent = q.targetBase ? q.targetBase.toUpperCase() : "";
    const lab = document.createElement("span");
    lab.className = "visual-label";
    lab.textContent = "VERBO";
    card.append(w, lab);
    box.append(card);
  }
  else if(q.type === "parentesco"){
    const w = document.createElement("span");
    w.className = "word-highlight";
    w.textContent = q.targetWord;
    box.append(w);
    const lab = document.createElement("span");
    lab.className = "visual-label";
    lab.textContent = "PALAVRA TUPI";
    box.append(lab);
    enableAudio(q.audioItem);
  }
  else if(q.type === "category"){
    const card = document.createElement("div");
    card.className = "visual-card";
    const grid = document.createElement("div");
    grid.className = "cat-grid";
    const lista = q.categorias || q.choices || [];
    lista.forEach(cat => {
      const slot = document.createElement("div");
      slot.className = "cat-slot";
      const src = imagemCategoria(cat);
      if(src){
        const img = document.createElement("img");
        img.className = "cat-slot-img";
        img.alt = String(cat);
        img.src = src;
        img.onerror = () => {
          img.remove();
          const fb = document.createElement("span");
          fb.className = "cat-slot-fallback";
          fb.textContent = emojiCategoria(cat);
          slot.append(fb);
        };
        slot.append(img);
      } else {
        const fb = document.createElement("span");
        fb.className = "cat-slot-fallback";
        fb.textContent = emojiCategoria(cat);
        slot.append(fb);
      }
      grid.append(slot);
    });
    card.append(grid);
    box.append(card);
    if(q.audioItem) enableAudio(q.audioItem);
  }
  else if(q.type === "order"){
    const target = document.createElement("div");
    target.className = "tokens label-wrap target";
    target.dataset.label = "SUA FRASE";
    target.id = "order-target";
    box.append(target);
    const pool = document.createElement("div");
    pool.className = "tokens label-wrap";
    pool.dataset.label = "TOQUE PARA MONTAR";
    pool.id = "order-pool";
    q.tokens.forEach(t => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "token pool";
      b.textContent = t;
      b.dataset.word = t;
      pool.append(b);
    });
    box.append(pool);
    const trad = document.createElement("div");
    trad.className = "order-translation";
    trad.id = "order-translation";
    trad.style.display = "none";
    box.append(trad);
  }
  else if(["meaning","reverse","odd","adv","greeting","cardinal","month","day"].includes(q.type)){
    const card = document.createElement("div");
    card.className = "visual-card";
    const w = document.createElement("span");
    w.className = "visual-note";
    if(q.type === "meaning") w.textContent = q.targetWord || q.target;
    else if(q.type === "reverse") w.textContent = q.targetMeaning || q.target;
    else if(q.type === "adv") w.textContent = q.targetWord || "";
    else if(q.type === "greeting" || q.type === "cardinal" || q.type === "month" || q.type === "day") w.textContent = q.targetWord || "";
    else if(q.type === "odd") w.textContent = "🤔";
    const lab = document.createElement("span");
    lab.className = "visual-label";
    lab.textContent = q.kind;
    card.append(w, lab);
    box.append(card);
    if(q.audioItem) enableAudio(q.audioItem);
  }
  else if(q.type === "cross"){
    const clues = document.createElement("ul");
    clues.className = "cw-clues";
    q.puzzle.words.forEach((w) => {
      const li = document.createElement("li");
      const n = document.createElement("strong");
      n.textContent = (w.num || "?") + ".";
      li.append(n, document.createTextNode(w.clue || w.word));
      const dir = document.createElement("span");
      dir.className = "cw-dir";
      dir.textContent = w.dir === "H" ? "→" : "↓";
      li.append(dir);
      clues.append(li);
    });
    box.append(clues);
  }
  else if(q.type === "match"){
    const note = document.createElement("span");
    note.className = "visual-note";
    note.textContent = "Ligue a palavra em Tupi à sua tradução em português.";
    box.append(note);
  }
}

function answers(q){
  const box = $("answers");
  limparAnswers(box);
  box.setAttribute("data-kind", q.type);

  if(q.type === "picture-sort" && q.items){
    box.style.display = "grid";
    box.style.gridTemplateColumns = "repeat(3, 1fr)";
    box.style.gap = "10px";
    q.items.forEach(item => {
      const b = document.createElement("button");
      b.className = "answer";
      b.type = "button";
      b.dataset.value = item.word;
      b.style.flexDirection = "column";
      b.style.alignItems = "center";
      b.style.justifyContent = "center";
      b.style.gap = "6px";
      b.style.textAlign = "center";
      b.append(createImage(item, "answer-img"));
      const lab = document.createElement("span");
      lab.style.fontSize = "12px";
      lab.style.color = "var(--muted)";
      lab.textContent = "escolher";
      b.append(lab);
      b.addEventListener("click", () => check(item.word, b));
      box.append(b);
    });
    return;
  }

  if(q.type === "order"){
    const pool = $("order-pool");
    const target = $("order-target");
    if(!pool || !target){ box.style.display = "none"; return; }
    function checarOrdem(){
      if(state.answered) return;
      const montada = Array.from(target.children).map(el=>el.dataset.word);
      const certa = q.target.split("|");
      if(montada.length !== certa.length) return;
      if(montada.every((v,i)=>v === certa[i])){
        verificar(q, true, target);
        mostrarTraducao(q);
      }
    }
    target.addEventListener("click", (e) => {
      const el = e.target.closest(".token");
      if(!el || state.answered) return;
      el.remove();
      const clone = document.createElement("button");
      clone.type = "button";
      clone.className = "token pool";
      clone.textContent = el.textContent;
      clone.dataset.word = el.dataset.word;
      pool.append(clone);
      sfx.clique();
      checarOrdem();
    });
    pool.addEventListener("click", (e) => {
      const el = e.target.closest(".token");
      if(!el || state.answered) return;
      el.remove();
      const mv = document.createElement("button");
      mv.type = "button";
      mv.className = "token";
      mv.textContent = el.textContent;
      mv.dataset.word = el.dataset.word;
      target.append(mv);
      sfx.clique();
      checarOrdem();
    });
    box.style.display = "none";
    return;
  }

  if(q.type === "match"){
    const stage = document.createElement("div");
    stage.className = "match-stage";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "match-svg");
    svg.innerHTML = `
      <defs>
        <marker id="match-arrow-ok" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#7be495"/></marker>
        <marker id="match-arrow-err" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#ff7a7a"/></marker>
      </defs>
    `;
    const grid = document.createElement("div");
    grid.className = "match-grid";
    const colL = document.createElement("div"); colL.className = "match-col left";
    const colR = document.createElement("div"); colR.className = "match-col right";
    const left = shuffle(q.pairs.map(p=>({t:p.a,k:p.b,side:"a"})));
    const right = shuffle(q.pairs.map(p=>({t:p.b,k:p.b,side:"b"})));
    let selL = null;
    let acertos = 0;
    const connectedLines = [];
    function drawArrowLine(elA, elB, isOk){
      const sRect = svg.getBoundingClientRect();
      const pinA = elA.querySelector(".match-pin");
      const pinB = elB.querySelector(".match-pin");
      if(!pinA || !pinB) return null;
      const pRectA = pinA.getBoundingClientRect();
      const pRectB = pinB.getBoundingClientRect();
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", (pRectA.left + pRectA.width / 2) - sRect.left);
      line.setAttribute("y1", (pRectA.top + pRectA.height / 2) - sRect.top);
      line.setAttribute("x2", (pRectB.left + pRectB.width / 2) - sRect.left);
      line.setAttribute("y2", (pRectB.top + pRectB.height / 2) - sRect.top);
      line.setAttribute("stroke", isOk ? "#7be495" : "#ff7a7a");
      line.setAttribute("stroke-width", "3");
      line.setAttribute("stroke-dasharray", "8,6");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("marker-end", isOk ? "url(#match-arrow-ok)" : "url(#match-arrow-err)");
      svg.appendChild(line);
      return {line, elA, elB, isOk};
    }
    function recalcularLinhas(){
      const sRect = svg.getBoundingClientRect();
      connectedLines.forEach(item => {
        const pinA = item.elA.querySelector(".match-pin");
        const pinB = item.elB.querySelector(".match-pin");
        if(!pinA || !pinB) return;
        const pRectA = pinA.getBoundingClientRect();
        const pRectB = pinB.getBoundingClientRect();
        item.line.setAttribute("x1", (pRectA.left + pRectA.width / 2) - sRect.left);
        item.line.setAttribute("y1", (pRectA.top + pRectA.height / 2) - sRect.top);
        item.line.setAttribute("x2", (pRectB.left + pRectB.width / 2) - sRect.left);
        item.line.setAttribute("y2", (pRectB.top + pRectB.height / 2) - sRect.top);
      });
    }
    window.addEventListener("resize", recalcularLinhas);
    const montar = (col, arr) => {
      arr.forEach(item => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "match-item";
        b.textContent = item.t;
        b.dataset.key = item.k;
        const pin = document.createElement("span");
        pin.className = "match-pin";
        b.appendChild(pin);
        b.addEventListener("click", () => {
          if(state.answered || b.classList.contains("matched")) return;
          if(item.side === "a"){
            Array.from(colL.children).forEach(x=>x.classList.remove("selected"));
            b.classList.add("selected");
            selL = b;
            sfx.clique();
            return;
          }
          if(!selL) return;
          if(selL.dataset.key === item.k){
            selL.classList.add("matched");
            selL.classList.remove("selected");
            b.classList.add("matched");
            b.classList.remove("selected");
            const itemLine = drawArrowLine(selL, b, true);
            if(itemLine) connectedLines.push(itemLine);
            acertos++;
            sfx.acerto();
            if(acertos === q.pairs.length){
              window.removeEventListener("resize", recalcularLinhas);
              verificar(q, true, stage);
            }
          } else {
            b.classList.add("wrong");
            selL.classList.add("wrong");
            const tempLine = drawArrowLine(selL, b, false);
            sfx.erro();
            setTimeout(() => {
              b.classList.remove("wrong");
              if(selL) selL.classList.remove("wrong");
              if(tempLine && tempLine.line && tempLine.line.parentNode) tempLine.line.remove();
            }, 360);
            window.removeEventListener("resize", recalcularLinhas);
            verificar(q, false, stage);
          }
          selL = null;
        });
        col.append(b);
      });
    };
    montar(colL, left);
    montar(colR, right);
    grid.append(colL, colR);
    stage.append(svg, grid);
    box.append(stage);
    return;
  }

  if(q.type === "cross"){
    const wrapper = document.createElement("div");
    wrapper.className = "cw-wrapper";
    const grid = document.createElement("div");
    grid.className = "cw-grid";
    grid.style.setProperty("--cw-cols", q.puzzle.cols);
    const inputs = [];
    for(let r = 0; r < q.puzzle.rows; r++){
      for(let c = 0; c < q.puzzle.cols; c++){
        const cell = q.puzzle.grid[r][c];
        const div = document.createElement("div");
        div.className = "cw-cell";
        if(!cell){ div.classList.add("cw-blocked"); grid.append(div); continue; }
        div.classList.add("cw-open");
        if(cell.num){
          const num = document.createElement("span");
          num.className = "cw-num";
          num.textContent = cell.num;
          div.append(num);
        }
        const inp = document.createElement("input");
        inp.type = "text";
        inp.maxLength = 1;
        inp.inputMode = "text";
        inp.autocomplete = "off";
        inp.autocorrect = "off";
        inp.autocapitalize = "characters";
        inp.spellcheck = false;
        inp.className = "cw-input";
        inp.setAttribute("data-sol", cell.letter);
        inp.setAttribute("aria-label", `Letra ${r + 1}, ${c + 1}`);
        inp.setAttribute("data-r", r);
        inp.setAttribute("data-c", c);
        div.addEventListener("click", () => inp.focus());
        inp.addEventListener("input", () => {
          const v = inp.value.replace(/[^A-Za-zÀ-ÿ]/g, "").slice(0, 1).toUpperCase();
          inp.value = v;
          if(v){
            div.classList.add("solved");
            const next = grid.querySelector(`.cw-input[data-r="${r}"][data-c="${c + 1}"]`);
            if(next) next.focus();
          } else {
            div.classList.remove("solved");
          }
          checarCross();
        });
        inp.addEventListener("keydown", (e) => {
          const r0 = Number(inp.dataset.r);
          const c0 = Number(inp.dataset.c);
          const focusCell = (nr, nc) => {
            const next = grid.querySelector(`.cw-input[data-r="${nr}"][data-c="${nc}"]`);
            if(next){ e.preventDefault(); next.focus(); next.select(); }
          };
          if(e.key === "ArrowRight") focusCell(r0, c0 + 1);
          if(e.key === "ArrowLeft")  focusCell(r0, c0 - 1);
          if(e.key === "ArrowDown")  focusCell(r0 + 1, c0);
          if(e.key === "ArrowUp")    focusCell(r0 - 1, c0);
          if(e.key === "Backspace" && !inp.value) focusCell(r0, c0 - 1);
        });
        div.append(inp);
        inputs.push({inp, sol: cell.letter});
        grid.append(div);
      }
    }
    function checarCross(){
      if(state.answered) return;
      const ok = inputs.every(({inp, sol}) => inp.value.toUpperCase() === sol);
      if(ok) verificar(q, true, grid);
    }
    wrapper.append(grid);
    const note = document.createElement("div");
    note.className = "cw-note";
    note.textContent = "Toque nas células e digite as letras. Sem acentos.";
    wrapper.append(note);
    box.append(wrapper);
    return;
  }

  if(q.type === "search"){
    const wrap = document.createElement("div");
    wrap.className = "search-grid";
    wrap.style.gridTemplateColumns = `repeat(${q.grid.size}, 1fr)`;
    let startCell = null;
    const found = [];
    q.grid.placed.forEach(p => {
      const set = new Set();
      for(let i=0;i<p.len;i++) set.add((p.r + p.dr*i) + ":" + (p.c + p.dc*i));
      found.push({word:p.word, cells:set, ok:false});
    });
    const wordStrip = document.createElement("div");
    wordStrip.className = "search-words";
    q.words.forEach(w => {
      const s = document.createElement("span");
      s.className = "search-word";
      s.dataset.w = w.replace(/'/g,"");
      s.textContent = w;
      wordStrip.append(s);
    });
    const cells = [];
    for(let r=0;r<q.grid.size;r++){
      for(let c=0;c<q.grid.size;c++){
        const cell = document.createElement("div");
        cell.className = "search-cell";
        cell.textContent = q.grid.G[r][c];
        cell.dataset.r = r; cell.dataset.c = c;
        cell.addEventListener("click", () => {
          if(state.answered) return;
          if(!startCell){ startCell = cell; cell.classList.add("sel"); sfx.clique(); }
          else marcar(startCell, cell);
        });
        cells.push(cell);
        wrap.append(cell);
      }
    }
    function marcar(a, b){
      const r1 = +a.dataset.r, c1 = +a.dataset.c;
      const r2 = +b.dataset.r, c2 = +b.dataset.c;
      const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
      const len = Math.abs(r2-r1) + Math.abs(c2-c1) + 1;
      const straight = (r1===r2) || (c1===c2) || Math.abs(r2-r1)===Math.abs(c2-c1);
      a.classList.remove("sel");
      startCell = null;
      if(!straight || len < 2) return;
      const picked = [];
      for(let i=0;i<len;i++){
        const r = r1 + dr*i, c = c1 + dc*i;
        if(r<0||r>=q.grid.size||c<0||c>=q.grid.size) return;
        picked.push(r+":"+c);
      }
      const alvo = found.find(f => !f.ok && (f.cells.size === picked.length && picked.every(k=>f.cells.has(k))));
      if(alvo){
        alvo.ok = true;
        picked.forEach(k => {
          const [r,c] = k.split(":").map(Number);
          cells[r*q.grid.size + c].classList.add("found");
        });
        const strip = wordStrip.querySelector(`[data-w="${alvo.word}"]`);
        if(strip) strip.classList.add("done");
        sfx.acerto();
        if(found.every(f=>f.ok)) verificar(q, true, wrap);
      } else sfx.erro();
    }
    box.append(wordStrip, wrap);
    return;
  }

  (q.choices || []).forEach(v => {
    const b = document.createElement("button");
    b.className = "answer";
    b.type = "button";
    b.dataset.value = String(v);
    if(q.type === "number" || q.type === "count"){
      const n = numberWord(Number(v));
      b.append(document.createTextNode(n ? n.word : String(v)));
    } else {
      b.append(document.createTextNode(String(v)));
    }
    b.addEventListener("click", () => check(v, b));
    box.append(b);
  });
}

/* ---------- §12 VERIFICAÇÃO ---------- */
function verificar(q, ok, anchor){
  if(state.answered) return;
  state.answered = true;
  document.querySelectorAll(".answer").forEach(b => b.disabled = true);
  const pontos = 10 + FASES_INFO[state.fase].bonus;
  if(ok){
    state.score += pontos;
    state.acertos += 1;
    if(anchor) anchor.classList.add("target");
    $("feedback").textContent = "AGUYJEVETE! Você acertou.";
    $("feedback").className = "feedback";
    sfx.acerto();
    if(q.audioItem && q.audioItem.audio) audio(q.audioItem.audio);
    else if(q.imageItem && q.imageItem.audio) audio(q.imageItem.audio);
  } else {
    state.erros += 1;
    $("feedback").textContent = "Ainda não! Veja a resposta correta.";
    $("feedback").className = "feedback error";
    sfx.erro();
  }
  $("score").textContent = state.score;
  atualizarEstrelas();
  $("next").disabled = false;
  salvarProgresso();
}
function check(value, button){
  if(state.answered) return;
  const q = state.questions[state.index];
  const ok = String(value) === String(q.target);
  state.answered = true;
  document.querySelectorAll(".answer").forEach(b => b.disabled = true);
  const pontos = 10 + FASES_INFO[state.fase].bonus;
  if(ok){
    state.score += pontos;
    state.acertos += 1;
    button.classList.add("correct");
    $("feedback").textContent = "AGUYJEVETE! Você acertou.";
    $("feedback").className = "feedback";
    sfx.acerto();
    if(q.audioItem && q.audioItem.audio) audio(q.audioItem.audio);
    else if(q.imageItem && q.imageItem.audio) audio(q.imageItem.audio);
  } else {
    state.erros += 1;
    button.classList.add("wrong");
    const right = [...document.querySelectorAll(".answer")].find(b => b.dataset.value === String(q.target));
    if(right) right.classList.add("correct");
    $("feedback").textContent = "Ainda não! A resposta certa está destacada.";
    $("feedback").className = "feedback error";
    sfx.erro();
  }
  $("score").textContent = state.score;
  atualizarEstrelas();
  $("next").disabled = false;
  salvarProgresso();
}
function next(){
  if(!state.answered) return;
  sfx.clique();
  if(state.index < state.questions.length - 1){
    state.index++; salvarProgresso(); render(); return;
  }
  registrarConclusao(state.fase);
  finish();
}

/* ---------- §13 CONCLUSÃO ---------- */
function scoreProfile(){
  const total = state.questions.length || QS_PER_FASE;
  const ok = state.acertos;
  const ratio = ok / total;
  const erros = state.erros;
  const perfeito = erros === 0;
  let medal, title, sub, apoio, atencao;
  if(ratio >= 0.9){
    medal = "🏆"; title = "Jornada excelente!";
    sub = FASES_INFO[state.fase].nome.toUpperCase() + " · RESUMO";
    apoio = "PORÃETE! Você dominou quase tudo. Nhandé nhe'ẽ (nossa língua) floresce com você.";
    atencao = perfeito
      ? "Nenhuma distração detectada. Siga com a próxima fase no mesmo ritmo e mantenha a atenção plena."
      : `Apenas ${erros} tropeço(s) — ótimo sinal. Releia as questões erradas e confirme os detalhes que confundem.`;
  } else if(ratio >= 0.65){
    medal = "🥇"; title = "Muito bem!";
    sub = FASES_INFO[state.fase].nome.toUpperCase() + " · RESUMO";
    apoio = "Você está aprendendo de verdade. O caminho se abre um passo por vez.";
    atencao = `Você acertou ${ok} de ${total}. Antes de seguir, volte aos termos que errou e leia a pronúncia pausadamente.`;
  } else if(ratio >= 0.4){
    medal = "🌱"; title = "Você está crescendo";
    sub = FASES_INFO[state.fase].nome.toUpperCase() + " · RESUMO";
    apoio = "Toda jornada tem seu tempo. Cada erro é uma palavra nova se fixando na memória.";
    atencao = `Atenção a ${erros} questão(ões). Faça esta fase de novo com calma — vai render mais na próxima.`;
  } else {
    medal = "🌰"; title = "Não desanime!";
    sub = FASES_INFO[state.fase].nome.toUpperCase() + " · RESUMO";
    apoio = "Ninguém nasce sabendo — siga tentando, você está no caminho.";
    atencao = `Você acertou ${ok} de ${total}. Recomendo repetir a fase sem pressa antes de continuar. Você vai sentir a diferença.`;
  }
  return {medal, title, sub, apoio, atencao};
}
function finish(){
  $("progress-fill").style.width = "100%";
  const p = scoreProfile();
  $("finish-bubble").style.animation = "none";
  void $("finish-bubble").offsetWidth;
  $("finish-bubble").style.animation = "";
  $("finish-medal").textContent = p.medal;
  $("finish-title").textContent = p.title;
  $("finish-sub").textContent = p.sub;
  $("final-score").textContent = state.score;
  $("stat-acertos").textContent = state.acertos;
  $("stat-erros").textContent = state.erros;
  $("stat-total").textContent = state.questions.length;
  $("support-msg").innerHTML = "<strong>Apoio</strong>" + p.apoio;
  $("attention-msg").innerHTML = "<strong>Atenção</strong>" + p.atencao;
  const btnNext = $("next-fase");
  const proxFase = state.fase + 1;
  if(state.fase < TOTAL_FASES){
    btnNext.style.display = "";
    btnNext.textContent = "CONTINUAR PARA A " + FASES_INFO[proxFase].nome.toUpperCase() + " →";
  } else btnNext.style.display = "none";
  $("time-chip").textContent = "FASE CONCLUÍDA";
  sfx.acerto();
  screen("finish");
}

/* ---------- §14 SELETOR E CONTINUAR ---------- */
function atualizarSeletorFase(){
  const box = $("fase-botoes");
  if(!box) return;
  box.innerHTML = "";
  for(let n = 1; n <= TOTAL_FASES; n++){
    const info = FASES_INFO[n];
    const liberada = faseDesbloqueada(n);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fase-btn";
    btn.dataset.fase = String(n);
    if(!liberada){ btn.disabled = true; btn.title = "Conclua a fase anterior"; }
    btn.innerHTML = `<span>${info.icone} ${info.nome}</span><small>${info.nivel}</small>`;
    btn.addEventListener("click", () => { if(!btn.disabled) start(n); });
    box.append(btn);
  }
}
function atualizarBotaoContinuar(){
  const botao = $("continue");
  if(!botao) return;
  const p = lerProgresso();
  if(!p || (p.score === 0 && p.index === 0)){ botao.style.display = "none"; return; }
  botao.style.display = "";
  const info = FASES_INFO[p.fase];
  botao.textContent = `CONTINUAR · ${info.icone} ${info.nome} · DESAFIO ${p.index + 1} · ${p.score} PTS`;
}
function showBootError(msg){
  const box = $("boot-error");
  if(!box) return;
  box.style.display = "block";
  box.textContent = "⚠ " + msg + "\n\nRecarregue a página (Ctrl+F5). Se persistir, abra o console (F12) e copie a primeira linha vermelha.";
}

/* ---------- §15 CLIMA — Open-Meteo ---------- */
const CLIMA_CIDADES = [
  {nome:"Barão de Antonina", uf:"SP", lat:-23.6296, lon:-49.5632},
  {nome:"Itaporanga",         uf:"SP", lat:-23.7086, lon:-49.4884},
  {nome:"Itararé",            uf:"SP", lat:-24.1131, lon:-49.3347},
  {nome:"São Paulo",          uf:"SP", lat:-23.5505, lon:-46.6333},
  {nome:"Curitiba",           uf:"PR", lat:-25.4284, lon:-49.2733}
];
const CLIMA_KEY = "tape-rupi-clima-cidade";
const CLIMA_LOCAL = { ...CLIMA_CIDADES[0], timezone:"America/Sao_Paulo" };
let   CLIMA_REQUEST_ID = 0;

const WMO = {
  0:{icon:"☀️",label:"Ensolarado"},1:{icon:"🌤",label:"Quase limpo"},
  2:{icon:"⛅",label:"Parcial. nublado"},3:{icon:"☁️",label:"Nublado"},
  45:{icon:"🌫",label:"Névoa"},48:{icon:"🌫",label:"Névoa gelada"},
  51:{icon:"🌦",label:"Garoa leve"},53:{icon:"🌦",label:"Garoa"},55:{icon:"🌧",label:"Garoa forte"},
  61:{icon:"🌧",label:"Chuva leve"},63:{icon:"🌧",label:"Chuva"},65:{icon:"🌧",label:"Chuva forte"},
  71:{icon:"🌨",label:"Neve leve"},73:{icon:"🌨",label:"Neve"},75:{icon:"❄️",label:"Neve forte"},
  80:{icon:"🌦",label:"Pancadas"},81:{icon:"🌧",label:"Pancadas fortes"},82:{icon:"⛈",label:"Pancadas violentas"},
  95:{icon:"⛈",label:"Trovoada"},96:{icon:"⛈",label:"Trovoada c/ granizo"},99:{icon:"⛈",label:"Trovoada severa"}
};

function lerCidadeSalva(){
  try{
    const i = Number(localStorage.getItem(CLIMA_KEY));
    if(Number.isInteger(i) && CLIMA_CIDADES[i]) return i;
  }catch(e){}
  return 0;
}
function horaAgora(){
  const d = new Date();
  return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0");
}
function renderizarClima(dados){
  const card = $("weather-card");
  if(!card || !dados) return;
  card.classList.remove("is-loading");
  card.dataset.fonte = dados.fonte || "real";
  card.classList.toggle("is-fallback", card.dataset.fonte === "simbolico");
  const set = (id, txt) => { const el = $(id); if(el) el.textContent = txt; };
  set("weather-city", dados.cidade);
  set("weather-icon", dados.icon);
  set("weather-temp", dados.temp);
  set("weather-desc", dados.label);
  set("weather-feels", dados.feels);
  set("weather-max", dados.max);
  set("weather-min", dados.min);
  set("weather-hum", dados.hum);
  set("weather-wind", dados.wind);
  set("weather-updated", dados.updated);
}
function climaSimbolico(){
  const d = new Date();
  const h = d.getHours();
  const iso = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  let seed = 0;
  for(let i = 0; i < iso.length; i++) seed = (seed * 31 + iso.charCodeAt(i)) >>> 0;
  const opcoes = [
    {icon:"☀️",label:"Ensolarado"},
    {icon:"⛅",label:"Parcial. nublado"},
    {icon:"🌦",label:"Chuva isolada"}
  ];
  const v = opcoes[seed % opcoes.length];
  const base = 18 + (seed % 13);
  const ajuste = (h >= 12 && h < 16) ? 2 : ((h >= 22 || h < 6) ? -2 : 0);
  const t = base + ajuste;
  renderizarClima({
    cidade: `${CLIMA_LOCAL.nome}, ${CLIMA_LOCAL.uf}`,
    icon: (h >= 18 || h < 6) ? "🌙" : v.icon,
    temp: `${t}°`,
    label: v.label,
    feels: `Sensação ${t + 1}°`,
    max: `${t + 3}°`,
    min: `${t - 4}°`,
    hum: "—",
    wind: "—",
    updated: "simbólico",
    fonte: "simbolico"
  });
}
async function atualizarClima(){
  const card = $("weather-card");
  if(card) card.classList.add("is-loading");
  const meuId = ++CLIMA_REQUEST_ID;
  const url = "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${CLIMA_LOCAL.lat}` +
    `&longitude=${CLIMA_LOCAL.lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,is_day,relative_humidity_2m,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&forecast_days=1` +
    `&timezone=${encodeURIComponent(CLIMA_LOCAL.timezone)}`;
  try{
    const r = await fetch(url, { cache: "no-store" });
    if(meuId !== CLIMA_REQUEST_ID) return;
    if(!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    const c = d && d.current;
    const daily = d && d.daily;
    if(!c || typeof c.temperature_2m !== "number") throw new Error("payload");
    const meta = WMO[Number(c.weather_code)] || {icon:"🌡", label:"tempo"};
    const icon = c.is_day === 0 ? "🌙" : meta.icon;
    renderizarClima({
      cidade: `${CLIMA_LOCAL.nome}, ${CLIMA_LOCAL.uf}`,
      icon,
      temp: `${Math.round(c.temperature_2m)}°`,
      label: meta.label,
      feels: typeof c.apparent_temperature === "number" ? `Sensação ${Math.round(c.apparent_temperature)}°` : "",
      max: daily && daily.temperature_2m_max ? `${Math.round(daily.temperature_2m_max[0])}°` : "—",
      min: daily && daily.temperature_2m_min ? `${Math.round(daily.temperature_2m_min[0])}°` : "—",
      hum: typeof c.relative_humidity_2m === "number" ? `${c.relative_humidity_2m}%` : "—",
      wind: typeof c.wind_speed_10m === "number" ? `${Math.round(c.wind_speed_10m)} km/h` : "—",
      updated: horaAgora(),
      fonte: "real"
    });
    if(card) card.setAttribute("title", `Clima em ${CLIMA_LOCAL.nome} (Open-Meteo · agora)`);
  }catch(e){
    if(meuId !== CLIMA_REQUEST_ID) return;
    console.warn("[clima] fallback simbólico:", e.message);
    climaSimbolico();
  }
}
function aplicarCidade(idx){
  const c = CLIMA_CIDADES[idx] || CLIMA_CIDADES[0];
  CLIMA_LOCAL.nome = c.nome;
  CLIMA_LOCAL.uf   = c.uf;
  CLIMA_LOCAL.lat  = c.lat;
  CLIMA_LOCAL.lon  = c.lon;
  try{ localStorage.setItem(CLIMA_KEY, String(idx)); }catch(e){}
  atualizarClima();
}
function montarSeletorClima(){
  const sel = $("weather-select");
  if(!sel) return;
  sel.innerHTML = "";
  CLIMA_CIDADES.forEach((c,i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `${c.nome} · ${c.uf}`;
    sel.append(opt);
  });
  const salvo = lerCidadeSalva();
  sel.value = String(salvo);
  sel.addEventListener("change", () => aplicarCidade(Number(sel.value)));
  aplicarCidade(salvo);
}

/* ---------- §16 BIND E BOOT ---------- */
function bindEvents(){
  safeBind("start", "click", () => { state.salvar = true; apagarProgresso(); start(1); });
  safeBind("next", "click", next);
  safeBind("home-button", "click", () => screen("home"));
  safeBind("finish-home", "click", () => screen("home"));
  safeBind("again-fase", "click", () => { apagarProgresso(); rejogarFase(); });
  safeBind("next-fase", "click", () => {
    const prox = state.fase + 1;
    if(prox > TOTAL_FASES) return;
    registrarConclusao(state.fase);
    start(prox);
  });
  safeBind("sound", "click", () => {
    state.sound = !state.sound;
    const s = $("sound");
    if(s){ s.textContent = state.sound ? "♫" : "♪̸"; s.setAttribute("aria-label", state.sound ? "Desativar sons" : "Ativar sons"); }
  });
  safeBind("continue", "click", continuarSalvo);
}

document.addEventListener("DOMContentLoaded", () => {
  try{
    aplicarSaudacao();
    bindEvents();
    atualizarSeletorFase();
    atualizarBotaoContinuar();
    montarSeletorClima();
    setInterval(() => {
      aplicarSaudacao();
      atualizarClima();
    }, 10 * 60 * 1000);
  }catch(e){
    console.error("[boot]", e);
    showBootError("Falha ao iniciar: " + e.message);
  }
});
