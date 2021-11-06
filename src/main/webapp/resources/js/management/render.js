let getSchedule = async () => {
	let response = await fetch('/schedule/get-schedule');
	let datas = await response.json();
	return datas;
};

let scheduleArray;

(async () => {
	
	scheduleArray =  await getSchedule();
	var prevSelected = undefined;
	var standardDate = new Date(); /* 일정 날짜로 선택된 날짜 */
	var scheduleDate; /* standard 날짜의 셀 */
    var localeSelectorEl = document.getElementById('locale-selector');
    var calendarEl = document.getElementById('calendar');
	let originColor = undefined;
	
	if(!document.querySelector('.select_menu')) {
		/*입력폼에서 standart-date에 값 없으면 달력 안띄워짐*/
		standardDate = document.querySelector('.standard_date').value;
	}
	
    var calendar = new FullCalendar.Calendar(calendarEl, {
		
	  initialDate: standardDate,
		
	  headerToolbar: {
        left: 'today',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
      },
      titleFormat: {
    	year: 'numeric',
    	month: 'long'
      },
      buttonText: {
    	today: 'today'  
      },
      dayMaxEvents: true, // allow "more" link when too many events
	  
	  dateClick: function(info) {
		if(prevSelected) {
			prevSelected.style.backgroundColor = '';
			if(standardDate != Date.now() && info.dayEl.dataset.date == standardDate) {
				return;
			}
		}
		prevSelected = info.dayEl
		info.dayEl.style.backgroundColor = '#c9d7e8';
	  },
	  eventMouseEnter: function(info) {
		originColor = info.el.style.backgroundColor;
		info.el.style.backgroundColor = 'grey';
	  },
	  eventMouseLeave: function(info) {
		info.el.style.backgroundColor = originColor;
	  },
	  eventClick: function(info) {
		scheduleClick(info.event);
	  },
	  initialEvents: scheduleArray,
      events: []
    });
    calendar.render();

	rendEventToTable(scheduleArray);
	
	if(!document.querySelector('.select_menu')) {
		document.querySelectorAll('.fc-scrollgrid-sync-table>tbody>tr').forEach(e => {
			e.childNodes.forEach(cell => {
				if(cell.dataset.date == standardDate) {
					scheduleDate = cell;
					scheduleDate.style.backgroundColor = '#ffb3b3';
				}
			})
		})
	}
	
	document.querySelector('.fc-scrollgrid-sync-table>tbody').addEventListener('dblclick', e => {
		/* 일정등록 선택 화면 뿌리기 */
		if(e.target.className == 'fc-event-title fc-sticky') return;
		if(e.target.className == 'fc-event-title-container') return;
		if(document.querySelector('.select_menu')) {
			document.querySelector('.select_menu').style.display = 'initial';
		
			document.querySelector('.select_menu').addEventListener('click', e => {
				if(e.target.className == 'top_menu' || e.target.className == 'bottom_menu'){
					document.querySelector('.select_menu').style.display = 'none';
				};
			});
			let doubleClickedDate = prevSelected.dataset.date;
			document.querySelectorAll('.btn_desc').forEach(e => {
				e.href = e.href.split('?')[0];
				e.href += '?date=' + doubleClickedDate;
			})
		}
	});
	
	
	/*document.querySelector('.fc-button-group').addEventListener('click', e => {
		console.dir(e);
		console.dir(scheduleDate.style.backgroundColor);
		scheduleDate.style.backgroundColor = '#ff6666';
	});*/
})();

let scheduleClick = async (event) => {
	if(!document.querySelector('.select_menu')) return; //메인화면이 아니면 바로 return;
	
	let kind = event.extendedProps.kind;
	if(kind == 'medical') {
		rendMedicalToTable(event);
	}else if(kind == 'prescription') {
		rendPrescriptionToTable(event);
	}else {
		rendVisitToTable(event);
	}
}


