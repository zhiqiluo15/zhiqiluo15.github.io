// ============================================================
//  版本控制与存储键
// ============================================================
const VERSION = 'v1.2';
const STORAGE_KEY = `worldbuilding_natural_${VERSION}`;
const OLD_VERSION = 'v1.0';
const OLD_STORAGE_KEY = `worldbuilding_natural_${OLD_VERSION}`;

// ============================================================
//  数据迁移与 ID 生成
// ============================================================
function generateId() {
  return 'ent_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
}

function migrateData(d) {
  // 第一步：确保每个条目有 id，并建立名称到 id 的映射（假设名称当前唯一）
  const nameToId = {};
  for (const cat of Object.keys(d)) {
    if (cat.startsWith('__')) continue;
    for (const name of Object.keys(d[cat])) {
      const entry = d[cat][name];
      if (entry && typeof entry === 'object') {
        if (!entry.id) entry.id = generateId();
        nameToId[name] = entry.id;
      }
    }
  }
  // 第二步：将 links 中的名称转换为 id
  for (const cat of Object.keys(d)) {
    if (cat.startsWith('__')) continue;
    for (const name of Object.keys(d[cat])) {
      const entry = d[cat][name];
      if (entry && Array.isArray(entry.links)) {
        const newLinks = [];
        for (const link of entry.links) {
          // 如果已经是 id 格式（以 ent_ 开头），直接校验是否存在
          const isId = typeof link === 'string' && link.startsWith('ent_');
          const targetId = isId ? link : nameToId[link];
          if (targetId && targetId !== entry.id) {
            // 确保目标 id 真实存在
            if (findEntryByIdIn(d, targetId)) {
              newLinks.push(targetId);
            }
          }
          // 自引用或无效目标则忽略
        }
        entry.links = newLinks;
      }
    }
  }
}

function findEntryByIdIn(d, id) {
  for (const cat of Object.keys(d)) {
    if (cat.startsWith('__')) continue;
    for (const name of Object.keys(d[cat])) {
      if (d[cat][name].id === id) return { cat, name, entry: d[cat][name] };
    }
  }
  return null;
}

const catIcons = {
  '世界观':'📜',
  '人物':'👥',
  '势力':'🏛️',
  '地理':'🗺️',
  '物品':'📦',
  '事件/时间线':'📅'
};

