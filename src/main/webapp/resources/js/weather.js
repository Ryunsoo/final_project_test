let getLocationTemp = async () => {
    const OPEN_WEATHER_API_KEY = '2348247efd54eca9a724c64d99b2ce0c';
    let coords = await getCoords();
 
    let params = {
          lat:coords.latitude,
          lon:coords.longitude,
          appid:OPEN_WEATHER_API_KEY,
          units:'metric',
          lang:'kr'
    };
    
    let queryString = createQueryString(params);
    let url = `https://api.openweathermap.org/data/2.5/onecall?${queryString}`;
    let tempUrl = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;
    
    let response = await fetch(url);
    let tempResponse = await fetch(tempUrl);
    
    let tempObj = await tempResponse.json();
    let obj =  await response.json();
    
    console.dir(tempObj);
    console.dir(obj);
    
    return {
       temp : obj.daily[0].temp.min,
       temp_min : obj.daily[0].temp.min,
       temp_max : obj.daily[0].temp.max,
       place : tempObj.name,
       description : obj.daily[0].weather[0].description,
       statu :  obj.daily[0].weather[0].icon,
       tempArr : obj.daily
    }
 }
 
      let createQueryString = (params) => {
       let arr = [];
       for(key in params){
          arr.push(key + '=' + params[key]);
       }
       
       return arr.join('&');   
    } 
 
 let getCoords = () => {
    if(!navigator.geolocation) {
        return new Promise((resolve,reject)=>{
           reject();
         });
    }else{
         return new Promise((resolve,reject)=>{
            navigator.geolocation.getCurrentPosition((position) => {
               resolve(position.coords);
            });
         })
     }
 }
    

(async ()=>{
    
    /* 지역과 기온 랜더링*/
   let locataionTemp = await getLocationTemp();
    document.querySelector('.location').innerHTML = `<i class="fas fa-location"></i> ` + locataionTemp.place;
    document.querySelector('.weather_temp').innerHTML = Math.floor(locataionTemp.temp) + 'º ';
   document.querySelector('.weather_statu').innerHTML = locataionTemp.description;
   document.querySelector('.weather_icon').innerHTML = `<img src = 'http://openweathermap.org/img/wn/${locataionTemp.statu}@2x.png' class="weather">`;
   document.querySelector('.weather_min').innerHTML = Math.floor(locataionTemp.temp_min) + 'º ';
   document.querySelector('.weather_max').innerHTML = Math.floor(locataionTemp.temp_max) + 'º ';
   
   let minForecastList = document.querySelectorAll('.min_forecast');
   let maxForecastList = document.querySelectorAll('.max_forecast');
   let iconForecastList = document.querySelectorAll('.forecast_icon');
   
   for(let i = 0; i < iconForecastList.length; i++){
	   iconForecastList[i].innerHTML = `<img src = 'http://openweathermap.org/img/wn/${locataionTemp.tempArr[i].weather[0].icon}@2x.png' class="weather">`
   }
   
   for(let i = 0; i < minForecastList.length; i++){
	   minForecastList[i].innerHTML = Math.floor(locataionTemp.tempArr[i].temp.min) + 'º ';
   }
   
   for(let i = 0; i < maxForecastList.length; i++){
	   maxForecastList[i].innerHTML = Math.floor(locataionTemp.tempArr[i].temp.max) + 'º ';
   }
   
   let chartTemp = locataionTemp.tempArr;
   
   var chart = c3.generate({
	    size: {
	    	width: 1100,
	    	height: 200
	    },
	    data: {
	        columns: [
	            ['min', Math.floor(chartTemp[0].temp.min), Math.floor(chartTemp[1].temp.min), Math.floor(chartTemp[2].temp.min), Math.floor(chartTemp[3].temp.min)
	            	, Math.floor(chartTemp[4].temp.min), Math.floor(chartTemp[5].temp.min), Math.floor(chartTemp[6].temp.min)],
	            ['max', Math.floor(chartTemp[0].temp.max), Math.floor(chartTemp[1].temp.max), Math.floor(chartTemp[2].temp.max), Math.floor(chartTemp[3].temp.max)
	            	, Math.floor(chartTemp[4].temp.max), Math.floor(chartTemp[5].temp.max), Math.floor(chartTemp[6].temp.max)]
	        ],
	        labels: true
	    },
	    color: {
	    	pattern: ['#1f77b4', '#ff7f0e']
	    }
	});

 
 })();