// Функция вычисления соответствия
function AIFunc2(p1, p2, x, y)
{
	var base = [p2.x - p1.x, p2.y - p1.y];
	var s1   = [p1.x - x, p1.y - y];
	var s2   = [p2.x - x, p2.y - y];

	var base_ = [];
	base_[0]  = base[0];
	base_[1]  = base[1];

	var bn   = getDistance(base[0], base[1]); //base[0] * base[0] + base[1] * base[1];
	base[0] /= bn;
	base[1] /= bn;

	// var d1 = getDistance(p1.x - x, p1.y - y);
	// var d2 = getDistance(p2.x - x, p2.y - y);
	var d1 = s1[0] * base[0] + s1[1] * base[1];
	var d2 = s2[0] * base[0] + s2[1] * base[1];
	d1 *= -1;

	if (d1 < 0 && d2 < 0)
	{
		d1 *= -1;
		d2 *= -1;
	}

	if (d1 < 0)
		d1 = 0;
	if (d2 < 0)
		d2 = 0;

	var k1 = 1 - d1 / (d1 + d2 + 1e-18);	//  + 1e-18 - это чтобы никогда не было деления на ноль
	var k2 = 1 - d2 / (d1 + d2 + 1e-18);

	var k1 = k1 / (k1 + k2);
	var k2 = k2 / (k1 + k2);
	// var Er = 1 - 1/(k1 + k2);

	// var D   = getDistance(p2.x - p1.x, p2.y - p1.y);
	var D = bn;
	var ed1 = getDistance(p1.x - x, p1.y - y);
	var ed2 = getDistance(p2.x - x, p2.y - y);

	// Расстояние от точки до прямой
	var dl = Math.abs(base_[1]*x - base_[0]*y + p2.x*p1.y - p2.y*p1.x) / D;

	// ed1 = ed1*ed1 - d1*d1;
	// ed2 = ed2*ed2 - d2*d2;
	var ed = Math.min(ed1, ed2);

	// var ac = Math.acos(d1 / getDistance(s1[0], s1[1]));
	// var dd = Math.pow(Math.abs(d1) + Math.abs(d2), 2);
	//var kd = dd / (D*D);
	
	// Этот расчёт учитывает деление плоскости на две части
	var kd = dl * dl / (D*D); //  * ed * ed
	if (kd < 1)
		kd = 1;

	kd *= (D * D);
	
	// Этот расчёт позволяет выделять области
	// var kd = ed*ed / (D*D);

	// Это нужно закомментировать, потому что, по сути, решающее значение играет именно дистанция между двумя точками - чем они дальше, тем менее они друг с другом коррелируют и противоположны
	// kd /= D * D;

	// var kd = ed * ed;
	// kd *= D * D;

	return [k1, k2, kd];
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


// ---------------- AI_class ----------------

var AI_class = function()
{
	this.pointR  = 4;
	this.drawedPercent = 0;
	this.notCalc = true;
	this.cx      = 0;	// На чём мы остановили вычисления
	this.cy      = 0;
	this.mx      = main_canvas.width;
	this.my      = main_canvas.height;

	this.points_init();
	this.AddEventListeners();
};

AI_class.prototype.points_init =
function()
{
	this.points  = [];
	this.weights = new Array(this.my);

	// FF - полная непрозрачность. Альфа-канал самый последний
	// this.points_color = ['#00FF00', '#0000FF', '#FF0000', '#FFFF00', '#00AAFF', '#FF00FF'];
	this.points_color = ['#00FF00FF', '#0000FFFF'];

	for (var i = 0; i < 2; i++)
		this.points.push([]);

	this.cleanCanvas();
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
	var percent = Math.floor((this.cy * this.mx + this.cx) / CountOfPoints * 100);
	loadProgressDiv.textContent = "Расчёт: " + percent + "%";

	if (this.cy >= this.my)
	{
		this.cy = 0;
		this.cx = 0;

		this.drawedPercent = 0;
		this.notCalc = false;

		loadProgressDiv.textContent = "Отрисовка";
		this.cleanCanvas();

		setTimeout(this.draw.bind(this), 0);
		return;
	}
/*  Это не будет работать
	if (percent - this.drawedPercent > 20)
	{
		this.drawedPercent = percent;
		this.draw.bind(this);
	}
*/
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

	var L = Math.min(this.points[0].length, this.points[1].length);

	var Err = 1e28;
	for (var p1 of this.points[0])
	for (var p2 of this.points[1])
	{
		var [k1, k2, Er] = AIFunc2(p1, p2, x, y);

		Err = Er;
		P1.push(k1);
		P2.push(k2);
		E .push(Er);

		if (k1 + k2 > 1 + 1e-9)
		{
			console.error("AIFunc2 error: k1 + k2 > 1 + 1e-9");
			console.error(P1);
			console.error(P2);
		}
		if (k1 + k2 < 1 - 1e-9)
		{
			console.error("AIFunc2 error: k1 + k2 < 1 - 1e-9");
			console.error(P1);
			console.error(P2);
		}
	}

	var minKD = 1e28;
	
	var SP1 = 0;
	var SP2 = 0;
	var SES = 0;
	var SE  = 1.0;
	var P1m = [1.0, 0.0];
	var P2m = [1.0, 0.0];
	for (var i = 0; i < P1.length; i++)
	{
		var e2 = E[i];
		var ek = e2;
		if (ek < 1 / P1.length)
			ek = 1 / P1.length;

		if (minKD > e2)
			minKD = e2;

		SP1 += P1[i] / ek;
		SP2 += P2[i] / ek;
		SES += 1 / ek;

		if (P1m[0] > P1[i])
			P1m[0] = P1[i];
		if (P2m[0] > P2[i])
			P2m[0] = P2[i];

		if (P1m[1] < P1[i])
			P1m[1] = P1[i];
		if (P2m[1] < P2[i])
			P2m[1] = P2[i];
	}

	if (SES > 0)
	{
		SP1 /= SES;
		SP2 /= SES;
		SE   = Math.max(P1m[1] - P1m[0], P2m[1] - P2m[0]);

		var minE = Math.pow(1/L, 0.5);
		if (SE < minE)
			SE = minE;
	}
	else
	{
		SP1 = 0.5;
		SP2 = 0.5;
		SE  = 1.0;
	}

	var rc = 0; // 0xFF * SE;
	var gc = 0xFF * SP1;
	var bc = 0xFF * SP2;

	// Показываем линию примерно одинаковых вероятностей
	if (gc <= 128 && gc >= 127)
	{
		rc = 255;
		gc = 255;
		bc = 255;
	}

	var obj = {E: /* SE */ minKD, P: [SP1, SP2], r: rc, g: gc, b: bc, warn: Err};
	this.weights[y][x] = obj;
};

loadProgressInc();
