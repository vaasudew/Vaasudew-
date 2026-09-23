import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Copy, 
  Check, 
  ShieldCheck, 
  Music, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Languages
} from 'lucide-react';

interface DevotionalSong {
  id: string;
  titleTelugu: string;
  titleEnglish: string;
  ragaTala: string;
  author: string;
  summaryTelugu: string;
  summaryEnglish: string;
  lyricsTelugu: {
    section: string;
    lines: string[];
  }[];
  lyricsEnglish: {
    section: string;
    lines: string[];
  }[];
}

const DEVOTIONAL_SONGS: DevotionalSong[] = [
  {
    id: 'kondalalo',
    titleTelugu: 'కొండలలో నెలకొన్న కోనేటి రాయడు వాడు',
    titleEnglish: 'Kondalalo Nelakonna Koneti Rayadu Vadu',
    ragaTala: 'రాగం: హిందోళం • తాళం: ఆది',
    author: 'శ్రీ తాళ్లపాక అన్నమాచార్యులు (Saint Annamacharya)',
    summaryTelugu: 'తిరుమల స్వామి పుష్కరిణి (కోనేటి) తీరాన కొండలలో నెలకొన్న శ్రీ వేంకటేశ్వరుడు భక్తులకు కొండలంత కోరికలను అవలీలగా అనుగ్రహించే పరమ దయాళువు.',
    summaryEnglish: 'The Lord who dwells atop the sacred seven hills beside the divine Pushkarini lake showers mountain-sized blessings and grace upon all pilgrims.',
    lyricsTelugu: [
      {
        section: 'పల్లవి (Pallavi)',
        lines: [
          'కొండలలో నెలకొన్న కోనేటి రాయడు వాడు ।',
          'కొండలంత వరములు గుప్పెడు వాడు ॥'
        ]
      },
      {
        section: 'చరణం 1 (Charanam 1)',
        lines: [
          'కుమ్మర దాసుడైన కురువరతినంబికి',
          'యిమ్మన్న వరమెల్ల యిచ్చినవాడు ।',
          'దొమ్మరులు జొచ్చిన యీదోసమంతయు బాపి',
          'రమ్మని తన లోనికి రప్పించినవాడు ॥ కొండలలో ॥'
        ]
      },
      {
        section: 'చరణం 2 (Charanam 2)',
        lines: [
          'కాంచీపురమున ఎదురు చూచే భక్తులకు',
          'రక్షించి నిలిచిన రమణాధీశుడు ।',
          'ఎంచిన కోర్కెలు ఎల్లప్పుడు తీర్చుచు',
          'మించిన కృపతో మమ్ము బ్రోచువాడు ॥ కొండలలో ॥'
        ]
      },
      {
        section: 'చరణం 3 (Charanam 3)',
        lines: [
          'నిత్యకల్యాణ పచ్చతోరణముగా',
          'సత్యమై వెలసిన శ్రీ వేంకటేశుడు ।',
          'ఏడుకొండలపైన వెలసిన దైవమై',
          'అడుగడుగున మమ్ము ఆదుకొనువాడు ॥ కొండలలో ॥'
        ]
      }
    ],
    lyricsEnglish: [
      {
        section: 'Pallavi',
        lines: [
          'Kondalalo nelakonna koneti rayadu vaadu |',
          'Kondalantha varamulu guppedu vaadu ||'
        ]
      },
      {
        section: 'Charanam 1',
        lines: [
          'Kummara daasudaina kuruvarathinambiki',
          'Yimmanna varamella yichinavaadu |',
          'Dommarulu jochina yeedosamanthayu baapi',
          'Rammani thana loniki rappinchinavaadu || Kondalalo ||'
        ]
      },
      {
        section: 'Charanam 2',
        lines: [
          'Kaanchipuramuna eduru chooche bhaktulaku',
          'Rakshinchi nilichina ramanadheesudu |',
          'Yenchina korkelu yellappudu theerchuchu',
          'Minchina krupatho mammu brochuvaadu || Kondalalo ||'
        ]
      },
      {
        section: 'Charanam 3',
        lines: [
          'Nitya kalyana pachhatoranamuga',
          'Satyamai velasina Sri Venkateshudu |',
          'Edu kondalapaina velasina daivamai',
          'Adugaduguna mammu aadukonuvaadu || Kondalalo ||'
        ]
      }
    ]
  },
  {
    id: 'govinda-namavali',
    titleTelugu: 'శ్రీ వేంకటేశ్వర గోవింద నామావళి (సంపూర్ణ గీతం)',
    titleEnglish: 'Sri Venkateswara Govinda Namavali (Devotional Song)',
    ragaTala: 'శైలి: భక్తి నామ సంకీర్తన (Chanted by Pilgrims)',
    author: 'తిరుమల యాత్రికుల నిత్య పారాయణ గీతం',
    summaryTelugu: 'తిరుమల కొండలకు వెళ్లే ప్రతి భక్తుడు ఘాట్ రోడ్డు ప్రయాణంలో స్మరించే పరమ పవిత్రమైన గోవింద నామాల గీతం. ఈ నామాలను ఆలపిస్తే అభయం, మోక్షం సిద్ధిస్తాయి.',
    summaryEnglish: 'The universally chanted devotional anthem recited by pilgrims climbing the sacred Seven Hills of Tirumala for divine grace and protection.',
    lyricsTelugu: [
      {
        section: 'మంగళ నామ ధ్యానం (Invocation)',
        lines: [
          'శ్రీనివాస గోవిందా శ్రీ వేంకటేశ గోవిందా ।',
          'భక్తవత్సల గోవిందా భాగవతప్రియ గోవిందా ॥'
        ]
      },
      {
        section: 'చరణాలు 1-4 (Stanzas 1-4)',
        lines: [
          'తిరుమలవాసా గోవిందా తిరుపతి వెలసిన గోవిందా ।',
          'ఏడుకొండలవాడ గోవిందా ఏకస్వరూప గోవిందా ॥',
          'ఆపద్బాంధవ గోవిందా అనాథరక్షక గోవిందా ।',
          'కలియుగ ప్రత్యక్ష దైవము గోవిందా కరుణాసాగర గోవిందా ॥'
        ]
      },
      {
        section: 'చరణాలు 5-8 (Stanzas 5-8)',
        lines: [
          'శంఖుచక్రధర గోవిందా శార్ఙ్గధనుష్కర గోవిందా ।',
          'పీతాంబరధర గోవిందా ముకుంద మాధవ గోవిందా ॥',
          'నిత్యకల్యాణ గోవిందా నీరజనాభ గోవిందా ।',
          'లక్ష్మీవల్లభ గోవిందా పద్మావతిప్రియ గోవిందా ॥'
        ]
      },
      {
        section: 'ముగింపు జయఘోష (Closing Chorus)',
        lines: [
          'గోవిందా హరి గోవిందా గోకులనందన గోవిందా ।',
          'ఏడుకొండలవాడ వేంకటరమణ గోవిందా గోవిందా ॥'
        ]
      }
    ],
    lyricsEnglish: [
      {
        section: 'Invocation',
        lines: [
          'Srinivasa Govinda Sri Venkatesha Govinda |',
          'Bhakthavatsala Govinda Bhagavathapriya Govinda ||'
        ]
      },
      {
        section: 'Stanzas 1-4',
        lines: [
          'Tirumalavasa Govinda Tirupati velasina Govinda |',
          'Edu kondalavada Govinda Eka swaroopa Govinda ||',
          'Aapadbaandhava Govinda Anaatharakshaka Govinda |',
          'Kaliyuga pratyaksha daivamu Govinda Karunasagara Govinda ||'
        ]
      },
      {
        section: 'Stanzas 5-8',
        lines: [
          'Shankha chakra dhara Govinda Sharngadhanushkara Govinda |',
          'Peethambaradhara Govinda Mukunda Madhava Govinda ||',
          'Nitya kalyana Govinda Neerajanabha Govinda |',
          'Lakshmee vallabha Govinda Padmavathipriya Govinda ||'
        ]
      },
      {
        section: 'Closing Chorus',
        lines: [
          'Govinda Hari Govinda Gokulanandana Govinda |',
          'Edu kondalavada Venkataramana Govinda Govinda ||'
        ]
      }
    ]
  },
  {
    id: 'brahma-kadigina',
    titleTelugu: 'బ్రహ్మ కడగిన పాదము',
    titleEnglish: 'Brahma Kadigina Padamu',
    ragaTala: 'రాగం: ముఖారి • తాళం: ఆది',
    author: 'శ్రీ తాళ్లపాక అన్నమాచార్యులు (Saint Annamacharya)',
    summaryTelugu: 'బ్రహ్మదేవుడు అర్ఘ్యపాద్యాలతో అభిషేకించిన శ్రీనివాసుని పవిత్ర పాదారవిందాల దివ్య మహత్యాన్ని కొనియాడే అమర సంకీర్తన.',
    summaryEnglish: 'The immortal song celebrating the holy feet of Lord Venkateswara, which Lord Brahma washed and revered as the ultimate source of salvation.',
    lyricsTelugu: [
      {
        section: 'పల్లవి (Pallavi)',
        lines: [
          'బ్రహ్మ కడగిన పాదము ।',
          'బ్రహ్మము తానె నీ పాదము ॥'
        ]
      },
      {
        section: 'చరణం 1 (Charanam 1)',
        lines: [
          'చెలగి వసుధ గొలిచిన నీ పాదము ।',
          'బలిదలమున మోపిన నీ పాదము ।',
          'తలకి గగనము దన్నిన పాదము ।',
          'బలరిపు గాచిన పాదము ॥ బ్రహ్మ ॥'
        ]
      },
      {
        section: 'చరణం 2 (Charanam 2)',
        lines: [
          'కామిని పాపము కడిగిన పాదము ।',
          'పాము తలనిడిన పాదము ।',
          'ప్రేమతో శ్రీసతి పిసికేడి పాదము ।',
          'తామరసపుటల నీ పాదము ॥ బ్రహ్మ ॥'
        ]
      },
      {
        section: 'చరణం 3 (Charanam 3)',
        lines: [
          'పరమ యోగులకు పరిపరి విధముల',
          'వరమొసగేటి నీ పాదము ।',
          'తిరువేంకటగిరి తిరమని చూపిన',
          'పరమపదము నీ పాదము ॥ బ్రహ్మ ॥'
        ]
      }
    ],
    lyricsEnglish: [
      {
        section: 'Pallavi',
        lines: [
          'Brahma kadigina paadamu |',
          'Brahmamu taane nee paadamu ||'
        ]
      },
      {
        section: 'Charanam 1',
        lines: [
          'Chelagi vasudha golichina nee paadamu |',
          'Bali dalamuna mopina nee paadamu |',
          'Talaki gaganamu dannina paadamu |',
          'Balaripu gaachina paadamu || Brahma ||'
        ]
      },
      {
        section: 'Charanam 2',
        lines: [
          'Kaamini paapamu kadigina paadamu |',
          'Paamu talanidina paadamu |',
          'Prematho Sreesati pisikedi paadamu |',
          'Taamarasaputala nee paadamu || Brahma ||'
        ]
      },
      {
        section: 'Charanam 3',
        lines: [
          'Parama yogulaku paripari vidhamula',
          'Varamosageti nee paadamu |',
          'Tiruvenkatagiri tiramani choopina',
          'Paramapadamu nee paadamu || Brahma ||'
        ]
      }
    ]
  }
];

