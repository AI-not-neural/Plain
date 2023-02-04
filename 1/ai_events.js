AI_class.prototype.AddEventListeners =
function()
{
    // https://developer.mozilla.org/ru/docs/Web/Events
    var events = [
                    ['click', 'onClick'], ['wheel', 'onWheel'], ['mousedown', 'onMouseDown'], ['keydown', 'onKeyDown'],
                    ['contextmenu', 'rightClick'], ['mousemove', 'onMouseMove']
                    ];

    for (var event of events)
    {
        main_canvas.addEventListener(event[0], this[event[1]].bind(this));
    }
};

AI_class.prototype.onClick =
function(e)
{
    e.preventDefault();
    e.cancelBubble = true;

    // this.draw();
};

AI_class.prototype.onWheel =
function()
{
    // this.draw();
};

AI_class.prototype.onMouseDown =
function(e)
{
    e.preventDefault();
    e.cancelBubble = true;

    // console.error(e);

    var classOfPoint = e.button > 0 ? 1 : 0;
    // if (e.altKey)
    // classOfPoint += 3;

    var [x, y] = this.getTruthCoordinated(e.clientX, e.clientY);
    this.points[classOfPoint].push({x: x, y: y});

    // Экономим, рисуем только точку, а не всё подряд
    this.drawAllPoints();
    loadProgressDiv.textContent = "Расчёт: 0%";

    this.cx = 0;
    this.cy = 0;
    this.notCalc = true;
    this.calc();
};

AI_class.prototype.onKeyDown =
function(e)
{
    var Found = false;
    try
    {
        console.log(e);	// TODO: убрать после отладки

        for (var key of this.onKeyDown_Array)
        {
            if (this.onKeyDown_Compare(e, key))
            {
                Found = true;

                var funcName = key[1];
                try
                {
                    this[funcName](e);
                }
                catch (ex)
                {
                    console.error("Game.onKeyDown error");
                    console.error(e);
                    console.error(ex);
                }

                return;
            }
        }

        Found = false;
        return true;
    }
    finally
    {
        if (Found)
        {
            e.preventDefault();
            e.cancelBubble = true;

            this.draw();
        }
    }
};

AI_class.prototype.onMouseMove =
function(e)
{
    if (typeof(this.weights[this.my - 1]) == 'undefined')
    {
        return;
    }

    var [x, y] = this.getTruthCoordinated(e.clientX, e.clientY);

    var w = this.weights[y][x];
	
	var str = "";
	if (w.warn)
		str = w.warn.toPrecision(4) + " x: " + x + " y: " + y;

    loadProgressDiv.textContent = "Error: " + w.E.toPrecision(4) + "    P1: " + w.P[0].toPrecision(4) + "    P2: " + w.P[1].toPrecision(4) + "    warn: " + str;
};


AI_class.prototype.rightClick =
function(e)
{
    e.preventDefault();
    e.cancelBubble = true;
};


AI_class.prototype.key_F10 =
function(e)
{
    console.error('F10 key pressed');
};

AI_class.prototype.key_Escape =
function(e)
{
    this.points_init();
};

AI_class.prototype.onKeyDown_Compare =
function(e, key)
{
    if (e.code != key[0])
        return false;

    var ctrl  = key[2];
    var shift = key[3];
    var alt   = key[4];

    if (ctrl === true || ctrl === false)
    if (ctrl !== e.ctrlKey)
        return false;

    if (shift === true || shift === false)
    if (shift !== e.shiftKey)
        return false;

    if (alt === true || alt === false)
    if (alt !== e.altKey)
        return false;

    return true;
};


AI_class.prototype.onKeyDown_Array =
	[
		['Escape',         'key_Escape',         false, false, false],	// Сброс
		['F10',            'key_F10',            false, false, false]
	];

loadProgressInc();