-- ============================================================
-- 灵弦词集 Supabase 初始化脚本
-- 在 Supabase SQL Editor 中执行
-- ============================================================

-- 1. 分类表
CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  slug  TEXT UNIQUE NOT NULL,
  name_zh  TEXT NOT NULL,
  desc_zh  TEXT
);

INSERT INTO categories (slug, name_zh, desc_zh) VALUES
  ('poem',      '以诗入词', '从诗词文言中拆解英文词汇'),
  ('history',   '以史鉴词', '中西历史对照中的语言演变'),
  ('etymology', '以词溯源', '单词在中文语境中的回声');

-- 2. 目录条目表
CREATE TABLE entries (
  id            SERIAL PRIMARY KEY,
  category_id   INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  title_zh      TEXT NOT NULL,
  subtitle_zh   TEXT,
  title_en      TEXT,
  author_era    TEXT NOT NULL,
  period_label  TEXT,
  summary_zh    TEXT NOT NULL,
  summary_en    TEXT NOT NULL,
  vocab_preview TEXT NOT NULL,
  content_data  JSONB NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 词卡表
CREATE TABLE word_cards (
  id          SERIAL PRIMARY KEY,
  entry_id    INTEGER REFERENCES entries(id) ON DELETE CASCADE,
  sort_order  INTEGER DEFAULT 0,
  word_zh     TEXT NOT NULL,
  word_en     TEXT NOT NULL,
  phonetic    TEXT NOT NULL,
  definition  TEXT NOT NULL,
  context_ref TEXT NOT NULL
);

-- 4. 当日诗词表
CREATE TABLE daily_poems (
  id        SERIAL PRIMARY KEY,
  poem_html TEXT NOT NULL,
  source    TEXT NOT NULL,
  poem_en   TEXT NOT NULL,
  poem_en2  TEXT
);

-- ============================================================
-- 种子数据
-- ============================================================

-- === 以诗入词：行路难 ===
INSERT INTO entries (category_id, title_zh, subtitle_zh, title_en, author_era, period_label, summary_zh, summary_en, vocab_preview, content_data)
SELECT id, '行路难', '·其一', 'Hard Is the Way to Go', '李白', '〔唐〕',
  '行路难，行路难，多歧路，今安在？',
  'Hard is the way, hard is the way. Don''t go astray! Whither today?',
  'journey · fork · goblet · jade · sword · sail · cleave · vast · astray',
  '{
    "context_label": "原",
    "poem_lines": [
      {"html": "<ruby>金<rt>jīn</rt></ruby><ruby>樽<rt>zūn</rt></ruby><ruby>清<rt>qīng</rt></ruby><ruby>酒<rt>jiǔ</rt></ruby><ruby>斗<rt>dǒu</rt></ruby><ruby>十<rt>shí</rt></ruby><ruby>千<rt>qiān</rt></ruby>，", "highlight": false},
      {"html": "<ruby>玉<rt>yù</rt></ruby><ruby>盘<rt>pán</rt></ruby><ruby>珍<rt>zhēn</rt></ruby><ruby>羞<rt>xiū</rt></ruby><ruby>直<rt>zhí</rt></ruby><ruby>万<rt>wàn</rt></ruby><ruby>钱<rt>qián</rt></ruby>。", "highlight": false},
      {"html": "<ruby>停<rt>tíng</rt></ruby><ruby>杯<rt>bēi</rt></ruby><ruby>投<rt>tóu</rt></ruby><ruby>箸<rt>zhù</rt></ruby><ruby>不<rt>bù</rt></ruby><ruby>能<rt>néng</rt></ruby><ruby>食<rt>shí</rt></ruby>，", "highlight": false},
      {"html": "<ruby>拔<rt>bá</rt></ruby><ruby>剑<rt>jiàn</rt></ruby><ruby>四<rt>sì</rt></ruby><ruby>顾<rt>gù</rt></ruby><ruby>心<rt>xīn</rt></ruby><ruby>茫<rt>máng</rt></ruby><ruby>然<rt>rán</rt></ruby>。", "highlight": false},
      {"html": "<ruby>欲<rt>yù</rt></ruby><ruby>渡<rt>dù</rt></ruby><ruby>黄<rt>huáng</rt></ruby><ruby>河<rt>hé</rt></ruby><ruby>冰<rt>bīng</rt></ruby><ruby>塞<rt>sè</rt></ruby><ruby>川<rt>chuān</rt></ruby>，", "highlight": false},
      {"html": "<ruby>将<rt>jiāng</rt></ruby><ruby>登<rt>dēng</rt></ruby><ruby>太<rt>tài</rt></ruby><ruby>行<rt>háng</rt></ruby><ruby>雪<rt>xuě</rt></ruby><ruby>满<rt>mǎn</rt></ruby><ruby>山<rt>shān</rt></ruby>。", "highlight": false},
      {"html": "<ruby>闲<rt>xián</rt></ruby><ruby>来<rt>lái</rt></ruby><ruby>垂<rt>chuí</rt></ruby><ruby>钓<rt>diào</rt></ruby><ruby>碧<rt>bì</rt></ruby><ruby>溪<rt>xī</rt></ruby><ruby>上<rt>shàng</rt></ruby>，", "highlight": false},
      {"html": "<ruby>忽<rt>hū</rt></ruby><ruby>复<rt>fù</rt></ruby><ruby>乘<rt>chéng</rt></ruby><ruby>舟<rt>zhōu</rt></ruby><ruby>梦<rt>mèng</rt></ruby><ruby>日<rt>rì</rt></ruby><ruby>边<rt>biān</rt></ruby>。", "highlight": false},
      {"html": "<ruby>行<rt>xíng</rt></ruby><ruby>路<rt>lù</rt></ruby><ruby>难<rt>nán</rt></ruby>，<ruby>行<rt>xíng</rt></ruby><ruby>路<rt>lù</rt></ruby><ruby>难<rt>nán</rt></ruby>，", "highlight": true},
      {"html": "<ruby>多<rt>duō</rt></ruby><ruby>歧<rt>qí</rt></ruby><ruby>路<rt>lù</rt></ruby>，<ruby>今<rt>jīn</rt></ruby><ruby>安<rt>ān</rt></ruby><ruby>在<rt>zài</rt></ruby>？", "highlight": true},
      {"html": "<ruby>长<rt>cháng</rt></ruby><ruby>风<rt>fēng</rt></ruby><ruby>破<rt>pò</rt></ruby><ruby>浪<rt>làng</rt></ruby><ruby>会<rt>huì</rt></ruby><ruby>有<rt>yǒu</rt></ruby><ruby>时<rt>shí</rt></ruby>，", "highlight": false},
      {"html": "<ruby>直<rt>zhí</rt></ruby><ruby>挂<rt>guà</rt></ruby><ruby>云<rt>yún</rt></ruby><ruby>帆<rt>fān</rt></ruby><ruby>济<rt>jì</rt></ruby><ruby>沧<rt>cāng</rt></ruby><ruby>海<rt>hǎi</rt></ruby>。", "highlight": false}
    ],
    "translation_lines": [
      {"text": "Pure wine in golden goblet costs ten thousand coppers, good!", "highlight": false},
      {"text": "Choice dish in a jade plate is worth as much, nice food!", "highlight": false},
      {"text": "Pushing aside my cup and chopsticks, I can''t eat;", "highlight": false},
      {"text": "Drawing my sword and looking round, I hear my heart beat.", "highlight": false},
      {"text": "I can''t cross Yellow River: ice has stopped its flow;", "highlight": false},
      {"text": "I can''t climb Mount Taihang: the sky is blind with snow.", "highlight": false},
      {"text": "I can but poise a fishing pole beside a stream", "highlight": false},
      {"text": "Or set sail for the sun like a sage in a dream.", "highlight": false},
      {"text": "Hard is the way, hard is the way.", "highlight": true},
      {"text": "Don''t go astray! Whither today?", "highlight": true},
      {"text": "A time will come to ride the wind and cleave the waves;", "highlight": false},
      {"text": "I''ll set my cloudlike sail to cross the sea which raves.", "highlight": false}
    ],
    "translator": "许渊冲"
  }'::jsonb