let rendMedicalToTable = async (event) => {
	let historyId = event.id;
	let response = await fetch('/schedule/get-medical?historyId=' + historyId);
	let datas = await response.json();
	document.querySelector('.schedule_table>tbody').innerHTML = '';
	
	let date = document.createElement('td');
	date.innerHTML = '<label>진료 날짜 : <input type="date" value=' + datas.schedule_date + ' readonly></label>';
	
	let hospital = document.createElement('td');
	hospital.innerHTML = "<label>진료 병원 : <a href='/searchHospital/search-hospital?input=" + datas.hospital + "&hospCode=" + datas.hospCode + "'>" + datas.hospital + "</a></label>";
	//hospital.innerHTML = '<label>진료 병원 : <input type="text" value=' + datas.hospital + ' readonly></label>';
	
	document.querySelector('.schedule_table>tbody').append(date);
	document.querySelector('.schedule_table>tbody').append(hospital);
	document.querySelector('.edit').href = document.querySelector('.edit').href.split('schedule-edit')[0];
	document.querySelector('.edit').href += 'schedule-edit/medical';
	document.querySelector('.action_icons').style.visibility = 'visible';
}

let rendPrescriptionToTable = async (event) => {
	let prescriptionId = event.id;
	let response = await fetch('/schedule/get-prescription?prescriptionId=' + prescriptionId);
	let datas = await response.json();
	let tbody = document.querySelector('.schedule_table>tbody');
	tbody.innerHTML = '';
	
	let start = document.createElement('td');
	start.innerHTML = '<label>복용 시작일 : <input type="date" value=' + datas.start + ' readonly></label>';
	
	let end = document.createElement('td');
	end.innerHTML = '<label>복용 종료일 : <input type="date" value=' + datas.end + ' readonly></label>';
	
	let pharm = document.createElement('td');
	pharm.innerHTML = '<label>처방 약국 : </label>';
	
	let mediTitle = document.createElement('td');
	mediTitle.innerHTML = '<label>처방 약 : </label>';
	
	tbody.append(start);
	tbody.append(end);
	
	if(datas.pharmName) {
		pharm.innerHTML = "<label>처방 약국 : <a href='/pharmacy/byname?byname=" + datas.pharmName + "&pharmCode=" + datas.pharmCode + "'>" + datas.pharmName + "</a></label>";
		//pharm.innerHTML = '<label>처방 약국 : <input type="text" value=' + datas.pharm + ' readonly></label>';
	}
	
	tbody.append(pharm);
	tbody.append(mediTitle);
	
	if(datas.medicineList) {
		let mediTd = document.createElement('td');
		let mediDiv = document.createElement('span');
		mediDiv.style.display = 'flex';
		mediDiv.style.flexWrap = 'wrap';
		
		let medicineList = datas.medicineList;
		console.dir(medicineList);
		medicineList.forEach(e => {
			mediDiv.innerHTML += "<span><a href='/Medicine/medicineInfo?medName=" + e + "'>" + e + "</a></span>"
		})
		mediTd.append(mediDiv);
		tbody.append(mediTd);
	}
	
	let times = document.createElement('td');
	times.innerHTML = "<label>1일 복용 횟수 : <input type='number' style='width:40px' value=" + datas.timesPerDay + " readonly> 회</label>";
	tbody.append(times);
	
	if(datas.doseTime) {
		datas.doseTime.forEach(time => {
			let timeTd = document.createElement('td');
			timeTd.innerHTML = '<label><input type="time" value=' + time + ' readonly></label>';
			tbody.append(timeTd);
		})
	}
	
	document.querySelector('.edit').href = document.querySelector('.edit').href.split('schedule-edit')[0];
	document.querySelector('.edit').href += 'schedule-edit/prescription?edit=1';
	document.querySelector('.action_icons').style.visibility = 'visible';
}

let rendVisitToTable = async (event) => {
	let visitNoticeCode = event.id;
	let response = await fetch('/schedule/get-visit?visitNoticeCode=' + visitNoticeCode);
	let datas = await response.json();
	document.querySelector('.schedule_table>tbody').innerHTML = '';
	
	let date = document.createElement('td');
	date.innerHTML = '<label>알림 날짜 : <input type="date" value=' + datas.notice_date + ' readonly></label>';
	
	let hospital = document.createElement('td');
	hospital.innerHTML = '<label>진료 병원 : </label>';
	if(datas.hospital) {
		hospital.innerHTML = "<label>진료 병원 : <a href='/searchHospital/search-hospital?input=" + datas.hospital + "&hospCode=" + datas.hospCode + "'>" + datas.hospital + "</a></label>";
	}
	
	let time = document.createElement('td');
	time.innerHTML = '<label>알림 시간 : <input type="time" value=' + datas.notice_time + ' readonly></label>';
	
	document.querySelector('.schedule_table>tbody').append(date);
	document.querySelector('.schedule_table>tbody').append(hospital);
	document.querySelector('.schedule_table>tbody').append(time);
	document.querySelector('.edit').href = document.querySelector('.edit').href.split('schedule-edit')[0];
	document.querySelector('.edit').href += 'schedule-edit/visit?edit=1';
	document.querySelector('.action_icons').style.visibility = 'visible';
}

