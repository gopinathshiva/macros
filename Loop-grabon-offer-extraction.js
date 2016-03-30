var macro = '';
var filterImage = "FILTER TYPE=IMAGES STATUS=ON "+"\n";
var siteurl = 'http://www.grabon.in/';
var storenames = ['1mg','abof','ace2three','amazon','americanswan','amzer','aplava','archies','askmegrocery','askmebazaar','beingjuliet','bluestone','bookmyflowers','candere','cardekho','chumbak','dailyobjects','ebay','evok','excitinglives','ezone','faballey',
'fabfurnish','fernspetals','floweraura','flyingmachine','foodpanda','giftalove','giftease','giftbymeeta','greendust','happilyunmarried','healthgenie','healthkart','homeshop18','industrybuying','infibeam','jockey','koovs','lenskart','limeroad','mobikwik','mybustickets','myflowertree','naaptol','naturesbasket','nykaa','ordervenue','oyorooms','printland','printvenue','purplle','shopclues','stalkbuylove','syberplace','thegudlook','thomascook','ticketgoose','tolexo','travelkhana',
'voylla','yepme'];

var startStore = '';
var startId = (storenames.indexOf(startStore)>=0)?storenames.indexOf(startStore):0;

var urls = [];
var categoryObj = {};

getCategoryObjects();

for(var i in storenames){
	urls.push(siteurl+storenames[i]+'-coupons/');
}

var url = '',storename = '';

var sitename = 'grabon';

for(var j = startId ; j <= urls.length; j++){

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
	var categoryDatas = [];

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
		var categories = offerObject.getAttribute('data-category');

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

		categories = categories.split(',');
		var requiredCategories = '';
		for(var m in categories){
			var cat_text = categoryObj[categories[m]];
			if(requiredCategories.indexOf(cat_text)<0){
				requiredCategories+=cat_text+',';
			}
		}
		requiredCategories = requiredCategories.substr(0,requiredCategories.length-2);
		categoryDatas.push(requiredCategories);
	}

	iimDisplay('Finished Extracting '+offerCount+' offers from dom');

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
		macro+="ADD !EXTRACT CATEGORIES"+"\n";
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
			iimSet('categories',categoryDatas[i-1]);

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
			macro += "ADD !EXTRACT {{categories}}"+"\n";
			macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE="+sitename+"-"+storename+"-urls-"+dateTime+".csv"+"\n";
			iimPlay(macro);
		}
	}

	iimDisplay('imacros link extraction done');
}