FROM categories WHERE slug = 'poem';

-- 行路难 词卡
DO $$
DECLARE
  eid INTEGER;
BEGIN
  SELECT id INTO eid FROM entries WHERE title_zh = '行路难';
  INSERT INTO word_cards (entry_id, sort_order, word_zh, word_en, phonetic, definition, context_ref) VALUES
    (eid, 0, '行路', 'journey', '/ˈdʒɜːrni/', 'a long trip or travel from one place to another; one''s life path', 'Hard is the <em>way</em> — 行路难，行路难'),
    (eid, 1, '歧路', 'fork',    '/fɔːrk/',  'a point where a road, path, or river divides', 'Don''t go <em>astray</em> — 多歧路，今安在？'),
    (eid, 2, '樽',   'goblet',  '/ˈɡɒblɪt/', 'a drinking glass with a stem and a base', 'Pure wine in golden <em>goblet</em> — 金樽清酒斗十千'),
    (eid, 3, '玉',   'jade',    '/dʒeɪd/', 'a hard, typically green stone used for ornaments', 'Choice dish in a <em>jade</em> plate — 玉盘珍羞直万钱'),
    (eid, 4, '剑',   'sword',   '/sɔːrd/', 'a weapon with a long metal blade', 'Drawing my <em>sword</em> and looking round — 拔剑四顾心茫然'),
    (eid, 5, '帆',   'sail',    '/seɪl/', 'a piece of material used to catch wind and propel a boat', 'I''ll set my cloudlike <em>sail</em> — 直挂云帆济沧海'),
    (eid, 6, '破',   'cleave',  '/kliːv/', 'to split or sever something along a natural line', 'Ride the wind and <em>cleave</em> the waves — 长风破浪会有时'),
    (eid, 7, '沧',   'vast',    '/vɑːst/', 'of very great extent or quantity; immense', 'Cross the sea which <em>raves</em> — 直挂云帆济沧海'),
    (eid, 8, '茫然', 'astray',  '/əˈstreɪ/', 'away from the correct path or direction', 'Don''t go <em>astray</em>! — 心茫然，多歧路');