var rendScheduleTable = function () {
	document.querySelector('.action_icons').style.visibility = 'hidden';
	rendEventToTable(scheduleArray);
}

let rendEventToTable = function (scheduleArray) {
	if(!document.querySelector('.select_menu')) return; //메인화면이 아니면 바로 return;
	
	currentSchedule = getSortedCurrentEvents(scheduleArray);
	document.querySelector('.schedule_table>tbody').innerHTML = '';
	
	if(currentSchedule.length == 0) {
		let th = document.createElement('th');
		th.innerHTML = "등록된 일정이 없습니다.<br><i style='font-size: 12px'>날짜를 더블클릭하여 일정 및 알림을 등록해보세요.</i>";
		document.querySelector('.schedule_table>tbody').appendChild(th);
		return;
	}
	
	currentSchedule.forEach(element => {
		let td = document.createElement('td');
		td.innerHTML = "<div style='background-color: " + element.backgroundColor + "'></div>";
		let text = document.createTextNode(element.start.substring(8, 10) + '일 ' + element.title);
		
		td.appendChild(text);
		document.querySelector('.schedule_table>tbody').appendChild(td);
		
	})
}

let getSortedCurrentEvents = function(scheduleArray) {
	let current = document.querySelector('.schedule_table>thead>tr>th').innerHTML;
	let curYear = current.substring(0, 4);
	let curMonth = current.substring(6, 8);
	
	let currentSchedule = scheduleArray.filter((element) => {
		let year = element.start.substring(0, 4);
		let month = element.start.substring(5, 7);
		if(year == curYear && month == curMonth) {
			return true;
		}
		return false;
	});
	
	currentSchedule.sort((a, b)=>{
		let aDate = new Date(a.start.substring(0, 10));
		let bDate = new Date(b.start.substring(0, 10));
		return aDate - bDate 
	})
	return currentSchedule;
}

let addMedicineNotice = function() {
	let times = document.querySelector('input[type=number]').value;
	let timeInp = document.createElement('label');
	timeInp.innerHTML = "<input type='time' class='time' name='dose_notice' required> ";
	
	let trashIcon = document.createElement('i');
	trashIcon.className = 'fas fa-trash';
	
	trashIcon.addEventListener('click', (e) => {
		document.querySelector('input[type=number]').value -= 1;
		e.target.parentElement.remove();
	})
	
	timeInp.appendChild(trashIcon);
	
	if(times < 24) {
		document.querySelector('input[type=number]').value = times - 1 + 2;
	}
	
	document.querySelector('.input_form').appendChild(timeInp);
	
};

let addVisitNotice = function(e) {
	let today = new Date();
	let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
	let yyyy = tomorrow.getFullYear();
	let mm = tomorrow.getMonth()+1;
	let dd = tomorrow.getDate();
	
	if(dd < 10) dd = '0' + dd;
	if(mm < 10) mm = '0' + mm;
	
	let minDate = yyyy + '-' + mm + '-' + dd + 'T00:00';
	
	let dateTimeInp = document.createElement('label');
	dateTimeInp.innerHTML = "<input type='datetime-local' class='dateTime' name='visit_notice_date' min='" + minDate + "' required> ";
	
	let trashIcon = document.createElement('i');
	trashIcon.className = 'fas fa-trash';
	
	trashIcon.addEventListener('click', (e) => {
		e.target.parentElement.remove();
	})
	
	dateTimeInp.appendChild(trashIcon);
	
	document.querySelector('.added-notice').appendChild(dateTimeInp);
	
};

