// supabase.js — 灵弦词集 Supabase 客户端 & 通用查询
const SUPABASE_URL = 'https://vacfnpexbwjqscrltwds.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bzHhPvrtJiiGrfE1eWldtA_1wYtEnQJ';

let _client = null;

function getSupabase() {
  if (!_client) {
    if (typeof window.supabase === 'undefined') {
      console.warn('Supabase CDN not loaded, using hard-coded fallback');
      return null;
    }
    _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return _client;
}

// 获取所有分类
async function fetchCategories() {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from('categories').select('*').order('id');
  if (error) { console.error('fetchCategories:', error); return []; }
  return data;
}

// 获取某分类下的所有条目（目录用）
async function fetchEntriesByCategory(categorySlug) {
  const sb = getSupabase();
  if (!sb) return [];

  const catRes = await sb.from('categories').select('id').eq('slug', categorySlug).single();
  if (catRes.error || !catRes.data) return [];

  const { data, error } = await sb
    .from('entries')
    .select('id, title_zh, subtitle_zh, author_era, period_label, summary_zh, summary_en, vocab_preview')
    .eq('category_id', catRes.data.id)
    .order('created_at');

  if (error) { console.error('fetchEntriesByCategory:', error); return []; }
  return data;
}

// 获取单条详情
async function fetchEntryDetail(entryId) {
  const sb = getSupabase();
  if (!sb) return null;

  const [entryRes, cardsRes] = await Promise.all([
    sb.from('entries').select('*, categories(slug, name_zh)').eq('id', entryId).single(),
    sb.from('word_cards').select('*').eq('entry_id', entryId).order('sort_order')
  ]);

  if (entryRes.error) { console.error('fetchEntryDetail:', entryRes.error); return null; }

  return {
    ...entryRes.data,
    word_cards: cardsRes.error ? [] : cardsRes.data
  };
}

// 获取当日诗词（按日期轮换，同一天内始终显示同一句）
async function fetchRandomPoem() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('daily_poems')
    .select('*')
    .order('id')
    .limit(100);

  if (error || !data || data.length === 0) return null;

  // 基于日期选择：同一天始终返回同一句，午夜自动切换
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % data.length;

  return data[index];
}

// 获取分类信息
async function fetchCategory(slug) {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from('categories').select('*').eq('slug', slug).single();
  if (error) return null;
  return data;
}

// 获取分类名（用于详情页显示）
async function fetchCategoryNameOf(entryId) {
  const detail = await fetchEntryDetail(entryId);
  return detail?.categories?.name_zh || '';
}
