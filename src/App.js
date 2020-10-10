import React, { useState } from "react";
import "./App.css";

import ReactEcharts from "echarts-for-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const App = () => {
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

  // 종목 값 저장
  const inputTarget = (e) => {
    const target = e.target.value;
    setInputValue(target);
  };

  // 주식종목 검색
  const submit = () => {
    const API_KEY = "HYMUUQAJ14PK7WTL";
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${inputValue}&outputsize=full&apikey=${API_KEY}`;
    // 데이터를 쪼개기 전 완전한 데이터를 아래 변수에 담는다.
    const xValuesFunction = []; // 날짜
    const xValuesClosePrice = []; // 종가
    const xValuesHighPrice = []; // 고가
    const xValuesOpenPrice = []; // 시가
    const xValuesLowPrice = []; // 저가
    const xValuesVolume = []; // 거래량

    // API 요청
    axios.get(API_Call).then(({ data }) => {
      for (var key in data["Time Series (Daily)"]) {
        xValuesFunction.unshift(key);
        xValuesClosePrice.unshift(data["Time Series (Daily)"][key]["4. close"]);
        xValuesHighPrice.unshift(data["Time Series (Daily)"][key]["2. high"]);
        xValuesOpenPrice.unshift(data["Time Series (Daily)"][key]["1. open"]);
        xValuesLowPrice.unshift(data["Time Series (Daily)"][key]["3. low"]);
        xValuesVolume.unshift(data["Time Series (Daily)"][key]["6. volume"]);
      }
      // console.log("xValuesFunction", xValuesFunction);

      // Date형식을 String 형식의 날짜로 변환하는 함수
      const getFormatDate = (date) => {
        let year = date.getFullYear();
        let month = (1 + date.getMonth());
        month = month >= 10 ? month : '0' + month;
        let day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        return year + "-" + month + "-" + day;
      }

      // startDate 변수를 스트링으로 변환하여 인덱스 위치값 반환
      const startDateString = getFormatDate(startDate);
      const startIndex = xValuesFunction.indexOf(startDateString);
      // console.log("startDateString : ", startDateString);
      // console.log("startIndex : ", startIndex);

      // endDate 변수를 스트링으로 변환하여 인덱스 위치값 반환
      const endDateString = getFormatDate(endDate);
      const endIndex = xValuesFunction.indexOf(endDateString);
      // console.log("endDateString : ", endDateString);
      // console.log("endIndex : ", endIndex);

      // 전체 배열을 시작~종료 사이의 날짜로 쪼개기
      const searchDate = xValuesFunction.slice(startIndex, endIndex + 1); // 날짜
      const searchClosePrice = xValuesClosePrice.slice(startIndex, endIndex + 1); // 종가 쪼개기
      const searchHighPrice = xValuesHighPrice.slice(startIndex, endIndex + 1); // 고가 쪼개기
      const searchOpenPrice = xValuesOpenPrice.slice(startIndex, endIndex + 1); // 시가 쪼개기
      const searchLowPrice = xValuesLowPrice.slice(startIndex, endIndex + 1); // 저가 쪼개기
      const searchVolume = xValuesVolume.slice(startIndex, endIndex + 1); // 거래량 쪼개기
      // console.log("searchDate : ", searchDate);
      console.log("searchClosePrice : ", searchClosePrice);
      // console.log("searchHighPrice : ", searchHighPrice);
      // console.log("stockInfo", stockInfo.date)

      // 종가 중 최소값 찾기
      const minArr = Math.min.apply(Math, searchClosePrice);
      const minArrClosePrice = (minArr * 0.95).toFixed(0);
      console.log("minArr : ", minArr);
      console.log("minArrClosePrice : ", minArrClosePrice);

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

  return (
    <div>
      <div className="header">
        <h1>1개 주식종목 검색(NASDAQ)</h1>
      </div>
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
          <input type="text" value={inputValue} onChange={inputTarget} onKeyPress={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }} />
          <button onClick={submit}>search</button>
        </div>
      
        <div className="chart">
          <ReactEcharts
            option={{
              title: {
                text: stockInfo.title.toUpperCase()
              },
              tooltip: {
                trigger: "axis"
              },
              xAxis: {
                type: "category",
                data: stockInfo.date
              },
              yAxis: {
                type: "value",
                min: minPrice,
              },
              legend: {
                data: ["고가", "종가", "시가", "저가"]
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
                }
              ],
            }}
          />
          <ReactEcharts
            option={{
              grid: {
                bottom: "50%"
              },
              xAxis: {
                type: "category",
                data: stockInfo.date
              },
              yAxis: {
                type: "value",
              },
              legend: {
                data: ["거래량"]
              },
              series: [

                // 거래량
                {
                  name: "거래량",
                  data: stockInfo.volume,
                  type: "bar",
                }
              ],
            }}
          />
        </div>
      </div>
      <div className="header">
        <h1>2개 주식종목 비교 검색(NASDAQ)</h1>
      </div>
    </div>
  );
};

export default App;
