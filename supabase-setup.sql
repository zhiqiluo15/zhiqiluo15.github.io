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

-- === 当日诗词 ===
INSERT INTO daily_poems (poem_html, source, poem_en, poem_en2) VALUES
  (
    '<ruby>落<rt>luò</rt></ruby><ruby>霞<rt>xiá</rt></ruby><ruby>与<rt>yǔ</rt></ruby><ruby>孤<rt>gū</rt></ruby><ruby>鹜<rt>wù</rt></ruby><ruby>齐<rt>qí</rt></ruby><ruby>飞<rt>fēi</rt></ruby>，<ruby>秋<rt>qiū</rt></ruby><ruby>水<rt>shuǐ</rt></ruby><ruby>共<rt>gòng</rt></ruby><ruby>长<rt>cháng</rt></ruby><ruby>天<rt>tiān</rt></ruby><ruby>一<rt>yī</rt></ruby><ruby>色<rt>sè</rt></ruby>',
    '王勃《滕王阁序》',
    'A solitary wild duck soars with the sunset clouds —',
    'Autumn river merges with the sky in one hue.'
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