// ============================================================
//  默认数据（v1.2 起自带 id）
// ============================================================
// BEGIN_GET_DEFAULT_DATA
function getDefaultData() {
  const d = {};
  const cats = ['世界观','人物','势力','地理','物品','事件/时间线'];
  cats.forEach(c => { d[c] = {}; });
  d['地理']['天宝十二载·长安城坊里权力地图'] = {
    id: 'def_地理_天宝十二载·长安城坊里权力地图',
    summary: '天宝癸巳（753），帝城如弈局。宫阙为盘，坊市为子，一百零九坊划分清浊、藏纳股肱。冯罗两家分踞街西街东，禁军暗影织成铁网。距安史乱起仅隔一岁余。',
    content: '<div class="article-content">'+
'<div class="article-intro">天宝癸巳，帝城如弈局。宫阙为盘，坊市为子，一百零九坊划分清浊、藏纳股肱。晨昏街鼓八百声，敲出天子脚下的尊卑秩序；金吾铺卒夜呼"金吾"，将宵禁后的长安切成光影交错的棋盘。街西属长安县，街东属万年县，中轴朱雀大街宽一百五十米，正如一道刀痕，把帝国的权力中枢与芸芸众坊劈成东西两半，北端宫禁森严，南端梵音缭绕。</div>'+
'<p>此时距安史乱起仅隔一岁余，杨国忠正位子午，吉温暗通幽燕，太子李亨困于东宫，而龙首坊马厩里的蹄铁与辅兴坊宫门后的甲胄，都已嗅到了风雨欲来的腥气。</p>'+
'<h3>一、最北部：皇家禁苑（北衙禁军之肺）</h3>'+
'<p class="poem">"北苑连山，霜戈曜日。"</p>'+
'<p>位于宫城、大明宫以北的整片园林，东西二十七里、南北三十三里，乃北衙禁军的战略后方、操演总枢。其核心不在亭台楼榭，而在于西内苑、东内苑两片营区，以及南北向的夹城复道。</p>'+
'<div class="sub-section">'+
'<h5>1. 西内苑（太极宫玄武门外）</h5>'+
'<p>右龙武军主力大营隐于槐柳之间，御马厩中常年蓄战马千二百匹，蹄声如雷。斗鸡坊表面是帝王玩赏之所，实为禁军捉对训练短兵巷战之处，鸡血与人血同渗黄土。陈玄礼以龙武大将军衔坐镇此地，每日寅时亲登苑墙望楼，巡视太极宫北垣十处暗哨；他是目前北门戍卫体系最后的锚点，冯、罗两家皆不敢轻撼其锋。</p>'+
'<h5>2. 东内苑（大明宫东南、兴庆宫东北之夹角）</h5>'+
'<p>左龙武军、左羽林军别营散列龙首池南北。龙首池引浐水而成，池畔设皇家马球场，玄宗常于此观赛，实为借球赛检阅骑兵阵型。夹城复道自大明宫东垣潜入，经通化门内夹墙直抵兴庆宫、更向南延伸至曲江芙蓉园。复道宽可行马，顶覆青瓦，壁留箭孔，是皇帝潜行城南的秘密通道，也是北衙禁军向南快速投送兵力的唯一路线。罗家骑兵熟谙此道每一处转弯的视角死角。</p>'+
'</div>'+
'<div class="highlight-box">功能：帝王射猎、禁军集训、囤积战马军械。所有军户出入宫禁多经此地，北苑诸门于丑时启、寅时闭，菜贩、内侍、巡街郎将皆需验鱼符，口令每日一换，由右龙武军书记官拟定。</div>'+
'<h3>二、三大宫城：三足鼎立的政治穹顶</h3>'+
'<h4>1. 西内·太极宫（正统宫城）</h4>'+
'<p class="poem">"明月出玄武，苍然万籁空。"</p>'+
'<p>南正门承天门：与外朝横街之间隔四百四十米广场，每年元日大朝会在此举行。但天宝以来，大朝会多改在大明宫，承天门外的石础已爬满薄苔。北门玄武门（武德九年事变原址）：双阙高耸，门道可容驷马并行。门内左右驻内廷禁军甲仗库，冯家子弟世代把守此门两掖，除轮值宿卫外，还负责核验进出太监、宫女的"过所"（通行文书），实质上掌控着太极宫最敏感的内廷人流。</p>'+
'<div class="highlight-box"><strong>辅兴坊关联：</strong>辅兴坊紧贴太极宫西南墙外安福门。坊东冯氏族长宅地下有一条干涸的早期宫城排水渠，传言可容人匍匐潜行至掖庭宫墙角，为冯家提供了一条不记入鱼符系统的"暗门"。冯氏族人明面由安福门入宫轮值，遇急则可通过此渠递送信物。</div>'+
'<h4>2. 东内·大明宫（东北政治隆起带）</h4>'+
'<p class="poem">"绛帻鸡人报晓筹，尚衣方进翠云裘。"</p>'+
'<p>南门丹凤门：五门道，外设百官待漏院，东侧院廊挂满各坊里正的灯笼。杨国忠每日卯时在此与党羽交换眼色，而太子东宫属官只能在最偏处呵气成霜。北门玄武—九仙门：北衙四军的核心防区。左·右龙武军、左·右羽林军大营一字排开，军帐延伸至禁苑深处。夜间九仙门外火把如昼，刁斗声与马嘶声构成宫城北界唯一的声音屏障。</p>'+
'<p>东宫（太子李亨居所）：位于大明宫东南隅，地形低洼，夏秋积水，宫墙斑驳。太子李亨常年受打压，其东宫僚属出行的路线：东宫 → 延政门 → 下马桥 → 入皇城东侧崇仁坊、永兴坊一带。沿途所有坊角均有金吾卫暗哨，为首者正是左金吾郎将罗家安排的亲信。东宫采买太监出春明门购物，每次皆被搜检两遍——这是杨国忠与罗家之间心照不宣的监视协议。</p>'+
'<div class="highlight-box"><strong>龙首坊关联：</strong>大明宫南墙外东侧即为虚构坊——龙首坊（见后文），罗氏家族宅邸所在。坊东北隅的龙首渠故道春月蛤蟆聒噪，夏汛时暗沟水涨，能淹没并掩盖某些不可思议的物件。</div>'+
'<h4>3. 南内·兴庆宫（实际政治心脏）</h4>'+
'<p class="poem">"沉香亭北倚阑干，解释春风无限恨。"</p>'+
'<p>原为玄宗藩邸，开元十六年大兴土木后改宫。天宝年间，这里是日常起居与最高决策的核心地。龙池东沉香亭、南花萼相辉楼，玄宗与杨贵妃昼夜行乐，政令多由高力士在此拟旨，中书省杨国忠只有承旨之份。高力士宦官集团中枢：内侍省在兴庆宫设"南衙"，高力士每日在此接收各地密折，再呈玄宗批阅。他掌握着所有进入兴庆宫的牌子，包括杨国忠入见也需他点头。杨氏外戚出入通道：虢国夫人等常由兴庆宫北门跃马而入，宫卫不敢拦。兴庆宫东南方向连接乐游原、曲江芙蓉园，这条"游宴动线"上密布杨国忠党羽的庄园别业，暗桩多于柳树。</p>'+
'<h3>三、皇城（中央官署区）：律令机器日夜轰鸣</h3>'+
'<p>位于宫城之南，全为衙署，无民居。左右对称，执掌政令与禁卫：中轴朱雀门，门内为皇城正门，门外即朱雀大街。每年春秋二季，金吾卫在此举行"街鼓交接"仪式，鼓声象征皇权向坊间延伸。</p>'+
'<p>东侧：门下省、中书省、尚书六部、御史台、东宫官署等。中书令杨国忠日常在中书省西厅办公，紧邻安上门，进出便捷。其厅壁挂《天下诸州贡赋图》，实际是他调度钱粮、结党营私的沙盘。西侧：十二卫府、太仆寺、鸿胪客馆、诸道进奏院密集区。鸿胪客馆常驻回纥、吐蕃、大食使团，实则为安禄山、哥舒翰等藩镇提供了一条绕过皇城正门的"外交通道"。各进奏院内部设有"捉驿使"，专事截获对手塘报。</p>'+
'<div class="highlight-box"><strong>左右金吾卫衙署：</strong>设于皇城东西两角。罗家主官为左金吾郎将，掌街东（万年县）全城巡警。每日卯正，他自龙首坊宅邸骑马过丹凤门，顺宫墙西行入延喜门点卯。其属下有街使、街铺、武侯队三百余人，分驻街东三十余所街铺。罗家还私蓄"街鬼"四十八人──皆是退役不良人（捕快），混迹于平康坊酒肆、东市邸店，替罗家盯紧任何可疑的外来武人。</div>'+
'<h3>四、外郭坊市（居住、商业、权力暗区）</h3>'+
'<h4>4.1 城北近宫坊区：冯罗两家森然对峙，禁军暗影织成铁网</h4>'+
'<p class="poem">"北阙临仙掌，南山对古丘。谁言甲第贵，不及近宸旒。"</p>'+
'<div class="sub-section">'+
'<h5>街西·辅兴坊（冯家巢穴）</h5>'+
'<p>辅兴坊居皇城西第一街第二坊，北抵安福门，东望掖庭宫。坊内东南隅有金仙女冠观、玉真女冠观双观并立，但冯氏并不礼佛道。冯家乃武德年间传承至今的宫门宿卫世家，族中多出内侍、守门校尉、符宝郎，以掌管宫内诸门鱼符、门籍为根基。宅第占据坊内东部四分之一的土地，墙高丈八，暗设三层哨楼，可眺望太极宫玄武门城楼。冯家内部用一套"门宦图谱"管理族人──将太极宫、东宫、掖庭等各大小门禁按"上八门、中十二门、下侧门"分级，由族老会分派轮值。每年冬至，冯家会闭门举行"换符礼"，重制门禁暗语，此时连陈玄礼的亲兵都不得进入。坊内杂居的香火道士、老宫人多为冯家眼线，将太极宫及掖庭后宫的日常动态编织成情报网。冯罗两家百年宿怨源于景龙年间一场宫门火并，自此物理隔绝，冯家绝不踏足街东，罗家亦不饮西市之酒。</p>'+
'<h5>街西·修德坊</h5>'+
'<p>左龙武军别部设于此坊北门内，马厩可容三百匹。这支别部名义上隶属陈玄礼，实则常被冯家以"宫城西墙防务"为由调动，形成对辅兴坊侧翼的屏护。夜间坊门关闭后，冯家暗探可通过修德坊与辅兴坊之间的坊墙梯道传递蜡丸。</p>'+
'<h5>街东·龙首坊（罗家铁骑营垒）⚠ 虚构坊</h5>'+
'<p>此坊正史不载，因坊东北旧渠而得名，系安史乱前特殊军户聚落。位处大明宫南墙外东侧，紧邻东内苑西墙。坊北距丹凤门仅一街之隔，坊东墙与龙武骑兵大营之间仅有一条窄巷，名"鸣镝巷"。龙首渠故道从坊东北斜穿而过，明渠早已干涸，但渠底遗留一处天然地窟，罗家辟为地下演武场，传有深达数丈的暗室收藏甲胄、火器硫磺——此乃罗家百年积蓄，以待非常。罗氏宗族占据坊西北整块区域，宅第规模逾百间，门前立戟十二枝（逾制），马厩分东厩、西厩，饲养战马百八十匹。演武场铺以河沙，每日晨间罗家儿郎在此操练陌刀、骑射，喝声震落槐叶。罗氏祖籍陇西，世代与骑兵结缘，武则天时期迁入龙首坊，受赐"世袭左金吾引驾仗"，以节制街东武侯铺为专职。</p>'+
'</div>'+
'<div class="highlight-box"><strong>罗冯对峙：</strong>罗冯两家分踞街东、街西，隔几个坊相望，但恩怨早渗入宫禁每一道门槛。每逢三节两寿，两人鸿胪寺偶遇，仅以"下官/某将"互称，目光却似淬了毒的箭镞。</div>'+
'<h4>4.2 皇城周边政务坊：密折流转，人心似海</h4>'+
'<div class="sub-section">'+
'<h5>务本坊（街东·皇城安门外东侧第一坊）</h5>'+
'<p>本为国子监所在，太学生晨诵《春秋》之声可达于街。但坊内靠近国子监东墙的进奏院群中，安禄山的三镇留后院（平卢、范阳、河东）表面赁用邸店三层，挂牌为"范阳邸"，实有死士三十名，日夜焚香译写东北军报。留后院隔壁即是卖笔墨纸砚的铺子，老板吉温族弟，专事窃听进奏院往来的官员交谈。吉温本人则每隔五日从御史台来此，与留后院的奚族暗卫交换信件，将朝中反安言论列成名单，快马递回幽州。</p>'+
'<h5>崇义坊、永兴坊</h5>'+
'<p>二坊邻接东宫南垣，多为东宫属官、失权文官聚居。太子的老师、年老翰林等每日在坊中酒肆赊账买醉，墙角常有匿名诗句斥责杨氏。金吾卫罗家对此地并无明显监控──因太子已无威胁，但冯家的密探仍装作卖梨小贩，记录每一个拜访过崇义坊东宫官邸的外来者。</p>'+
'</div>'+
'<h4>4.3 城中权贵游宴区：烈火烹油，金粉绘皮</h4>'+
'<div class="sub-section">'+
'<h5>宣阳坊、亲仁坊</h5>'+
'<p>杨国忠宅在宣阳坊南街，与虢国夫人、韩国夫人、秦国夫人宅第以复壁暗廊相连，坊间美其名曰"三姨洞"。亲仁坊有安禄山早年受赐之豪宅，此时空置，但府中留有色目老仆，每夜在府后小佛堂点燃三百六十盏油灯——实为信号灯，与龙首坊罗家某一高阁遥相呼应（罗氏暗许安禄山一些边境军械私贩，以换取东北良马）。</p>'+
'<h5>平康坊</h5>'+
'<p>长安昼夜不眠的销金窟。妓家分南北，南妓善谑，北妓善琴。地下暗流却是：杨国忠的心腹常包下北曲最豪奢的"棠棣楼"密晤藩镇使节；安禄山的眼线则偏爱南曲临街小阁，借歌伎的手拍节奏传递暗语。平康坊与罗家"街鬼"活动区高度重合，罗氏在此养线人十二，专司捕捉娱乐间不经意泄露的朝政隐私。</p>'+
'<h5>曲江·芙蓉园·乐游原</h5>'+
'<p>大规模游宴循环：上巳、寒食、重阳，玄宗的游船自兴庆宫夹城水道缓缓南来。每次游宴，左金吾卫需提前清道，罗家主官往往亲带队骑巡，踏过每一座便桥。天宝十二载三月三日，杜甫写下《丽人行》，所刺正是此地风光。而罗家就是从这次游宴的记录中，推断出杨国忠与吐蕃使节私下接触的时间节点。</p>'+
'</div>'+
'<h4>4.4 城南平民寺观坊：清音之下，暗线绵长</h4>'+
'<p>明德门周边及城南偏东诸坊（如晋昌坊大慈恩寺·大雁塔、安仁坊小雁塔·荐福寺等），多为中下层官员、平民聚居。坊墙矮小、土围墙多生杂草，井水微咸。大型佛寺与祆祠、景教寺点缀其间，西市的胡商常越过朱雀街，到此区的祆祠祭拜圣火。但城南绝非清静之地：寺院内寄住的落第举子常为藩镇充当文牍教习，借抄经之名行间谍之实。大慈恩寺塔是眺望全城的最佳制高点，罗家密探每月携"功德"入寺，实为登上塔刹，用窥管（原始望远镜）观测太极宫、大明宫的晨昏旗号变化。</p>'+
'<h3>五、东西两市：财富的阴阳两面</h3>'+
'<p><strong>东市：</strong>靠近兴庆宫与权贵坊区，店铺售"阡陌纱""龙香墨""宣州紫毫笔"，顾客多乘犊车、带侍从。坊间盛传东市某邸店地窖，藏有左藏令偷出的国库金银器，与杨国忠有关。<strong>西市：</strong>丝路国际商贸总汇。拂菻、波斯、粟特胡商摩肩接踵，酒肆中胡姬跳袄教舞，钱庄可凭飞钱兑付千里之外的货款。禁军士卒休假时常来此饮三勒浆，挥金如土；罗家骑兵则定期在西市"铁勒邸"采购西域精铁。冯家耳目伪装成粟特商人，在西市开了一间香料铺，以天竺龙脑香为号，专司刺探街东来的骑兵、打手。</p>'+
'<div class="divider">━ ◇ ━</div>'+
'<h3>附笺</h3>'+
'<p>全城地下水系统分为龙首渠、清明渠、永安渠三条干渠，其中龙首渠部分废弃段正是龙首坊下暗道的由来。传说几条主渠交汇处有大业年间留下的密道枢纽，唯冯家老族长与罗家死士首领各持半张羊皮图。以上诸坊，凡涉及冯罗两家秘辛，皆为绝密口耳相传，书于纸者，阅后即焚。</p>'+
'<div class="end-poem">帝城九衢，马蹄踏碎霜晨鼓。<br>天宝十二载的月光如一把钝刀，割开了歌舞升平的假象，<br>让隐藏在坊墙后的铁甲与密信微微泛出冷光。<br>而生活其中的人们，尚沉溺于沉香亭的乐曲声里，<br>不知棋局将翻覆，长安将焚。</div>'+
'</div>',
    status: '完善', tags: ['地理','势力分布','冯罗对峙','权力地图','长安城'], links: [], created: '2026-06-09',
    detailPage: 'settings/changan-power-map.html'
  };
  return d;
}
// END_GET_DEFAULT_DATA

