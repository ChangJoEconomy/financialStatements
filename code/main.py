from getIndexInfo import get_index_info
from getStockList import get_stocks_list

def main():
    print("index 정보 불러오는 중...")
    get_index_info()
    print("주식 리스트 불러오는 중...")
    get_stocks_list()

if __name__ == "__main__":
    main()
