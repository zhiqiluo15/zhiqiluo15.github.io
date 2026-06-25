// ============================================================
//  数据层（完全不变）
// ============================================================
const STORAGE_KEY = 'vocab_categorized_v2';
let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ============================================================
//  工具函数
// ============================================================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCatKeys() { return Object.keys(data); }

function esc(str) { return str.replace(/'/g, "\\'"); }

// ============================================================
//  类别管理
// ============================================================
function createCategory() {
  const input = document.getElementById('newCat');
  const name = input.value.trim();
  if (!name) { alert('请输入类别名称'); return; }
  const existing = getCatKeys().find(k => k.toLowerCase() === name.toLowerCase());
  if (existing) { alert(`类别 "${existing}" 已存在`); input.value = ''; return; }
  data[name] = {};
  saveData();
  input.value = '';
  refreshUI();
  ['addCatSelect', 'wordListCatSelect', 'reviewCatSelect'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.value = name;
  });
  refreshWordList();
}

function deleteCategory(cat) {
  if (!data[cat]) return;
  if (!confirm(`确定要删除类别「${cat}」及其所有单词吗？`)) return;
  delete data[cat];
  saveData();
  refreshUI();
  document.getElementById('wordListContainer').innerHTML = '';
  showDataMsg('已删除类别');
}

// ============================================================
//  单词管理
// ============================================================
function addWord() {
  const cat = document.getElementById('addCatSelect').value;
  if (!cat) { document.getElementById('addMsg').textContent = '请先选择类别'; return; }
  const en = document.getElementById('addEn').value.trim().toLowerCase();
  const zh = document.getElementById('addZh').value.trim();
  if (!en || !zh) { document.getElementById('addMsg').textContent = '请输入英文和中文'; return; }
  if (data[cat][en]) {
    document.getElementById('addMsg').textContent = `单词 "${en}" 已存在于「${cat}」，已忽略。`;
  } else {
    data[cat][en] = zh;
    saveData();
    document.getElementById('addMsg').textContent = `✅ 已添加 [${cat}] ${en}: ${zh}`;
  }
  document.getElementById('addEn').value = '';
  document.getElementById('addZh').value = '';
  document.getElementById('addEn').focus();
  refreshCatList();
  refreshWordList();
}

function deleteWord(cat, en) {
  if (!data[cat] || !data[cat][en]) return;
  if (!confirm(`确定删除单词 "${en}" (${data[cat][en]})？`)) return;
  delete data[cat][en];
  saveData();
  refreshCatList();
  refreshWordList();
  showDataMsg(`已删除 "${en}"`);
}

function refreshWordList() {
  const cat = document.getElementById('wordListCatSelect').value;
  const container = document.getElementById('wordListContainer');
  if (!cat || !data[cat]) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📂</div>请选择一个有效类别</div>';
    return;
  }
  const entries = Object.entries(data[cat]);
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div>该类别下暂无单词，快去添加吧</div>';
    return;
  }
  let html = '<div class="word-list-wrap">';
  entries.forEach(([en, zh]) => {
    const safeCat = esc(cat);
    const safeEn = esc(en);
    html += `<div class="word-item">
      <div><strong>${en}</strong> <span>— ${zh}</span></div>
      <button class="word-del btn-danger" onclick="deleteWord('${safeCat}','${safeEn}')">删除</button>
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// ============================================================
//  导出 / 导入 / 清空
// ============================================================
function exportData() {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vocab_backup_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showDataMsg('✅ 导出成功');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported === null) throw new Error('格式错误（null）');
      if (typeof imported !== 'object' || Array.isArray(imported)) throw new Error('格式错误');
      for (const cat of Object.keys(imported)) {
        if (typeof imported[cat] !== 'object' || Array.isArray(imported[cat])) throw new Error('类别格式错误');
        for (const en of Object.keys(imported[cat])) {
          if (typeof imported[cat][en] !== 'string') throw new Error('单词格式错误');
        }
      }
      if (!confirm(`导入将覆盖当前所有数据（当前 ${getCatKeys().length} 个类别，导入 ${Object.keys(imported).length} 个类别）。确定继续？`)) return;
      data = imported;
      saveData();
      refreshUI();
      refreshWordList();
      showDataMsg('✅ 导入成功');
    } catch (err) {
      alert('导入失败：文件格式不正确。' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function clearAllData() {
  if (!confirm('确定要清空所有类别和单词吗？此操作不可撤销！')) return;
  data = {};
  saveData();
  refreshUI();
  refreshWordList();
  showDataMsg('🗑️ 已清空所有数据');
}

function showDataMsg(msg) {
  document.getElementById('dataMsg').textContent = msg;
  setTimeout(() => { document.getElementById('dataMsg').textContent = ''; }, 3000);
}

// ============================================================
//  UI刷新
// ============================================================
function refreshCatList() {
  const list = document.getElementById('catList');
  const keys = getCatKeys();
  if (keys.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div>暂无类别，请创建一个</div>';
    return;
  }
  list.innerHTML = keys.map(cat => {
    const count = Object.keys(data[cat]).length;
    const safeCat = esc(cat);
    return `<li>
      <span>${cat} <small>(${count} 词)</small></span>
      <button class="cat-del btn-danger" onclick="deleteCategory('${safeCat}')">删除</button>
    </li>`;
  }).join('');
}

function refreshSelects() {
  const ids = ['addCatSelect', 'wordListCatSelect', 'reviewCatSelect'];
  const saved = ids.map(id => document.getElementById(id).value);
  ids.forEach((id, i) => {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">-- 选择类别 --</option>';
    getCatKeys().forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      sel.appendChild(opt);
    });
    if (saved[i] && data[saved[i]]) sel.value = saved[i];
  });
}

function refreshUI() {
  refreshCatList();
  refreshSelects();
}

// ============================================================
//  复习核心
// ============================================================
let review = null;
let autoNextTimer = null;

function startReview() {
  const cat = document.getElementById('reviewCatSelect').value;
  if (!cat) { document.getElementById('reviewInfo').textContent = '请先选择类别'; return; }
  const entries = Object.entries(data[cat]);
  if (entries.length === 0) { document.getElementById('reviewInfo').textContent = `「${cat}」中没有单词`; return; }

  const allWords = shuffleArray(entries.map(([en, zh]) => ({ en, zh })));

  review = {
    cat,
    allWords,
    offset: 0,
    group: [],
    groupIdx: 0,
    correct: 0,
    totalInGroup: 0,
    finished: false,
    round: 1,
    submitted: false
  };

  document.getElementById('mainPanel').classList.add('hidden');
  document.getElementById('reviewPanel').classList.add('active');
  document.getElementById('reviewInfo').textContent = '';
  document.getElementById('groupResult').style.display = 'none';
  document.getElementById('quizArea').style.display = 'block';

  loadNextGroup();
}

function loadNextGroup() {
  if (!review) return;

  if (review.offset >= review.allWords.length) {
    review.allWords = shuffleArray(review.allWords);
    review.offset = 0;
    review.round++;
  }

  const remaining = review.allWords.length - review.offset;
  const groupSize = Math.min(20, remaining);
  review.group = review.allWords.slice(review.offset, review.offset + groupSize);
  review.offset += groupSize;
  review.groupIdx = 0;
  review.correct = 0;
  review.totalInGroup = groupSize;
  review.finished = false;

  document.getElementById('groupResult').style.display = 'none';
  document.getElementById('quizArea').style.display = 'block';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('answerInput').disabled = false;
  document.getElementById('answerInput').value = '';
  document.getElementById('answerFeedback').textContent = '';
  document.getElementById('answerInput').focus();
  clearTimer();

  showWord();
}

function showWord() {
  if (!review || review.finished) return;
  review.submitted = false;
  const word = review.group[review.groupIdx];
  if (!word) { finishGroup(); return; }

  const totalWords = review.allWords.length;
  const reviewedSoFar = review.offset - review.totalInGroup + review.groupIdx;
  document.getElementById('chineseDisplay').textContent = word.zh;
  document.getElementById('progress').textContent =
    `📂 ${review.cat}  ·  第 ${review.round} 轮  ·  第 ${Math.floor((review.offset - review.totalInGroup) / 20) + 1} 组  ·  ${review.groupIdx+1} / ${review.totalInGroup}  ·  已复习 ${reviewedSoFar} / ${totalWords}`;

  document.getElementById('answerInput').value = '';
  document.getElementById('answerFeedback').textContent = '';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('answerInput').disabled = false;
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('answerInput').focus();
  clearTimer();
}

function submitAnswer() {
  if (!review || review.submitted) return;
  const ans = document.getElementById('answerInput').value.trim().toLowerCase();
  const word = review.group[review.groupIdx];
  const feedback = document.getElementById('answerFeedback');
  const isCorrect = (ans === word.en);

  if (isCorrect) {
    feedback.innerHTML = '<span class="green">✅ 正确！</span>';
    review.correct++;
    word.wrong = false;
  } else {
    feedback.innerHTML = `<span class="red">❌ 错误，正确答案：${word.en}</span>`;
    word.wrong = true;
  }

  document.getElementById('submitBtn').disabled = true;
  document.getElementById('answerInput').disabled = true;
  review.submitted = true;

  const nextBtn = document.getElementById('nextBtn');
  const isLast = (review.groupIdx + 1 >= review.totalInGroup);
  nextBtn.textContent = isLast ? '📊 查看组结果' : '▶ 下一词';
  nextBtn.style.display = 'inline-block';

  const delay = isCorrect ? 500 : 1500;
  clearTimer();
  autoNextTimer = setTimeout(() => {
    autoNextTimer = null;
    nextWord();
  }, delay);
}

function nextWord() {
  clearTimer();
  if (!review || review.finished) return;
  review.groupIdx++;
  if (review.groupIdx >= review.totalInGroup) {
    finishGroup();
  } else {
    showWord();
  }
}

function finishGroup() {
  if (!review) return;
  review.finished = true;
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('groupResult').style.display = 'block';

  const total = review.totalInGroup;
  const correct = review.correct;
  const wrongCount = total - correct;
  let wrongHtml = '';
  if (wrongCount > 0) {
    const wrongWords = review.group.filter(w => w.wrong);
    wrongHtml = `<div class="wrong-list"><strong>❌ 错误单词 (${wrongWords.length})：</strong><ul>` +
      wrongWords.map(w => `<li>${w.en} — ${w.zh}</li>`).join('') + '</ul></div>';
  } else {
    wrongHtml = '<p style="color:var(--primary-dark); font-weight:600;">🎉 全部正确！</p>';
  }
  document.getElementById('wrongListContainer').innerHTML = wrongHtml;
  document.getElementById('groupStats').innerHTML =
    `📊 本组完成：正确 ${correct} / ${total} 词  (轮次: ${review.round})`;

  const remaining = review.allWords.length - review.offset;
  const continueBtn = document.getElementById('continueBtn');
  if (remaining > 0) {
    continueBtn.textContent = '🔄 继续下一组';
  } else {
    continueBtn.textContent = '🔄 开始新一轮';
  }

  clearTimer();
}

function continueReview() {
  if (!review) return;
  review.finished = false;
  document.getElementById('groupResult').style.display = 'none';
  document.getElementById('quizArea').style.display = 'block';
  loadNextGroup();
}

function exitReview() {
  clearTimer();
  review = null;
  document.getElementById('reviewPanel').classList.remove('active');
  document.getElementById('mainPanel').classList.remove('hidden');
  refreshUI();
  refreshWordList();
}

function clearTimer() {
  if (autoNextTimer) {
    clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
}

// ============================================================
//  初始化
// ============================================================
refreshUI();
refreshWordList();

window.addEventListener('load', () => {
  const keys = getCatKeys();
  if (keys.length > 0) {
    ['addCatSelect', 'wordListCatSelect', 'reviewCatSelect'].forEach(id => {
      document.getElementById(id).value = keys[0];
    });
    refreshWordList();
  }
});
