// index.html 시장 정보 UI 구성
document.addEventListener("DOMContentLoaded", function() {
    fetch('./data/index_data.json') // JSON 파일 경로 수정
        .then(response => response.json())
        .then(data => {
            const indexDataContainer = document.getElementById("index_data");

            // 각 섹션 생성 함수
            const createSection = (sectionName, sectionData) => {
                const colDiv = document.createElement("div");
                colDiv.className = "col-xl-4 col-md-6";

                const cardDiv = document.createElement("div");
                cardDiv.className = "card";

                const cardBody = document.createElement("div");
                cardBody.className = "card-body";

                const title = document.createElement("h5");
                title.className = "mb-3";
                title.style.fontWeight = "bold";
                title.style.textAlign = "left";
                title.style.borderBottom = "2px solid #000";
                title.textContent = sectionName;

                cardBody.appendChild(title);

                for (const [key, value] of Object.entries(sectionData)) {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "d-flex justify-content-between align-items-center";

                    const leftDiv = document.createElement("div");
                    const strong = document.createElement("p");
                    strong.className = "mb-0";
                    strong.style.fontWeight = "bold";
                    strong.textContent = key;
                    const small = document.createElement("small");
                    small.className = "text-muted";
                    small.textContent = value.update_date;

                    leftDiv.appendChild(strong);
                    leftDiv.appendChild(small);

                    const rightDiv = document.createElement("div");
                    rightDiv.className = "text-end";
                    const valueP = document.createElement("p");
                    valueP.className = "mb-0";
                    valueP.textContent = value.latest_value;

                    const changeSpan = document.createElement("span");
                    changeSpan.style.backgroundColor = value.change_rate >= 0 ? "#ed3738": "#097df3";
                    changeSpan.style.color = "white";
                    changeSpan.style.padding = "2px 4px";
                    changeSpan.style.borderRadius = "4px";
                    changeSpan.textContent = `${value.change_rate.toFixed(2)}%`;

                    rightDiv.appendChild(valueP);
                    rightDiv.appendChild(changeSpan);

                    itemDiv.appendChild(leftDiv);
                    itemDiv.appendChild(rightDiv);

                    cardBody.appendChild(itemDiv);
                    cardBody.appendChild(document.createElement("hr"));
                }

                cardDiv.appendChild(cardBody);
                colDiv.appendChild(cardDiv);
                return colDiv;
            };

            // JSON 데이터를 기반으로 섹션 생성
            for (const [sectionName, sectionData] of Object.entries(data)) {
                const section = createSection(sectionName, sectionData);
                indexDataContainer.appendChild(section);
            }
        })
        .catch(error => console.error('Error fetching market data:', error));
});

// 검색 자동완성 코드 -----------------------------------------------------------------
// 디바운싱 유틸 함수
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 초성 검색 관련 변수 및 함수
const CHO_HANGUL = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
    'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
    'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];
const HANGUL_START_CHARCODE = '가'.charCodeAt();
const CHO_PERIOD = Math.floor('까'.charCodeAt() - '가'.charCodeAt());
const JUNG_PERIOD = Math.floor('개'.charCodeAt() - '가'.charCodeAt());

function combine(cho, jung, jong) {
    return String.fromCharCode(
        HANGUL_START_CHARCODE + cho * CHO_PERIOD + jung * JUNG_PERIOD + jong
    );
}

function makeRegexByCho(search = '') {
    const regex = CHO_HANGUL.reduce(
        (acc, cho, index) =>
            acc.replace(
                new RegExp(cho, 'g'),
                `[${combine(index, 0, 0)}-${combine(index + 1, 0, -1)}]`
            ),
        search
    );

    return new RegExp(`(${regex})`, 'g');
}

function includeByCho(search, targetWord) {
    return makeRegexByCho(search).test(targetWord);
}

// 검색 함수 (초성 검색 포함)
function searchStocks(query, data) {
    if (!query) return [];
    query = query.toLowerCase();

    const regexByCho = makeRegexByCho(query); // 정규식 캐싱

    return data.filter((item) => {
        const name = item.Name.toLowerCase();
        const code = item.Code || '';
        const symbol = item.Symbol ? item.Symbol.toLowerCase() : '';

        // 초성 검색 및 일반 검색
        return (
            name.includes(query) ||
            code.includes(query) ||
            symbol.includes(query) ||
            regexByCho.test(item.Name)
        );
    });
}

function displayResults(results, nowIndex) {
    const autocompleteDiv = document.querySelector('.autocomplete');
    autocompleteDiv.innerHTML = results
        .map(
            (result, index) =>
                `<div class="autocomplete-item d-flex align-items-center ${nowIndex === index ? 'active' : ''}" 
                     onclick="selectResult('${result.Name}', '${result.Code}', '${result.Market}')">
                    <i class="fas fa-search me-2 text-secondary"></i>
                    <div class="text-start">
                        <span class="fw-bold text-dark">${result.Name}</span>
                        <span class="text-muted ms-2">${result.Code || ''}</span>
                    </div>
                    <span class="text-muted ms-auto">${result.Market}</span>
                </div>`
        )
        .join('');
    autocompleteDiv.style.display = results.length ? 'block' : 'none';
}



// 자동완성 선택 시 동작
function selectResult(name, code, market) {
    //const searchBar = document.getElementById('search-bar');
    //searchBar.value = name; // 검색창에는 이름만 입력
    //clearResults(); // 결과 초기화

    // 선택된 이름, 종목 코드, 시장 이름으로 analysis.html로 이동
    window.location.href = `analysis.html?query=${encodeURIComponent(name)}&code=${encodeURIComponent(code)}&market=${encodeURIComponent(market)}`;
}


// 결과 초기화
function clearResults() {
    const autocompleteDiv = document.querySelector('.autocomplete');
    autocompleteDiv.innerHTML = '';
    autocompleteDiv.style.display = 'none';
}

// 이벤트 리스너 설정
fetch('./data/korea_stocks_list.json')
    .then((res) => res.json())
    .then((koreaStocks) => {
        fetch('./data/usa_stocks_list.json')
            .then((res) => res.json())
            .then((usaStocks) => {
                const data = [...koreaStocks, ...usaStocks];
                const searchBar = document.getElementById('search-bar');
                let nowIndex = 0;

                // 디바운싱 적용된 검색 함수
                const debouncedSearch = debounce((query) => {
                    const results = searchStocks(query, data).slice(0, 10); // 최대 10개 결과 제한
                    nowIndex = 0;

                    if (results.length) {
                        displayResults(results, nowIndex);
                    } else {
                        clearResults();
                    }
                }, 100);

                searchBar.addEventListener('input', (event) => {
                    const query = event.target.value.trim();
                    debouncedSearch(query);
                });

                searchBar.addEventListener('keyup', (event) => {
                    const query = searchBar.value.trim();
                    const results = searchStocks(query, data).slice(0, 10);

                    switch (event.keyCode) {
                        case 38: // UP KEY
                            nowIndex = Math.max(nowIndex - 1, 0);
                            displayResults(results, nowIndex);
                            break;

                        case 40: // DOWN KEY
                            nowIndex = Math.min(nowIndex + 1, results.length - 1);
                            displayResults(results, nowIndex);
                            break;

                        case 13: // ENTER KEY
                            if (results[nowIndex]) {
                                selectResult(results[nowIndex].Name, results[nowIndex].Code, results[nowIndex].Market);
                            }
                            nowIndex = 0;
                            break;

                        default:
                            break;
                    }
                });
            });
    });
