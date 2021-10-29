AI_class.prototype.getTruthCoordinated =
function (x, y)
{
    var cRect = main_canvas.getBoundingClientRect();
    var tx    = x - cRect.left;
    var ty    = y - cRect.top;

    return [tx, ty];
};

AI_class.prototype.draw =
function()
{
    // Зачерняем фон
    CTX.fillStyle = "#000000";
    CTX.fillRect(0, 0, main_canvas.width, main_canvas.height);

    this.drawAllWeights();

    for (var pI = 0; pI < this.points.length; pI++)
    {
        var ps    = this.points[pI];
        var color = this.points_color[pI];
        for (var p of ps)
        {
	        this.drawPoint(p.x, p.y, color);
        }
    }

    // Задаём, что нужно производить обновление состояния каждую секунду - на случай, если calc не успевает
    if (this.notDraw === true)
    {
        var t = this;
        setTimeout
        (
            function()
            {
                t.notDraw = true;
                t.draw();
            },
            1000
        );

        this.notDraw = false;
    }
};

AI_class.prototype.drawPoint =
function(x, y, color)
{
	CTX.beginPath();

	var [x, y, R, startAngle, endAngle] = [x, y, this.pointR, 0, Math.PI*2];
    CTX.arc(x, y, R, startAngle, endAngle, true);

	CTX.fillStyle = color;
	CTX.fill();
}

AI_class.prototype.drawRect =
function(x, y, color)
{
    CTX.fillStyle = color;
    CTX.fillRect(x, y, 1, 1);
}

AI_class.prototype.drawAllWeights =
function()
{
    console.error("drawAllWeights");
    for (var wy in this.weights)
    {
        var wys = this.weights[wy];
        for (var wx in wys)
        {
            // console.error(wxs[w]);
            // this.drawRect(wx, wy, wys[wx].color);
            // console.error(wx);
            // console.error(w);
        }
    }
};

loadProgressInc();
