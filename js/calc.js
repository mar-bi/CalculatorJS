$(document).ready(function(){
	var slot1;
	var slot2;
	var math_operator;

	//on-off (AC) button
	$('button#AC').on('click', function(){
		$('#screen-input').empty();
		$('#inmemory').empty();
		$('#screen-input').toggle(10, function(){
			$('#screen-input').text('0');	
		});
		$('#inmemory').toggle(10);
		$('div.screen').toggleClass('screenoff');
	});

	//show numbers
	$('button.num').on('click', function(){
		var test_reg = /[-+*0/]/g;
		var button_val = $(this).attr('value');
		var str = maxInput($('#screen-input').text());
		//console.log(str);
		if(str.length === 1 && test_reg.test(str)) { 
			$('#screen-input').text(button_val);
			$('#inmemory').append(button_val);
		}else if (str.length >= 1) {
			$('#screen-input').text(str + button_val);
			$('#inmemory').append(button_val);
		}else {
			$('#inmemory').empty();
			$('#screen-input').html('<span class="err-message">Digit limit met</span>');
			setTimeout(zeroScreen, 1000);

		}
	});

	//point button
	$('button#point').on('click', function(){
		//only 1 point in string
		var str = $('#screen-input').text();
		var lastArithm = str.search(/[-+*/]/g);
		
		if (str.indexOf('.') === -1) {
			$('#screen-input').append('.');
			$('#inmemory').append('.');		
		}
	});

	//delete button
	$('button#del').on('click', function(){
		var str = $('#screen-input').text();
		var memory = $('#inmemory').text();
		var strLength = str.length;
		if (strLength <= 1) {
			$('#screen-input').text('0');
			$('#inmemory').text(memory.substring(0, memory.length - 1));
		}else {
		$('#screen-input').text(str.substring(0, strLength - 1));
		$('#inmemory').text(memory.substring(0, memory.length - 1));
		}
	});

	//equals button
	$('button#equals').on('click', function(){
		evaluation($('#inmemory').text());
	});


	//simple arithmetic buttons (all buttons have ids)
	//PLUS
	$('button#plus').on('click', function(){
		simpleArithmetic('+');
	});
	//MINUS
	$('button#minus').on('click', function(){
		simpleArithmetic('-');
	});
	//TIMES
	$('button#times').on('click', function(){
		simpleArithmetic('*');;
	});
	//DIVIDE
	$('button#divide').on('click', function(){
		simpleArithmetic('/');;
	});
	// SIGN
	$('button#sign').on('click', function(){
		var str = $('#screen-input').text();
		var memory = $('#inmemory').text();
		if (str.charAt(0) === '-'){
			$('#screen-input').text(str.substring(1));
			$('#inmemory').text(memory.substring(1));
		} else {
			$('#screen-input').prepend('-');
			$('#inmemory').prepend('-');	
		}
	});
	// PERCENT (classical percentage button from simple calculators)
	$('button#percentage').on('click', function(){
		var str = $('#inmemory').text();
		var convert = Number(str);
		
		if (!convert) {
			var operation = str.match(/[-+*/]/g);
			if (operation.length === 1) {
				var stop_index = str.indexOf(operation);
				var num1 = StringToNumber(str.substring(0, stop_index));
				var num2 = StringToNumber(str.substring(stop_index + 1));
				var ans;
						
				switch(operation[0]){
					case '+':
						ans = num1 + (num1/100)*num2;
						console.log(num1, num2);
						console.log(ans);
						break;
					case '-':
						ans = num1 - (num1/100)*num2;
						break;
					case '*':
						ans = num1 * (num1/100)*num2;
						break;
					case '/':
						ans = num1 / (num1/100)*num2;
						break;
				}
				precision(ans);
			} else {
				$('#inmemory').empty();
				$('#screen-input').html('<span class="err-message">Wrong format</span>');
				setTimeout(zeroScreen, 1000);
			}
		}
		else {
			$('#screen-input').text(convert/100);
			$('#inmemory').text(convert/100);
		}
	});


	//math functions
	//PI
	$('button#pi').on('click', function(){
		$('#screen-input').text(Math.PI.toPrecision(5));
		$('#inmemory').append(Math.PI.toPrecision(5));
	});
	//SQUARED
	$('button#squared').on('click', function(){
		var empty = $('#screen-input').empty();
		var memory = $('#inmemory').text();
		if (memory === '') {
			$('#inmemory').empty();
			$('#screen-input').html('<span class="err-message">Error</span>');
			setTimeout(zeroScreen, 1000); 
		} else {
			var str = eval(memory);
			var ans = Math.pow(Number(str), 2);
			precision(ans);
		}
	});
	//SQRT
	$('button#sqrt').on('click', function(){
		var memory = $('#inmemory').text();
		if (memory === '') {
			$('#inmemory').empty();
			$('#screen-input').html('<span class="err-message">Error</span>');
			setTimeout(zeroScreen, 1000);
		} else {
			var str = eval(memory);
			if (Number(str) < 0) {
				$('#inmemory').empty();
				$('#screen-input').html('<span class="err-message">Error</span>');
				setTimeout(zeroScreen, 1000);
			} else {
				var ans = Math.sqrt(Number(str));
				precision(ans);
			}
		}			
	});
	//RECIPROCAL
	$('button#recip').on('click', function(){
		var memory = $('#inmemory').text();
		if (memory === '') {
			$('#inmemory').empty();
			$('#screen-input').html('<span class="err-message">Error</span>');
			setTimeout(zeroScreen, 1000);
		} else {
			var str = eval(memory);
			//console.log(str, typeof(str));
			if (Number(str) === 0) {
				$('#inmemory').empty();
				$('#screen-input').html('<span class="err-message">Error</span>');
				setTimeout(zeroScreen, 1000);
			} else {
				var ans = (1 / str);
				precision(ans);
			}
		}				
	});


	//HELPERS
	//converts string to float or to integer
	function StringToNumber(str) {
		if (str.indexOf('.') !== -1) {
			return parseFloat(str, 10); 
		}else {
			return parseInt(str, 10);
		}
		console.log(num1);
	}

	//check if string length doesn't exseed the max screen length
	function maxInput(str) {
		if (str.length > 9) {
			return '';
		} 
		else {
			return str;
		}
	}

	//evaluates an atirhmetic expression
	function evaluation(str) {
		var ans = eval(str);
		precision(ans);
	}

	// adds arithm. operation and evaluates previous operation 
	function simpleArithmetic(operator){
		var test_reg = /[-+*/]/g;
		var str = $('#screen-input').text();
		var memory = $('#inmemory').text();
		
 		if (!test_reg.test(str) && !test_reg.test(memory)) {
			$('#screen-input').text(operator);
			$('#inmemory').append(operator);
		} 
		if (!test_reg.test(str) && test_reg.test(memory)){
			evaluation(memory);
			$('#screen-input').text(operator);
			$('#inmemory').append(operator);
		}
	}
	// adds format to results of evaluation 
	function precision(num){
		if (num.toString().indexOf('.') !== -1 && num.toString().length > 5){
			$('#screen-input').text(num.toPrecision(5));
			$('#inmemory').text(num.toPrecision(5));
		} else {
			$('#screen-input').text(num);
			$('#inmemory').text(num);
		}
	}

	function zeroScreen(){
		$('#screen-input').text('0');
	}

});

