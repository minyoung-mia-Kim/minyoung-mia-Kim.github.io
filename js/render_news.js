function renderNews(mode = 'selected') {
  const container = document.getElementById('news-list-container');
  const btnContainer = document.getElementById('news-view-btn-container');
  if (!container) return;

  let displayData = [];
  
  // 3개 기준으로 모드 전환
  if (mode === 'selected' && newsData.length > 3) {
    displayData = newsData.slice(0, 3); // 상위 3개만
    if (btnContainer) {
      btnContainer.style.display = 'block';
      btnContainer.innerHTML = `<button onclick="renderNews('all')" class="custom-btn" style="font-size: 12px; padding: 4px 12px;">
      More News ↓
    </button>`;
    }
  } else {
    displayData = newsData;
    if (btnContainer) {
      if (newsData.length > 3) {
        btnContainer.innerHTML = `<button onclick="renderNews('selected')" class="custom-btn" style="font-size: 12px; padding: 4px 12px;">
      Close ↑
    </button>`;
      } else {
        btnContainer.style.display = 'none';
      }
    }
  }

  container.innerHTML = displayData.map(news => `
    <tr>
      <td class="news_date1">${news.month}</td>
      <td class="news_date2">${news.year}</td>
      <td class="news_details">${news.details}</td>
    </tr>
  `).join('');
}

// 초기 로드
document.addEventListener('DOMContentLoaded', () => renderNews('selected'));