// Функция вычисления соответствия
function AIFunc(p1, p2, x, y)
{
	var d1 = getDistance(p1.x - x, p1.y - y);
	var d2 = getDistance(p2.x - x, p2.y - y);

	var D  = getDistance(p2.x - p1.x, p2.y - p1.y);

	var k1 = d1 / (d1 + d2 + 1e-18);	//  + 1e-18 - это чтобы никогда не было деления на ноль
	var k2 = d2 / (d1 + d2 + 1e-18);

	var k1 = k1 / (k1 + k2);
	var k2 = k2 / (k1 + k2);
	// var Er = 1 - 1/(k1 + k2);
	var Er = 0.0;
	if (d1 + d2 > D)
	{
		var dk = D / (d1 + d2 + 1e-18);
		Er = 1 - dk * dk;
	}

	return [k1, k2, Er];
}

// Градусы в радианы
function toRadian(val)
{
	return val * 2*Math.PI / 360;
}

// Эта функция возвращает дистанцию до объекта
function getDistance(x, y)
{
	// return Math.max(Math.abs(x), Math.abs(y));
	return Math.pow(x*x+y*y, 0.5);
}

var AI_class = function()
{
	this.pointR  = 4;
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
	this.points_color = ['#0000FFFF', '#00FF00FF'];

	for (var i = 0; i < 2; i++)
		this.points.push([]);

	this.calc();
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

		this.cy++;
	}
	loadProgressDiv.textContent = "Расчёт: " + Math.floor((this.cy * this.mx + this.cx) / CountOfPoints * 100) + "%";

	if (this.cy >= this.my)
	{
		this.cy = 0;
		this.cx = 0;

		this.notCalc = false;

		loadProgressDiv.textContent = "Отрисовка";
		this.cleanCanvas();

		setTimeout(this.draw.bind(this), 0);
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

	var P1 = [];
	var P2 = [];
	var E  = [];


	for (var p1 of this.points[0])
	for (var p2 of this.points[1])
	{
		var [k1, k2, Er] = AIFunc(p1, p2, x, y);

		P1.push(k1);
		P2.push(k2);
		E .push(Er);
	}

	var SP1 = 0;
	var SP2 = 0;
	var SE  = 0;
	for (var i = 0; i < P1.length; i++)
	{
		SP1 += P1[i];
		SP2 += P2[i];
		SE  += E [i];
	}

	if (P1.length > 0)
	{
		SP1 /= P1.length;
		SP2 /= P2.length;
		SE  /= E .length;
	}
	else
	{
		SP1 = 0.5;
		SP2 = 0.5;
		SE  = 1.0;
	}

	var rc = 0xFF * SE;
	var gc = 0xFF * SP1;
	var bc = 0xFF * SP2;

	var obj = {E: SE, P: [SP1, SP2], r: rc, g: gc, b: bc};
	this.weights[y][x] = obj;
};

loadProgressInc();
