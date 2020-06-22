
// Родитель таблицы

let elem = document.querySelector('#elem');


// Шаг 1 Создание массива для алгоритма

let arr = [
	['S', 1, 1, 1, 1, 1, 1, 1, 1, '-'],
	[1, 1, 1, 1, '-', 1, '-', 1, 1, '-'],
	[1, 1, 1, 1, '-', 1, 1, 1, 1, '-'],
	[1, 1, 1, 1, '-', 1, '-', 1, '-', 1],
    ['-', 1, 1, 1, '-', 1, 1, '-', 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, '-'],
    [1, 1, 1, 1, 1, 1, '-', '-', '-', '-'],
    ['-', '-', 1, 1, '-', 1, 1, 1, 1, 1],
    ['-', 1, 1, 1, '-', 1, 1, 1, 1, 1],
    [1, '-', 1, 1, '-', '-', 1, 'F', 1, '-'],
];



// Функция создания таблицы

function createTable(parent, arr) {
	let table = document.createElement('table');
	for(let i = 0; i < arr.length; i++) {
		let row = document.createElement('tr');
		for(let j = 0; j < arr.length; j++) {
			let cell = document.createElement('td');
			cell.append(arr[i][j]);
			row.appendChild(cell)
			arr[i][j].elem = cell;
			cell.classList.add('setup');
			if(arr[i][j] == 'X') {
				cell.classList.remove('setup');
				cell.classList.add('intact');
			}
			if(arr[i][j] == 'S') {
				cell.classList.add('start');
			}
			if(arr[i][j] == '-') {
				cell.classList.remove('setup')
				cell.classList.add('nul');
			}
			if(arr[i][j] == 'F') {
				cell.classList.add('finish');
			}
		}
		table.appendChild(row);
		table.id = '#newTable';
	}
	parent.appendChild(table);
}


//Функция сортировки массива

function algoritmLi(cell, step = 0) {
	cell.steps = step;
	cell.neighbors.forEach(cellNeighbor => {
		if(cellNeighbor.type == 'floor' && cellNeighbor.steps > cell.steps + 1) {
			algoritmLi(cellNeighbor, step + 1);
		}
	}); 
}

	function incrementNeighbors(cell) {
		cell.neighbors.forEach(function (cellneighbors) {
			if(cell.type == 'floor' && cellneighbors.steps > cell.steps) {
				cellneighbors.steps = cell.steps + 1
			}
		})
	}
// Шаг 2 Функция создания обьектов массива

let newArr = arr.map(function (value, index_i, arr_outer) {
	const neighbors = []
	return value.map(function(currvalue, index_j, arr_inner) {
		 	  return {
		 	  	i: index_i,
		 	  	j: index_j,
		   		type: currvalue === 1 || currvalue === 'S' || currvalue === 'F' ? 'floor' : 'wall',
	       		steps: currvalue === 'S' ? 0 : Infinity,
    	   		isStart: currvalue === 'S',
       	   		isFinish: currvalue === 'F',
       	   		neighbors: neighbors,
			}

		});
	}
);

// Добавление соседей к ячейкам обьекта

 newArr.forEach(function (value, index_i, arr_outer) {

	return value.forEach(function (currvalue, index_j, arr_inner) {

		const neighbors = [];

		if((arr_outer[index_i + 1] && arr_outer[index_i + 1][index_j]) !== undefined && typeof arr_outer[index_i + 1][index_j] !== 'string') {
			neighbors.push(arr_outer[index_i + 1][index_j]);
		}
		if(arr_outer[index_i][index_j + 1] !== undefined && typeof arr_outer[index_i][index_j + 1] !== 'string') {
			neighbors.push(arr_outer[index_i][index_j + 1]);
		}
		if((arr_outer[index_i - 1] && arr_outer[index_i - 1][index_j]) !== undefined && typeof arr_outer[index_i - 1][index_j] !== 'string') {
			neighbors.push(arr_outer[index_i - 1][index_j]);
		}
		if(arr_outer[index_i][index_j - 1] !== undefined && typeof arr_outer[index_i][index_j - 1] !== 'string') {
			neighbors.push(arr_outer[index_i][index_j - 1]);
		}
		currvalue.neighbors = neighbors;

		return currvalue
	});
})

// Шаг 3 

let cellStart = newArr.flat().find(cell => cell.isStart);
algoritmLi(cellStart, step = 0);

// Шаг 4 

let resultAlgoritm = newArr.map( function(value) {
	return value.map( function(currvalue) {
			if( currvalue.isStart) {
				return 'S'
			}
			if( currvalue.isFinish) {
				return 'F'
			}
			if( currvalue.type === 'wall') {
				return '-'
			}
			if( currvalue.steps == Infinity) {
				return 'X'
			}
			return  currvalue.steps
	})
})




// Шаг 5

console.log(resultAlgoritm)
console.log(newArr);
createTable(elem, resultAlgoritm)





// Функция поиска ячейки 


function search(i, j) {
	let table = document.getElementById('#newTable');
	return table.children[i].children[j];
}

// console.log(search(1, 3))
// Создаем алгоритм обратного порядка


function getPreviousCell(cell) {
	return cell.neighbors.find(neighborscell => neighborscell.steps < cell.steps && neighborscell.type == 'floor');
}




// Получение обратного пути лабиринта

function backTrace(cell) {
	const result = []
	let currCell = cell;
	while(!currCell.isStart) {
		currCell = getPreviousCell(currCell);
		result.push(currCell);
	}
	return result.sort((a, b) => a.steps - b.steps);
}

let cellFinish = newArr.flat().find(cell => cell.isFinish);
let back = backTrace(cellFinish);


// Функция прохода по индексам 

function goingIndex(back) {
	const result = []
	for(let i = 0; i < back.length; i++) {
		 result.push(back[i]) 
	}
	 result.forEach(currCell => {
		const cell = search(currCell.i, currCell.j);
		cell.classList.remove('setup');
		cell.classList.add('passing');
	});
	 return result
}


console.log(goingIndex(back));