// ============================================================
//  数据层加载（含旧版本迁移）
// ============================================================
let data = (() => {
  // 尝试当前版本存储
  let stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
        // 确保已迁移
        if (!parsed.__meta || !parsed.__meta.migrated) {
          migrateData(parsed);
          if (!parsed.__meta) parsed.__meta = {};
          parsed.__meta.migrated = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch(e) {}
  }

  // 尝试旧版本存储迁移
  const oldStored = localStorage.getItem(OLD_STORAGE_KEY);
  if (oldStored) {
    try {
      const oldData = JSON.parse(oldStored);
      if (typeof oldData === 'object' && !Array.isArray(oldData)) {
        migrateData(oldData);
        oldData.__meta = { migrated: true, fromVersion: OLD_VERSION };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(oldData));
        localStorage.removeItem(OLD_STORAGE_KEY);
        return oldData;
      }
    } catch(e) {}
  }

  // 使用默认数据
  const defaultData = getDefaultData();
  migrateData(defaultData);
  defaultData.__meta = { migrated: true, isDefault: true };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
})();

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function allCategories() { return Object.keys(data).filter(k => !k.startsWith('__')); }

function findEntryByName(name) {
  for (const cat of allCategories()) {
    if (data[cat][name] !== undefined) {
      const entry = data[cat][name];
      return { cat, name, entry, id: entry.id };
    }
  }
  return null;
}

