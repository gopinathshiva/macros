var macro = '';
var filterImage = "FILTER TYPE=IMAGES STATUS=ON "+"\n";

var csvfiles = ['grabon-thegudlook-urls-3_30_2016-9_02_38AM'];

var affBtnIDS = ['907'];
var offerCounts= [9];

var sitename = 'grabon';

iimDisplay('Beginning affiliate link generation');

for(var j = 0; j < csvfiles.length; j++){

	var dateTime = new Date().toLocaleString();
	dateTime = dateTime.split(' ').join('');
	dateTime = dateTime.replace(',','-');

	var offerCount = offerCounts[j];
	var csvfile = csvfiles[j];

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
	macro += "ADD !EXTRACT CONVERTED<SP>AFF<SP>URL"+"\n";

	macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+filename+".csv";

	iimPlay(macro);

	for(var i=2;i<=offerCount;i++){
		var macro ="CODE:";

		//macro += "TAB T=1"+"\n";

		//macro += "SET !SINGLESTEP YES "+"\n";

		macro += "SET !DATASOURCE "+csvfile+".csv"+"\n";

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

		macro += "WAIT SECONDS=1"+"\n";

		macro += "TAG POS=1 TYPE=TEXTAREA ATTR=NAME:deeplink EXTRACT=TXT"+"\n";

		macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+filename+".csv";

		iimPlay(macro);
	}

}
iimDisplay('Affiliate link generation done');
