// 주식 종목 설정 ------------------------------------------
// URL 파라미터 가져오기
const params = new URLSearchParams(window.location.search);
const query = params.get('query') || "Dashboard";
const code = params.get('code') || "";
const market = params.get('market') || "";

// 검색된 내용을 대체
document.addEventListener("DOMContentLoaded", () => {
    // h1 태그 변경
    const dashboardTitle = document.querySelector("h1");
    if (dashboardTitle) {
        dashboardTitle.textContent = query;
    }

    // breadcrumb 변경
    const breadcrumbItem = document.querySelector("li.breadcrumb-item.active");
    if (breadcrumbItem && code && market) {
        breadcrumbItem.textContent = `${market}: ${code}`;
    }
});
