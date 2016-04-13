var macro = '';
var filterImage = "FILTER TYPE=IMAGES STATUS=ON "+"\n";

var csvObj = { 
  pepperfry:
   { csvFile: 'output-csv/grabon-pepperfry-urls-4_7_2016-3_49_37PM.csv',
     rowCount: 24 },
  zivame:
   { csvFile: 'output-csv/grabon-zivame-urls-4_11_2016-8_51_53AM.csv',
     rowCount: 27 } 
};

var blacklistStores = ["ace2three", "amazon", "askmebazaar", "askmegrocery", "candere", "ezone", "flipkart",
 "foodpanda", "freecharge", "happilyunmarried", "jockey","makemytrip", "mobikwik", "naaptol", "printvenue",
  "purplle", "snapdeal", "syberplace", "thomascook"];

var csvfiles = [];
var offerCounts = [];
var affBtnIDS = [];

var affBtnObj = {
	faballey:28,
	makemytrip:44, //seperate btn ids for flight
	pepperfry:52,
	printland:90,
	ticketgoose:98,
	zivame:100,
	vistaprint:114,
	lenskart:120,
	shopclues:122,
	jabong:126,
	trendin:140,
	clovia:146,
	stalkbuylove:230,
	nykaa:232,
	wonderchef:244,
	fernsnpetals:260,
	limeroad:280,
	shopcj:290,
	koovs:318,
	healthgenie:346,
	suratdiamond:364,
	bookmyflowers:398,
	homeshop18:402,
	zovi:480,
	shoppersstop:510,
	dailyobjects:542,
	smiledrive:571,
	mybustickets:579,
	indiangiftsportal:709,
	bluestone:713,
	archies:727,
	chumbak:735,
	expedia:779,
	floweraura:787,
	americanswan:817,
	infibeam:899,
	thegudlook:907,
	indiareads:919,
	shopnineteen:985,
	excitinglives:1006,
	travelkhana:1016,
	ebay:1018,
	paytm:1022,
	fabfurnish:1070,
	kapkids:1078,
	giftease:1126,
	amzer:1236,
	giftsbymeeta:1274,
	giftalove:1292,
	fabindia:1326,
	oyorooms:1362,
	evok:1460,
	healthkart:1480,
	bilba:1490,
	"1mg":1578,
	agoda:1632,
	tolexo:1670,
	greendust:1678,
	voylla:1686,
	wearyourshine:1700,
	myflowertree:1720,
	aplava:1764,
	kazo:1792,
	bluehost:1960,
	firstcry:2031,
	flyingmachine:2141,
	industrybuying:2187,
	abof:2361,
	naturesbasket:2371,
	sendmygift:2375
};

var unavailableAffBtnIds = [];

for(var c in csvObj){
	if(blacklistStores.indexOf(csvObj[c])<0){
		if(!affBtnObj[c]){
			unavailableAffBtnIds.push(c);
		}else{
			affBtnIDS.push(affBtnObj[c]);
			csvfiles.push(csvObj[c].csvFile);
			offerCounts.push(csvObj[c].rowCount);
		}
	}
}

var sitename = 'grabon';

iimDisplay('Beginning affiliate link generation');

for(var j = 0; j < csvfiles.length; j++){

	var dateTime = new Date().toLocaleString();
	dateTime = dateTime.split(' ').join('');
	dateTime = dateTime.replace(',','-');

	var offerCount = offerCounts[j];
	var csvfile = csvfiles[j];
	csvfile = csvfile.split('/')[1];

	var storename = csvfile.split('-');
	storename = storename[1];

	var affBtnID = affBtnIDS[j];

	var filename = "converted-aff-urls-"+sitename+"-"+storename+dateTime;

	var macro ="CODE:";
	//macro += "SET !SINGLESTEP YES "+"\n";
	macro += "ADD !EXTRACT INDEX"+"\n";
	macro += "ADD !EXTRACT TITLE"+"\n";
	macro += "ADD !EXTRACT TYPE"+"\n";
	macro += "ADD !EXTRACT DESCRIPTION"+"\n";
	macro += "ADD !EXTRACT EXPIRY"+"\n";
	macro += "ADD !EXTRACT CODE"+"\n";
	macro += "ADD !EXTRACT URL"+"\n";
	macro += "ADD !EXTRACT CATEGORIES"+"\n";
	macro += "ADD !EXTRACT CONVERTED<SP>AFF<SP>URL"+"\n";

	macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+filename+".csv";

	iimPlay(macro);

	for(var i=2;i<=offerCount;i++){
		var macro ="CODE:";

		//macro += "TAB T=1"+"\n";

		//macro += "SET !SINGLESTEP YES "+"\n";

		if(csvfile.indexOf('.csv')<0){
			macro += "SET !DATASOURCE "+csvfile+".csv"+"\n";
		}else{
			macro += "SET !DATASOURCE "+csvfile+"\n";
		}

		iimDisplay("Generating Affiliate link no:"+i);

		macro += "SET !LOOP "+i+"\n";

		macro += "SET !DATASOURCE_LINE {{!LOOP}}"+"\n";

		macro += "FRAME F=2"+"\n";

		macro += "TAG POS=1 TYPE=SELECT ATTR=ID:offer_id CONTENT=%"+affBtnID+"\n";

		//macro += 'SET !VAR1 EVAL("var url=\"{{!COL7}}\"; var id = url.indexOf(\"?utm_source\"); url = url.substr(0,id) ); ")'+'\n';

		macro += "TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:website_link CONTENT={{!COL7}}"+"\n";

		macro += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Add"+"\n";

		macro += "ADD !EXTRACT {{!COL1}}"+"\n";

		macro += "ADD !EXTRACT {{!COL2}}"+"\n";

		macro += "ADD !EXTRACT {{!COL3}}"+"\n";

		macro += "ADD !EXTRACT {{!COL4}}"+"\n";

		macro += "ADD !EXTRACT {{!COL5}}"+"\n";

		macro += "ADD !EXTRACT {{!COL6}}"+"\n";

		macro += "ADD !EXTRACT {{!COL7}}"+"\n";

		macro += "ADD !EXTRACT {{!COL8}}"+"\n";

		macro += "WAIT SECONDS=1"+"\n";

		macro += "TAG POS=1 TYPE=TEXTAREA ATTR=NAME:deeplink EXTRACT=TXT"+"\n";

		macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+filename+".csv";

		iimPlay(macro);
	}

}
iimDisplay('Affiliate link generation done');
