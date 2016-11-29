
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
	constructor(Id, Name, Description, Cost, ParentId)
	{
		this.Id = Id;
		this.Name = Name;
		this.Description = Description;
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
var CurrencyUnits = 100;
var LastExamPassed = true;
var DebugMode = true;

//=====================================================================
// Initialization
//=====================================================================
function Initialization()
{
	// Generate some temporary levels
	for (var i = 2; i < 50; i++)
	{
		GlobalLevels.push(new Level("Temporary Exam", i * 4, i * 2, "Linear"));
	}
	// Push upgrades
	GlobalUpgrades.push(new Upgrade("click01", "Enthusiasm", "Each click now gives you 2 points.", 3, null));
	GlobalUpgrades.push(new Upgrade("click02", "Courage", "Each click now gives you 3 points.", 3, "click01"));
	GlobalUpgrades.push(new Upgrade("click03", "Persistence", "Each click now gives you 4 points.", 3, "click02"));
	GlobalUpgrades.push(new Upgrade("click04", "Dedication", "Each click now gives you 5 points.", 3, "click03"));
	GlobalUpgrades.push(new Upgrade("click05", "Determination", "Each click now gives you 10 points.", 7, "click04"));
	GlobalUpgrades.push(new Upgrade("speed01", "Time Management, Introductory course", "Your clicks are now 50% faster.", 3, null));
	GlobalUpgrades.push(new Upgrade("speed02", "Time Management, Advanced course", "Your clicks are now 2 times faster.", 3, "speed01"));
	GlobalUpgrades.push(new Upgrade("speed03", "Time Management, Professional course", "Your clicks are now 3 times faster.", 3, "speed02"));
	GlobalUpgrades.push(new Upgrade("speed04", "Time Management, Scientific course", "Your clicks are now 4 times faster.", 3, "speed03"));
	GlobalUpgrades.push(new Upgrade("speed_jacobs", "Time Management, Jacobs course", "Fires as fast as you can pull down the trigger.", 7, "speed04"));
	GlobalUpgrades.push(new Upgrade("crit", "Sudden Inspiration", "You have a 5% chance to get inspired and double your points for a click.", 3, "click01"));
	GlobalUpgrades.push(new Upgrade("crit_damage01", "Massive Inspiration, Level 1", "Inspiration now gives you 2.5x points.", 3, "crit"));
	GlobalUpgrades.push(new Upgrade("crit_damage02", "Massive Inspiration, Level 2", "Inspiration now gives you 3.0x points.", 3, "crit_damage01"));
	GlobalUpgrades.push(new Upgrade("crit_damage03", "Massive Inspiration, Level 3", "Inspiration now gives you 3.5x points.", 3, "crit_damage02"));
	GlobalUpgrades.push(new Upgrade("crit_damage04", "Massive Inspiration, Level 4", "Inspiration now gives you 4.0x points.", 3, "crit_damage03"));
	GlobalUpgrades.push(new Upgrade("crit_damage05", "Massive Inspiration, Level 5", "Inspiration now gives you 4.5x points.", 3, "crit_damage04"));
	GlobalUpgrades.push(new Upgrade("crit_damage06", "Massive Inspiration, Level 6", "Inspiration now gives you 5.0x points.", 3, "crit_damage05"));
	GlobalUpgrades.push(new Upgrade("crit_damage07", "Massive Inspiration, Level 7", "Inspiration now gives you 5.5x points.", 3, "crit_damage06"));
	GlobalUpgrades.push(new Upgrade("crit_damage08", "Massive Inspiration, Level 8", "Inspiration now gives you 6.0x points.", 3, "crit_damage07"));
	GlobalUpgrades.push(new Upgrade("crit_chance01", "Reliable Inspiration, Level 1", "Inspiration now has 10% chance to occur.", 3, "crit"));
	GlobalUpgrades.push(new Upgrade("crit_chance02", "Reliable Inspiration, Level 2", "Inspiration now has 15% chance to occur.", 3, "crit_chance01"));
	GlobalUpgrades.push(new Upgrade("crit_chance03", "Reliable Inspiration, Level 3", "Inspiration now has 20% chance to occur.", 3, "crit_chance02"));
	GlobalUpgrades.push(new Upgrade("crit_chance04", "Reliable Inspiration, Level 4", "Inspiration now has 25% chance to occur.", 3, "crit_chance03"));
	GlobalUpgrades.push(new Upgrade("crit_chance05", "Reliable Inspiration, Level 5", "Inspiration now has 30% chance to occur.", 3, "crit_chance04"));
	GlobalUpgrades.push(new Upgrade("crit_chance06", "Reliable Inspiration, Level 6", "Inspiration now has 35% chance to occur.", 3, "crit_chance05"));
	GlobalUpgrades.push(new Upgrade("crit_chance07", "Reliable Inspiration, Level 7", "Inspiration now has 40% chance to occur.", 3, "crit_chance06"));
	GlobalUpgrades.push(new Upgrade("crit_chance08", "Reliable Inspiration, Level 8", "Inspiration now has 45% chance to occur.", 3, "crit_chance07"));
	GlobalUpgrades.push(new Upgrade("crit_chance09", "Reliable Inspiration, Level 9", "Inspiration now has 50% chance to occur.", 3, "crit_chance08"));
	//GlobalUpgrades.push(new Upgrade("crit_double01", "Inspiration Overflow", "Inspiration now can happen one extra time.", 5, "crit_damage08"));
	//GlobalUpgrades.push(new Upgrade("crit_double02", "Inspiration Overflow", "Inspiration now can happen one extra time.", 5, "crit_chance09"));
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
		// Start timer
		if (Upgrade.IsPurchased("speed_jacobs") == false)
		{
			WorkHard_Timer();
			document.getElementById("ExamWorkHard").disabled = true;
		}
		// Insta-finish timer
		else
		{
			WorkHard_TimerEnd();
		}
	}
}