function findEntryById(id) {
  for (const cat of allCategories()) {
    for (const name of Object.keys(data[cat])) {
      const entry = data[cat][name];
      if (entry && entry.id === id) return { cat, name, entry };
    }
  }
  return null;
}

// ============================================================
//  分类管理
// ============================================================
let currentCat = allCategories()[0] || '';
let currentEntry = null;

function showAddCategory() {
  document.getElementById('addCatOverlay').classList.add('open');
  document.getElementById('newCatInput').value = '';
  document.getElementById('newCatInput').focus();
}
function closeAddCategory() { document.getElementById('addCatOverlay').classList.remove('open'); }
function createCategory() {
  const name = document.getElementById('newCatInput').value.trim();
  if (!name) return;
  if (data[name]) { toast('分类已存在'); return; }
  data[name] = {}; saveData(); closeAddCategory(); refreshAll();
  toast(`🌿 新枝「${name}」已发芽`);
}
function deleteCategory(cat) {
  if (!confirm(`确定删除分类「${cat}」及其所有条目？`)) return;
  delete data[cat]; saveData();
  if (currentCat === cat) { const cats = allCategories(); currentCat = cats.length>0 ? cats[0] : ''; currentEntry = null; }
  refreshAll(); toast('已修剪');
}

// ============================================================
//  条目 CRUD
// ============================================================
function showAddEntryForm(cat, name) {
  cat = cat || currentCat || allCategories()[0];
  const overlay = document.getElementById('entryFormOverlay');
  document.getElementById('entryFormTitle').textContent = name ? '编辑叶片' : '新叶片';
  const saveBtn = document.getElementById('efSaveBtn');
  saveBtn.dataset.editing = name || '';
  const sel = document.getElementById('efCat');
  sel.innerHTML = allCategories().map(c => `<option value="${c}">${c}</option>`).join('');
  sel.value = cat;
  saveBtn.dataset.oldCat = cat;
  if (name && data[cat] && data[cat][name]) {
    const e = data[cat][name];
    document.getElementById('efName').value = name;
    document.getElementById('efContent').value = e.content || '';
    document.getElementById('efStatus').value = e.status || '草稿';
    document.getElementById('efTags').value = (e.tags || []).join(', ');
    document.getElementById('efLinks').value = (e.links || []).map(id => {
      const found = findEntryById(id);
      return found ? found.name : id;
    }).join(', ');
  } else {
    document.getElementById('efName').value = '';
    document.getElementById('efContent').value = '';
    document.getElementById('efStatus').value = '完善';
    document.getElementById('efTags').value = '';
    document.getElementById('efLinks').value = '';
  }
  overlay.classList.add('open');
}
function closeEntryForm() { document.getElementById('entryFormOverlay').classList.remove('open'); }
function saveEntryForm() {
  const cat = document.getElementById('efCat').value;
  const name = document.getElementById('efName').value.trim();
  if (!cat || !name) { toast('分类和名称不能为空'); return; }
  const content = document.getElementById('efContent').value.trim();
  const status = document.getElementById('efStatus').value;
  const tags = document.getElementById('efTags').value.split(',').map(s=>s.trim()).filter(Boolean);
  const linksInput = document.getElementById('efLinks').value;
  const linkNames = linksInput.split(',').map(s=>s.trim()).filter(Boolean);
  const editing = document.getElementById('efSaveBtn').dataset.editing;
  const oldCat = document.getElementById('efSaveBtn').dataset.oldCat || cat;

  // 处理 ID
  let entryId;
  if (editing && data[oldCat] && data[oldCat][editing]) {
    entryId = data[oldCat][editing].id;
  } else {
    entryId = generateId();
  }

  // 转换链接名称 -> ID
  const linkIds = [];
  for (const lname of linkNames) {
    const found = findEntryByName(lname);
    if (found && found.id !== entryId) {
      linkIds.push(found.id);
    } else if (found && found.id === entryId) {
      // 自引用忽略
    } else {
      toast(`关联 "${lname}" 未找到，已跳过`);
    }
  }

  // 名称唯一性检查（允许跨分类，但建议唯一）
  if (!editing || editing !== name) {
    for (const c of allCategories()) {
      if (data[c][name] !== undefined && (c !== cat || !editing)) {
        if (!confirm(`条目「${name}」已在分类「${c}」中存在，是否继续？`)) return;
      }
    }
  }

  // 处理重命名时删除旧键
  if (editing) {
    if (oldCat !== cat || editing !== name) {
      if (data[oldCat] && data[oldCat][editing]) delete data[oldCat][editing];
    }
  }

  if (!data[cat]) data[cat] = {};
  data[cat][name] = {
    id: entryId,
    content,
    status,
    tags,
    links: linkIds,
    created: data[cat][name] ? data[cat][name].created : new Date().toISOString().slice(0,10)
  };
  saveData(); closeEntryForm();
  currentCat = cat; currentEntry = name; refreshAll();
  toast(`🍃 叶片「${name}」已保存`);
}
function deleteEntry(cat, name) {
  if (!data[cat] || !data[cat][name]) return;
  if (!confirm(`删除叶片「${name}」？`)) return;
  delete data[cat][name]; saveData();
  if (currentCat === cat && currentEntry === name) currentEntry = null;
  refreshAll(); toast('已摘除');
}