END $$;

-- === 以史鉴词：鸦片战争 ===
INSERT INTO entries (category_id, title_zh, subtitle_zh, title_en, author_era, period_label, summary_zh, summary_en, vocab_preview, content_data)
SELECT id, '鸦片战争', '· 炮舰外交', 'The Opium Wars', '晚清 · 工业革命', '晚清 · 工业革命 ／ 1839–1860',
  '坚船利炮叩开国门，条约口岸改写东亚贸易版图',
  'Gunboats and unequal treaties reshaped East-West relations',
  'opium · gunboat · treaty · cede · empire · port · indemnity · concession',
  '{
    "context_label": "史",
    "history_zh": [
      {"text": "英商以鸦片扭转贸易逆差，林则徐虎门销烟，", "highlight": false},
      {"text": "坚船利炮叩开广州、厦门、定海、天津，", "highlight": true},
      {"text": "《南京条约》割香港、开五口，", "highlight": false},
      {"text": "炮舰外交改写东亚贸易版图。", "highlight": true},
      {"text": "白银外流、关税尽失，帝国裂痕自此不可弥合。", "highlight": false}
    ],
    "history_en": [
      {"text": "In the early nineteenth century, British merchants flooded China with <strong>opium</strong> to reverse a trade deficit. When Commissioner Lin Zexu confiscated and destroyed the drug at Humen, Britain responded with <strong>gunboat</strong> diplomacy.", "highlight": false},
      {"text": "The Treaty of Nanjing (1842) forced the Qing <strong>empire</strong> to <strong>cede</strong> Hong Kong Island, open five <strong>treaty ports</strong>, and pay massive indemnities. A second war (1856–1860) brought further concessions — the burning of the Old Summer Palace and the legalization of the opium trade.", "highlight": false},
      {"text": "These conflicts marked the violent collision of an industrializing West with a declining agrarian empire, and the vocabulary born from this era — gunboat, treaty, cede, opium — still echoes in international relations today.", "highlight": false}
    ],
    "source_note": "adapted from historical sources"
  }'::jsonb
FROM categories WHERE slug = 'history';

-- 鸦片战争 词卡
DO $$
DECLARE
  eid INTEGER;
