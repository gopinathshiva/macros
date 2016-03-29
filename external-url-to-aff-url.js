var macro ="CODE:";
var csvFile = "jabong.csv";
var loopStart = 2;
var loopEnd = 98;
var affid = 126;

var dateTime = new Date().toLocaleString();
dateTime = dateTime.split(' ').join('');
dateTime = dateTime.replace(',','-');

//macro += "TAB T=1"+"\n";

//macro += "SET !SINGLESTEP YES "+"\n";

macro += "URL GOTO=http://www.vcommission.com/"+"\n";

macro += "TAG POS=1 TYPE=A ATTR=TXT:Login"+"\n";

macro += "SET !ENCRYPTION NO"+"\n";

macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:loginForm ATTR=ID:UserPassword CONTENT=$iva&Kala@31"+"\n";

macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:loginForm ATTR=ID:UserEmail CONTENT=couponmachi@gmail.com"+"\n";

macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:loginForm ATTR=ID:loginButton"+"\n";

macro += "WAIT SECONDS=15"+"\n";

macro += "TAG POS=1 TYPE=A ATTR=TXT:Tools"+"\n";

macro += "TAG POS=1 TYPE=A ATTR=TXT:Deeplink<SP>Tool"+"\n";

iimPlay(macro);

var macro ="CODE:";

macro+="ADD !EXTRACT INDEX"+"\n";
macro+="ADD !EXTRACT TITLE"+"\n";
macro+="ADD !EXTRACT CONVERTED AFF URL"+"\n";
macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=grabon-jabong-converted-aff-urls-"+dateTime+".csv";

iimPlay(macro);

for(var i=loopStart;i<=loopEnd;i++){

	var macro ="CODE:";

	iimDisplay('Converting url no:'+i);

	macro += "WAIT SECONDS=2"+"\n";

	macro += "SET !DATASOURCE "+csvFile+"\n";

	macro += "SET !LOOP "+i+"\n";

	macro += "SET !DATASOURCE_LINE {{!LOOP}}"+"\n";

	macro += "FRAME F=2"+"\n";

	macro += "TAG POS=1 TYPE=SELECT ATTR=NAME:offer_id CONTENT=%"+affid+"\n";

	macro += "TAG POS=1 TYPE=INPUT:TEXT ATTR=NAME:website_link CONTENT={{!COL4}}"+"\n";

	macro += "TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:Add"+"\n";

	macro += "ADD !EXTRACT {{!COL1}}"+"\n";

	macro += "ADD !EXTRACT {{!COL2}}"+"\n";

	macro += "WAIT SECONDS=2"+"\n";

	macro += "TAG POS=1 TYPE=TEXTAREA ATTR=NAME:deeplink EXTRACT=TXT"+"\n";

	macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=grabon-jabong-converted-aff-urls-"+dateTime+".csv";

	iimPlay(macro);	

}

iimDisplay('imacros url conversion done');