// ============================================================
//  渲染树
// ============================================================
function renderTree() {
  const tree = document.getElementById('catTree');
  const cats = allCategories();
  if (cats.length === 0) {
    tree.innerHTML = '<li style="color:var(--text-muted);padding:20px;text-align:center;">🌱 播下第一颗种子吧</li>';
    return;
  }
  tree.innerHTML = cats.map(cat => {
    const entries = Object.keys(data[cat] || {});
    const count = entries.length;
    const isActive = cat === currentCat;
    const openClass = isActive ? 'open' : '';
    const icon = catIcons[cat] || '📁';
    return `<li>
      <div class="cat-item ${isActive?'active':''}" onclick="onCatClick('${esc(cat)}')">
        <span class="chevron ${openClass}">${isActive?'▼':'▶'}</span>
        <span class="icon">${icon}</span>
        <span>${cat}</span>
        <span class="badge">${count}</span>
        <span class="actions">
          <button onclick="event.stopPropagation();showAddEntryForm('${esc(cat)}','')" title="新叶">➕</button>
          <button onclick="event.stopPropagation();deleteCategory('${esc(cat)}')" title="修剪">🗑️</button>
        </span>
      </div>
      <ul class="entry-list ${openClass}">
        ${entries.map(name => {
          const entry = data[cat][name];
          const statusIcon = entry.status==='完善'?'✅': entry.status==='废弃'?'⛔':'📝';
          const isEntryActive = (cat === currentCat && name === currentEntry);
          return `<li class="entry-item ${isEntryActive?'active':''}" onclick="onEntryClick('${esc(cat)}','${esc(name)}')">
            <span class="status-indicator">${statusIcon}</span>
            <span>${name}</span>
          </li>`;
        }).join('')}
      </ul>
    </li>`;
  }).join('');
}