BEGIN
  SELECT id INTO eid FROM entries WHERE title_zh = '鸦片战争';
  INSERT INTO word_cards (entry_id, sort_order, word_zh, word_en, phonetic, definition, context_ref) VALUES
    (eid, 0, '鸦片', 'opium',      '/ˈəʊpiəm/',       'a reddish-brown addictive drug from the opium poppy', 'British merchants flooded China with <em>opium</em> — 鸦片贸易扭转逆差'),
    (eid, 1, '炮舰', 'gunboat',    '/ˈɡʌnbəʊt/',       'a small warship armed with heavy guns for coastal attack', 'Britain responded with <em>gunboat</em> diplomacy — 坚船利炮叩开国门'),
    (eid, 2, '条约', 'treaty',     '/ˈtriːti/',        'a formally concluded and ratified agreement between states', 'The <em>Treaty</em> of Nanjing forced the Qing empire — 《南京条约》'),
    (eid, 3, '割让', 'cede',       '/siːd/',           'to give up power or territory, especially by treaty', 'to <em>cede</em> Hong Kong Island — 割让香港岛'),
    (eid, 4, '帝国', 'empire',     '/ˈempaɪər/',       'an extensive group of states ruled by one authority', 'The Qing <em>empire</em> — 碰撞中的大清帝国'),
    (eid, 5, '口岸', 'port',       '/pɔːrt/',          'a harbor where ships load and unload cargo', 'Five <em>treaty ports</em> — 五口通商'),
    (eid, 6, '赔款', 'indemnity',  '/ɪnˈdemnɪti/',     'a sum paid as compensation by a defeated nation', 'pay massive <em>indemnities</em> — 巨额战争赔款'),
    (eid, 7, '特许', 'concession', '/kənˈseʃn/',       'a grant of land under foreign control', 'further <em>concessions</em> — 租界与治外法权');
END $$;

-- === 以词溯源：茶 ===
INSERT INTO entries (category_id, title_zh, subtitle_zh, title_en, author_era, period_label, summary_zh, summary_en, vocab_preview, content_data)
SELECT id, '茶', '· 一条叶子两种读音', 'Tea · Cha · Chai', '闽南 → 英语 ／ 官话 → 印地语', '闽南语 te → 英语 tea ／ 官话 cha → 印地语 chai',
  '从闽南海港到伦敦下午茶，一片叶子走出的两条读音之路',
  'One leaf, two journeys: how Min Nan te and Mandarin cha each traveled the world',
  'tea · cha · chai · porcelain · caravan · silk',
  '{
    "context_label": "源",
    "story_zh": [
      {"text": "茶叶从福建泉州港装船出海，", "highlight": false},
      {"text": "闽南语的「te」随荷兰商船漂洋过海，", "highlight": true},
      {"text": "化为英语 tea、法语 thé、德语 Tee。", "highlight": false},
      {"text": "另一路沿陆上丝绸之路西行，", "highlight": false},
      {"text": "北方官话的「cha」经波斯、印度，", "highlight": true},
      {"text": "落地为印地语 chai、阿拉伯语 shay、俄语 chay。", "highlight": false},
      {"text": "一片叶子，海陆分途——今天世界语言中「茶」的读音只有两种，都来自中国。", "highlight": false}
    ],
    "etymology_en": [
      {"text": "The word <strong>tea</strong> entered English in the 1650s via the Dutch <em>thee</em>, borrowed from the Min Nan Chinese <em>tê</em> — the language spoken in the port of Xiamen (Amoy), where Dutch traders first loaded tea onto ships bound for Europe.", "highlight": false},
      {"text": "Meanwhile, the Mandarin pronunciation <strong>cha</strong> traveled overland along the <strong>Silk Road</strong> through Persia and into the Indian subcontinent, giving rise to <strong>chai</strong> in Hindi, <em>shay</em> in Arabic, and <em>chay</em> in Russian.", "highlight": false},
      {"text": "Linguists can map historical trade routes by whether a language uses a tea-word (sea route) or a cha-word (land route). Nearly every language on Earth falls into one of these two etymological families — both rooted in Chinese.", "highlight": false}
    ]
  }'::jsonb
FROM categories WHERE slug = 'etymology';

-- 茶 词卡
DO $$
DECLARE
  eid INTEGER;
