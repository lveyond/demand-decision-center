let projects = JSON.parse(localStorage.getItem('pm_projects')) || [];

function calculateScore(rice, bossFactor, techDifficulty) {
    let baseRice = (rice.reach * rice.impact * (rice.confidence / 100)) / rice.effort;
    let bossMultiplier = 1 + (bossFactor - 1) * 0.5; // 老板权重每级+50%
    let techPenalty = 1 - (techDifficulty - 1) * 0.08; // 难度每级-8%
    return (baseRice * bossMultiplier * techPenalty).toFixed(2);
}

function uiAddProject() {
    const name = document.getElementById('pName').value;
    const r = parseFloat(document.getElementById('pReach').value);
    const i = parseFloat(document.getElementById('pImpact').value);
    const c = parseFloat(document.getElementById('pConf').value);
    const e = parseFloat(document.getElementById('pEffort').value);
    const b = parseInt(document.getElementById('pBoss').value);
    const t = parseInt(document.getElementById('pTech').value);

    if(!name) { alert("妈咪，需求名字还没起呢喵！"); return; }

    const score = calculateScore({reach: r, impact: i, confidence: c, effort: e}, b, t);
    projects.push({ name, score, r, i, c, e, b, t });
    projects.sort((a, b) => b.score - a.score);
    
    localStorage.setItem('pm_projects', JSON.stringify(projects));
    renderList();
    document.getElementById('pName').value = ""; // 清空
}

function renderList() {
    const listDiv = document.getElementById('projectList');
    if (projects.length === 0) {
        listDiv.innerHTML = '<p style="color: #666;">暂无需求，请从上方录入... 🐈</p>';
        return;
    }
    listDiv.innerHTML = projects.map(p => `
        <div class="project-item">
            <span class="score-tag">${p.score}</span>
            <div style="font-weight:bold; color:var(--accent);">${p.name}</div>
            <div style="font-size:12px; color:#aaa; margin-top:5px;">
                RICE: ${p.r}/${p.i}/${p.c}%/${p.e} | Boss: ${p.b} | Tech: ${p.t}
            </div>
        </div>
    `).join('');
}

// 页面加载时渲染一次
window.onload = renderList;
