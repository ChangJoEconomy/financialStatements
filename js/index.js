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