BEGIN
  SELECT id INTO eid FROM entries WHERE title_zh = '茶';
  INSERT INTO word_cards (entry_id, sort_order, word_zh, word_en, phonetic, definition, context_ref) VALUES
    (eid, 0, '茶（海路）', 'tea',        '/tiː/',           'from Min Nan tê → Dutch thee → English', 'From Min Nan <em>tê</em> → Dutch <em>thee</em> → English <em>tea</em>'),
    (eid, 1, '茶（陆路）', 'cha',        '/tʃɑː/',          'the Mandarin pronunciation adopted along the Silk Road', 'Languages using a <em>cha</em>-word — 陆上丝绸之路'),
    (eid, 2, '香料茶',     'chai',       '/tʃaɪ/',          'Indian spiced tea, from Hindi chai, ultimately Chinese cha', 'Masala <em>chai</em> — 从印度回到英语的回旋镖词汇'),
    (eid, 3, '瓷器',       'porcelain',  '/ˈpɔːrsəlɪn/',    'a white vitrified ceramic, named via Italian porcellana', 'Teacups of <em>porcelain</em> — 茶与瓷，海路的双生子'),
    (eid, 4, '商队',       'caravan',    '/ˈkærəvæn/',      'a group traveling together through desert regions', '<em>Caravans</em> carried cha along the Silk Road — 驼铃声中的茶叶'),
    (eid, 5, '丝绸',       'silk',       '/sɪlk/',           'a fine fiber produced by silkworms', 'The <em>Silk</em> Road — 希腊人用丝国人命名中国');
END $$;

-- === 以诗入词：春望 ===
INSERT INTO entries (category_id, title_zh, subtitle_zh, title_en, author_era, period_label, summary_zh, summary_en, vocab_preview, content_data)
SELECT id, '春望', '', 'Spring View', '杜甫', '〔唐〕',
  '感时花溅泪，恨别鸟惊心——烽火三月，家书万金',
  'Grieved o''er the years, flowers make us shed tears — the war-torn land of Du Fu',
  'beacon · war · ruin · petal · bird · letter · scratch · hairpin · thinner',
  '{
    "context_label": "原",
    "translator": "许渊冲",
    "poem_lines": [
      {"html": "<ruby>国<rt>guó</rt></ruby><ruby>破<rt>pò</rt></ruby><ruby>山<rt>shān</rt></ruby><ruby>河<rt>hé</rt></ruby><ruby>在<rt>zài</rt></ruby>，", "highlight": false},
      {"html": "<ruby>城<rt>chéng</rt></ruby><ruby>春<rt>chūn</rt></ruby><ruby>草<rt>cǎo</rt></ruby><ruby>木<rt>mù</rt></ruby><ruby>深<rt>shēn</rt></ruby>。", "highlight": false},
      {"html": "<ruby>感<rt>gǎn</rt></ruby><ruby>时<rt>shí</rt></ruby><ruby>花<rt>huā</rt></ruby><ruby>溅<rt>jiàn</rt></ruby><ruby>泪<rt>lèi</rt></ruby>，", "highlight": true},
      {"html": "<ruby>恨<rt>hèn</rt></ruby><ruby>别<rt>bié</rt></ruby><ruby>鸟<rt>niǎo</rt></ruby><ruby>惊<rt>jīng</rt></ruby><ruby>心<rt>xīn</rt></ruby>。", "highlight": true},
      {"html": "<ruby>烽<rt>fēng</rt></ruby><ruby>火<rt>huǒ</rt></ruby><ruby>连<rt>lián</rt></ruby><ruby>三<rt>sān</rt></ruby><ruby>月<rt>yuè</rt></ruby>，", "highlight": false},
      {"html": "<ruby>家<rt>jiā</rt></ruby><ruby>书<rt>shū</rt></ruby><ruby>抵<rt>dǐ</rt></ruby><ruby>万<rt>wàn</rt></ruby><ruby>金<rt>jīn</rt></ruby>。", "highlight": false},
      {"html": "<ruby>白<rt>bái</rt></ruby><ruby>头<rt>tóu</rt></ruby><ruby>搔<rt>sāo</rt></ruby><ruby>更<rt>gèng</rt></ruby><ruby>短<rt>duǎn</rt></ruby>，", "highlight": false},
      {"html": "<ruby>浑<rt>hún</rt></ruby><ruby>欲<rt>yù</rt></ruby><ruby>不<rt>bù</rt></ruby><ruby>胜<rt>shèng</rt></ruby><ruby>簪<rt>zān</rt></ruby>。", "highlight": false}
    ],
    "translation_lines": [
      {"text": "On war-torn land streams flow and mountains stand;", "highlight": false},
      {"text": "In vernal town grass and weeds are o''ergrown.", "highlight": false},
      {"text": "Grieved o''er the years, flowers make us shed tears;", "highlight": true},
      {"text": "Hating to part, hearing birds breaks our heart.", "highlight": true},
      {"text": "The beacon fire has gone higher and higher;", "highlight": false},
      {"text": "Words from household are worth their weight in gold.", "highlight": false},
      {"text": "I cannot bear to scratch my grizzling hair;", "highlight": false},
      {"text": "It grows too thin for a hairpin to hold.", "highlight": false}
    ]
  }'::jsonb
