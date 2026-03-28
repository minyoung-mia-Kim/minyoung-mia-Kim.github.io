// 1. 설정 및 데이터 맵 (가장 상단에 위치시켜 어디서든 참조 가능하게 함)
const VENUE_PRIORITY = {
  "top": 1,
  "conference": 2,
  "journal": 3,
  "workshop": 4,
  "others": 5
};

const VENUE_TITLES = {
  "top": "ACM SIGGRAPH / CHI",
  "conference": "Conferences",
  "journal": "Journals",
  "workshop": "Workshops",
  "others": "Others"
};

function formatAuthors(authorStr) {
  if (!authorStr) return "";
  
  if (typeof authorLinks === 'undefined') {
    return authorStr; 
  }

  // 1. " and "를 ", "로 변환 (저자가 2명일 때나 마지막 저자 앞의 and 처리)
  // 2. 쉼표(,)를 기준으로 나누기
  return authorStr.replace(/\band\b/g, ',').split(',').map(name => {
    // 앞뒤 공백 및 특수 공백 제거
    const cleanName = name.replace(/\*/g, '').replace(/\u00a0/g, ' ').trim();
    
    // 빈 문자열이면 건너뜀 (쉼표가 연속으로 있을 경우 대비)
    if (!cleanName) return null;

    const url = authorLinks[cleanName];
    
    // 본인 이름 강조 (Minyoung Kim)
    let displayName = cleanName.includes("Minyoung Kim") ? `<strong>${cleanName}</strong>` : cleanName;
    
    // 링크가 있으면 a 태그, 없으면 이름만
    if (url && url !== "#") {
      return `<a href="${url}" target="_blank" class="author-link">${displayName}</a>`;
    }
    return displayName;
  }).filter(n => n !== null).join(', '); // null 제거 후 다시 쉼표로 연결
}
/**
 * 메인 렌더링 함수
 */
function renderPapers(mode = 'selected') {
  const container = document.getElementById('paper-list-container');
  const viewAllBtnContainer = document.getElementById('view-all-btn-container');
  
  if (!container) return;
  if (typeof paperData === 'undefined' || !paperData.length) return;

  let displayData = [];
  let showTitles = false;

  // --- 모드 설정 및 데이터 정렬 ---
  if (mode === 'selected' && paperData.length > 4) {
    displayData = paperData
      .filter(p => p.selected)
      .sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    
    showTitles = false;
    
    if (viewAllBtnContainer) {
      viewAllBtnContainer.style.display = 'block';
      viewAllBtnContainer.innerHTML = `
    <button onclick="renderPapers('all')" class="custom-btn">
      View All Publications ↓
    </button>
  `;
    }
  } else {
    // 'all' 모드이거나 논문이 4개 이하일 때
    displayData = [...paperData].sort((a, b) => {
      const tierA = VENUE_PRIORITY[a.venue_type] || 99;
      const tierB = VENUE_PRIORITY[b.venue_type] || 99;
      if (tierA !== tierB) return tierA - tierB;
      return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
    });

    showTitles = true;

    if (viewAllBtnContainer) {
      if (paperData.length > 4) {
        viewAllBtnContainer.style.display = 'block';
          viewAllBtnContainer.innerHTML = `
    <button onclick="renderPapers('selected')" class="custom-btn">
      Show Selected Only ↑
    </button>
  `;
      } else {
        viewAllBtnContainer.style.display = 'none';
      }
    }
  }

  // --- HTML 생성 ---
  let finalHtml = "";
  let lastVenueType = null;

displayData.forEach(paper => {
    // 섹션 타이틀 추가 (View All 모드일 때만)
    if (showTitles && paper.venue_type !== lastVenueType) {
      const title = VENUE_TITLES[paper.venue_type] || "Publications";
      
      // 요청하신 News 섹션 디자인 스타일 적용
      finalHtml += `
        <tr>
          <td colspan="2" style="padding: 20px 0px 10px 0px; width: 100%; vertical-align: middle;">
            <table style="width:100%; border:0px; border-spacing:0px; border-collapse:separate; margin-right:auto; margin-left:auto;">
              <tbody>
                <tr>
                  <td style="padding:0px 20px 10px 20px; width:100%; vertical-align:middle;">
                    <heading>${title}</heading>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      `;
      lastVenueType = paper.venue_type;
    }

    // ⭐️ 매 루프마다 저자 포맷팅 실행
    const formattedAuthors = formatAuthors(paper.author);
    const topics = paper.topics || ['all'];
    // 1. 현재 연도 가져오기 (현재 2026년 기준)
    const currentYear = new Date().getFullYear();
    
    // 2. 최근 1년 이내(작년~올해) 논문인지 판정
    const isRecent = (parseInt(paper.year) >= currentYear - 1); 

    // 3. 배지 생성 (데이터에 isNew: true가 있거나 최근 논문이면 표시)
    const isNewBadge = (paper.isNew || isRecent) ? `<span class="new-badge">NEW</span>` : "";

finalHtml += `
  <tr class="paper_entry" data-year="${paper.year}" data-topic="${topics.join(' ')}">
    <td class="paper_tb">
      <img src="${paper.teaser}" alt="teaser" class="fade">
    </td>
    <td class="paper_details">
      <a target="_blank" href="${paper.url || '#'}">
        <papertitle>${paper.name}</papertitle>
      </a>${isNewBadge}<br>
      
      <span class="author-list">${formattedAuthors}</span><br>
      
      <div style="margin: 5px 0;">
        <strong>[${paper.booktitle} ${paper.year}]</strong>
      </div>
      
      <div class="links" style="font-size: 0.95em;">
        ${paper.url && paper.url !== "#" ? `<a href="${paper.url}" target="_blank">Project</a>` : ""} 
        ${paper.paper && paper.paper !== "#" ? `| <a href="${paper.paper}" target="_blank">Paper</a>` : ""} 
        ${paper.supp && paper.supp !== "#" ? `| <a href="${paper.supp}" target="_blank">Supp</a>` : ""}
        ${paper.video && paper.video !== "#" ? `| <a href="${paper.video}" target="_blank">Video</a>` : ""} 
        ${paper.code && paper.code !== "#" ? `| <a href="${paper.code}" target="_blank">Code</a>` : ""} 
      </div>
      <div style="margin-top:8px;">
        ${topics.filter(t => t !== 'all').map(t => `<div class="topic-circle ${t}-color"></div>`).join('')}
      </div>
    </td>
  </tr>`;
  });

  container.innerHTML = finalHtml;

  if (mode === 'selected' && window.scrollY > container.offsetTop) {
    window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
  }
}

// 초기 로드 실행
document.addEventListener('DOMContentLoaded', () => {
  renderPapers('all');
});