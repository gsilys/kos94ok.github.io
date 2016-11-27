
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

class Upgrade
{
	// Create new upgrade
	constructor(Id, Name, Cost, ParentId)
	{
		this.Id = Id;
		this.Name = Name;
		this.Cost = Cost;
		this.ParentId = ParentId;
		this.Purchased = false;
	}
	// [Internal use]
	// Get index of an upgrade in the array
	static GetIndexOf(Id)
	{
		for (var i = 0; i < GlobalUpgrades.length; i++)
		{
			if (GlobalUpgrades[i].Id == Id)
			{
				return i;
			}
		}
		return -1;
	}
	// Is the upgrade visible on the list (i.e. can be purchased)
	static IsVisible(Id)
	{
		var Index = Upgrade.GetIndexOf(Id);
		// No upgrade found or already purchased - hide
		if (Index == -1 || GlobalUpgrades[Index].Purchased == true)
			return false;
		// No parent (and not purchased yet) - show
		if (GlobalUpgrades[Index].ParentId == null)
			return true;
		// Else look for parent
		for (var i = 0; i < GlobalUpgrades.length; i++)
		{
			if (GlobalUpgrades[i].Id == GlobalUpgrades[Index].ParentId)
			{
				if (Upgrade.IsPurchased(GlobalUpgrades[i].Id) == true) {
					return true;
				}
				else {
					return false;
				}
			}
		}
		return false;
	}
	static IsPurchased(Id)
	{
		var Index = Upgrade.GetIndexOf(Id);
		if (Index == -1)
			return false;
		return GlobalUpgrades[Index].Purchased;
	}
}

//=====================================================================
// Global scope variables
//=====================================================================
var CurrentExamOrdinal = 0;
var TotalExamsPassed = 0;
var TotalExamsFailed = 0;
var GlobalLevels = [];
var GlobalUpgrades = [];
var ExamPoints = 0;
var CurrencyUnits = 0;
var LastExamPassed = true;

//=====================================================================
// Initialization
//=====================================================================
function Initialization()
{
	// Generate some temporary levels
	for (var i = 2; i < 50; i++)
	{
		GlobalLevels.push(new Level("Temporary Exam", i * 4, i, "Linear"));
	}
	// Push upgrades
	GlobalUpgrades.push(new Upgrade("click01", "Determination, Level 1", 1, null));
	GlobalUpgrades.push(new Upgrade("click02", "Determination, Level 2", 2, "click01"));
	GlobalUpgrades.push(new Upgrade("click03", "Determination, Level 3", 5, "click02"));
	GlobalUpgrades.push(new Upgrade("click04", "Determination, Level 4", 8, "click03"));
	GlobalUpgrades.push(new Upgrade("click05", "Determination, Level 5", 15, "click04"));
	// Start exam timer
	Exam_Timer();
	// Show exam UI
	ShowExam();
}

//=====================================================================
// Event handlers
//=====================================================================
function WorkHard_OnClick()
{
	if (ExamPoints < GlobalLevels[CurrentExamOrdinal].Points[4])
	{
		document.getElementById("ExamWorkHard").disabled = true;
		WorkHard_Timer();
	}
}

function EndExam_OnClick()
{
	// Update the stats
	var Grade = GetCurrentExamGrade();
	if (Grade == 0) {
		LastExamPassed = false;
		TotalExamsFailed += 1;
	}
	else {
		LastExamPassed = true;
		TotalExamsPassed += 1;
	}
	CurrencyUnits += Grade;

	window.clearInterval(ExamTimerId);
	ShowHome();
}

function NextExam_OnClick()
{
	if (CurrentExamOrdinal < GlobalLevels.length - 1)
	{
		Exam_Timer();
		ExamPoints = 0;
		if (LastExamPassed == true) {
			CurrentExamOrdinal += 1;
		}
		ShowExam();
	}
}