FROM categories WHERE slug = 'poem';

-- 春望 词卡
DO $$
DECLARE
  eid INTEGER;
BEGIN
  SELECT id INTO eid FROM entries WHERE title_zh = '春望';
  INSERT INTO word_cards (entry_id, sort_order, word_zh, word_en, phonetic, definition, context_ref) VALUES
    (eid, 0, '烽火', 'beacon',  '/ˈbiːkən/',  'a fire lit on a hill as a signal, especially in war', 'The <em>beacon</em> fire has gone higher — 烽火连三月'),
    (eid, 1, '国破', 'war',     '/wɔːr/',      'a state of armed conflict between nations', 'On <em>war</em>-torn land — 国破山河在'),
    (eid, 2, '城春', 'ruin',    '/ˈruːɪn/',    'the physical destruction or decay of a place', 'In <em>vernal</em> town — 城春草木深'),
    (eid, 3, '花',   'petal',   '/ˈpetl/',     'each segment of the corolla of a flower', '<em>Flowers</em> make us shed tears — 感时花溅泪'),
    (eid, 4, '鸟',   'bird',    '/bɜːrd/',     'a warm-blooded vertebrate with feathers and wings', 'Hearing <em>birds</em> breaks our heart — 恨别鸟惊心'),
    (eid, 5, '家书', 'letter',  '/ˈletər/',   'a written message addressed to a person', '<em>Words</em> from household — 家书抵万金'),
    (eid, 6, '搔',   'scratch', '/skrætʃ/',   'to rub or scrape with one''s nails', 'Cannot bear to <em>scratch</em> — 白头搔更短'),
    (eid, 7, '簪',   'hairpin', '/ˈherpɪn/',  'a small U-shaped pin for holding hair in place', 'Too thin for a <em>hairpin</em> — 浑欲不胜簪'),
    (eid, 8, '短',   'thin',    '/θɪn/',       'having little extent from one surface to its opposite', 'It grows too <em>thin</em> — 浑欲不胜簪');
END $$;

-- === 以史鉴词：丝绸之路 ===
INSERT INTO entries (category_id, title_zh, subtitle_zh, title_en, author_era, period_label, summary_zh, summary_en, vocab_preview, content_data)
SELECT id, '丝绸之路', '· 驼铃万里', 'The Silk Road', '汉–明 · 欧亚大陆', '汉–明 ／ 公元前2世纪–公元15世纪',
  '张骞凿空西域——驼铃万里，文明对流，不止丝绸与香料',
  'Zhang Qian opened the way West — caravans carried silk, spice, and civilizations across Eurasia',
  'silk · caravan · spice · porcelain · merchant · monk · bazaar · damask',
  '{
    "context_label": "史",
    "source_note": "adapted from historical sources",
    "history_zh": [
      {"text": "张骞凿空西域，一条横贯欧亚的商道自此贯通，", "highlight": false},
      {"text": "丝绸、瓷器、茶叶自长安西行，骆驼商队穿越帕米尔高原，", "highlight": true},
      {"text": "香料、玻璃、天文知识逆流东来，", "highlight": false},
      {"text": "不只是商品交换——佛教、景教、伊斯兰教沿此传入中土，", "highlight": true},
      {"text": "纸张与火药文明西传，改写世界历史进程。", "highlight": false}
    ],
    "history_en": [
      {"text": "The <strong>Silk Road</strong> was never a single road, but a sprawling web of <strong>caravan</strong> routes stretching from Chang''an to the Mediterranean. For over a millennium, <strong>merchants</strong> and <strong>monks</strong> alike traversed deserts and mountains, carrying not just goods but entire civilizations.", "highlight": false},
      {"text": "<strong>Silk</strong>, of course, gave the route its name — a Chinese secret so guarded that Roman senators grumbled about the Empire''s gold draining east for the fabric. But <strong>spice</strong>, <strong>porcelain</strong>, and <strong>tea</strong> flowed alongside it, while <strong>glass</strong> and <strong>gems</strong> returned westward.", "highlight": false},
      {"text": "The words we use today — silk, caravan, bazaar, damask — trace directly back to this ancient exchange. The Silk Road was history''s first great experiment in globalization, and its vocabulary lives on in every language it touched.", "highlight": false}
    ]
  }'::jsonb
