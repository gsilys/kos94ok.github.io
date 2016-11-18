
//=====================================================================
// Class declarations
//=====================================================================
class Level
{
	constructor(Name, PointStartValue, PointMultiplier, PointFunction)
	{
		this.Name = Name;
		this.Points = [0, 0, 0, 0, 0];
		for (var i = 0; i < 5; i += 1)
		{
			if (PointFunction == "Linear")
			{
				this.Points[i] = PointStartValue + PointMultiplier * i;
			}
			else if (PointFunction == "Parabolic")
			{
				this.Points[i] = PointStartValue + Math.pow(PointMultiplier, i + 1) - PointMultiplier;
			}
			else if (PointFunction == "Exponential")
			{
				this.Points[i] = PointStartValue + Math.round(Math.pow(Math.E, PointMultiplier * i)) - 1;
			}
		}
	}
}

//=====================================================================
// Global scope variables
//=====================================================================
var CurrentExamOrdinal = 0;
var TotalExamsPassed = 0;
var TotalExamsFailed = 0;
var GlobalLevels = [];
var ExamPoints = 0;

//=====================================================================
// Initialization
//=====================================================================
function Initialization()
{
	// Generate some temporary levels
	for (var i = 2; i < 50; i++)
	{
		GlobalLevels.push(new Level("Linear", i, i, "Linear"));
	}
	// Update the UI initially
	UpdateExamPoints();
	UpdateExamOrdinal();
}

//=====================================================================
// Event handlers
//=====================================================================
function WorkHard_OnClick()
{
	if (ExamPoints < GlobalLevels[CurrentExamOrdinal].Points[4])
	{
		ExamPoints += 1;
	}
	UpdateExamPoints();
}

function EndExam_OnClick()
{
	ExamPoints = 0;
	TotalExamsPassed += 1;
	CurrentExamOrdinal += 1;
	UpdateExamPoints();
	UpdateExamOrdinal();
}

function NextExam_OnClick()
{

}

//=====================================================================
// UI update functions
//=====================================================================
function UpdateExamPoints()
{
	// Calculate the goal
	var PointsGoal = 0;
	for (var i = 3; i >= 0; i--)
	{
		if (ExamPoints >= GlobalLevels[CurrentExamOrdinal].Points[i])
		{
			PointsGoal = GlobalLevels[CurrentExamOrdinal].Points[i + 1];
			break;
		}
		else if (i == 0)
		{
			PointsGoal = GlobalLevels[CurrentExamOrdinal].Points[0];
		}
	}
	// Update the UI
	document.getElementById("ExamPointsCurrent").innerHTML = ExamPoints;
	document.getElementById("ExamPointsMax").innerHTML = PointsGoal;
}

function UpdateExamOrdinal()
{
	document.getElementById("ExamNumber").innerHTML = "#" + (CurrentExamOrdinal + 1);
}