function onCatClick(cat) {
  if (currentCat === cat) {
    currentCat = ''; currentEntry = null;
  } else {
    currentCat = cat; currentEntry = null;
  }
  document.getElementById('searchInput').value = '';
  refreshAll();
}

function onEntryClick(cat, name) {
  currentCat = cat; currentEntry = name;
  refreshAll();
  const entry = data[cat] && data[cat][name];
  if (entry && entry.detailPage) {
    window.location.href = entry.detailPage;
    return;
  }
  showDetail(cat, name);
}

function refreshAll() {
  renderTree();
  renderCardList();
}

// ============================================================
//  卡片列表
// ============================================================
function renderCardList() {
  const container = document.getElementById('cardList');
  if (!currentCat || !data[currentCat]) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">🌳</span><span>从左侧选一棵树吧</span></div>';
    return;
  }
  const entries = Object.entries(data[currentCat]);
  if (entries.length === 0) {
    container.innerHTML = `<div class="empty-state"><span class="emoji">🍂</span><span>「${currentCat}」还未长出新叶</span></div>`;
    return;
  }
  container.innerHTML = entries.map(([name, entry]) => {
    const statusClass = entry.status==='完善'?'perfect': entry.status==='废弃'?'abandon':'draft';
    const statusIcon = entry.status==='完善'?'✅': entry.status==='废弃'?'⛔':'📝';
    const statusText = entry.status;
    const tagsHtml = (entry.tags||[]).map(t => `<span class="tag">${esc(t)}</span>`).join('');
    const preview = (entry.content||'').substring(0, 120);
    const linksCount = (entry.links||[]).length;
    const isActive = name === currentEntry;
    const detailUrl = entry.detailPage || null;
    const tagOpen = detailUrl ? `<a href="${detailUrl}" class="card ${isActive?'active':''}" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;">` : `<div class="card ${isActive?'active':''}" onclick="showDetail('${esc(currentCat)}','${esc(name)}')">`;
    const tagClose = detailUrl ? '</a>' : '</div>';
    return `${tagOpen}
      <div class="head">
        <h3>${name}</h3>
        <span class="status-tag ${statusClass}">${statusIcon} ${statusText}</span>
      </div>
      <div class="tags">${tagsHtml}</div>
      <div class="preview">${esc(preview)}${preview.length>=120?'...':''}</div>
      <div class="foot">
        <span>📅 ${entry.created||'未知'}</span>
        <span class="links-count">🔗 ${linksCount} 关联</span>
      </div>
    ${tagClose}`;
  }).join('');
}

