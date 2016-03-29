var macro = '';
var filterImage = "FILTER TYPE=IMAGES STATUS=ON "+"\n";
var url = "http://www.grabon.in/1mg-coupons/";
var storename = '1mg';

var affBtnID = 126;
var sitename = 'grabon';


var dateTime = new Date().toLocaleString();
dateTime = dateTime.split(' ').join('');
dateTime = dateTime.replace(',','-');

macro += "CODE:";
macro += "VERSION BUILD=10022823"+"\n";
macro += "TAB T=1"+"\n";
macro += "TAB CLOSEALLOTHERS"+"\n";
macro += filterImage;
macro += "URL GOTO="+url+"\n";

iimPlay(macro);
// macro += "SET !TIMEOUT_STEP 2"+"\n";

// macro+="ADD !EXTRACT INDEX"+"\n";
// macro+="ADD !EXTRACT TITLE"+"\n";
// macro+="ADD !EXTRACT DESCRIPTION"+"\n";
// macro+="ADD !EXTRACT TITLE"+"\n";
// macro+="ADD !EXTRACT TYPE"+"\n";
// macro+="ADD !EXTRACT CODE"+"\n";

// macro+="SAVEAS TYPE=EXTRACT FOLDER=* FILE=grabon-jabong-"+dateTime+".csv"+"\n";

// iimDisplay("Running Macro");
// iimPlay(macro);

//  var offerItems = window.document.getElementsByClassName('coupon-list-item');

//  var offerCount = offerItems.length;

// for(var i=1;i<=offerCount;i++){
// 	macro ="CODE:";
// 	macro += "SET !TIMEOUT_STEP 1"+"\n";
// 	iimDisplay("Extracting " + i);
// 	iimSet("i",i);
// 	macro += "ADD !EXTRACT {{i}}"+"\n";
// 	macro += "TAG POS={{i}} TYPE=B ATTR=CLASS:h3_click EXTRACT=TXT"+"\n";
// 	macro += "TAG POS={{i}} TYPE=DIV ATTR=CLASS:coupon-description EXTRACT=TXT"+"\n";
// 	macro += "TAG POS={{i}} TYPE=LI ATTR=CLASS:coupon-extras-expiry EXTRACT=TXT"+"\n";
// 	macro += "TAG POS={{i}} TYPE=SPAN ATTR=CLASS:go-smooth EXTRACT=TXT"+"\n";

// 	var offerObject = offerItems[i-1];
// 	iimDisplay(offerObject.dataset.type);
// 	if(offerObject.dataset.type == 1){
// 		var couponcode = offerObject.children[2].children[0].children[0].children[1];
// 		if(couponcode){
// 			couponcode = couponcode.textContent;
// 			iimSet('code',couponcode);
// 			macro+="ADD !EXTRACT {{code}}"+"\n";
// 		}
// 	}

// 	macro+="SAVEAS TYPE=EXTRACT FOLDER=* FILE=grabon-jabong-"+dateTime+".csv"+"\n";
// 	iimPlay(macro);	
// }

iimDisplay('Initiating Content Extraction');

var offerTypes = [];
var offerTitles = [];
var offerDescription = [];
var offerExpriy = [];
var codes = [];

var offerItems = window.document.getElementsByClassName('coupon-list-item');
var offerCount = offerItems.length;

iimDisplay(offerCount+' offers found');

function getFormattedDate(date) {
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}

for(var i=1;i<=offerCount;i++){
	var offerObject = offerItems[i-1];
	var description = offerObject.children[1].children[1].textContent
	var title = offerObject.children[1].children[0].textContent;
	var expiryDate = offerObject.children[1].children[2].children[0].textContent;
	expiryDate = expiryDate.trim();
	expiryDate = expiryDate.replace('Ends on ','');

	expiryDate = new Date(expiryDate);
	expiryDate = getFormattedDate(expiryDate);

	var couponcode = "";
	offerTitles.push(title);
	offerDescription.push(description);
	offerExpriy.push(expiryDate);
	if(offerObject.dataset.type == 1){
		offerTypes.push('coupon');
		couponcode = offerObject.children[2].children[0].children[0].children[1].textContent;
	}else if(offerObject.dataset.type == 2){
		offerTypes.push('deal');
	}else{
		offerTypes.push('coupon');
		couponcode = offerObject.children[2].children[0].children[0].children[1].textContent;
	}
	codes.push(couponcode);
}

