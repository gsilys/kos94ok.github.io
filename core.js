
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
	// Hide home area
	document.getElementById("Home").style.display = "none";
	// Generate some temporary levels
	for (var i = 2; i < 50; i++)
	{
		GlobalLevels.push(new Level("Temporary Exam", i, i, "Linear"));
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
	// Display home
	document.getElementById("Exam").style.display = "none";
	document.getElementById("Home").style.display = "block";
	// Update the stats
	var Grade = GetCurrentExamGrade();
	if (Grade == 0) {
		TotalExamsFailed += 1;
	}
	else {
		TotalExamsPassed += 1;
	}
	// Update the UI
	UpdateHome();
}

function NextExam_OnClick()
{
	document.getElementById("Home").style.display = "none";
	document.getElementById("Exam").style.display = "block";
	if (CurrentExamOrdinal < GlobalLevels.length - 1)
	{
		ExamPoints = 0;
		TotalExamsPassed += 1;
		CurrentExamOrdinal += 1;
		UpdateExamPoints();
		UpdateExamOrdinal();
	}
}

//=====================================================================
// Supplementary functions
//=====================================================================
function GetCurrentExamGrade()
{
	var Grade = 5;
	for (var i = 0; i < 5; i++) {
		if (ExamPoints < GlobalLevels[CurrentExamOrdinal].Points[i]) {
			Grade = i;
			break;
		}
	}
	return Grade;
}

function GetCurrentExamPointsGoal()
{
	var Goal = GlobalLevels[CurrentExamOrdinal].Points[4];
	for (var i = 0; i < 5; i++) {
		if (ExamPoints < GlobalLevels[CurrentExamOrdinal].Points[i]) {
			Goal = GlobalLevels[CurrentExamOrdinal].Points[i];
			break;
		}
	}
	return Goal;
}

//=====================================================================
// UI update functions
//=====================================================================
function UpdateExamPoints()
{
	// Calculate the goal and grade
	var Grade = GetCurrentExamGrade();
	var PointsGoal = GetCurrentExamPointsGoal();
	// Update the UI
	document.getElementById("ExamPointsCurrent").innerHTML = ExamPoints;
	document.getElementById("ExamPointsMax").innerHTML = PointsGoal;
	document.getElementById("ExamGradeValue").innerHTML = Grade;
	// Grade color code
	if (Grade == 0) {
		document.getElementById("ExamGradeValue").style.color = "red";
	}
	else if (Grade < 5) {
		document.getElementById("ExamGradeValue").style.color = "orange";
	}
	else if (Grade == 5) {
		document.getElementById("ExamGradeValue").style.color = "green";
	}
}

function UpdateExamOrdinal()
{
	document.getElementById("ExamName").innerHTML = GlobalLevels[CurrentExamOrdinal].Name;
	document.getElementById("ExamNumber").innerHTML = "[№" + (CurrentExamOrdinal + 1) + "]";
}

function UpdateHome()
{
	var Grade = GetCurrentExamGrade();
	var ExamStatus;
	if (Grade == 0) {
		ExamStatus = "You have failed the exam!";
	}
	document.getElementById("HomeExamStatus").innerHTML = ExamStatus;
}