// ============================================================
//  详情与跳转
// ============================================================
function showDetail(cat, name) {
  if (!data[cat] || !data[cat][name]) return;
  const entry = data[cat][name];
  currentCat = cat; currentEntry = name;
  refreshAll();
  const panel = document.getElementById('detailContent');
  const overlay = document.getElementById('detailOverlay');
  const statusClass = entry.status==='完善'?'perfect': entry.status==='废弃'?'abandon':'draft';
  const statusIcon = entry.status==='完善'?'✅': entry.status==='废弃'?'⛔':'📝';
  const statusText = entry.status;
  const tagsHtml = (entry.tags||[]).map(t => `<span class="tag">${esc(t)}</span>`).join('');
  const linksHtml = (entry.links||[]).map(id => {
    const found = findEntryById(id);
    if (found) {
      return `<span class="link-item exists" onclick="jumpToEntry('${esc(found.cat)}','${esc(found.name)}')">${found.name}</span>`;
    } else {
      return `<span class="link-item missing" title="目标不存在 (${esc(id)})">未知</span>`;
    }
  }).join('');
  panel.innerHTML = `
    <h2>${name}</h2>
    <div class="meta">
      <span class="badge status-tag ${statusClass}">${statusIcon} ${statusText}</span>
      <span>📅 ${entry.created||'未知'}</span>
      <span>📍 ${cat}</span>
      <div class="tags-inline">${tagsHtml}</div>
    </div>
    <div class="content-text">${esc(entry.content||'(无内容)')}</div>
    <div class="links-section">
      <h4>🔗 关联条目</h4>
      <div>${linksHtml || '无关联'}</div>
    </div>
    <div class="actions">
      <button class="btn-edit" onclick="showAddEntryForm('${esc(cat)}','${esc(name)}')">✏️ 编辑</button>
      <button class="btn-delete" onclick="deleteEntry('${esc(cat)}','${esc(name)}'); closeDetail();">🗑️ 删除</button>
    </div>
  `;
  overlay.classList.add('open');
}
function closeDetail() { document.getElementById('detailOverlay').classList.remove('open'); }
function jumpToEntry(cat, name) { closeDetail(); currentCat=cat; currentEntry=name; refreshAll(); showDetail(cat,name); }

// ============================================================
//  搜索、图谱、导入导出JSON、同步、清空
// ============================================================
function onSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const container = document.getElementById('cardList');
  if (!query) { renderCardList(); return; }
  let results = [];
  for (const cat of allCategories()) {
    for (const [name, entry] of Object.entries(data[cat])) {
      const searchIn = (name + ' ' + (entry.content||'') + ' ' + (entry.tags||[]).join(' ') + ' ' + (entry.links||[]).join(' ')).toLowerCase();
      if (searchIn.includes(query)) results.push({cat, name, entry});
    }
  }
  if (results.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="emoji">🔍</span><span>未找到</span></div>'; return;
  }
  container.innerHTML = results.map(({cat, name, entry}) => {
    const statusClass = entry.status==='完善'?'perfect': entry.status==='废弃'?'abandon':'draft';
    const tagsHtml = (entry.tags||[]).map(t => `<span class="tag">${esc(t)}</span>`).join('');
    const preview = (entry.content||'').substring(0, 120);
    const detailUrl = entry.detailPage || null;
    const tagOpen = detailUrl ? `<a href="${detailUrl}" class="card" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;">` : `<div class="card" onclick="jumpToEntry('${esc(cat)}','${esc(name)}')">`;
    const tagClose = detailUrl ? '</a>' : '</div>';
    return `${tagOpen}
      <div class="head">
        <h3>${name}</h3>
        <span class="status-tag ${statusClass}">${entry.status}</span>
        <span style="margin-left:auto;font-size:0.7rem;color:var(--text-muted);">📍 ${cat}</span>
      </div>
      <div class="tags">${tagsHtml}</div>
      <div class="preview">${esc(preview)}${preview.length>=120?'...':''}</div>
    ${tagClose}`;
  }).join('');
}

let network = null;
function showGraph() {
  document.getElementById('graphOverlay').classList.add('open');
  setTimeout(() => buildGraph(), 200);
}
function closeGraph() {
  document.getElementById('graphOverlay').classList.remove('open');
  if (network) { network.destroy(); network = null; }
}
function showHelp() {
  document.getElementById('helpOverlay').classList.add('open');
}
function closeHelp() {
  document.getElementById('helpOverlay').classList.remove('open');
}
function buildGraph() {
  const container = document.getElementById('graphContainer');
  container.style.height = '100%';
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();
  const nodeMap = {};  // id -> vis id
  let visId = 0;
  const catColors = { '世界观':'rgba(126,184,160,0.85)','人物':'rgba(126,184,212,0.85)','势力':'rgba(212,184,122,0.85)','地理':'rgba(180,160,212,0.85)','物品':'rgba(212,160,180,0.85)','事件/时间线':'rgba(212,180,140,0.85)' };
  // 添加节点
  for (const cat of allCategories()) {
    for (const [name, entry] of Object.entries(data[cat])) {
      const id = entry.id;
      if (!nodeMap[id]) {
        nodeMap[id] = ++visId;
        nodes.add({ id: visId, label: name, title: `${name} (${cat})`, color: { background: (catColors[cat] || 'rgba(180,196,188,0.85)'), border: 'rgba(20,20,40,0.3)' }, shape: 'dot', size: 26, borderWidth: 3 });
      }
    }
  }
  // 添加边
  for (const cat of allCategories()) {
    for (const [name, entry] of Object.entries(data[cat])) {
      const fromVisId = nodeMap[entry.id];
      if (!fromVisId) continue;
      for (const linkId of (entry.links || [])) {
        const toVisId = nodeMap[linkId];
        if (toVisId && fromVisId !== toVisId) {
          edges.add({ from: fromVisId, to: toVisId, arrows: 'to', color: { color: 'rgba(196,181,154,0.15)', highlight: 'rgba(212,184,122,0.4)' }, width: 1.5, smooth: { type: 'continuous' } });
        }
      }
    }
  }
  const options = {
    physics: { solver: 'forceAtlas2Based', stabilization: { iterations: 150 } },
    interaction: { hover: true, tooltipDelay: 200 },
    nodes: { font: { size: 14, color: '#c4b59a', face: 'Inter, Noto Sans SC, sans-serif', strokeWidth: 0 } },
    edges: { smooth: { type: 'continuous' }, color: { color: 'rgba(196,181,154,0.2)', highlight: 'rgba(212,184,122,0.5)' } }
  };
  network = new vis.Network(container, { nodes, edges }, options);
  network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const node = nodes.get(params.nodes[0]);
      if (node) {
        // 根据 vis id 找到对应的条目 id
        for (const cat of allCategories()) {
          for (const [name, entry] of Object.entries(data[cat])) {
            if (nodeMap[entry.id] === params.nodes[0]) {
              closeGraph();
              jumpToEntry(cat, name);
              return;
            }
          }
        }
      }
    }
  });
}

