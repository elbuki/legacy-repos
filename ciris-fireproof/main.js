var CIRISAPP = CIRISAPP || {
	numbersEntered: null,
	tempArray: [],
	itemsEntered: [],
	$: function(query) { //JQuery-like selector, just for simplicity and less code
		return document.querySelectorAll(query);
	},
	generatePage: function() { //generates HTML elements to be used in the frontend, used this because this is a pure JavaScript webpage
		document.title = 'Job application';
		var body = this.$('body')[0];
		var plainText = document.createElement('p');
		var exerciseHeader = document.createElement('h1');
		var promptBox = document.createElement('div');
		var numberEntry = document.createElement('input');
		var button = document.createElement('button');
		var enteredBox = document.createElement('fieldset');
		var legend = document.createElement('legend');
		var resultsBox = document.createElement('div');
		var forBox = document.createElement('div');
		var whileBox = document.createElement('div');
		var recursionBox = document.createElement('div');

		plainText.innerHTML = 'Here are the following '
		+	'exercises left in the fire proof.';
		exerciseHeader.innerHTML = 'Exercise 1';
		forBox.innerHTML = whileBox.innerHTML = recursionBox.innerHTML = '0';
		forBox.id = 'for-box';
		whileBox.id = 'while-box';
		recursionBox.id = 'recursion-box';
		numberEntry.setAttribute('type', 'number');
		button.innerHTML = 'Add';
		button.setAttribute('onclick', 'CIRISAPP.addNumber(CIRISAPP.$(\'body input\')[0].value)');
		legend.innerHTML = 'Numbers entered';
		enteredBox.setAttribute('style', 'width: 20%; margin: 10px 0px');

		resultsBox.appendChild(forBox);
		resultsBox.appendChild(whileBox);
		resultsBox.appendChild(recursionBox);
		promptBox.appendChild(numberEntry);
		promptBox.appendChild(button);		
		enteredBox.appendChild(legend);
		body.appendChild(plainText);
		body.appendChild(exerciseHeader);
		body.appendChild(promptBox);
		
		plainText = document.createElement('p');
		plainText.innerHTML = 'No numbers entered!';

		enteredBox.appendChild(plainText);
		body.appendChild(enteredBox);
		body.appendChild(resultsBox);

		exerciseHeader = document.createElement('h1');
		exerciseHeader.innerHTML = 'Exercise 2';

		enteredBox = document.createElement('fieldset');
		legend = document.createElement('legend');
		button = document.createElement('button');
		numberEntry = document.createElement('input');
		plainText = document.createElement('p');

		plainText.innerHTML = 'No elements added!';
		numberEntry.setAttribute('type', 'text');
		button.innerHTML = 'Add item';
		button.setAttribute('onclick', 'CIRISAPP.addElement(CIRISAPP.$(\'body input\')[1].value)');
		legend.innerHTML = 'Elements added on array';
		enteredBox.setAttribute('style', 'width: 20%; margin: 10px 0px');

		body.appendChild(exerciseHeader);
		body.appendChild(numberEntry);
		body.appendChild(button);
		button = document.createElement('button');
		button.innerHTML = 'Submit';
		button.setAttribute('onclick', 'CIRISAPP.addArray()');
		body.appendChild(button);
		enteredBox.appendChild(legend);
		enteredBox.appendChild(plainText);
		body.appendChild(enteredBox);

		enteredBox = document.createElement('fieldset');
		legend = document.createElement('legend');
		plainText = document.createElement('p');

		legend.innerHTML = 'Arrays added';
		plainText.innerHTML = 'No arrays added!';
		enteredBox.setAttribute('style', 'width: 20%; margin: 10px 0px');

		enteredBox.appendChild(legend);
		enteredBox.appendChild(plainText);
		body.appendChild(enteredBox);

		button = document.createElement('button');
		button.innerHTML = 'Show result';
		button.setAttribute('onclick', 'CIRISAPP.showResult()');

		body.appendChild(button);
	},
	addNumber: function(number) { //adds a number to a array then calculate the sum using all methods and prints the results on the screen
		if(!isNaN(number) && number !== '') {
			if(this.numbersEntered === null) {
				this.numbersEntered = [number];
			} else {
				this.numbersEntered.push(number);						
			}
			this.$('fieldset p')[0].innerHTML = this.numbersEntered;
			this.$('#for-box')[0].innerHTML = this.firstExerciseFor() + ' using for.';
			this.$('#while-box')[0].innerHTML = this.firstExerciseWhile() + ' using while';
			this.$('#recursion-box')[0].innerHTML = this.firstExerciseRecursion(this.numbersEntered.length - 1) + ' using recursion.';
		}
	},
	addElement: function(value) { //adds an element to the temporary array (tempArray) then updates the paragraph showing the elements
		var text = this.$('fieldset p')[1].innerHTML;
		if(text.indexOf('No elements added!') > -1) {
			text = value;
			this.tempArray = [ value ];
		} else {
			text += ', ' + value;			
			this.tempArray.push(value);
		}
		this.$('fieldset p')[1].innerHTML = text;
	},
	addArray: function() { //adds an array to the itemsEntered array then updates the praragraph showing the arrays entered
		this.itemsEntered.push(this.tempArray);
		tempArray = [];
		this.$('fieldset p')[1].innerHTML = 'No elements added!';
		var arrayContents = '';
		for (var i = 0; i < this.itemsEntered.length; i++) {
			for(var j = 0; j < this.itemsEntered[i].length; j++) {
				arrayContents += this.itemsEntered[i][j] + ', ';

			};
			arrayContents = arrayContents.substring(0, arrayContents.length - 2);
			arrayContents += '<br>';
		};
		this.$('fieldset p')[2].innerHTML = arrayContents;
	},
	firstExerciseFor: function() { //result of the first exercise using a for loop
		var total = 0;
		for (var i = 0; i < this.numbersEntered.length; i++) {
			total += parseInt(this.numbersEntered[i]);
		};
		return total;
	},
	firstExerciseWhile: function() { //result of the first exercise using a while loop
		var total, i;
		total = i = 0;
		while(i < this.numbersEntered.length) {
			total += parseInt(this.numbersEntered[i]);
			i++;
		};
		return total;
	},
	firstExerciseRecursion: function(index) { //result of the first exercise, using recursion
		//for this exercise i had used this as a reference: http://stackoverflow.com/questions/20253651/recursively-sum-the-integers-in-an-array
		if(index == 0) {
			return this.numbersEntered[index];
		} else {
			return parseInt(this.numbersEntered[index]) + parseInt(this.firstExerciseRecursion(index - 1));
		}
	},
	secondExercise: function() { //iterates the itemsEntered array and its elements and mix their contents to a new array
		var result = [];
		var j, argsUndefined;
		argsUndefined = j = 0;
		while(this.itemsEntered.length > 0) {
			for (var i = 0; i < this.itemsEntered.length; i++) {
				if(this.itemsEntered[i][j] !== undefined) {
					result.push(this.itemsEntered[i][j]);
				} else {
					if(argsUndefined === this.itemsEntered.length) {
						return result;
					} else {
						argsUndefined++;
					}
				}
			};
			j++;
		}
	},
	showResult: function() { //show the result of the last exercise converting from an array to string
		var arrayToString = '';
		this.secondExercise().filter(function(a) { arrayToString += a + ', ' });
		arrayToString = arrayToString.substring(0, arrayToString.length - 2);
		alert(arrayToString);
	}
};
CIRISAPP.generatePage();