export const GovindaShlokaBanner: React.FC = () => {
  const [copiedShloka, setCopiedShloka] = useState(false);
  const [copiedSongLyrics, setCopiedSongLyrics] = useState(false);
  const [chantCount, setChantCount] = useState(0);

  // Song Lyrics States
  const [selectedSongId, setSelectedSongId] = useState<string>('kondalalo');
  const [showEnglishScript, setShowEnglishScript] = useState(false);
  const [fontSizeLarge, setFontSizeLarge] = useState(false);
  const [isSongSectionOpen, setIsSongSectionOpen] = useState(true);

  const selectedSong = DEVOTIONAL_SONGS.find(s => s.id === selectedSongId) || DEVOTIONAL_SONGS[0];

  const shlokaTelugu = `కల్యాణాద్భుత గాత్రాయ కామితార్థ ప్రదాయినే ।
శ్రీమద్వేంకటనాథాయ శ్రీనివాసాయ తే నమః ॥

వినా వేంకటేశం న నాథో న నాథః
సదా వేంకటేశం స్మరామి స్మరామి ।
హరే వేంకటేశ ప్రసీద ప్రసీద
ప్రియం వేంకటేశ ప్రయచ్ఛ ప్రయచ్ఛ ॥

ఏడుకొండలవాడ వేంకటరమణ గోవిందా గోవిందా!`;

  const handleCopyShloka = () => {
    navigator.clipboard.writeText(shlokaTelugu);
    setCopiedShloka(true);
    setTimeout(() => setCopiedShloka(false), 2000);
  };

  const handleCopySelectedSong = () => {
    const sections = showEnglishScript ? selectedSong.lyricsEnglish : selectedSong.lyricsTelugu;
    const fullText = `${selectedSong.titleTelugu} (${selectedSong.titleEnglish})\n${selectedSong.author}\n\n` +
      sections.map(s => `[${s.section}]\n${s.lines.join('\n')}`).join('\n\n') +
      `\n\nహరి ట్రావెల్స్ తిరుపతి - భక్తి ప్రయాణం`;
    
    navigator.clipboard.writeText(fullText);
    setCopiedSongLyrics(true);
    setTimeout(() => setCopiedSongLyrics(false), 2000);
  };

  const handleChantClick = () => {
    setChantCount(prev => prev + 1);
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-2">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#450C14] via-[#6B1724] to-[#30070D] text-white border-2 border-[#D4AF37]/60 shadow-xl p-6 sm:p-8 md:p-10">
        {/* Subtle Temple Arch Ornamentation Pattern */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Traditional Tirumala Namam / Divine Symbol Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-5 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  శ్రీ వేంకటేశ్వర దివ్య దర్శన శ్లోకము • Sacred Tirumala Chants
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
                శ్రీ వేంకటేశ్వర గోవింద శ్లోకం & భక్తి సంకీర్తనలు (Govinda Shloka & Song Lyrics)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShloka}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-xs font-medium text-amber-200 transition cursor-pointer"
              title="Copy Telugu Shloka"
            >
              {copiedShloka ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>కాపీ చేయబడింది!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-300" />
                  <span>కాపీ శ్లోకం (Copy)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SECTION 1: The Sacred Telugu Shloka Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Shloka Verses in Telugu */}
          <div className="lg:col-span-8 space-y-4 text-center sm:text-left">
            {/* Primary Mangala Shloka */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/25 border border-[#D4AF37]/30 backdrop-blur-xs space-y-3">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-200 font-serif leading-relaxed tracking-wide drop-shadow-sm">
                కల్యాణాద్భుత గాత్రాయ కామితార్థ ప్రదాయినే ।<br />
                శ్రీమద్వేంకటనాథాయ శ్రీనివాసాయ తే నమః ॥
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-2" />

              {/* Govinda Prapatti Shloka */}
              <p className="text-base sm:text-xl md:text-2xl font-bold text-amber-100 font-serif leading-relaxed tracking-wide">
                వినా వేంకటేశం న నాథో న నాథః<br />
                సదా వేంకటేశం స్మరామి స్మరామి ।<br />
                హరే వేంకటేశ ప్రసీద ప్రసీద<br />
                ప్రియం వేంకటేశ ప్రయచ్ఛ ప్రయచ్ఛ ॥
              </p>
            </div>

            {/* Sacred Govinda Namavali Mantra Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#D4AF37]/30 to-amber-500/20 border border-[#D4AF37]/50 text-center">
              <p className="text-lg sm:text-2xl font-black text-amber-300 font-serif tracking-wider">
                గోవిందా హరి గోవిందా.. వేంకటరమణ గోవిందా!
              </p>
              <p className="text-xs sm:text-sm text-amber-100/90 font-medium mt-1">
                ఏడుకొండలవాడ వేంకటరమణ గోవిందా గోవిందా! • తిరుమల శ్రీవారి దర్శన ప్రార్థన
              </p>
            </div>

            {/* Meaning in Telugu & English */}
            <div className="text-xs sm:text-sm text-amber-200/80 leading-relaxed space-y-1 pt-1">
              <p>
                <strong className="text-amber-300">తాత్పర్యం (Meaning):</strong> కళ్యాణ ప్రదాత, కోరిన కోర్కెలు తీర్చే శ్రీనివాసునికి ప్రణామాలు. కలియుగ ప్రత్యక్ష దైవమైన శ్రీ వేంకటేశ్వరుని మించిన రక్షకుడు ఎవరూ లేరు. స్వామిని నిరంతరం స్మరిస్తూ సుఖసంతోషాలు పొందెదము గాక!
              </p>
            </div>
          </div>

          {/* Right Side: Devotional Pilgrim Interactive Chant Box */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-black/35 border border-[#D4AF37]/40 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg animate-pulse">
              <span className="font-serif text-2xl font-bold">ఓం</span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold block">
                భక్తి నామ జపం
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                గోవింద నామ స్మరణ
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                ఘాట్ రోడ్డు ప్రయాణంలో శ్రీవారి నామాన్ని స్మరిస్తూ సురక్షిత ప్రయాణం సాగించండి.
              </p>
            </div>

            <button
              type="button"
              onClick={handleChantClick}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm transition shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-stone-950" />
              <span>గోవిందా! అనండి ({chantCount > 0 ? chantCount : 'Chant'})</span>
            </button>

            {chantCount > 0 && (
              <p className="text-[11px] text-emerald-300 font-medium">
                శ్రీనివాసుని కృపతో మీ తిరుపతి యాత్ర మంగళప్రదం అగుగాక!
              </p>
            )}

            <div className="pt-2 border-t border-[#D4AF37]/20 w-full text-[10px] text-amber-200/70 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>తిరుమల ఘాట్ రోడ్ FASTag అధీకృత డ్రైవర్లు</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: SACRED SONGS WITH LYRICS (భక్తి సంకీర్తనలు & పాటల సాహిత్యం) */}
        <div className="mt-8 pt-6 border-t-2 border-[#D4AF37]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                  శ్రీ అన్నమాచార్య సంకీర్తనలు • Sacred Song Lyrics
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>తిరుమల భక్తి పాటల సాహిత్యం (Tirumala Song with Lyrics)</span>
                </h3>
              </div>
            </div>

            {/* Toggle Section & Controls */}
            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowEnglishScript(!showEnglishScript)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-xs font-semibold text-amber-200 transition cursor-pointer"
                title="Switch between Telugu and English script"
              >
                <Languages className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{showEnglishScript ? 'తెలుగు లిపి' : 'English Script'}</span>
              </button>

              <button
                type="button"
                onClick={() => setFontSizeLarge(!fontSizeLarge)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-xs font-semibold text-amber-200 transition cursor-pointer"
                title="Adjust font size"
              >
                <span>{fontSizeLarge ? 'A- చిన్నది' : 'A+ పెద్దది'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSongSectionOpen(!isSongSectionOpen)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37] text-xs font-bold text-amber-200 transition cursor-pointer"
              >
                {isSongSectionOpen ? (
                  <>
                    <span>దాచండి</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>సాహిత్యం చూడండి</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {isSongSectionOpen && (
            <div className="space-y-5">
              {/* Song Selection Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/40 border border-[#D4AF37]/30">
                {DEVOTIONAL_SONGS.map((song) => {
                  const isSelected = selectedSong.id === song.id;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => setSelectedSongId(song.id)}
                      className={`p-3 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#8C1B2C] to-[#6B1724] border border-[#D4AF37] shadow-md text-amber-100'
                          : 'hover:bg-white/5 text-stone-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="block text-xs font-bold truncate">
                          {song.titleTelugu}
                        </span>
                        <span className="block text-[10px] text-amber-300/70 truncate">
                          {song.titleEnglish}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Song Lyrics Card */}
              <div className="rounded-3xl bg-black/30 border border-[#D4AF37]/40 p-5 sm:p-7 backdrop-blur-xs space-y-6">
                {/* Song Meta Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      {selectedSong.ragaTala} • {selectedSong.author}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-200 mt-0.5">
                      {showEnglishScript ? selectedSong.titleEnglish : selectedSong.titleTelugu}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySelectedSong}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/40 text-xs font-semibold text-amber-200 transition cursor-pointer"
                      title="Copy full song lyrics"
                    >
                      {copiedSongLyrics ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>లిరిక్స్ కాపీ అయింది!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-amber-300" />
                          <span>కాపీ లిరిక్స్ (Copy)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Stanzas Display */}
                <div className="space-y-5">
                  {(showEnglishScript ? selectedSong.lyricsEnglish : selectedSong.lyricsTelugu).map((sec, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 sm:p-5 rounded-2xl ${
                        idx === 0 
                          ? 'bg-amber-500/10 border border-[#D4AF37]/40 shadow-inner' 
                          : 'bg-black/20 border border-white/10'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                        {sec.section}
                      </span>
                      <div className="space-y-1.5">
                        {sec.lines.map((line, lineIdx) => (
                          <p
                            key={lineIdx}
                            className={`font-serif leading-relaxed tracking-wide ${
                              idx === 0 ? 'text-amber-100 font-bold' : 'text-stone-100'
                            } ${fontSizeLarge ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl'}`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meaning / Bhavam in Telugu & English */}
                <div className="p-4 rounded-2xl bg-amber-900/30 border border-[#D4AF37]/30 text-xs sm:text-sm text-amber-200/90 leading-relaxed space-y-1.5">
                  <p>
                    <strong className="text-amber-300">భావార్థం (Spiritual Significance):</strong> {selectedSong.summaryTelugu}
                  </p>
                  <p className="text-[11px] sm:text-xs text-amber-300/80 italic">
                    &ldquo;{selectedSong.summaryEnglish}&rdquo;
                  </p>
                </div>

                {/* Chauffeur & Pilgrim Ghat Journey Note */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-amber-200/70 border-t border-[#D4AF37]/20">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>తిరుపతి - తిరుమల ఘాట్ రోడ్డు ప్రయాణంలో పఠించదగిన అమృత కీర్తనలు</span>
                  </span>
                  <span className="font-serif text-[#D4AF37] font-semibold">
                    ఓం నమో వేంకటేశాయ • హరి ట్రావెల్స్ తిరుపతి
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
