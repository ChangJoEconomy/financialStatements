import FinanceDataReader as fdr
import pandas as pd
import json

def get_korea_stocks():
    # 코스피 + 코스닥 + 코넥스 목록들 불러오기
    stocks_krx = fdr.StockListing('KRX')
    filtered_stocks_krx = stocks_krx[["Name", "Code", "Market"]]
    json_data = filtered_stocks_krx.to_dict(orient="records")

    # json 저장
    output_path = "data/korea_stocks_list.json"
    with open(output_path, "w", encoding="utf-8") as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)

def get_usa_stocks():
    # S&P500, NASDAQ, NYSE 데이터를 모두 불러오기
    markets = ["S&P500", "NASDAQ", "NYSE"]
    all_stocks = []

    for market in markets:
        stocks = fdr.StockListing(market)
        stocks["Market"] = market  # 각 데이터에 시장 이름 추가
        stocks = stocks[["Name", "Symbol", "Market"]]
        all_stocks.append(stocks)

    # 데이터 합치기
    stocks_usa = pd.concat(all_stocks, ignore_index=True)

    # JSON으로 변환
    json_data = stocks_usa.to_dict(orient="records")

    # JSON 파일로 저장
    output_path = "data/usa_stocks_list.json"
    with open(output_path, "w", encoding="utf-8") as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)

def get_stocks_list():
    get_korea_stocks()
    get_usa_stocks()

if __name__ == "__main__":
    get_stocks_list()