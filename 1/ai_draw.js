AI_class.prototype.getTruthCoordinated =
function (x, y)
{
    var cRect = main_canvas.getBoundingClientRect();
    var tx    = x - cRect.left;
    var ty    = y - cRect.top;

    return [parseInt(tx), parseInt(ty)];
};

AI_class.prototype.cleanCanvas =
function()
{
    // Зачерняем фон
    CTX.fillStyle = "#000000";
    CTX.fillRect(0, 0, main_canvas.width, main_canvas.height);
};

AI_class.prototype.draw =
function()
{
    if (typeof(this.weights[this.my - 1]) == 'undefined')
    {
        this.cleanCanvas();
        return;
    }

    // this.cleanCanvas();
    this.drawAllWeights();
    this.drawAllPoints();

    loadProgressDiv.textContent = "Готово";
};

AI_class.prototype.drawAllPoints =
function()
{
    for (var pI = 0; pI < this.points.length; pI++)
    {
        var ps    = this.points[pI];
        var color = this.points_color[pI];
        for (var p of ps)
        {
	        this.drawPoint(p.x, p.y, color);
        }
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
    // console.error("drawAllWeights");

    const imageData = CTX.getImageData(0, 0, main_canvas.width, main_canvas.height);
    const data = imageData.data;
    var [x, y] = [0, 0];
    for (var i = 0; i < data.length; i += 4)
    {
        var obj = this.weights[y][x];
        data[i]     = obj.r;     // red
        data[i + 1] = obj.g; // green
        data[i + 2] = obj.b; // blue
        data[i + 3] = 0x88;

        x++;
        if (x >= this.mx)
        {
            x = 0;
            y++;
        }
    }
/*
    for (var wy in this.weights)
    {
        var wys = this.weights[wy];
        for (var wx in wys)
        {
            // console.error(wxs[w]);
            this.drawRect(wx, wy, wys[wx].color);
            // console.error(wx);
            // console.error(w);
        }
    }
*/
    CTX.putImageData(imageData, 0, 0);
};

loadProgressInc();
