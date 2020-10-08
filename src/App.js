import React, { useState } from "react";
import "./App.css";

import ReactEcharts from "echarts-for-react";
import axios from "axios";

const App = () => {
  const [stockInfo, setStockInfo] = useState({
    date: [],
    price: [],
    title: "",
  });
  const [inputValue, setInputValue] = useState("");

  // 텍스트 값 저장
  const inputTarget = (e) => {
    const target = e.target.value;
    setInputValue(target);
  };
  // 주식종목 검색
  const submit = () => {
    const API_KEY = "HYMUUQAJ14PK7WTL";
    let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${inputValue}&outputsize=compact&apikey=${API_KEY}`;
    const xValuesFunction = [];
    const yValuesFunction = [];

    // API 요청
    axios.get(API_Call).then(({ data }) => {
      for (var key in data["Time Series (Daily)"]) {
        xValuesFunction.unshift(key);
        yValuesFunction.unshift(data["Time Series (Daily)"][key]["4. close"]);
      }
      // console.log("xValuesFunction", xValuesFunction);
      // console.log("yValuesFunction", yValuesFunction);
      console.log("data : ", data);
      console.log("MetaData : ", data["Meta Data"]["2. Symbol"]);
      setStockInfo(() => {
        return {
          date: xValuesFunction,
          price: yValuesFunction,
          title: data["Meta Data"]["2. Symbol"],
        };
      });
      console.log("stockInfo : ", stockInfo);
      console.log("target : ", inputValue);
    });
  };

  return (
    <div>
      <ReactEcharts
        option={{
          xAxis: {
            type: "category",
            data: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: "line",
            },
          ],
        }}
      />
      <div>
        <h1>주식정보</h1>
        <input type="text" value={inputValue} onChange={inputTarget} />
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
