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
	this.AddEventListeners();

	this.points1 = [];
	this.points2 = [];

	this.draw();
};


AI_class.prototype.draw =
function()
{
	CTX.beginPath();

	var [x, y, R, startAngle, endAngle] = [10, 10, 100, 0, Math.PI];
    CTX.arc(x, y, R, startAngle, endAngle, true);

	CTX.fill();
};

loadProgressInc();
