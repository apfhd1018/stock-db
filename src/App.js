import React, { useState } from "react";
import "./App.css";

import ReactEcharts from "echarts-for-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const App = () => {
  // ==========종목 1개 검색 정보 변수===========
  const [stockInfo, setStockInfo] = useState({
    date: [],
    closePrice: [],
    highPrice: [],
    openPrice: [],
    lowPrice: [],
    volume: [],
    title: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  // ==========종목 2개 검색 정보 변수===========
  const [compareInfoFirst, setCompareInfoFirst] = useState({
    date: [],
    closePrice: [],
    highPrice: [],
    openPrice: [],
    lowPrice: [],
    volume: [],
    title: "",
  });
  const [compareInfoSecond, setCompareInfoSecond] = useState({
    date: [],
    closePrice: [],
    highPrice: [],
    openPrice: [],
    lowPrice: [],
    volume: [],
    title: "",
  });
  const [compareInputValueFirst, setCompareInputValueFirst] = useState("");
  const [compareInputValueSecond, setCompareInputValueSecond] = useState("");
  const [compareStartDate, setCompareStartDate] = useState("");
  const [compareEndDate, setCompareEndDate] = useState("");
  const [compareMinPriceFirst, setCompareMinPriceFirst] = useState("");
  const [compareMinPriceSecond, setCompareMinPriceSecond] = useState("");

  const API_KEY = "HYMUUQAJ14PK7WTL";

  const compareData = [
    `${compareInfoFirst.title} 종가`,
    `${compareInfoFirst.title} 고가`,
    `${compareInfoFirst.title} 시가`,
    `${compareInfoFirst.title} 저가`,
    `${compareInfoSecond.title} 종가`,
    `${compareInfoSecond.title} 고가`,
    `${compareInfoSecond.title} 시가`,
    `${compareInfoSecond.title} 저가`,
  ];
  const compareMin = (a, b) => {
    if (a >= b) {
      return b;
    } else if (a < b) {
      return a;
    }
  };

  // 1개 비교 종목 값 저장
  const inputTarget = (e) => {
    const target = e.target.value;
    setInputValue(target);
  };
  // 2개 비교 인풋 값 첫번째 저장
  const compareInputTargetFirst = (e) => {
    const target = e.target.value;
    setCompareInputValueFirst(target);
  };
  // 2개 비교 인풋 값 두번째 저장
  const compareInputTargetSecond = (e) => {
    const target = e.target.value;
    setCompareInputValueSecond(target);
  };
  // Date형식을 String 형식의 날짜로 변환하는 함수
  const getFormatDate = (date) => {
    let year = date.getFullYear();
    let month = 1 + date.getMonth();
    month = month >= 10 ? month : "0" + month;
    let day = date.getDate();
    day = day >= 10 ? day : "0" + day;
    return year + "-" + month + "-" + day;
  };
  // ==========================
  //   API 호출 후 변수 지정
  // ==========================
  const eventAxios = (API, startDate, endDate, setStockInfo, setMinPrice) => {
    const xValuesFunction = []; // 날짜
    const yValuesClosePrice = []; // 종가
    const yValuesHighPrice = []; // 고가
    const yValuesOpenPrice = []; // 시가
    const yValuesLowPrice = []; // 저가
    const yValuesVolume = []; // 거래량

    axios.get(API).then(({ data }) => {
      for (var key in data["Time Series (Daily)"]) {
        xValuesFunction.unshift(key);
        yValuesClosePrice.unshift(data["Time Series (Daily)"][key]["4. close"]);
        yValuesHighPrice.unshift(data["Time Series (Daily)"][key]["2. high"]);
        yValuesOpenPrice.unshift(data["Time Series (Daily)"][key]["1. open"]);
        yValuesLowPrice.unshift(data["Time Series (Daily)"][key]["3. low"]);
        yValuesVolume.unshift(data["Time Series (Daily)"][key]["6. volume"]);
      }
      // startDate 변수를 스트링으로 변환하여 인덱스 위치값 반환
      const startDateString = getFormatDate(startDate);
      const startIndex = xValuesFunction.indexOf(startDateString);
      // endDate 변수를 스트링으로 변환하여 인덱스 위치값 반환
      const endDateString = getFormatDate(endDate);
      const endIndex = xValuesFunction.indexOf(endDateString);
      // 전체 배열을 시작~종료 사이의 날짜로 쪼개기
      const searchDate = xValuesFunction.slice(startIndex, endIndex + 1); // 날짜
      const searchClosePrice = yValuesClosePrice.slice(
        startIndex,
        endIndex + 1
      ); // 종가 쪼개기
      const searchHighPrice = yValuesHighPrice.slice(startIndex, endIndex + 1); // 고가 쪼개기
      const searchOpenPrice = yValuesOpenPrice.slice(startIndex, endIndex + 1); // 시가 쪼개기
      const searchLowPrice = yValuesLowPrice.slice(startIndex, endIndex + 1); // 저가 쪼개기
      const searchVolume = yValuesVolume.slice(startIndex, endIndex + 1); // 거래량 쪼개기
      // 종가 중 최소값 찾기
      const minArr = Math.min.apply(Math, searchClosePrice);
      const minArrClosePrice = (minArr * 0.95).toFixed(0); //최소값의 95%를 차트 yAxis 최소값에 반영
      // 검색 해당되는 정보를 stockInfo에 최종 저장
      setStockInfo(() => {
        return {
          date: searchDate,
          closePrice: searchClosePrice,
          highPrice: searchHighPrice,
          openPrice: searchOpenPrice,
          lowPrice: searchLowPrice,
          volume: searchVolume,
          title: data["Meta Data"]["2. Symbol"],
        };
      });
      setMinPrice(minArrClosePrice);
    });
  };

  // ==========================
  //   1개 주식종목 검색 이벤트
  // ==========================
  const submit = () => {
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${inputValue}&outputsize=full&apikey=${API_KEY}`;

    eventAxios(API_Call, startDate, endDate, setStockInfo, setMinPrice);
  };
  // ==========================
  //   2개 주식종목 검색 이벤트
  // ==========================
  const secondSubmit = () => {
    let API_Call_First = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${compareInputValueFirst}&outputsize=full&apikey=${API_KEY}`;

    let API_Call_Second = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${compareInputValueSecond}&outputsize=full&apikey=${API_KEY}`;

    // #####첫 번째 인풋에 대한 데이터 요청
    eventAxios(
      API_Call_First,
      compareStartDate,
      compareEndDate,
      setCompareInfoFirst,
      setCompareMinPriceFirst
    );
    // #####두 번째 인풋에 대한 데이터 요청
    eventAxios(
      API_Call_Second,
      compareStartDate,
      compareEndDate,
      setCompareInfoSecond,
      setCompareMinPriceSecond
    );
    console.log("CompareMinPriceFirst : ", compareMinPriceFirst);
    console.log("CompareMinPriceSecond : ", compareMinPriceSecond);
  };

  // ======================================
  //              렌더링 영역
  // ======================================
  return (
    <div>
      <div className="header">
        <h1>1개 주식종목 검색(NASDAQ)</h1>
      </div>
      {/* ==========한개 종목 검색========== */}
      <div className="firstSearch">
        <div className="pickDate">
          <h3>조회 날짜 : </h3>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
            // isClearable
            placeholderText="시작날짜"
            startDate={startDate}
            endDate={endDate}
          />
          ~
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
            // isClearable
            placeholderText="종료날짜"
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="search">
          <h3>종목 이름 : </h3>
          <input
            type="text"
            value={inputValue}
            onChange={inputTarget}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
          <button onClick={submit}>search</button>
        </div>

        <div className="chart">
          <ReactEcharts
            option={{
              title: {
                text: stockInfo.title.toUpperCase(),
              },
              tooltip: {
                trigger: "axis",
              },
              xAxis: {
                type: "category",
                data: stockInfo.date,
              },
              yAxis: {
                type: "value",
                min: minPrice,
              },
              legend: {
                data: ["고가", "종가", "시가", "저가"],
              },
              series: [
                // 종가
                {
                  name: "종가",
                  data: stockInfo.closePrice,
                  type: "line",
                },
                // 고가
                {
                  name: "고가",
                  data: stockInfo.highPrice,
                  type: "line",
                },
                // 시가
                {
                  name: "시가",
                  data: stockInfo.openPrice,
                  type: "line",
                },
                // 저가
                {
                  name: "저가",
                  data: stockInfo.lowPrice,
                  type: "line",
                },
              ],
            }}
          />
          <ReactEcharts
            option={{
              grid: {
                bottom: "50%",
              },
              xAxis: {
                type: "category",
                data: stockInfo.date,
              },
              yAxis: {
                type: "value",
              },
              legend: {
                data: ["거래량"],
              },
              series: [
                // 거래량
                {
                  name: "거래량",
                  data: stockInfo.volume,
                  type: "bar",
                },
              ],
            }}
          />
        </div>
      </div>
      {/* ==========두개 종목 검색========== */}
      <div className="header">
        <h1>2개 주식종목 비교 검색(NASDAQ)</h1>
      </div>

      <div className="firstSearch">
        <div className="pickDate">
          <h3>조회 날짜 : </h3>
          <DatePicker
            selected={compareStartDate}
            onChange={(date) => setCompareStartDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
            // isClearable
            placeholderText="시작날짜"
            startDate={compareStartDate}
            endDate={compareEndDate}
          />
          ~
          <DatePicker
            selected={compareEndDate}
            onChange={(date) => setCompareEndDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
            // isClearable
            placeholderText="종료날짜"
            startDate={compareStartDate}
            endDate={compareEndDate}
          />
        </div>
        <div className="search">
          <h3>종목 이름 : </h3>
          <input
            type="text"
            value={compareInputValueFirst}
            onChange={compareInputTargetFirst}
          />
          <input
            type="text"
            value={compareInputValueSecond}
            onChange={compareInputTargetSecond}
          />
          <button onClick={secondSubmit}>search</button>
        </div>

        <div className="chart">
          <ReactEcharts
            option={{
              title: {
                text: `${compareInfoFirst.title.toUpperCase()}, ${compareInfoSecond.title.toUpperCase()}`,
              },
              tooltip: {
                trigger: "axis",
              },
              xAxis: {
                type: "category",
                data: compareInfoFirst.date,
              },
              yAxis: {
                type: "value",
                // min: compareMin(compareMinPriceFirst, compareMinPriceSecond),
                min: 0,
              },
              legend: {
                data: compareData,
              },
              series: [
                // First 종가
                {
                  name: compareData[0],
                  data: compareInfoFirst.closePrice,
                  type: "line",
                },
                // First 고가
                {
                  name: compareData[1],
                  data: compareInfoFirst.highPrice,
                  type: "line",
                },
                // First 시가
                {
                  name: compareData[2],
                  data: compareInfoFirst.openPrice,
                  type: "line",
                },
                // First 저가
                {
                  name: compareData[3],
                  data: compareInfoFirst.lowPrice,
                  type: "line",
                },
                // Second 종가
                {
                  name: compareData[4],
                  data: compareInfoSecond.closePrice,
                  type: "line",
                },
                // Second 고가
                {
                  name: compareData[5],
                  data: compareInfoSecond.highPrice,
                  type: "line",
                },
                // Second 시가
                {
                  name: compareData[6],
                  data: compareInfoSecond.openPrice,
                  type: "line",
                },
                // Second 저가
                {
                  name: compareData[7],
                  data: compareInfoSecond.lowPrice,
                  type: "line",
                },
              ],
            }}
          />
          <ReactEcharts
            option={{
              grid: {
                bottom: "50%",
              },
              xAxis: {
                type: "category",
                data: compareInfoFirst.date,
              },
              yAxis: {
                type: "value",
              },
              legend: {
                data: [
                  `${compareInfoFirst.title} 거래량`,
                  `${compareInfoSecond.title} 거래량`,
                ],
              },
              series: [
                // 거래량
                {
                  name: `${compareInfoFirst.title} 거래량`,
                  data: compareInfoFirst.volume,
                  type: "bar",
                },
                {
                  name: `${compareInfoSecond.title} 거래량`,
                  data: compareInfoSecond.volume,
                  type: "bar",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
