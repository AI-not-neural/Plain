// Градусы в радианы
function toRadian(val)
{
	return val * 2*Math.PI / 360;
}

// Эта функция возвращает дистанцию до объекта с учётом нужной метрики пространства
function getDistance(x, y)
{
	// return Math.max(Math.abs(x), Math.abs(y));
	return Math.pow(x*x+y*y, 0.5);
}

var AI_class = function()
{
	this.pointR  = 4;
	this.notDraw = true;
	this.notCalc = true;
	this.cx      = 0;	// На чём мы остановили вычисления
	this.cy      = 0;
	this.mx      = main_canvas.width;
	this.my      = main_canvas.height;

	this.AddEventListeners();

	this.points  = [];
	this.weights = new Array(this.my);

	// FF - полная непрозрачность. Альфа-канал самый последний
	// this.points_color = ['#00FF00', '#0000FF', '#FF0000', '#FFFF00', '#00AAFF', '#FF00FF'];
	this.points_color = ['#00FF00', '#0000FF'];

	for (var i = 0; i < 6; i++)
		this.points.push([]);

	this.draw();
};

AI_class.prototype.calc =
function()
{
	if (this.notCalc === false)
		return;

	var CountOfPoints = this.mx * this.my;

	// Расчёт нескольких линий картинки
	for (var cnt = 0; cnt < 1; cnt++)
	{
		var Y = this.cy;
		for (var X = 0; X < this.mx; X++)
		{
			this.calcForPoint(X, Y);
		}
console.error(this.cy);
		this.cy++;
	}
	loadProgressDiv.textContent = "Расчёт: " + Math.floor((this.cy * this.mx + this.cx) / CountOfPoints * 100) + "%";

	if (this.cy >= this.my)
	{
		this.cy = 0;
		this.cx = 0;

		this.notCalc = false;
		return;
	}

	// Продолжаем вычисления
	setTimeout
	(
		this.calc.bind(this),
		0
	);
};

AI_class.prototype.calcForPoint =
function(x, y)
{
	if (typeof(this.weights[y]) == 'undefined')
		this.weights[y] = new Array(this.mx);

	var P = [];
	var E = [];

	var rc = 0xFF;
	var gc = 0xFF;
	var bc = 0xFF;

	var obj = {E: 0, P: [0, 0], color: 'rgb(' + rc + ', ' + gc + ', ' + bc + ')'};
	this.weights[y][x] = obj;
};

loadProgressInc();