iimDisplay('Finished Extracting '+offerCount+' offers from dom');

// macro = "CODE:";
// macro += "PROMPT \"EXECUTE LINK GENERATION? Y/N\" {{!VAR1}}"+"\n";
// macro+="SET !EXTRACT {{!VAR1}}"+"\n";
// iimPlay(macro);

// var answer = iimGetLastExtract();

var answer = 'y';
if(answer.toLowerCase() == 'y'){

	macro = "CODE:";
	//macro += " SET !SINGLESTEP YES "+"\n";
	macro += "TAB T=1"+"\n";
	macro += "TAB CLOSEALLOTHERS"+"\n";
	macro += filterImage;
	macro += "URL GOTO="+url+"\n";
	macro+="ADD !EXTRACT INDEX"+"\n";
	macro+="ADD !EXTRACT TITLE"+"\n";
	macro+="ADD !EXTRACT TYPE"+"\n";
	macro+="ADD !EXTRACT DESCRIPTION"+"\n";
	macro+="ADD !EXTRACT EXPIRY"+"\n";
	macro+="ADD !EXTRACT CODE"+"\n";
	macro+="ADD !EXTRACT URL"+"\n";
	macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+sitename+"-"+storename+"-urls-"+dateTime+".csv"+"\n";
	iimPlay(macro);
		
	for(var i=1;i<=offerCount;i++){
		macro = "CODE:";
		macro += "WAIT SECONDS=1"+"\n";
		//macro += " SET !SINGLESTEP YES "+"\n";
		macro += "SET !ERRORIGNORE YES"+"\n";
		macro += filterImage;
		iimSet("i",i);
		iimDisplay('offerType:'+offerTypes[i-1]+" offerTitle:"+offerTitles[i-1]+" on link no:"+i);
		macro += "SET !TIMEOUT_STEP 2"+"\n";
		macro += "URL GOTO="+url+"\n";
		macro += "SET !EXTRACT NULL"+"\n";
		iimSet('title',offerTitles[i-1]);
		iimSet('index',i);
		iimSet('description',offerDescription[i-1]);
		iimSet('type',offerTypes[i-1]);
		iimSet('expiry',offerExpriy[i-1]);
		iimSet('code',codes[i-1]);

		macro += "ADD !EXTRACT {{index}}"+"\n";
		macro += "WAIT SECONDS=1"+"\n";
		macro += "ADD !EXTRACT {{title}}"+"\n";
		macro += "ADD !EXTRACT {{type}}"+"\n";
		macro += "ADD !EXTRACT {{description}}"+"\n";
		macro += "ADD !EXTRACT {{expiry}}"+"\n";
		macro += "ADD !EXTRACT {{code}}"+"\n";

		if(offerTypes[i-1]=='coupon'){
			macro += "TAG POS={{i}} TYPE=SPAN ATTR=CLASS:go-smooth"+"\n";
			//macro += "TAG POS={{i}} TYPE=SPAN ATTR=TXT:Show<SP>Coupon<SP>Code"+"\n";
			macro += "TAB T=1"+"\n";
			macro += "TAB CLOSEALLOTHERS"+"\n";
			macro += "ADD !EXTRACT {{!URLCURRENT}}"+"\n";
			macro += "BACK"+"\n";
			macro += "WAIT SECONDS=1"+"\n";
		}else if(offerTypes[i-1]=='deal'){
			//macro += "TAG POS={{i}} TYPE=A ATTR=TXT:Activate<SP>Deal"+"\n";
			macro += "TAG POS={{i}} TYPE=SPAN ATTR=CLASS:go-smooth"+"\n";
			macro += "TAB T=2"+"\n";
			macro += "ADD !EXTRACT {{!URLCURRENT}}"+"\n";
			macro += "TAB T=1"+"\n";
			macro += "TAB CLOSEALLOTHERS"+"\n";
			macro += "WAIT SECONDS=1"+"\n";
		}else{
			macro += "TAG POS={{i}} TYPE=SPAN ATTR=CLASS:go-smooth"+"\n";
			//macro += "TAG POS={{i}} TYPE=SPAN ATTR=TXT:Grabon<SP>Exclusive"+"\n";
			macro += "TAB T=2"+"\n";
			macro += "ADD !EXTRACT {{!URLCURRENT}}"+"\n";
			macro += "TAB T=1"+"\n";
			macro += "TAB CLOSEALLOTHERS"+"\n";
			macro += "WAIT SECONDS=1"+"\n";
		}
		macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+sitename+"-"+storename+"-urls-"+dateTime+".csv"+"\n";
		iimPlay(macro);
	}
}

