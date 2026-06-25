        var materials = [], corrections = [], duplicates = [];
        var currentFilter = '', currentSearch = '', inputCount = 0;

        var typoMap = {
            '安剑': '按剑', '在坐': '在座', '以经': '已经', '既将': '即将',
            '地话': '的话', '得话': '的话', '那怕': '哪怕',
            '那吗': '那么', '那末': '那么', '甚麽': '什么', '什麽': '什么',
            '为甚': '为何', '为什麽': '为什么', '怎麽': '怎么', '甚麽样': '什么样',
            '那麽样': '那么样', '那末样': '那么样', '那末些': '那些', '那末个': '那个',
            '这末': '这么', '这麽': '这么', '这麽样': '这么样', '这麽些': '这些',
            '这麽个': '这个', '那们': '那么', '这们': '这么', '甚的': '什么的',
            '甚底': '什么的', '甚麽底': '什么的', '甚麽样底': '什么样的',
            '那等': '那种', '那樣': '那样', '那樣子': '那样子', '這样': '这样',
            '這樣': '这样', '這樣子': '这样子', '那麽些': '那些', '那麽个': '那个',
            '那麽样': '那么样', '那麽底': '那么的'
        };

        function loadData() {
            var saved = localStorage.getItem('novel-materials');
            var savedCorr = localStorage.getItem('novel-corrections');
            var savedDup = localStorage.getItem('novel-duplicates');
            var savedCount = localStorage.getItem('novel-input-count');
            if (saved) materials = JSON.parse(saved);
            if (savedCorr) corrections = JSON.parse(savedCorr);
            if (savedDup) duplicates = JSON.parse(savedDup);
            if (savedCount) inputCount = parseInt(savedCount);
            
            if (materials.length === 0) {
                importInitialMaterials();
            }
            
            updateDisplay();
        }

        function importInitialMaterials() {
            var initialMaterials = [
                { category: '人物', content: '空颜子，东胜神州送经客', featureTags: '核心人物，佛骨道心，曾在花果山筑府，贞观时应劫陨灭' },
                { category: '人物', content: '孙悟空，花果山大王，已去西天做了尊神佛', featureTags: '被五指山镇压五百年的齐天大圣，天地灵石所化' },
                { category: '人物', content: '老妇，花果山下村落居民', featureTags: '救助空颜子的凡人' },
                { category: '人物', content: '持剑者，数人，杀气凛然', featureTags: '血洗花果山的刺客，最后自刎' },
                { category: '人物', content: '土地，花果山土地神', featureTags: '被削去九成九修为' },
                { category: '人物', content: '七爷八爷，地府之人', featureTags: '收走屠戮者神魂' },
                { category: '场景', content: '花果山，福地，有瀑布水帘洞', featureTags: '空颜子早年筑府之处' },
                { category: '场景', content: '水帘洞，洞天', featureTags: '空颜子曾书写"花果山福地，水帘洞洞天"' },
                { category: '场景', content: '青石台', featureTags: '空颜子站立之处，天书灵宝遗留地' },
                { category: '场景', content: '花果山下村落', featureTags: '老妇居住之地' },
                { category: '场景', content: '东胜神州', featureTags: '空颜子称号相关地域' },
                { category: '场景', content: '西天', featureTags: '孙悟空成神佛之地' },
                { category: '场景', content: '瀑布，飞泉玉龙吟啸，山壁怪石嶙峋', featureTags: '空颜子凌空穿出之处' },
                { category: '伏笔', content: '"东胜神州送经客"，空颜子不曾写过，但字迹笔意与自己如出一辙', featureTags: '未解之谜，疑似他人伪造' },
                { category: '伏笔', content: '送经？何为经？', featureTags: '空颜子的核心疑问，贯穿全文' },
                { category: '伏笔', content: '贞观之后已是天宝十二载，空颜子惊觉时间跳跃', featureTags: '时空设定疑问' },
                { category: '伏笔', content: '空颜子一身法力被封，沦为凡人之躯', featureTags: '力量被封印的原因' },
                { category: '伏笔', content: '吊睛白额虎拦路，实为幻象试验', featureTags: '神秘力量操控' },
                { category: '伏笔', content: '天书灵宝，来历非凡，空颜子遗落而久不自知', featureTags: '重要道具，有真经之韵' },
                { category: '伏笔', content: '花果山生灵屠尽，谁所为？', featureTags: '核心谜团' },
                { category: '伏笔', content: '某伟力存在注视空颜子，称其为"送经客"', featureTags: '幕后推手' },
                { category: '伏笔', content: '孙悟空曾受佛骨道心身影密言，留意道号空颜子', featureTags: '关键关联' },
                { category: '点子', content: '空颜子在瀑中孤影凌空穿出，身畔一卷文书悬于半空，灵流涌动', featureTags: '场景构想' },
                { category: '点子', content: '空颜子与猴子对话，得知孙悟空已成神佛，时间已是唐朝天宝年间', featureTags: '剧情桥段' },
                { category: '点子', content: '空颜子遭遇吊睛白额虎幻象攻击，识破后继续前行', featureTags: '动作设计' },
                { category: '点子', content: '空颜子与持剑者激战，被一剑贯穿后心身亡', featureTags: '冲突桥段' },
                { category: '点子', content: '孙悟空被唤出，为报答密言嘱托，为空颜子重塑肉身', featureTags: '关键转折' },
                { category: '点子', content: '空颜子道心引动，借助孙悟空法力自塑肉身苏醒', featureTags: '恢复桥段' },
                { category: '点子', content: '空颜子告知孙悟空花果山生灵屠尽的真相', featureTags: '剧情推进' },
                { category: '点子', content: '伟力存在借天书之力唤来被五指山镇压五百年的孙悟空', featureTags: '时空交错' }
            ];
            
            initialMaterials.forEach(function(m) {
                inputCount++;
                materials.push({
                    id: Date.now() + inputCount,
                    content: m.content,
                    category: m.category,
                    featureTags: m.featureTags,
                    inputIndex: inputCount,
                    createdAt: new Date().toISOString()
                });
            });
            
            saveData();
        }

        function saveData() {
            localStorage.setItem('novel-materials', JSON.stringify(materials));
            localStorage.setItem('novel-corrections', JSON.stringify(corrections));
            localStorage.setItem('novel-duplicates', JSON.stringify(duplicates));
            localStorage.setItem('novel-input-count', inputCount.toString());
        }

        function addMaterial() {
            var content = document.getElementById('material-input').value.trim();
            var category = document.getElementById('category-select').value;
            var featureTags = document.getElementById('feature-tags').value.trim();
            if (!content) { alert('请输入素材内容'); return; }
            
            inputCount++;
            var material = {
                id: Date.now(), content: content, category: category, featureTags: featureTags,
                inputIndex: inputCount, createdAt: new Date().toISOString()
            };
            materials.push(material);
            checkForCorrections(material);
            checkForDuplicates(material);
            
            document.getElementById('material-input').value = '';
            document.getElementById('feature-tags').value = '';
            updateDisplay();
            saveData();
        }

        function batchImport() {
            var text = document.getElementById('batch-input').value.trim();
            if (!text) {
                document.getElementById('batch-result').innerHTML = '<span style="color: #dc3545;">请输入要导入的内容</span>';
                return;
            }
            processBatchText(text);
        }

        function processBatchText(text) {
            var categoryPattern = /【(人物|场景|伏笔|点子)】/g;
            var featureTagPattern = /\[([^\]]+)\]/g;
            var lines = text.split(/[\r\n]+/);
            var importedCount = 0;
            var failedCount = 0;

            lines.forEach(function(line) {
                line = line.trim();
                if (!line) return;

                var categoryMatch = line.match(categoryPattern);
                if (!categoryMatch) {
                    failedCount++;
                    return;
                }

                var category = categoryMatch[0].replace(/【|】/g, '');
                var content = line.replace(categoryPattern, '').trim();
                var featureTags = '';
                var featureMatch = content.match(featureTagPattern);
                if (featureMatch) {
                    featureTags = featureMatch[0].replace(/\[|\]/g, '');
                    content = content.replace(featureTagPattern, '').trim();
                }

                if (!content) {
                    failedCount++;
                    return;
                }

                inputCount++;
                var material = {
                    id: Date.now() + importedCount,
                    content: content,
                    category: category,
                    featureTags: featureTags,
                    inputIndex: inputCount,
                    createdAt: new Date().toISOString()
                };
                materials.push(material);
                checkForCorrections(material);
                checkForDuplicates(material);
                importedCount++;
            });

            document.getElementById('batch-input').value = '';
            updateDisplay();
            saveData();

            return { imported: importedCount, failed: failedCount };
        }

        function importFromURL() {
            var urlParams = new URLSearchParams(window.location.search);
            var data = urlParams.get('data');
            if (data) {
                try {
                    var decodedText = decodeURIComponent(data);
                    var result = processBatchText(decodedText);
                    console.log('URL导入结果: 成功' + result.imported + '条, 失败' + result.failed + '条');
                } catch (e) {
                    console.error('URL导入失败:', e);
                }
            }
        }

        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'novel_material_import') {
                var result = processBatchText(event.data.content);
                if (event.source) {
                    event.source.postMessage({
                        type: 'novel_material_import_result',
                        imported: result.imported,
                        failed: result.failed
                    }, event.origin);
                }
            }
        });

        window.addNovelMaterial = function(content) {
            return processBatchText(content);
        };

        function checkForCorrections(m) {
            var errors = [];
            for (var wrong in typoMap) {
                var correct = typoMap[wrong];
                if (m.content.indexOf(wrong) !== -1 && wrong !== correct) {
                    errors.push({ type: '错别字', location: m.content,
                        problem: '疑为错别字"' + wrong + '"，通常作"' + correct + '"', source: '第' + m.inputIndex + '次输入' });
                }
            }
            materials.forEach(function(mat) {
                if (mat.id !== m.id && mat.category === m.category) {
                    var nameMatch1 = m.content.match(/([\u4e00-\u9fa5]{2,4})\s*(，|,|是|有|在|的)/);
                    var nameMatch2 = mat.content.match(/([\u4e00-\u9fa5]{2,4})\s*(，|,|是|有|在|的)/);
                    if (nameMatch1 && nameMatch2 && nameMatch1[1] !== nameMatch2[1]) {
                        if (nameMatch1[1][0] === nameMatch2[1][0] || nameMatch1[1].indexOf(nameMatch2[1][0]) !== -1) {
                            errors.push({ type: '名称不统一', location: m.content,
                                problem: '当前为"' + nameMatch1[1] + '"，与第' + mat.inputIndex + '次输入的"' + nameMatch2[1] + '"可能指同一人', source: '第' + m.inputIndex + '次输入' });
                        }
                    }
                    var numMatch1 = m.content.match(/(\d+)\s*(年|岁|级|丈|尺|寸|里|两|钱|分)/);
                    var numMatch2 = mat.content.match(/(\d+)\s*(年|岁|级|丈|尺|寸|里|两|钱|分)/);
                    if (numMatch1 && numMatch2 && numMatch1[2] === numMatch2[2] && numMatch1[1] !== numMatch2[1]) {
                        errors.push({ type: '数值数据冲突', location: m.content,
                            problem: '当前数值"' + numMatch1[1] + numMatch1[2] + '"与第' + mat.inputIndex + '次输入的"' + numMatch2[1] + numMatch2[2] + '"冲突', source: '第' + m.inputIndex + '次输入' });
                    }
                }
            });
            errors.forEach(function(e) {
                var exists = corrections.some(function(c) {
                    return c.location === e.location && c.problem === e.problem;
                });
                if (!exists) corrections.push(e);
            });
        }

        function checkForDuplicates(m) {
            materials.forEach(function(mat) {
                if (mat.id !== m.id && areSimilar(m.content, mat.content)) {
                    var existingGroup = duplicates.find(function(g) {
                        return g.some(function(d) { return d.id === mat.id || d.id === m.id; });
                    });
                    var item1 = { id: m.id, content: m.content, source: '第' + m.inputIndex + '次输入' };
                    var item2 = { id: mat.id, content: mat.content, source: '第' + mat.inputIndex + '次输入' };
                    if (existingGroup) {
                        if (!existingGroup.some(function(d) { return d.id === m.id; })) existingGroup.push(item1);
                        if (!existingGroup.some(function(d) { return d.id === mat.id; })) existingGroup.push(item2);
                    } else {
                        duplicates.push([item1, item2]);
                    }
                }
            });
        }

        function areSimilar(s1, s2) {
            var clean1 = s1.replace(/[，,。.、/\\\s]/g, '');
            var clean2 = s2.replace(/[，,。.、/\\\s]/g, '');
            var len1 = clean1.length, len2 = clean2.length;
            if (Math.abs(len1 - len2) > 5) return false;
            var common = 0;
            for (var i = 0; i < clean1.length; i++) {
                if (clean2.indexOf(clean1[i]) !== -1) common++;
            }
            return common / Math.max(len1, len2) > 0.6;
        }

        function showTab(tab) {
            document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
            document.querySelectorAll('.content-area').forEach(function(c) { c.classList.remove('active'); });
            document.querySelector('.tab[onclick="showTab(\'' + tab + '\')"]').classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
            if (tab === 'all') renderAllMaterials();
            else if (['character', 'scene', 'foreshadow', 'idea'].indexOf(tab) !== -1) {
                var cat = tab === 'character' ? '人物' : tab === 'scene' ? '场景' : tab === 'foreshadow' ? '伏笔' : '点子';
                renderCategory(cat, 'tab-' + tab);
            } else if (tab === 'duplicate') renderDuplicates();
            else if (tab === 'correction') renderCorrections();
        }

        function filterByCategory(cat) {
            currentFilter = cat;
            document.querySelectorAll('.filter-tag').forEach(function(t) { t.classList.remove('active'); });
            document.querySelector('.filter-tag.' + (cat || 'all')).classList.add('active');
            renderAllMaterials();
        }

        function searchMaterial() {
            currentSearch = document.getElementById('search-input').value.toLowerCase();
            renderAllMaterials();
        }

        function renderAllMaterials() {
            var filtered = materials.slice();
            if (currentFilter) filtered = filtered.filter(function(m) { return m.category === currentFilter; });
            if (currentSearch) filtered = filtered.filter(function(m) { return m.content.toLowerCase().indexOf(currentSearch) !== -1; });
            document.getElementById('all-materials').innerHTML = filtered.length ? 
                filtered.map(renderMaterialItem).join('') : '<div class="empty-state">暂无素材</div>';
        }

        function renderCategory(cat, container) {
            var items = materials.filter(function(m) { return m.category === cat; });
            document.getElementById(container.replace('tab-', '') + '-materials').innerHTML = 
                items.length ? items.map(renderMaterialItem).join('') : '<div class="empty-state">暂无素材</div>';
        }

        function renderDuplicates() {
            if (!duplicates.length) {
                document.getElementById('duplicate-content').innerHTML = '<div class="empty-state">暂无疑似重复素材</div>';
                return;
            }
            var html = '';
            for (var i = 0; i < duplicates.length; i++) {
                var group = duplicates[i];
                html += '<div class="duplicate-section">';
                html += '<h3>疑似重复组 ' + (i + 1) + '</h3>';
                html += '<div class="duplicate-group">';
                for (var j = 0; j < group.length; j++) {
                    var d = group[j];
                    html += '<div class="duplicate-item">';
                    html += '<span class="duplicate-source">' + d.source + '</span>';
                    html += '<span class="duplicate-content">' + d.content + '</span>';
                    html += '<button class="btn btn-secondary btn-small" data-group="' + i + '" data-item="' + j + '">保留</button>';
                    html += '</div>';
                }
                html += '</div>';
                html += '<p style="color:#ffc107;font-size:12px;margin-top:10px;">→ 疑似同一设定，请手动判定合并或保留</p>';
                html += '</div>';
            }
            document.getElementById('duplicate-content').innerHTML = html;
            
            document.querySelectorAll('.duplicate-section button').forEach(function(btn) {
                btn.onclick = function() {
                    var groupIdx = parseInt(this.getAttribute('data-group'));
                    var itemIdx = parseInt(this.getAttribute('data-item'));
                    removeFromDuplicate(groupIdx, itemIdx);
                };
            });
        }

        function removeFromDuplicate(groupIdx, itemIdx) {
            duplicates[groupIdx].splice(itemIdx, 1);
            if (duplicates[groupIdx].length < 2) duplicates.splice(groupIdx, 1);
            renderDuplicates();
            saveData();
        }

        function renderCorrections() {
            if (!corrections.length) {
                document.getElementById('correction-content').innerHTML = '<div class="empty-state">暂无纠错提醒</div>';
                return;
            }
            var html = '';
            for (var i = 0; i < corrections.length; i++) {
                var c = corrections[i];
                html += '<div class="error-section">';
                html += '<div class="error-item">';
                html += '<div class="error-type">⚠️ ' + c.type + '</div>';
                html += '<div class="error-content">';
                html += '<div>位置：' + c.location + '</div>';
                html += '<div>问题：' + c.problem + '</div>';
                if (c.related) html += '<div>关联：' + c.related + '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }
            document.getElementById('correction-content').innerHTML = html;
        }

        function renderMaterialItem(m) {
            return '<div class="material-item">' +
                '<span class="material-tag tag-' + m.category + '">【' + m.category + '】</span>' +
                '<span class="material-content">' + m.content + (m.featureTags ? '<span class="feature-tag">[' + m.featureTags + ']</span>' : '') + '</span>' +
                '<div class="material-meta">第' + m.inputIndex + '次输入 · ' + formatDate(m.createdAt) + '</div>' +
                '<div class="material-actions">' +
                '<button class="btn-edit" onclick="editMaterial(' + m.id + ')">编辑</button>' +
                '<button class="btn-delete" onclick="deleteMaterial(' + m.id + ')">删除</button>' +
                '</div>' +
                '</div>';
        }

        function formatDate(dateStr) {
            var d = new Date(dateStr);
            return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
        }

        function editMaterial(id) {
            var m = materials.find(function(m) { return m.id === id; });
            if (!m) return;
            document.getElementById('edit-id').value = id;
            document.getElementById('edit-category').value = m.category;
            document.getElementById('edit-content').value = m.content;
            document.getElementById('edit-feature-tags').value = m.featureTags;
            document.getElementById('edit-modal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('edit-modal').classList.remove('active');
        }

        function saveEdit() {
            var id = parseInt(document.getElementById('edit-id').value);
            var m = materials.find(function(m) { return m.id === id; });
            if (!m) return;
            m.category = document.getElementById('edit-category').value;
            m.content = document.getElementById('edit-content').value;
            m.featureTags = document.getElementById('edit-feature-tags').value;
            closeModal();
            updateDisplay();
            saveData();
        }

        function deleteMaterial(id) {
            if (!confirm('确定要删除这条素材吗？')) return;
            materials = materials.filter(function(m) { return m.id !== id; });
            corrections = corrections.filter(function(c) { return c.location.indexOf(materials.find(function(m) { return m.id === id; })?.content || '') === -1; });
            duplicates = duplicates.filter(function(g) { return !g.some(function(d) { return d.id === id; }); });
            updateDisplay();
            saveData();
        }

        function clearAllData() {
            if (!confirm('确定要清空所有素材吗？此操作不可恢复！')) return;
            materials = [];
            corrections = [];
            duplicates = [];
            inputCount = 0;
            updateDisplay();
            saveData();
        }

        function exportData() {
            var data = { materials: materials, corrections: corrections, duplicates: duplicates, inputCount: inputCount };
            var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'novel-materials-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);
        }

        function updateDisplay() {
            var counts = { 
                total: materials.length,
                character: materials.filter(function(m) { return m.category === '人物'; }).length,
                scene: materials.filter(function(m) { return m.category === '场景'; }).length,
                foreshadow: materials.filter(function(m) { return m.category === '伏笔'; }).length,
                idea: materials.filter(function(m) { return m.category === '点子'; }).length,
                duplicate: duplicates.length,
                correction: corrections.length
            };
            for (var k in counts) {
                var v = counts[k];
                var statEl = document.getElementById('stat-' + k);
                var countEl = document.getElementById('count-' + k);
                if (statEl) statEl.textContent = v;
                if (countEl) countEl.textContent = v;
            }
            if (document.querySelector('.content-area.active').id === 'tab-all') renderAllMaterials();
        }

        document.addEventListener('DOMContentLoaded', loadData);
