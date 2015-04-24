var stopwatch;
var runningstate = 0; 
var stoptime = 0;
var lapcounter = 0;
var currenttime;
var lapdate = '';
var lapdetails;
var c = 0;
var t_array = [];
var v_array = [];
var chart_data = [];
var options_g;
var tau_g;
var time_g;
var v_g;
var count_times = 0;
	
function update_tau() {
	var tau = document.getElementById("tau");
	tau.innerHTML = '';
	var r = document.getElementById("res").value;
	var c = (document.getElementById("cap").value)/1000000;

	var result_tau = r*c;

	tau.innerHTML += 'τ = ';
	tau.innerHTML += result_tau;
	tau.innerHTML += ' s';

	tau_g = result_tau;
}

function timecounter(starttime) {
	currentdate = new Date();
	lapdetails = document.getElementById('lapdetails');
	stopwatch = document.getElementById('stopwatch');
	
	var timediff = currentdate.getTime() - starttime;
	
	if(runningstate == 0) {
		timediff = timediff + stoptime
	}
	
	if(runningstate == 1) {
		stopwatch.value = formattedtime(timediff);
		refresh = setTimeout('timecounter(' + starttime + ');',10);
	}
	else {
		window.clearTimeout(refresh);
		stoptime = timediff;
	}
}
	
function marklap() {
	lapdetails.value = '';
	if(runningstate == 1) { 
		lapdate = stopwatch.value;
		lapdetails.value += stopwatch.value;
		
		var t = lapdetails.value;

		if (count_times < v_g-1) {
			timeColumn = document.createElement("td");
			timeValue = document.createTextNode(t);
			timeColumn.appendChild(timeValue);
			document.getElementById("timeTitle").appendChild(timeColumn);
		
			t_array.push(lapdetails.value);
			t_array[c] = parseFloat(t_array[c]);
			c++;
			count_times++;
		}

		lapdetails.value = '';
	}
	time_g = t_array[c];
}
		
function startandstop() {
	var startandstop = document.getElementById('startandstopbutton');
	var startdate = new Date();
	var starttime = startdate.getTime();

	if (runningstate == 0) {
		startandstop.value = 'Stop';
		runningstate = 1;
		timecounter(starttime);
	}
	else {
		startandstop.value = 'Start';
		runningstate = 0;
			lapdate = '';
	}
}

function resetstopwatch() {
	lapdetails.value = '';
	lapcounter = 0;
	stoptime = 0;
	lapdate = '';

	window.clearTimeout(refresh);

	if(runningstate == 1) {
		var resetdate = new Date();
		var resettime = resetdate.getTime();
		timecounter(resettime);
	}
	else {
		stopwatch.value = "0.0";
		var list = document.getElementById("timeTitle");
		while (list.hasChildNodes()) list.removeChild(list.firstChild);
	}
}

	function formattedtime(unformattedtime) {

	var decisec = Math.floor(unformattedtime/100) + '';
	var second = Math.floor(unformattedtime/1000);
	var minute = Math.floor(unformattedtime/60000);
	decisec = decisec.charAt(decisec.length - 1);
	return second + '.' + decisec;
}


function updateVoltageTable() {
	var v = parseFloat(document.getElementById("v").value);
	v_g = v;
	var v_paragraph = document.getElementById("v_paragraph");
	v_paragraph.innerHTML = '';

	for (var i = 0; i < v; i++) 
		v_array.push(i);

	v_paragraph.innerHTML += 'E = ';
	v_paragraph.innerHTML += v;
	v_paragraph.innerHTML += ' V';

}

function resetTableVoltage() {
	var list = document.getElementById("voltageTitle");
	while (list.hasChildNodes()) list.removeChild(list.firstChild);
}


function drawChart() {
	var chart_data = new google.visualization.DataTable();
	var valores_volt = [];

	chart_data.addColumn('number', 'Times');
	chart_data.addColumn('number', 'Voltage');
	chart_data.addColumn('number', 'Voltage');

	j = v_g-1;
	chart_data.addRow([0, 0, j]);
	for (var i = 0; i < t_array.length+1; i++) {
		chart_data.addRow([t_array[i], v_array[i+1], v_array[j-1]]);
		j--;
	}

	var options = {
		title: 'Capacitor Charge / Discharge',
		curveType: 'function',
		smoothLine: true,
		width: 500,
		height: 300,
		legend: 'none',
		
		series: {
			0: { color: '#004c99' },
			1: { color: '#ff6666' }
		},
		
		vAxis: {
				title: "E (V)",
				viewWindow: { min: 0, max: v_g },
		},
		
		hAxis: {
				title: "t (s)", 
				viewWindowMode:'explicit',
				viewWindow: { min: 0, max: time_g }
    	  		},
		pointSize: 3.7,
	}; 

	//var chart = new google.visualization.AreaChart(document.getElementById('curve_chart'));
	var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

	chart.draw(chart_data, options);
}