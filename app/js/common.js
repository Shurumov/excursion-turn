var sessionId, apiUrl, projectName, userId, selected, listExcursion, language;
var maxParticipant = 45;

function getList(){
	var url = apiUrl + "/objects/Excursion?include=['userId','group']&take=-1";

	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("X-Appercode-Session-Token", sessionId);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) 
			return;
		if (xhr.status == 401) {
			console.log("не удалось получить данные");
		} else if (xhr.status == 200) {
			try {
				response = JSON.parse(xhr.responseText);
				listExcursion = response;
				
				if (listExcursion.some(checkParticipation)){
					congratulations()
				}

				calculateFreePlace()

			} catch (err) {
				console.log('Ошибка при парсинге ответа сервера.');
			}
		}
	};
}

function postExcursion() {
	var url = apiUrl + "/objects/Excursion";
	var xhr = new XMLHttpRequest();
	var selectedGroup = document.querySelector(":checked").value;
	var reqBody = {
		userId: userId,
		group: selectedGroup
	};

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("X-Appercode-Session-Token", sessionId);
	xhr.onreadystatechange = function () {
		if (xhr.readyState !== 4)
			return;
		if (xhr.status !== 200) {
			console.log(xhr.status + ': ' + xhr.statusText);
		} else {
			congratulations();
		}
	};
	xhr.send(JSON.stringify(reqBody));
}

function sessionFromNative(jsonStr) {
	var params;
	try {
		params = JSON.parse(jsonStr);	
	} catch (err) {
		console.log('Ошибка при парсинге JSON');
	}
	sessionId = params.sessionId;
	apiUrl = params.baseUrl + params.projectName;
	projectName = params.projectName;
	userId = +params.userId;
	language = params.language;
	localizeInterface();
	getList();
}

function localizeInterface() {
	if (language == "en"){
		document.querySelector("#p1").innerHTML = "Dear Participants of the Forum! You have a unique opportunity to visit the Russian ski jumping Championship. Specially for you the excursion to Krasnaya Polyana will be organized. The program includes a tour of the Russian Ski jumping complex and participation in a fan club of the competitions.";
		document.querySelector("#p2").innerHTML = "Excursion is optional. Registration of participants is completed after the group has 45 people. You can sign up for the tour, in the Horizons application through the More tab, choosing a suitable date and time.";
		document.querySelector("label[for=excursion1]").innerHTML ="1st group - October 6, departure at 2pm, return at 6pm";
		document.querySelector("label[for=excursion2]").innerHTML ="2nd group - October 7, departure at 1pm, return at 5pm";
		document.querySelector("label[for=excursion3]").innerHTML ="3rd group - October 7, departure at 2pm, return at 7pm.";
		document.querySelector(".welcome").innerHTML = "You have successfully registered";
		document.querySelector("button").innerHTML = "Register"
	}
}

function activateButton(){
	var selectedGroup = document.querySelector(":checked").value;
	var count = 0;
	listExcursion.forEach( item => {
		if (item.group == selectedGroup){
			count++;
		}
	});
	if (count < maxParticipant){
		document.querySelector("button").disabled = false;
	} else {
		document.querySelector("button").disabled = true;
	}
}

function ready() {
	document.querySelector('form').addEventListener('submit', function(e){
		e.preventDefault();
		postExcursion()
	});

}

function congratulations() {
	document.querySelector(".welcome").hidden = false;
	document.querySelectorAll("input").forEach( item => {
		item.disabled = true;
	});
	document.querySelector("button").disabled = true;
}

function checkParticipation(item) {
	return item.userId == userId
}

function calculateFreePlace(){
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var input1 = document.querySelector("#excursion1");
	var input2 = document.querySelector("#excursion2");
	var input3 = document.querySelector("#excursion3");

	listExcursion.forEach( item => {
		if (item.group == input1.value){
			count1++;
		}
		if (item.group == input2.value){
			count2++;
		}
		if (item.group == input3.value){
			count3++;
		}
	});
	
	if( count1 >= maxParticipant ){
		if (language != "en"){
			document.querySelector('label[for="excursion1"]').innerHTML = "1-ая группа - 6 октября выезд в 14.00, возвращение в 18.00 (мест нет)";
		} else {
			document.querySelector('label[for="excursion1"]').innerHTML = "1st group - October 6, departure at 2pm, return at 6pm (group is full)";
		}
		input1.disabled = true;
	}

	if( count2 >= maxParticipant ){
		if (language != "en"){
			document.querySelector('label[for="excursion2"]').innerHTML = "2-ая группа - 7 октября выезд в 13.00, возвращение в 17.00 (мест нет)";
		} else {
			document.querySelector('label[for="excursion1"]').innerHTML = "2nd group - October 7, departure at 1pm, return at 5pm (group is full)";
		}
		
		input2.disabled = true;
	}

	if( count3 >= maxParticipant ){
		if (language != "en"){
			document.querySelector('label[for="excursion3"]').innerHTML = "3-я группа - 7 октября выезд в 14.00, возвращение в 19.00 (мест нет)";
		} else {
			document.querySelector('label[for="excursion1"]').innerHTML = "3rd - October 7, departure at 2pm, return at 7pm (group is full)";
		}
		
		input3.disabled = true;
	}

}

document.addEventListener("DOMContentLoaded", ready);


sessionFromNative('{"sessionId":"e9986f43-1157-41ee-80e9-887f1eda0e0f","userId":"90","language": "en","projectName": "tmk","baseUrl":"https://api.appercode.com/v1/","refreshToken":"1"}');