function WorkHard_TimerEnd()
{
	// Add the points				
	ExamPoints += GetExamPointsPerClick();
	// Update points
	var Goal = GetCurrentExamPointsGoal();
	if (ExamPoints > Goal) { ExamPoints = Goal; }
	UpdateExamPoints();
}

function EndExam_OnClick()
{
	// Update the stats
	var Grade = GetCurrentExamGrade();
	if (Grade == 0 && DebugMode == false) {
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
function GetExamPointsPerClick()
{
	var PointsToAdd = 1;
	// Vanilla points
	if (Upgrade.IsPurchased("click01")) { PointsToAdd = 2; } 
	if (Upgrade.IsPurchased("click02")) { PointsToAdd = 3; } 
	if (Upgrade.IsPurchased("click03")) { PointsToAdd = 4; } 
	if (Upgrade.IsPurchased("click04")) { PointsToAdd = 5; } 
	if (Upgrade.IsPurchased("click05")) { PointsToAdd = 10; } 
	// Inspiration
	if (Upgrade.IsPurchased("crit"))
	{
		// Calculate the chance
		var CritChance = 0.05;
		if (Upgrade.IsPurchased("crit_chance01")) { CritChance = 0.10; }
		if (Upgrade.IsPurchased("crit_chance02")) { CritChance = 0.15; }
		if (Upgrade.IsPurchased("crit_chance03")) { CritChance = 0.20; }
		if (Upgrade.IsPurchased("crit_chance04")) { CritChance = 0.25; }
		if (Upgrade.IsPurchased("crit_chance05")) { CritChance = 0.30; }
		if (Upgrade.IsPurchased("crit_chance06")) { CritChance = 0.35; }
		if (Upgrade.IsPurchased("crit_chance07")) { CritChance = 0.40; }
		if (Upgrade.IsPurchased("crit_chance08")) { CritChance = 0.45; }
		if (Upgrade.IsPurchased("crit_chance09")) { CritChance = 0.50; }
		var CritFactor = 2;
		if (Upgrade.IsPurchased("crit_damage01")) { CritFactor = 2.5; }
		if (Upgrade.IsPurchased("crit_damage02")) { CritFactor = 3.0; }
		if (Upgrade.IsPurchased("crit_damage03")) { CritFactor = 3.5; }
		if (Upgrade.IsPurchased("crit_damage04")) { CritFactor = 4.0; }
		if (Upgrade.IsPurchased("crit_damage05")) { CritFactor = 4.5; }
		if (Upgrade.IsPurchased("crit_damage06")) { CritFactor = 5.0; }
		if (Upgrade.IsPurchased("crit_damage07")) { CritFactor = 5.5; }
		if (Upgrade.IsPurchased("crit_damage08")) { CritFactor = 6.0; }
		// Apply critical(s)
		var CritRolls = 1;
		if (Upgrade.IsPurchased("crit_double01")) { CritRolls += 1; }
		if (Upgrade.IsPurchased("crit_double02")) { CritRolls += 1; }
		for (var i = 0; i < CritRolls; i++)
		{
			var Roll = Math.random();
			if (Roll < CritChance) { PointsToAdd *= CritFactor; }
			else { break; }
		}
	}
	return Math.floor(PointsToAdd);
}

function GetWorkHardTimeModifier()
{
	var SpeedModifier = 1.0;
	if (Upgrade.IsPurchased("speed01")) { SpeedModifier = 1.5; }
	if (Upgrade.IsPurchased("speed02")) { SpeedModifier = 2.0; }
	if (Upgrade.IsPurchased("speed03")) { SpeedModifier = 3.0; }
	if (Upgrade.IsPurchased("speed04")) { SpeedModifier = 4.0; }
	return SpeedModifier;
}

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
			Progress.value += (NewTimestamp - Timestamp) * GetWorkHardTimeModifier();
			Timestamp = NewTimestamp;
			if (Progress.value >= Progress.max)
			{
				window.clearInterval(TimerId);
				document.getElementById("ExamWorkHard").disabled = false;
				WorkHard_TimerEnd();
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
	if (Grade == 0 && DebugMode == false) { ExamStatus = "You have failed the exam!"; }
	else if (Grade == 0 && DebugMode == true) { ExamStatus = "You have failed the exam! But it's debug mode so it's all k."; }
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
			Div += "<div>Cost: " + GlobalUpgrades[i].Cost + "</div>";
			// Upgrade description
			Div += "<div class=\"HomeUpgradesText\">" + GlobalUpgrades[i].Description + "</div></div>";
			// Button
			Div += "<button id=\"UpgBtn_" + GlobalUpgrades[i].Id + "\" class=\"HomeUpgradesButton\" onclick=\"BuyUpgrade_OnClick(this.id)\">Buy</button>";
			// Div closing tag
			Div += "</div>"
			document.getElementById("HomeUpgrades").innerHTML += Div;
		}
	}
}