function BuyUpgrade_OnClick(ButtonId)
{
	var UpgradeId = ButtonId.substring(7);
	var Index = Upgrade.GetIndexOf(UpgradeId);
	var Cost = GlobalUpgrades[Index].Cost;
	if (CurrencyUnits >= Cost)
	{
		CurrencyUnits -= Cost;
		GlobalUpgrades[Index].Purchased = true;
		UpdateHome();
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
	return GlobalLevels[CurrentExamOrdinal].Points[4];
	// The following code returns the next goal value depending on the current grade.
	/*var Goal = GlobalLevels[CurrentExamOrdinal].Points[4];
	for (var i = 0; i < 5; i++) {
		if (ExamPoints < GlobalLevels[CurrentExamOrdinal].Points[i]) {
			Goal = GlobalLevels[CurrentExamOrdinal].Points[i];
			break;
		}
	}
	return Goal;*/
}

function ShowHome()
{
	// Display home
	document.getElementById("Exam").style.display = "none";
	document.getElementById("Home").style.display = "block";
	document.getElementById("HomeGameOver").style.display = "none";
	// Game over condition
	if (TotalExamsFailed == 3)
	{
		document.getElementById("HomeContinue").style.display = "none";
		document.getElementById("HomeGameOver").style.display = "block";
	}
	// Update the UI
	UpdateHome();
}

function ShowExam()
{
	document.getElementById("Home").style.display = "none";
	document.getElementById("Exam").style.display = "block";
	UpdateExamPoints();
	UpdateExamOrdinal();
}

function WorkHard_Timer()
{
	var TimerId = window.setInterval(WorkHard_OnProgressUpdate, 20);
	var Timestamp = new Date();

	function WorkHard_OnProgressUpdate()
	{
		var Progress = document.getElementById("ExamWorkProgress");
		if (Progress.value >= Progress.max)
		{
			Progress.value = 0;
		}
		else
		{
			var NewTimestamp = new Date();
			Progress.value += NewTimestamp - Timestamp;
			Timestamp = NewTimestamp;
			if (Progress.value >= Progress.max)
			{
				window.clearInterval(TimerId);
				document.getElementById("ExamWorkHard").disabled = false;
				// Add the stuff
				ExamPoints += 1;
				UpdateExamPoints();
			}
		}
	}
}

var ExamTimerId;
function Exam_Timer()
{
	ExamTimerId = window.setInterval(Exam_OnTimerUpdate, 1000);
	var TimerData = 61;
	Exam_OnTimerUpdate();

	function Exam_OnTimerUpdate()
	{
		TimerData -= 1;
		// Get label
		var Label = document.getElementById("ExamTimeProgress");
		// Calculate values
		var Minutes = Math.floor(TimerData / 60);
		var Seconds = TimerData - Minutes * 60;
		// Display values
		var LabelText = "";
		if (Minutes < 10)
		{
			LabelText += "0";
		}
		LabelText += Minutes + ":";
		if (Seconds < 10)
		{
			LabelText += "0";
		}
		LabelText += Seconds;
		Label.innerHTML = LabelText;

		if (TimerData == -1)
		{
			EndExam_OnClick();
		}
	}
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
	// Determine the outcome message
	var ExamStatus;
	if (Grade == 0) { ExamStatus = "You have failed the exam!"; }
	else { ExamStatus = "Congratulations! You have passed the exam with grade " + Grade; }
	// Update elements
	document.getElementById("HomeExamStatus").innerHTML = ExamStatus;
	document.getElementById("HomeCurrencyUnits").innerHTML = "- Your (up)grade money: " + CurrencyUnits;
	document.getElementById("HomeExamsPassed").innerHTML = "- Exams passed: " + TotalExamsPassed;
	document.getElementById("HomeExamsFailed").innerHTML = "- Exams failed: " + TotalExamsFailed + " / 3";
	// Update upgrade list
	UpdateUpgradeList();
}

function UpdateUpgradeList()
{
	var Div = "";
	document.getElementById("HomeUpgrades").innerHTML = "";
	for (var i = 0; i < GlobalUpgrades.length; i++)
	{
		if (Upgrade.IsVisible(GlobalUpgrades[i].Id))
		{
			// Div tag
			Div = "<div id=\"Upg_" + GlobalUpgrades[i].Id + "\" class=\"HomeUpgradesFloater\">";
			// Upgrade name
			Div += "<div><div>" + GlobalUpgrades[i].Name + "</div>";
			// Upgrade cost
			Div += "<div>Cost: " + GlobalUpgrades[i].Cost + "</div></div>";
			// Button
			Div += "<button id=\"UpgBtn_" + GlobalUpgrades[i].Id + "\" class=\"HomeUpgradesButton\" onclick=\"BuyUpgrade_OnClick(this.id)\">Buy</button>";
			// Div closing tag
			Div += "</div>"
			document.getElementById("HomeUpgrades").innerHTML += Div;
		}
	}
}