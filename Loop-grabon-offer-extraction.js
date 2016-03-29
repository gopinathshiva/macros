var macro = '';
var filterImage = "FILTER TYPE=IMAGES STATUS=ON "+"\n";
// var urls = ["http://www.grabon.in/bluestone-coupons/","http://www.grabon.in/bookmyflowers-coupons/",
// "http://www.grabon.in/candere-coupons/","http://www.grabon.in/cardekho-coupons/","http://www.grabon.in/chumbak-coupons/","http://www.grabon.in/dailyobjects-coupons/",
// "http://www.grabon.in/ebay-coupons/","http://www.grabon.in/evok-coupons/","http://www.grabon.in/excitinglives-coupons/","http://www.grabon.in/ezone-coupons/","http://www.grabon.in/faballey-coupons/",
// "http://www.grabon.in/fabfurnish-coupons/","http://www.grabon.in/fernsnpetals-coupons/","http://www.grabon.in/floweraura-coupons/","http://www.grabon.in/flyingmachine-coupons/","http://www.grabon.in/foodpanda-coupons/",
// "http://www.grabon.in/giftalove-coupons/","http://www.grabon.in/giftease-coupons/","http://www.grabon.in/giftsbymeeta-coupons/","http://www.grabon.in/greendust-coupons/","http://www.grabon.in/happilyunmarried-coupons/",
// "http://www.grabon.in/healthgenie-coupons/","http://www.grabon.in/healthkart-coupons/","http://www.grabon.in/homeshop18-coupons/","http://www.grabon.in/industrybuying-coupons/","http://www.grabon.in/infibeam-coupons/","http://www.grabon.in/jockey-coupons/","http://www.grabon.in/koovs-coupons/",
//"http://www.grabon.in/lenskart-coupons/","http://www.grabon.in/limeroad-coupons/","http://www.grabon.in/mobikwik-coupons/","http://www.grabon.in/mybustickets-coupons/"];

var urls = ["http://www.grabon.in/myflowertree-coupons/","http://www.grabon.in/naaptol-coupons/","http://www.grabon.in/naturesbasket-coupons/","http://www.grabon.in/nykaa-coupons/","http://www.grabon.in/ordervenue-coupons/",
"http://www.grabon.in/oyorooms-coupons/","http://www.grabon.in/printland-coupons/","http://www.grabon.in/printvenue-coupons/","http://www.grabon.in/purplle-coupons/","http://www.grabon.in/shopclues-coupons/",
"http://www.grabon.in/stalkbuylove-coupons/","http://www.grabon.in/syberplace-coupons/","http://www.grabon.in/thegudlook-coupons/","http://www.grabon.in/thomascook-coupons/","http://www.grabon.in/ticketgoose-coupons/",
"http://www.grabon.in/tolexo-coupons/","http://www.grabon.in/travelkhana-coupons/","http://www.grabon.in/voylla-coupons/","http://www.grabon.in/yepme-coupons/"];

//var storenames = ['bluestone','bookmyflowers','candere','cardekho','chumbak','dailyobjects','ebay','evok','excitinglives','ezone','faballey',
//'fabfurnish','fernspetals','floweraura','flyingmachine','foodpanda','giftalove','giftease','giftbymeeta','greendust','happilyunmarried','healthgenie','healthkart','homeshop18','industrybuying','infibeam','jockey','koovs','lenskart','limeroad','mobikwik','mybustickets'];

var storenames = ['myflowertree','naaptol','naturesbasket','nykaa','ordervenue','oyorooms','printland','printvenue','purplle','shopclues','stalkbuylove','syberplace','thegudlook','thomascook','ticketgoose','tolexo','travelkhana',
'voylla','yepme'];

var url = '',storename = '';

var sitename = 'grabon';

for(var j = 12 ; j <= urls.length; j++){

	var dateTime = new Date().toLocaleString();
	dateTime = dateTime.split(' ').join('');
	dateTime = dateTime.replace(',','-');

	url = urls[j];
	storename = storenames[j];
	macro = '';

	macro += "CODE:";
	macro += "VERSION BUILD=10022823"+"\n";
	macro += "TAB T=1"+"\n";
	macro += "TAB CLOSEALLOTHERS"+"\n";
	macro += filterImage;
	macro += "URL GOTO="+url+"\n";

	iimPlay(macro);

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
}