function getCategoryObjects() {
	categoryObj = {
	   "11":"Healthcare & Fitness",
	   "300":"Healthcare & Fitness",
	   "301":"Nutrition & Supplements",
	   "303":"Nutrition & Supplements",
	   "304":"Nutrition & Supplements",
	   "373":"Medicines",
	   "176":"Men Clothing",
	   "177":"Men Clothing",
	   "178":"Men Clothing",
	   "179":"Sports Wear",
	   "180":"Men Clothing",
	   "181":"Men Clothing",
	   "182":"Men Clothing",
	   "183":"Men Clothing",
	   "184":"Men Clothing",
	   "185":"Winter wear",
	   "186":"Men Clothing",
	   "187":"Men Clothing",
	   "188":"Men Clothing",
	   "189":"Men Clothing",
	   "196":"Women Clothing",
	   "199":"Women Clothing",
	   "2":"Accessories",
	   "202":"Women Clothing",
	   "203":"Women Clothing",
	   "205":"Women Clothing",
	   "206":"Women Clothing",
	   "214":"Women Clothing",
	   "232":"Footwear",
	   "24":"Fashion",
	   "252":"Bag & Accessory",
	   "49":"Men Clothing",
	   "50":"Women Clothing",
	   "25":"Entertainment",
	   "26":"Gaming",
	   "1":"Electronics",
	   "10":"Gifts",
	   "104":"Furniture & Decor",
	   "105":"Furniture & Decor",
	   "106":"Furniture & Decor",
	   "12":"Home Appliances",
	   "14":"Home Appliances",
	   "143":"Home Appliances",
	   "15":"Pet Items",
	   "163":"Storage Devices",
	   "173":"Cameras & Accessories",
	   "18":"Footwear",
	   "19":"Sporting Goods",
	   "21":"Kids & Toys",
	   "217":"Electronics",
	   "218":"Footwear",
	   "219":"Footwear",
	   "220":"Footwear",
	   "223":"Kids Clothing",
	   "227":"Kids Clothing",
	   "242":"Trimmers",
	   "244":"Eye wear",
	   "245":"Sunglasses",
	   "248":"Watches",
	   "254":"Watches",
	   "264":"Handbags & Wallets",
	   "269":"Gift Cards",
	   "27":"Mobiles",
	   "271":"Pet Items",
	   "276":"Pet Items",
	   "281":"Bike Accessories",
	   "283":"Car Accessories",
	   "284":"Car Accessories",
	   "285":"Car Accessories",
	   "286":"Car Accessories",
	   "3":"Automotive",
	   "34":"Mobile & Tablet Accessories",
	   "35":"Laptops",
	   "36":"Home Appliances",
	   "37":"Televisions",
	   "38":"Tablets",
	   "39":"Computer & Laptop Accessories",
	   "4":"Personal Care & Beauty",
	   "40":"Cameras & Accessories",
	   "5":"Books",
	   "54":"Kitchen & Dining",
	   "6":"Men Clothing,Women Clothing",
	   "61":"Storage Devices",
	   "75":"Kitchen & Dining",
	   "76":"Home Appliances",
	   "267":"Gifts",
	   "268":"Gifts",
	   "270":"Flowers & Cakes",
	   "110":"Beverages",
	   "112":"Sweets & Snacks",
	   "115":"Nutrition & Supplements",
	   "117":"Sweets & Snacks",
	   "118":"Sweets & Snacks",
	   "121":"Sweets & Snacks",
	   "313":"School & Stationery Items",
	   "47":"Groceries",
	   "7":"Food Ordering",
	   "158":"Computer & Laptop Accessories",
	   "237":"Electronics,Home Appliances",
	   "238":"Electronics,Home Appliances",
	   "240":"Electronics,Home Appliances",
	   "241":"Electronics,Home Appliances",
	   "243":"Electronics,Home Appliances",
	   "321":"Electronics,Home Appliances",
	   "56":"Healthcare & Fitness",
	   "59":"Headphones & Speakers",
	   "63":"Sportswear",
	   "66":"Sportswear",
	   "79":"Baby",
	   "9":"Baby",
	   "13":"Jewellery",
	   "305":"Jewellery",
	   "306":"Jewellery",
	   "307":"Jewellery",
	   "308":"Jewellery",
	   "309":"Jewellery",
	   "311":"Jewellery",
	   "312":"Jewellery",
	   "111":"Flowers & Cakes",
	   "249":"Fashion",
	   "250":"Bag & Accessory",
	   "262":"Bag & Accessory",
	   "314":"Others",
	   "263":"Cameras & Accessories",
	   "325":"Others",
	   "72":"Furniture & Decor",
	   "73":"Furniture & Decor",
	   "159":"Monitors & Desktops",
	   "160":"Storage Devices",
	   "170":"Cameras & Accessories",
	   "171":"Cameras & Accessories",
	   "172":"Cameras & Accessories",
	   "175":"Cameras & Accessories",
	   "215":"Women Clothing",
	   "216":"Women Clothing",
	   "251":"Fashion",
	   "119":"Home Appliances",
	   "132":"Home Appliances",
	   "139":"Televisions",
	   "141":"Computer & Laptop Accessories",
	   "144":"Home Appliances",
	   "145":"Home Appliances",
	   "147":"Home Appliances",
	   "150":"Home Appliances",
	   "151":"Home Appliances",
	   "156":"Home Appliances",
	   "157":"Home Appliances,Furniture & Decor",
	   "200":"Women Clothing",
	   "210":"Women Clothing",
	   "246":"Fashion",
	   "253":"Fashion",
	   "260":"Bag & Accessory",
	   "265":"Bag & Accessory",
	   "266":"Bag & Accessory",
	   "113":"Food Ordering",
	   "114":"Food Ordering",
	   "116":"Food Ordering",
	   "29":"Food Ordering",
	   "310":"Jewellery",
	   "167":"Computer & Laptop Accessories",
	   "168":"Computer & Laptop Accessories",
	   "261":"Bag & Accessory",
	   "165":"Headphones & Speakers",
	   "229":"Footwear",
	   "255":"Watches",
	   "258":"Women Clothing",
	   "259":"Women Clothing",
	   "64":"Footwear",
	   "65":"Footwear",
	   "318":"Safety Products",
	   "320":"Safety Products",
	   "322":"Tools",
	   "323":"Tools",
	   "329":"Tools",
	   "288":"Books",
	   "292":"eBooks & Magazines",
	   "247":"Optics & Contact Lenses",
	   "201":"Women Clothing",
	   "204":"Women Clothing",
	   "208":"Women Clothing",
	   "67":"Women Clothing",
	   "102":"DTH",
	   "103":"Movie Tickets",
	   "107":"Mobile Recharge",
	   "108":"Mobile Recharge",
	   "109":"Mobile Recharge",
	   "126":"Train Tickets",
	   "23":"Mobile Recharge",
	   "299":"Bill Payments",
	   "31":"Bus",
	   "120":"Sweets & Snacks",
	   "33":"Hotel",
	   "315":"School & Stationery Items",
	   "316":"Gifts",
	   "274":"Pet Items",
	   "137":"Bag & Accessory",
	   "51":"Women Clothing",
	   "52":"Women Clothing",
	   "213":"Women Clothing",
	   "127":"Travel Packages",
	   "130":"Travel Packages",
	   "32":"Flight",
	   "319":"Safety Products,Bike Accessories",
	   "326":"Plumbing",
	   "231":"Sports Wear",
	   "69":"Footwear",
	   "70":"Footwear"
   };
}
