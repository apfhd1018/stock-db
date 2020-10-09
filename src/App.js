import React, { useState } from "react";
import "./App.css";

import ReactEcharts from "echarts-for-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import axios from "axios";

const App = () => {
  const [stockInfo, setStockInfo] = useState({
    date: [],
    price: [],
    title: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [selectedDate1, setSelectedDate1] = useState(null);
  // const [selectedDate2, setSelectedDate2] = useState(null);
  // const [what, setWhat] = useState("");

  // 종목 값 저장
  const inputTarget = (e) => {
    const target = e.target.value;
    setInputValue(target);
  };
  // 시작날짜 값 저장
  const startTarget = (e) => {
    setStartDate(e.target.value);
  };
  // 종료날짜 값 저장
  const endTarget = (e) => {
    setEndDate(e.target.value);
  };
  // 시작날짜 라이브러리
  // const start = (e) => {
  //   setSelectedDate1(e);
  //   setWhat(e.target.value);
  // };

  // const handleChange = (value) => {
  //   setSelectedDate1(value);
  //   console.log("selectedDate1", selectedDate1);
  // }
  // 주식종목 검색
  const submit = () => {
    const API_KEY = "HYMUUQAJ14PK7WTL";
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${inputValue}&outputsize=compact&apikey=${API_KEY}`;
    // 데이터를 쪼개기 전 데이터를 아래 변수에 담는다.
    const xValuesFunction = [];
    const yValuesFunction = [];

    // API 요청
    axios.get(API_Call).then(({ data }) => {
      for (var key in data["Time Series (Daily)"]) {
        xValuesFunction.unshift(key);
        yValuesFunction.unshift(data["Time Series (Daily)"][key]["4. close"]);
      }
      // console.log("xValuesFunction", xValuesFunction);

      // Date형식을 String 형식의 날짜로 변환하는 함수
      const getFormatDate = (date) => {
        let year = date.getFullYear();
        let month = (1 + date.getMonth());
        month = month >= 10 ? month : '0' + month;
        let day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        return  year + "-" + month + "-" + day;
      }

      // startDate 변수를 스트링으로 변환하여 인덱스 위치값 반환
      const startDateString = getFormatDate(startDate);
      const startIndex = xValuesFunction.indexOf(startDateString);
      console.log("startDateString : ", startDateString);
      console.log("startIndex : ", startIndex);
      // endDate 변수를 스트링으로 변환하여 인덱스 위치값 반환
      const endDateString = getFormatDate(endDate);
      const endIndex = xValuesFunction.indexOf(endDateString);
      console.log("endDateString : ", endDateString);
      console.log("endIndex : ", endIndex);
      // 전체 배열을 시작~종료 사이의 날짜로 쪼개기
      const searchDate = xValuesFunction.slice(startIndex, endIndex + 1); // 날짜
      const searchPrice = yValuesFunction.slice(startIndex, endIndex + 1); // 가격
      console.log("searchDate : ", searchDate);
      console.log("searchPrice : ", searchPrice);
      console.log("stockInfo", stockInfo.date)

      setStockInfo(() => {
        return {
          date: searchDate,
          price: searchPrice,
          title: data["Meta Data"]["2. Symbol"],
        };
      });
      // console.log("stockInfo : ", stockInfo);
      
    });
  };

  return (
    <div>
      <ReactEcharts
        option={{
          xAxis: {
            type: "category",
            // data: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            data: stockInfo.date
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              // data: [820, 932, 901, 934, 1290, 1330, 1320],
              data: stockInfo.price,
              type: "line",
            },
          ],
        }}
      />
      <div>
        <h1>주식정보(NASDAQ)</h1>
        <div>
          종목검색
          <input type="text" value={inputValue} onChange={inputTarget} />
        </div>
        <div>
          조회날짜
          {/* <input
            type="text"
            placeholder="xxxx-xx-xx"
            value={startDate}
            onChange={startTarget}
          />
          ~
          <input
            type="text"
            placeholder="xxxx-xx-xx"
            value={endDate}
            onChange={endTarget}
          /> */}
          (100일 전 날짜 ~ 현재 날짜 사이에서 조회 가능)
        </div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
          isClearable
          placeholderText="시작날짜"
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0}
          isClearable
          placeholderText="종료날짜"
          startDate={startDate}
          endDate={endDate}
        />
        <button onClick={submit}>search</button>
        <h2>{stockInfo.title.toUpperCase()}</h2>
        <div>
          {stockInfo.date.map((data, i) => {
            return <div key={i}>{data}</div>;
          })}
          {stockInfo.price.map((data, i) => {
            return <div key={i}>{data}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