function exportData() {
  if (!confirm('您即将提交的内容将永久纳入公共设定库，不可撤回。是否确认？')) {
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `worldbuilding_${VERSION}_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  toast('✅ JSON导出成功');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (typeof imported !== 'object' || Array.isArray(imported)) throw new Error('格式错误');
      for (const cat of Object.keys(imported)) {
        if (cat.startsWith('__')) continue;
        if (typeof imported[cat] !== 'object' || Array.isArray(imported[cat])) throw new Error('分类格式错误');
        for (const name of Object.keys(imported[cat])) {
          const e = imported[cat][name];
          if (!e || !e.content) throw new Error(`条目「${name}」缺少 content`);
        }
      }
      if (!confirm('导入将覆盖当前数据，确定？')) return;
      migrateData(imported); // 确保 id 和 links
      imported.__meta = { migrated: true, imported: true };
      data = imported; saveData();
      currentCat = allCategories()[0] || ''; currentEntry = null;
      refreshAll(); toast('✅ 导入成功');
    } catch(err) { alert('导入失败：'+err.message); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function clearAll() {
  if (!confirm('⚠️ 清空所有？不可撤销！')) return;
  data = {}; saveData();
  currentCat = ''; currentEntry = null;
  refreshAll(); toast('已清空');
}

function resetToDefault() {
  if (!confirm('⚠️ 将清除本地所有修改，加载作者最新内嵌的默认数据。\n建议先导出备份。确定？')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

// ============================================================
//  导出完整HTML快照（使用标记定位，替代正则）
// ============================================================
function exportHTML() {
  if (!confirm('导出 HTML 快照将包含当前所有设定数据，是否继续？')) return;

  let html = document.documentElement.outerHTML;
  const dataJSON = JSON.stringify(data);
  const snapshotVersion = 'snapshot_' + Date.now();

  // 替换 getDefaultData 函数
  const beginMarker = '// BEGIN_GET_DEFAULT_DATA';
  const endMarker = '// END_GET_DEFAULT_DATA';
  const beginIdx = html.indexOf(beginMarker);
  const endIdx = html.indexOf(endMarker);
  if (beginIdx === -1 || endIdx === -1) {
    toast('导出失败：无法定位数据函数');
    return;
  }
  // 定位标记所在行
  const lineStart = html.lastIndexOf('\n', beginIdx) + 1;
  let lineEnd = html.indexOf('\n', endIdx);
  if (lineEnd === -1) lineEnd = html.length;
  else lineEnd = lineEnd + 1; // 包含换行
  // 替换为直接返回数据的函数
  const newFunc = `function getDefaultData() {\n  return ${dataJSON};\n}\n`;
  html = html.substring(0, lineStart) + beginMarker + '\n' + newFunc + endMarker + '\n' + html.substring(lineEnd);

  // 替换版本号与存储键（使用字符串替换，不涉及正则）
  html = html.replace("const VERSION = 'v1.2'", `const VERSION = '${snapshotVersion}'`);
  html = html.replace("const STORAGE_KEY = `worldbuilding_natural_${VERSION}`", `const STORAGE_KEY = \`worldbuilding_natural_${snapshotVersion}\``);
  html = html.replace(/worldbuilding_natural_[\w.]+/g, `worldbuilding_natural_${snapshotVersion}`);

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `灵弦华夏_${snapshotVersion}.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  toast('✅ HTML快照导出成功');
}

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,"&#39;"); }
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer); t._timer = setTimeout(()=>t.classList.remove('show'), 2500);
}

// ============================================================
//  Escape 键全局关闭所有覆盖层
// ============================================================
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;

  const overlays = [
    { id: 'graphOverlay', close: closeGraph },
    { id: 'detailOverlay', close: closeDetail },
    { id: 'helpOverlay', close: closeHelp },
    { id: 'entryFormOverlay', close: closeEntryForm },
    { id: 'addCatOverlay', close: closeAddCategory }
  ];
  for (const ol of overlays) {
    const el = document.getElementById(ol.id);
    if (el && el.classList.contains('open')) {
      ol.close();
      e.preventDefault();
      return;
    }
  }
  // 没有覆盖层时不做任何跳转
});

// ===== 初始化 =====
document.getElementById('versionDisplay').textContent = VERSION;
if (!currentCat && allCategories().length > 0) currentCat = allCategories()[0];
refreshAll();