FROM categories WHERE slug = 'history';

-- 丝绸之路 词卡
DO $$
DECLARE
  eid INTEGER;
BEGIN
  SELECT id INTO eid FROM entries WHERE title_zh = '丝绸之路';
  INSERT INTO word_cards (entry_id, sort_order, word_zh, word_en, phonetic, definition, context_ref) VALUES
    (eid, 0, '丝绸', 'silk',       '/sɪlk/',          'a fine lustrous fiber produced by silkworms', '<em>Silk</em> gave the route its name — 丝绸命名了这条路'),
    (eid, 1, '商队', 'caravan',    '/ˈkærəvæn/',     'a group of travelers journeying together through desert regions', '<em>Caravan</em> routes stretching from Chang''an — 骆驼商队越漠穿山'),
    (eid, 2, '香料', 'spice',      '/spaɪs/',         'an aromatic vegetable substance used to flavor food', 'But <em>spice</em>, porcelain, and tea flowed — 香料逆流东来'),
    (eid, 3, '瓷器', 'porcelain',  '/ˈpɔːrsəlɪn/',   'a white vitrified translucent ceramic', '<em>Porcelain</em> and tea flowed alongside — 瓷器与茶海陆并行'),
    (eid, 4, '商人', 'merchant',   '/ˈmɜːrtʃənt/',  'a person who trades in commodities', '<em>Merchants</em> and monks alike traversed — 商旅与僧人同路'),
    (eid, 5, '僧侣', 'monk',       '/mʌŋk/',          'a member of a religious community of men', 'Merchants and <em>monks</em> alike — 佛教沿丝路传入中土'),
    (eid, 6, '集市', 'bazaar',     '/bəˈzɑːr/',      'a marketplace, from Persian bāzār', 'The words — <em>bazaar</em>, damask — 波斯集市遍及丝路'),
    (eid, 7, '锦缎', 'damask',     '/ˈdæməsk/',      'a rich patterned fabric, named after Damascus', '<em>Damask</em> traces back to this ancient exchange — 大马士革锦缎');
END $$;

-- === 以词溯源：台风 ===
INSERT INTO entries (category_id, title_zh, subtitle_zh, title_en, author_era, period_label, summary_zh, summary_en, vocab_preview, content_data)
SELECT id, '台风', '· 双源归一的风暴之名', 'Typhoon', '粤语 + 希腊语 → 英语', '粤语 daai6 fung1 ／ 希腊语 Typhon → 英语 typhoon',
  '粤语「大风」走海路，希腊巨怪 Typhon 走陆路——十六世纪在英语中合二为一',
  'Cantonese ''daai fung'' met Greek ''Typhon'' in 16th-century sailor charts — a rare case of dual etymology',
  'typhoon · tempest · hurricane · monsoon · vortex · spiral · voyage',
  '{
    "context_label": "源",
    "story_zh": [
      {"text": "狂风呼啸、暴雨倾盆的西太平洋猛烈风暴，", "highlight": false},
      {"text": "英语叫 typhoon——这个词身世复杂，同时有中文和希腊文两个源头，", "highlight": true},
      {"text": "中文「大风」→ 粤语 daai6 fung1 → 阿拉伯语 ṭūfān → 葡萄牙语 tufão，", "highlight": false},
      {"text": "希腊神话中 Typhon 是喷火百头巨怪，风暴之王，", "highlight": true},
      {"text": "两条词源路径在 16 世纪葡萄牙航海家的海图中交汇——", "highlight": false},
      {"text": "最终在英语里合二为一，成为 typhoon。", "highlight": false},
      {"text": "这是罕见的东西方词源同归现象：一个词，两段历史，同一种风暴。", "highlight": false}
    ],
    "etymology_en": [
      {"text": "The word <strong>typhoon</strong> has a fascinating dual etymology — one of the rare cases where Chinese and Greek roots converged into a single English word.", "highlight": false},
      {"text": "From the Chinese side: Cantonese <em>daai6 fung1</em> (大风, ''great wind'') traveled via Arabic sailors as <em>ṭūfān</em>, then into Portuguese as <em>tufão</em> during the Age of Exploration.", "highlight": false},
      {"text": "From the Greek side: <strong>Typhon</strong> was a monstrous hundred-headed giant in Greek mythology — the father of all storm winds. Greek traders and scholars carried the name across the Mediterranean.", "highlight": false},
      {"text": "When Portuguese navigators reached East Asian waters in the 16th century and encountered the violent Pacific storms, both etymological streams — Chinese <em>tai fung</em> and Greek <em>Typhon</em> — merged naturally in English as <strong>typhoon</strong>. Two ancient civilizations, one shared vocabulary for fury.", "highlight": false}
    ]
  }'::jsonb
