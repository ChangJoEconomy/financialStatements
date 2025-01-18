import FinanceDataReader as fdr
import json

def get_latest_json(dataframe, value_column="Close"):
    latest_row = dataframe.iloc[-1]  # 가장 마지막 데이터
    previous_row = dataframe.iloc[-2]  # 바로 이전 데이터
    result = {
        "update_date": dataframe.index.max().strftime('%Y-%m-%d'),  # 문자열로 변환
        "latest_value": round(latest_row[value_column], 2),
        "change_rate": round((latest_row[value_column] - previous_row[value_column]) / previous_row[value_column] * 100, 2)
    }
    return result

def get_index_info():
    # 데이터 수집 시작 년도
    start_year = "2024"

    # 국내/외 지수
    kospi = fdr.DataReader("KS11", start_year) # 코스피
    kosdaq = fdr.DataReader("KQ11", start_year) # 코스닥
    ks200 = fdr.DataReader("KS200", start_year) # 코스피200
    dowjonse = fdr.DataReader("DJI", start_year) # 다우존스
    nasdaq = fdr.DataReader("IXIC", start_year) # 나스닥
    snp = fdr.DataReader("US500", start_year) # S&P 500

    # 원달러 환율
    us_krw = fdr.DataReader('USD/KRW', start_year) # 달러 원 환율
    jpy_krw = fdr.DataReader('JPY/KRW', start_year) # 엔화 원 환율
    eur_krw = fdr.DataReader('EUR/KRW', start_year) # 유료화 원 환율

    # 데이터를 분류하여 저장
    result = {
        "한국": {
            "코스피": get_latest_json(kospi),
            "코스닥": get_latest_json(kosdaq),
            "코스피 200": get_latest_json(ks200)
        },
        "미국": {
            "다우존스": get_latest_json(dowjonse),
            "나스닥": get_latest_json(nasdaq),
            "S&P 500": get_latest_json(snp)
        },
        "환율": {
            "USD/KRW": get_latest_json(us_krw),
            "JPY/KRW": get_latest_json(jpy_krw),
            "EUR/KRW": get_latest_json(eur_krw)
        }
    }

    # 파일 저장
    output_path = "data/index_data.json"
    with open(output_path, "w", encoding="utf-8") as json_file:
        json.dump(result, json_file, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    get_index_info()