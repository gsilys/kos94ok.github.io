
var HeroHealth = 100;
var HeroHealthMax = 100;
var HeroDamageMin = 5;
var HeroDamageMax = 15;
var EnemyHealth = 100;
var EnemyHealthMax = 100;
function Initialization()
{
	Update_All();
}

function Update_All()
{
	document.getElementById("HeroHealthValue").innerHTML = HeroHealth + " / " + HeroHealthMax;
	document.getElementById("EnemyHealthValue").innerHTML = EnemyHealth + " / " + EnemyHealthMax;
}

function Attack_OnClick()
{
	EnemyHealth -= Math.round(Math.random() * (HeroDamageMax - HeroDamageMin) + HeroDamageMin);
	if (EnemyHealth <= 0)
		EnemyHealth = EnemyHealthMax;
	Update_All();
}