FROM categories WHERE slug = 'etymology';

-- 台风 词卡
DO $$
DECLARE
  eid INTEGER;
BEGIN
  SELECT id INTO eid FROM entries WHERE title_zh = '台风';
  INSERT INTO word_cards (entry_id, sort_order, word_zh, word_en, phonetic, definition, context_ref) VALUES
    (eid, 0, '台风',   'typhoon',   '/taɪˈfuːn/',    'a tropical storm in the western Pacific, from Cantonese daai fung', '<em>Typhoon</em> — Chinese and Greek roots converged — 双源归一'),
    (eid, 1, '暴风雨', 'tempest',   '/ˈtempɪst/',    'a violent windy storm, from Latin tempestas', 'Greek <em>Typhon</em>, father of all storm winds — 风暴之王'),
    (eid, 2, '飓风',   'hurricane', '/ˈhʌrɪkən/',   'a tropical storm in the Atlantic, from Taino hurakán', 'Pacific <em>typhoon</em> vs Atlantic <em>hurricane</em> — 同名异域'),
    (eid, 3, '季风',   'monsoon',   '/mɒnˈsuːn/',    'a seasonal wind, from Arabic mawsim', 'Arabic sailors carried <em>ṭūfān</em> — 阿拉伯航海者'),
    (eid, 4, '漩涡',   'vortex',    '/ˈvɔːrteks/',   'a whirling mass of fluid or air', 'The <em>vortex</em> of the storm — 风暴之眼'),
    (eid, 5, '螺旋',   'spiral',    '/ˈspaɪrəl/',    'a curve winding around a center point', 'The <em>spiral</em> of typhoon clouds — 台风螺旋云系'),
    (eid, 6, '航海',   'voyage',    '/ˈvɔɪɪdʒ/',     'a long journey by sea', 'Portuguese <em>voyages</em> to East Asia — 大航海时代');
END $$;

-- === 当日诗词 ===
INSERT INTO daily_poems (poem_html, source, poem_en, poem_en2) VALUES
  (
    '落霞与孤鹜齐飞，秋水共长天一色',
    '王勃《滕王阁序》',
    'A solitary wild duck soars with the sunset clouds —',
    'Autumn river merges with the sky in one hue.'
  ),
  (
    '但愿人长久，千里共婵娟',
    '苏轼《水调歌头》',
    'May we all be blessed with longevity —',
    'Though miles apart, we share the same moonlit beauty.'
  ),
  (
    '举头望明月，低头思故乡',
    '李白《静夜思》',
    'I raise my head and gaze upon the moon so bright —',
    'Then lower it, homesick thoughts filling the night.'
  ),
  (
    '明月松间照，清泉石上流',
    '王维《山居秋暝》',
    'Through pine woods shines the bright moonlight —',
    'O''er crystal-clear stones flows the stream in sight.'
  ),
  (
    '月落乌啼霜满天，江枫渔火对愁眠',
    '张继《枫桥夜泊》',
    'The moon goes down, crows cry under the frosty sky —',
    'Dimly-lit fishing boats ''neath maples sadly lie.'
  ),
  (
    '野火烧不尽，春风吹又生',
    '白居易《赋得古原草送别》',
    'Wildfire cannot burn it all away —',
    'When spring breeze blows, it grows again one day.'
  ),
  (
    '大漠孤烟直，长河落日圆',
    '王维《使至塞上》',
    'In boundless desert lonely smoke rises straight —',
    'Over endless river the sun sinks round and great.'
  );

-- 索引
CREATE INDEX idx_entries_category ON entries(category_id);
CREATE INDEX idx_word_cards_entry ON word_cards(entry_id);

-- 启用行级安全（允许匿名读取）
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_poems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read" ON categories  FOR SELECT USING (true);
CREATE POLICY "anon_read" ON entries     FOR SELECT USING (true);
CREATE POLICY "anon_read" ON word_cards  FOR SELECT USING (true);
CREATE POLICY "anon_read" ON daily_poems FOR SELECT USING (true);
