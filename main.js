var main_canvas = document.getElementById("main");

// Это нужно для того, чтобы можно было генерировать keydown на нажатых клавишах
main_canvas.contentEditable = true;
main_canvas.focus();
main_canvas.width  = 1000;
main_canvas.height = 1000;

var CTX = main_canvas.getContext("2d");

var loadProgressDiv = document.getElementById("loadProgress");
var loadProgressInt = 0;
var loadProgressMax = 4;
var AI = null;


function loadProgressInc()
{
	loadProgressInt++;
	loadProgressDiv.textContent = "Загрузка: " + Math.floor(loadProgressInt / loadProgressMax * 100) + "%";
};

window.onload = function()
{
    // Ошибка в величине константы, задающей количество загружаемых файлов
	if (loadProgressInt != loadProgressMax)
	{
		console.error("loadProgressMax = " + loadProgressInt);
		console.error("See main.js for correct the number");
	}

    AI = new AI_class();
}

loadProgressInc();