iimDisplay('imacros link extraction done');

// macro = "CODE:";
// macro += "PROMPT \"EXECUTE AFFILIATE LINK GENERATION? Y/N\" {{!VAR1}}"+"\n";
// macro+="SET !EXTRACT {{!VAR1}}"+"\n";
// iimPlay(macro);

// var answer = iimGetLastExtract();
// if(answer.toLowerCase() == 'y'){
// 	iimDisplay('Beginning affiliate link generation');

// 	macro = "CODE:";
// 	macro += "PROMPT \"Enter AFF Id\" {{!VAR1}}"+"\n";
// 	macro+="SET !EXTRACT {{!VAR1}}"+"\n";
// 	iimPlay(macro);

// 	affBtnID = iimGetLastExtract();

// 	var macro ="CODE:";

// 	macro+="ADD !EXTRACT INDEX"+"\n";
// 	macro+="ADD !EXTRACT TITLE"+"\n";
// 	macro+="ADD !EXTRACT DESCRIPTION"+"\n";
// 	macro+="ADD !EXTRACT EXPIRY"+"\n";
// 	macro+="ADD !EXTRACT CODE"+"\n";
// 	macro+="ADD !EXTRACT URL"+"\n";
// 	macro+="ADD !EXTRACT CONVERTED AFF URL"+"\n";
// 	macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+sitename+"-"+storename+"-converted-aff-urls-"+dateTime+".csv";

// 	iimPlay(macro);

// 	var macro ="CODE:";

// 	macro += "TAB T=2"+"\n";

// 	for(var i=2;i<=offerCount;i++){
// 		macro += "SET !DATASOURCE "+sitename+"-"+storename+"-urls-"+dateTime+".csv"+"\n";

// 		iimDisplay("Generating Affiliate link no:"+i);

// 		macro += "SET !LOOP "+i+"\n";
		
// 		macro += "SET !DATASOURCE_LINE {{!LOOP}}"+"\n";

// 		macro += "FRAME F=2"+"\n";

// 		macro += "TAG POS=1 TYPE=SELECT ATTR=NAME:offer_id CONTENT=%"+affBtnID+"\n";

// 		macro += "TAG POS=1 TYPE=INPUT:TEXT ATTR=NAME:website_link CONTENT={{!COL7}}"+"\n";

// 		macro += "TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:Add"+"\n";

// 		macro += "ADD !EXTRACT {{!COL1}}"+"\n";

// 		macro += "ADD !EXTRACT {{!COL2}}"+"\n";

// 		macro += "ADD !EXTRACT {{!COL3}}"+"\n";

// 		macro += "ADD !EXTRACT {{!COL4}}"+"\n";

// 		macro += "ADD !EXTRACT {{!COL5}}"+"\n";

// 		macro += "ADD !EXTRACT {{!COL6}}"+"\n";

// 		macro += "WAIT SECONDS=2"+"\n";

// 		macro += "TAG POS=1 TYPE=TEXTAREA ATTR=NAME:deeplink EXTRACT=TXT"+"\n";

// 		macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+sitename+"-"+storename+"-converted-aff-urls.csv"+"\n";
// 	}

// 	iimPlay(macro);	
// }