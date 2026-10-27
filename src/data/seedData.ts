import { AppData, SkillSentence } from '../types';

export const RAW_SKILL_SEED: string[] = [
  "Greetings|Nimage hegidira?|Aap kaise hain?|आप कैसे हैं?",
  "Greetings|Nanu chennagiddene.|Main theek hoon.|मैं ठीक हूँ।",
  "Greetings|Namaskara|Namaste|नमस्ते",
  "Greetings|Shubhodaya|Suprabhat|सुप्रभात",
  "Greetings|Shubha ratri|Shubh ratri|शुभ रात्रि",
  "Greetings|Nimmannu bheti aagi santosha|Aap se milkar khushi hui|आप से मिलकर खुशी हुई",
  "Greetings|Dhanyavadagalu|Shukriya|शुक्रिया",
  "Greetings|Swagata|Swagat hai|स्वागत है",
  "Greetings|Matte sigona|Phir milenge|फिर मिलेंगे",
  "Greetings|Kshamisi|Maaf kijiye|माफ़ कीजिए",
  "Introduction|Nimma hesaru enu?|Aapka naam kya hai?|आपका नाम क्या है?",
  "Introduction|Nanna hesaru ...|Mera naam ... hai|मेरा नाम ... है",
  "Introduction|Nivu elliyavaru?|Aap kahan se hain?|आप कहाँ से हैं?",
  "Introduction|Nanu Karnatakada avanu.|Main Karnataka se hoon.|मैं कर्नाटक से हूँ।",
  "Introduction|Nanu ... kelasa madtene|Main ... kaam karta hoon|मैं ... काम करता हूँ",
  "Introduction|Nanage ... varsha|Meri umar ... saal hai|मेरी उम्र ... साल है",
  "Introduction|Nimma mane elli?|Aapka ghar kahan hai?|आपका घर कहाँ है?",
  "Introduction|Nanu Hindi kalitiddene|Main Hindi seekh raha hoon|मैं हिंदी सीख रहा हूँ",
  "Introduction|Idu nanna snehita|Yeh mera dost hai|यह मेरा दोस्त है",
  "Introduction|Nanna kutumba dodda|Mera parivar bada hai|मेरा परिवार बड़ा है",
  "General Talk|Nimage Hindi baruttada?|Kya aapko Hindi aati hai?|क्या आपको हिंदी आती है?",
  "General Talk|Nanage swalpa Hindi barutte|Mujhe thodi Hindi aati hai|मुझे थोड़ी हिंदी आती है",
  "General Talk|Nanage artha aayitu|Mujhe samajh aaya|मुझे समझ आया",
  "General Talk|Nanage artha aagilla|Mujhe samajh nahi aaya|मुझे समझ नहीं आया",
  "General Talk|Dayavittu matte hELi|Kripya phir se boliye|कृपया फिर से बोलिए",
  "General Talk|Swalpa nidhana maatadi|Thoda dheere boliye|थोड़ा धीरे बोलिए",
  "General Talk|Idara artha enu?|Iska matlab kya hai?|इसका मतलब क्या है?",
  "General Talk|Hindiyalli idannu hege hELuvudu?|Hindi mein ise kaise kehte hain?|हिंदी में इसे कैसे कहते हैं?",
  "General Talk|Howdu|Haan|हाँ",
  "General Talk|Illa|Nahin|नहीं",
  "General Talk|Sari|Theek hai|ठीक है",
  "General Talk|Nanage gottilla|Mujhe nahi pata|मुझे नहीं पता",
  "General Talk|Ondu nimisha|Ek minute|एक मिनट",
  "General Talk|Yenu aaytu?|Kya hua?|क्या हुआ?",
  "General Talk|Nija ha?|Sach mein?|सच में?",
  "Questions|Idu enu?|Yeh kya hai?|यह क्या है?",
  "Questions|Yaaru?|Kaun?|कौन?",
  "Questions|Elli?|Kahan?|ಕहाँ?",
  "Questions|Yavaga?|Kab?|कब?",
  "Questions|Yake?|Kyon?|क्यों?",
  "Questions|Hege?|Kaise?|कैसे?",
  "Questions|Eshtu?|Kitna?|कितना?",
  "Questions|Samaya eshtu?|Kitne baje hain?|कितने बजे हैं?",
  "Questions|Nivu yenu madtiddira?|Aap kya kar rahe hain?|आप क्या कर रहे हैं?",
  "Questions|Nivu elli hoguttiddira?|Aap kahan ja rahe hain?|आप कहाँ जा रहे हैं?",
  "Daily Life|Nanu manege hoguttiddene|Main ghar ja raha hoon|मैं घर जा रहा हूँ",
  "Daily Life|Nanu kelasakke hoguttiddene|Main kaam par ja raha hoon|मैं काम पर जा रहा हूँ",
  "Daily Life|Nanu kelasa mugisiddene|Maine kaam khatam kar liya|मैंने काम खत्म कर लिया",
  "Daily Life|Nanage nidre baruttide|Mujhe neend aa rahi hai|मुझे नींद आ रही है",
  "Daily Life|Nanu snana madtene|Main nahane ja raha hoon|मैं नहाने जा रहा हूँ",
  "Daily Life|Nanu tumba busy|Main bahut vyast hoon|मैं बहुत व्यस्त हूँ",
  "Daily Life|Nanage sahaya beku|Mujhe madad chahiye|मुझे मदद चाहिए",
  "Daily Life|Dayavittu nanage sahaya madi|Kripya meri madad kijiye|कृपया मेरी मदद कीजिए",
  "Daily Life|Nanu nimage phone madtene|Main aapko phone karunga|मैं आपको फोन करूँगा",
  "Daily Life|Nanage phone madi|Mujhe phone karna|मुझे फोन करना",
  "Daily Life|Ivattu enu vishesha?|Aaj kya khaas hai?|आज क्या खास है?",
  "Daily Life|Naale sigona|Kal milte hain|कल मिलते हैं",
  "Daily Life|Nanu barta iddene|Main aa raha hoon|मैं आ रहा हूँ",
  "Daily Life|Swalpa kayiri|Thoda ruko|थोड़ा रुको",
  "Daily Life|Bega banni|Jaldi aao|ಜಲ್ದಿ ಆವೋ",
  "Food|Nanage hasivagide|Mujhe bhookh lagi hai|मुझे भूख लगी है",
  "Food|Nanage neeru beku|Mujhe paani chahiye|मुझे पानी चाहिए",
  "Food|Oota aayitha?|Kya aapne khana khaya?|क्या आपने खाना खाया?",
  "Food|Tumba ruchiyagide|Bahut swadisht hai|बहुत स्वादिष्ट है",
  "Food|Nanage chai beku|Mujhe chai chahiye|मुझे चाय चाहिए",
  "Food|Swalpa uppu beku|Thoda namak chahiye|थोड़ा नमक चाहिए",
  "Food|Khara kadime madi|Teekha kam kijiye|तीखा कम कीजिए",
  "Food|Bill kodi|Bill dijiye|बिल दीजिए",
  "Food|Nanage ade beku|Mujhe woh chahiye|मुझे वह चाहिए",
  "Food|Saku|Bas|बस",
  "Shopping|Idara bele eshtu?|Iska daam kitna hai?|इसका दाम कितना है?",
  "Shopping|Tumba jasti|Bahut zyada hai|बहुत ज़्यादा है",
  "Shopping|Swalpa kadime madi|Thoda kam kijiye|थोड़ा कम कीजिए",
  "Shopping|Nanage idu beku|Mujhe yeh chahiye|मुझे यह चाहिए",
  "Shopping|Nanage beda|Mujhe nahi chahiye|मुझे नहीं चाहिए",
  "Shopping|Bere ide?|Aur hai kya?|और है क्या?",
  "Shopping|Nanu huduktiddene|Main dhoondh raha hoon|मैं ढूँढ रहा हूँ",
  "Shopping|Nanna hattira hana ide|Mere paas paise hain|मेरे पास पैसे हैं",
  "Shopping|Chillare ide?|Khule paise hain?|खुले पैसे हैं?",
  "Shopping|Idu sari|Yeh sahi hai|यह सही है",
  "Travel|Bus stand elli?|Bus stand kahan hai?|बस स्टैंड कहाँ है?",
  "Travel|Nanu dari maretiddene|Main raasta bhool gaya hoon|मैं रास्ता भूल गया हूँ",
  "Travel|Balakke tiruguvi|Daayein mudiye|दाएँ मुड़िए",
  "Travel|Edakke tiruguvi|Baayein mudiye|बाएँ मुड़िए",
  "Travel|Neravaagi hogi|Seedha jaiye|सीधा जाइए",
  "Travel|Hattira ide|Paas mein hai|पास में है",
  "Travel|Tumba doora|Bahut door hai|बहुत दूर है",
  "Travel|Illi nillisi|Yahan rokiye|यहाँ रोकिए",
  "Travel|Railway station elli?|Railway station kahan hai?|रेलवे स्टेशन कहाँ है?",
  "Travel|Nanu sari dariyalli iddena?|Kya main sahi raaste par hoon?|क्या मैं सही रास्ते पर हूँ?",
  "Feelings|Nanu kushiyagiddene|Main khush hoon|मैं खुश हूँ",
  "Feelings|Nanu besaravagiddene|Main udaas hoon|मैं उदास हूँ",
  "Feelings|Nanage kopa bandide|Mujhe gussa aa raha hai|मुझे गुस्सा आ रहा है",
  "Feelings|Nanage bhaya aaguttide|Mujhe darr lag raha hai|मुझे डर लग रहा है",
  "Feelings|Nanage tumba ishta|Mujhe bahut pasand hai|मुझे बहुत पसंद है",
  "Feelings|Chinte madabedi|Chinta mat kijiye|चिंता मत कीजिए",
  "Feelings|Nanage tale novu|Mujhe sar dard hai|मुझे सर दर्द है",
  "Feelings|Nanage sustaagide|Main thak gaya hoon|मैं थक गया हूँ",
  "Feelings|Tumba chennagide|Bahut accha hai|बहुत अच्छा है",
  "Feelings|Nimma jote matanadi santosha aaytu|Aapse baat karke accha laga|आपसे बात करके अच्छा लगा",
  "Spoken Sentences|Oorinda bandu sweet taralillave?|Ghar se aakar sweet nahi laaye?|घर से आकर स्वीट नहीं लाये?",
  "Spoken Sentences|Congrats Nadeem, tande adeyallava neenu.|Congrats Nadeem, tum baap ban gaye na.|कांग्रेट्स नदीम, तुम बाप बन गए ना।",
  "Spoken Sentences|Magu hegide, husharidheya?|Baccha kaisa hai, theek hai na?|बच्चा कैसा है, ठीक है ना?",
  "Spoken Sentences|Gandu maguvo, hennu maguvo?|Ladka hai ya ladki?|लड़का है या लड़की?",
  "Spoken Sentences|Modala maguva?|Pehla baccha hai kya?|पहला बच्चा है क्या?",
  "Spoken Sentences|Oorige hogabekanta aguttidheya?|Ghar jaane ka mann kar raha hai kya?|घर जाने का मन कर रहा है क्या?",
  "Spoken Sentences|Dhanyavadagalu bhaya, ninna sahayakke.|Bahut shukriya bhai, teri madad ke liye.|बहुत शुक्रिया भाई, तेरी मदद के लिए।",
  "Spoken Sentences|Good morning, ivattina dina chennagirali.|Good morning, aaj ka din accha rahe.|गुड मॉर्निंग, आज का दिन अच्छा रहे।",
  "Spoken Sentences|Matte sigona, husharagirali.|Phir milte hain, dhyan rakhna.|फिर मिलते हैं, ध्यान रखना।",
  "Spoken Sentences|Sorry yaro, nanage swalpa tadavayitu.|Sorry yaar, mujhe thodi der ho gayi.|सॉरी यार, मुझे थोड़ी देर हो गई।",
  "Spoken Sentences|Tondare illa bidu, paravagilla.|Koi baat nahi, chalta hai.|कोई बात नहीं, चलता है।",
  "Spoken Sentences|Ninnannu bhetiyagiddu tumba khushiyaytu.|Tumse milkar bahut khushi hui.|तुमसे मिलकर बहुत खुशी हुई।",
  "Spoken Sentences|Good night, bega malagu.|Good night, jaldi so jaao.|गुड नाईट, जल्दी सो जाओ।",
  "Spoken Sentences|Nimage tumba abhinandanegalu!|Tumko bahut bahut badhaai!|तुमको बहुत-बहुत बधाई!",
  "Spoken Sentences|Sorry, nanage artha agilla.|Sorry, mujhe samajh nahi aaya.|सॉरी, मुझे समझ नहीं आया।",
  "Spoken Sentences|Tension tagobeda, ella sarihogutte.|Tension mat lo, sab theek ho jayega.|टेंशन मत लो, सब ठीक हो जाएगा।",
  "Spoken Sentences|Neenu beligge eshtu gantege eltiya?|Tum subah kitne baje uthte ho?|तुम सुबह कितने बजे उठते हो?",
  "Spoken Sentences|Nanu beligge 6 gantege eltini.|Main subah 6 baje uthta hoon.|मैं सुबह 6 बजे उठता हूँ।",
  "Spoken Sentences|Ega samaya eshtaytu?|Abhi kitne baj rahe hain?|अभी कितने बज रहे हैं?",
  "Spoken Sentences|Ega madhyahna 1 gante.|Abhi dopahar ka 1 baj raha hai.|अभी दोपहर का 1 बज रहा है।",
  "Spoken Sentences|Nanage tadavagtide, nanu bega hogabeku.|Mujhe der ho rahi hai, mujhe jaldi jaana hai.|मुझे देर हो रही है, मुझे जल्दी जाना है।",
  "Spoken Sentences|Ivattu havamana super agide.|Aaj mausam bahut mast hai.|आज मौसम बहुत मस्त है।",
  "Spoken Sentences|Naale ninage kelasa ideya?|Kal tumhein koi kaam hai kya?|कल तुम्हें कोई काम है क्या?",
  "Spoken Sentences|Naale nanage raje ide.|Kal meri chutti hai.|कल मेरी छुट्टी है।",
  "Spoken Sentences|Nanu sanje running hogtini.|Main shaam ko running jaata hoon.|मैं शाम को रनिंग जाता हूँ।",
  "Spoken Sentences|Ratri bega malagodu olledu.|Raat ko jaldi sona acchi baat hai.|रात को जल्दी सोना अच्छी बात है।",
  "Spoken Sentences|Ninna kelasa mugita?|Tumhara kaam khatam hua kya?|तुम्हारा काम खत्म हुआ क्या?",
  "Spoken Sentences|Howdu, nanna kelasa mugitu.|Haan, mera kaam ho gaya.|हां, मेरा काम हो गया।",
  "Spoken Sentences|Innu swalpa kelasa baaki ide.|Abhi thoda kaam baaki hai.|अभी थोड़ा काम बाकी है।",
  "Spoken Sentences|Boss ninnannu karita iddare.|Boss tumhein bula rahe hain.|बॉस तुम्हें बुला रहे हैं।",
  "Spoken Sentences|Ivattu officenalli tumba kelasa ide.|Aaj office mein bahut kaam hai.|आज ऑफिस में बहुत काम है।",
  "Spoken Sentences|E file annu takshana kalusu.|Yeh file abhi ke abhi bhejo.|यह फाइल अभी के अभी भेजो।",
  "Spoken Sentences|Naale meeting eshtu gantege?|Kal meeting kitne baje hai?|कल मीटिंग कितने बजे हैं?",
  "Spoken Sentences|Nanu ega busy iddini, aamele call martini.|Main abhi busy hoon, baad mein call karta hoon.|मैं अभी बिजी हूँ, बाद में कॉल करता हूँ।",
  "Spoken Sentences|E email omme check maru.|Yeh email ek baar check kar lo.|यह ईमेल एक बार चेक कर लो।",
  "Spoken Sentences|Navu e kelasavannu time-ge mugisabeku.|Humein yeh kaam time par khatam karna hai.|हमें यह काम टाइम पर खत्म करना है।",
  "Spoken Sentences|Ninage hasivagtideya?|Tumhein bhook lagi hai kya?|तुम्हें भूख लगी है क्या?",
  "Spoken Sentences|Howdu, nanage sakkat hasivagide.|Haan, mujhe bahut bhook lagi hai.|हां, मुझे बहुत भूख लगी है।",
  "Spoken Sentences|Tindige enide?|Nashte mein kya hai?|नाश्ते में क्या है?",
  "Spoken Sentences|Aduge tumba chennagide.|Khaana bahut mast bana hai.|खाना बहुत मस्त बना है।",
  "Spoken Sentences|Ninage neeru beka?|Tumhein paani chahiye kya?|तुम्हें पानी चाहिए क्या?",
  "Spoken Sentences|Nanage ondu cup chaha kodu.|Mujhe ek cup chai do.|मुझे एक कप चाय दो।",
  "Spoken Sentences|Ninage yava aduge andra ishta?|Tumhein kaun sa khaana pasand hai?|तुम्हें कौन सा खाना पसंद है?",
  "Spoken Sentences|Nanage biryani andra tumba ishta.|Mujhe biryani bahut pasand hai.|मुझे बिरयानी बहुत पसंद है।",
  "Spoken Sentences|Saku, nanna hotte tumbtu.|Bas, mera pet bhar gaya.|बस, मेरा पेट भर गया।",
  "Spoken Sentences|Ba, ibbaroo joteyalli oota madona.|Aao, saath mein khaana khaate hain.|आओ, साथ में खाना खाते हैं।",
  "Spoken Sentences|Bus stand ellide?|Bus stand kahan hai?|बस स्टैंड कहाँ है?",
  "Spoken Sentences|Train eshtu gantege barutte?|Train kitne baje aayegi?|ट्रेन कितने बजे आएगी?",
  "Spoken Sentences|Illinda marketge eshtu doora?|Yahan se market kitna door hai?|यहां से मार्केट कितना दूर है?",
  "Spoken Sentences|Seeda hogi, aamele right tago.|Seedhe jaao, phir right le lo.|सीधे जाओ, फिर राइट ले लो।",
  "Spoken Sentences|Auto baadige eshtagutte?|Auto ka kiraya kitna hoga?|ऑटो का किराया कितना होगा?",
  "Spoken Sentences|E address ellide anta swalpa heltiga?|Yeh address kahan hai thoda bataoge?|यह एड्रेस कहां है थोड़ा बताओगे?",
  "Spoken Sentences|Stationge hogalu eshtu time beku?|Station jaane mein kitna time lagega?|स्टेशन जाने में कितना टाइम लगेगा?",
  "Spoken Sentences|Daariyalli tumba traffic ide.|Raaste mein bahut traffic hai.|रास्ते में बहुत ट्रैफिक है।",
  "Spoken Sentences|Navu sariyagi talupidevu.|Hum sahi se pahunch gaye.|हम सही से पहुंच गए।",
  "Spoken Sentences|Jagarookaragi hogi ba.|Sahi se jaakar aao.|सही से जाकर आओ।",
  "Spoken Sentences|Idara rate eshtu?|Iska rate kitna hai?|इसका रेट कितना है?",
  "Spoken Sentences|Idu tumba costly agide.|Yeh bahut mehenga hai.|यह बहुत महंगा है।",
  "Spoken Sentences|Swalpa kammi maru bhai.|Thoda kam karo bhai.|थोड़ा कम करो भाई।",
  "Spoken Sentences|Ninna hattira chillare ideya?|Tumhare paas chutta hai kya?|तुम्ारे पास छुट्टा है क्या?",
  "Spoken Sentences|Online payment madala?|Online payment karoon kya?|ऑनलाइन पेमेंट करूं क्या?",
  "Spoken Sentences|Idu super agide, nanu tagotini.|Yeh bahut accha hai, main le leta hoon.|यह बहुत अच्छा है, मैं ले लेता हूँ।",
  "Spoken Sentences|Bill kodi.|Bill de do.|बिल दे दो।",
  "Spoken Sentences|Idaralli bere color ideya?|Ismein doosra color hai kya?|इसमें दूसरा कलर है क्या?",
  "Spoken Sentences|Nanagondhu bag beku.|Mujhe ek bag chahiye.|मुझे एक बैग चाहिए।",
  "Spoken Sentences|E shop eshtu gantege close agutte?|Yeh shop kitne baje band hoti hai?|यह शॉप कितने बजे बंद होती है?",
  "Spoken Sentences|Ninage ega aaramagideya?|Tumhein abhi theek lag raha hai kya?|तुम्हें अभी ठीक लग रहा है क्या?",
  "Spoken Sentences|Nanage jwara aur tale novu ide.|Mujhe bukhar aur sar dard hai.|मुझे बुखार और सर दर्द है।",
  "Spoken Sentences|Doctor hattira hogona ba.|Doctor ke paas chalte hain aao.|डॉक्टर के पास चलते हैं आओ।",
  "Spoken Sentences|E medicine dinakke eradu bari tago.|Yeh medicine din mein do baar le lo.|यह मेडिसिन दिन में दो बार ले लो।",
  "Spoken Sentences|Chennagi rest tago.|Aaram se rest karo.|आराम से रेस्ट करो।",
  "Spoken Sentences|Bisi neeru kudiyodu olledu.|Garam paani peena accha hai.|गरम पानी पीना अच्छा है।",
  "Spoken Sentences|Nanage swalpa sustagtide.|Mujhe thodi thakaan lag rahi hai.|मुझे थोड़ी थकान लग रही है।",
  "Spoken Sentences|Ega nanagena tondare illa, aaramagiddini.|Abhi mujhe koi dikkat nahi hai, main theek hoon.|अभी मुझे कोई दिक्कत नहीं है, मैं ठीक हूँ।",
  "Spoken Sentences|Daily walking marodu olledu.|Daily walking karna accha hai.|डेली वॉकिंग करना अच्छा है।",
  "Spoken Sentences|Health chennagidre ellavu iddante.|Sehat acchi toh sab accha.|सेहत अच्छी तो सब अच्छा।",
  "Spoken Sentences|Ninna maneyalli yaryariddare?|Tumhare ghar mein kaun-kaun hain?|तुम्ारे घर में कौन-कौन हैं?",
  "Spoken Sentences|Namma maneyalli appa, amma matte tangi iddare.|Mere ghar mein papa, mummy aur choti behen hain.|मेरे घर में पापा, मम्मी और छोटी बहन हैं।",
  "Spoken Sentences|Ninna tamma enu martiddane?|Tumhara bhai kya kar raha hai?|तुम्हारा भाई क्या कर रहा है?",
  "Spoken Sentences|Avanu collegenalli odtiddane.|Woh college mein padh raha hai.|वह कॉलेज में पढ़ रहा है।",
  "Spoken Sentences|Navibbaroo chikkandinda friends.|Hum dono bachpan se dost hain.|हम दोनों बचपन से दोस्त हैं।",
  "Spoken Sentences|E weekend namma manege ba.|Is weekend mere ghar aao.|इस वीकेंड मेरे घर आओ।",
  "Spoken Sentences|Maneyalli ellaru hegiddare?|Ghar pe sab kaise hain?|घर पे सब कैसे हैं?",
  "Spoken Sentences|Ellaru aaramagiddare.|Sab theek-thaak hain.|सब ठीक-ठाक हैं।",
  "Spoken Sentences|Navibbaroo horage hogona.|Hum dono bahar chalte hain.|हम दोनों बाहर चलते हैं।",
  "Spoken Sentences|Ninnannu nodi tumba dina aytu.|Tumhein dekhe hue bahut din ho gaye.|तुम्हें देखे हुए बहुत दिन हो गए।",
  "Spoken Sentences|Nanage tumba khushiyagtide.|Mujhe bahut khushi ho rahi hai.|मुझे बहुत खुशी हो रही है।",
  "Spoken Sentences|Ninage kopa bandideya?|Tumhein gussa aaya hai kya?|तुम्हें गुस्सा आया है क्या?",
  "Spoken Sentences|E plan super agide.|Yeh plan bahut mast hai.|यह प्लान बहुत मस्त है।",
  "Spoken Sentences|Nanage idara mele nambike illa.|Mujhe is par bharosa nahi hai.|मुझे इस पर भरोसा नहीं है।",
  "Spoken Sentences|Neenu heliddu sari.|Tumne sahi bola.|तुमने सही बोला।",
  "Spoken Sentences|Nanage bhayavagtide.|Mujhe darr lag raha hai.|मुझे डर लग रहा है।",
  "Spoken Sentences|Hedarabeda, dhairyavagiru.|Daro mat, himmat rakho.|डरो मत, हिम्मत रखो।",
  "Spoken Sentences|Idu nijavagiyoo super agide!|Yeh sach mein bahut accha hai!|यह सच में बहुत अच्छा है!",
  "Spoken Sentences|Nanage idu ishtavagilla.|Mujhe yeh pasand nahi aaya.|मुझे यह पसंद नहीं आया।",
  "Spoken Sentences|Ellavu olleyadakke nadeyutte.|Jo hota hai acche ke liye hota hai.|जो होता है अच्छे के लिए होता है।",
  "Spoken Sentences|Ninage Hindi matanadalu barutta?|Tumhein Hindi bolna aata hai kya?|तुम्हें हिंदी बोलना आता है क्या?",
  "Spoken Sentences|Howdu, nanage swalpa swalpa Hindi barutte.|Haan, mujhe thodi-thodi Hindi aati hai.|हां, मुझे थोड़ी-थोड़ी हिंदी आती है।",
  "Spoken Sentences|Ninna mobile number kodu.|Tumhara mobile number do.|तुम्हारा मोबाइल नंबर दो।",
  "Spoken Sentences|Ninna jote matanadi tumba khushiyaytu, matte sigona!|Tumse baat karke bahut accha laga, phir milte hain!|तुमसे बात करके बहुत अच्छा लगा, फिर मिलते हैं!"
];

export const initialSkills: SkillSentence[] = RAW_SKILL_SEED.map((line, idx) => {
  const parts = line.split('|');
  return {
    id: `sk_${idx + 1}`,
    category: parts[0] || 'General',
    kannada: parts[1] || '',
    roman: parts[2] || '',
    deva: parts[3] || ''
  };
});

const todayYMD = () => new Date().toISOString().split('T')[0];
const daysAgoYMD = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const initialAppData: AppData = {
  runWalk: [
    { id: 'rw_1', date: todayYMD(), distance: 5.2, duration: 42, notes: 'Morning jog' },
    { id: 'rw_2', date: daysAgoYMD(1), distance: 6.0, duration: 48, notes: 'Evening walk' },
    { id: 'rw_3', date: daysAgoYMD(2), distance: 4.5, duration: 35, notes: 'Park rounds' },
    { id: 'rw_4', date: daysAgoYMD(3), distance: 5.0, duration: 40, notes: 'Morning brisk walk' },
    { id: 'rw_5', date: daysAgoYMD(4), distance: 7.1, duration: 55, notes: 'Long weekend run' },
    { id: 'rw_6', date: daysAgoYMD(5), distance: 3.5, duration: 30, notes: 'Light recovery walk' },
    { id: 'rw_7', date: daysAgoYMD(6), distance: 5.5, duration: 45, notes: 'Stadium track' }
  ],
  habits: [
    {
      id: 'h_1',
      title: 'Water 3.5L',
      dateCreated: daysAgoYMD(10),
      logs: {
        [todayYMD()]: '✅',
        [daysAgoYMD(1)]: '✅',
        [daysAgoYMD(2)]: '✅',
        [daysAgoYMD(3)]: '❌',
        [daysAgoYMD(4)]: '✅',
        [daysAgoYMD(5)]: '✅',
        [daysAgoYMD(6)]: '✅'
      }
    },
    {
      id: 'h_2',
      title: 'Daily Exercise / Walking',
      dateCreated: daysAgoYMD(10),
      logs: {
        [todayYMD()]: '✅',
        [daysAgoYMD(1)]: '✅',
        [daysAgoYMD(2)]: '✅',
        [daysAgoYMD(3)]: '✅',
        [daysAgoYMD(4)]: '✅',
        [daysAgoYMD(5)]: '❌',
        [daysAgoYMD(6)]: '✅'
      }
    },
    {
      id: 'h_3',
      title: 'Hindi Practice 15m',
      dateCreated: daysAgoYMD(10),
      logs: {
        [todayYMD()]: '✅',
        [daysAgoYMD(1)]: '✅',
        [daysAgoYMD(2)]: '❌',
        [daysAgoYMD(3)]: '✅',
        [daysAgoYMD(4)]: '✅',
        [daysAgoYMD(5)]: '✅',
        [daysAgoYMD(6)]: '✅'
      }
    },
    {
      id: 'h_4',
      title: 'Reading Book (10 pages)',
      dateCreated: daysAgoYMD(10),
      logs: {
        [todayYMD()]: '✅',
        [daysAgoYMD(1)]: '❌',
        [daysAgoYMD(2)]: '✅',
        [daysAgoYMD(3)]: '✅',
        [daysAgoYMD(4)]: '❌',
        [daysAgoYMD(5)]: '✅',
        [daysAgoYMD(6)]: '✅'
      }
    }
  ],
  quickNotes: [
    {
      id: 'qn_1',
      content: 'Graphic Zone: Call Taj Print for paper GSM pricing and banner vinyl delivery schedule.',
      dateTimeStr: `${todayYMD()} 09:30:00`,
      lastModified: `${todayYMD()} 09:30:00`
    },
    {
      id: 'qn_2',
      content: 'Federal Bank passbook entry update and SIP confirmation check.',
      dateTimeStr: `${daysAgoYMD(1)} 14:15:00`,
      lastModified: `${daysAgoYMD(1)} 14:15:00`
    },
    {
      id: 'qn_3',
      content: 'Kudremukh trek permit booking and winter gears checklist.',
      dateTimeStr: `${daysAgoYMD(2)} 20:00:00`,
      lastModified: `${daysAgoYMD(2)} 20:00:00`
    }
  ],
  diary: [
    {
      id: 'd_1',
      date: todayYMD(),
      title: 'Day of Productivity & Goals',
      notes: 'Completed today morning run in high energy. Graphic Zone order G315 completed on schedule. Focused on maintaining disciplined investing routine and learning new spoken sentences.',
      lastModified: `${todayYMD()} 21:00:00`
    },
    {
      id: 'd_2',
      date: daysAgoYMD(2),
      title: 'Planning & Reflection',
      notes: 'Reviewed all financial goals for 2026. Consistent monthly savings and healthy habits are paying off. Feeling motivated to push boundaries.',
      lastModified: `${daysAgoYMD(2)} 22:30:00`
    }
  ],
  liabilityAssets: [
    { id: 'la_1', type: 'ASSET', name: 'Emergency Liquid Cash', amount: 45000 },
    { id: 'la_2', type: 'ASSET', name: 'Bank Fixed Deposit', amount: 120000 },
    { id: 'la_3', type: 'ASSET', name: 'Gold Coin Savings', amount: 85000 },
    { id: 'la_4', type: 'LIABILITY', name: 'Credit Card Bill Due', amount: 14500 },
    { id: 'la_5', type: 'LIABILITY', name: 'Shop Rental Advance Balance', amount: 20000 }
  ],
  savingBanks: [
    { id: 'sb_1', name: 'Federal Bank', currency: 'INR', type: 'Savings Account', balance: 35000 },
    { id: 'sb_2', name: 'Union Bank', currency: 'INR', type: 'Savings Account', balance: 18500 },
    { id: 'sb_3', name: 'Karnataka Bank', currency: 'INR', type: 'Savings Account', balance: 12000 },
    { id: 'sb_4', name: 'ADCB Bank', currency: 'AED', type: 'Current Account', balance: 3500 },
    { id: 'sb_5', name: 'Botim Bank', currency: 'AED', type: 'Digital Pay Wallet', balance: 450 },
    { id: 'sb_6', name: 'Pot / Locker', currency: 'AED', type: 'Savings Pot', balance: 1200 },
    { id: 'sb_7', name: 'Cash Wallet', currency: 'AED', type: 'Cash / Digital Wallet', balance: 300 }
  ],
  salaries: [
    {
      id: 'sc_1',
      year: 2026,
      month: '10',
      basic: 5000,
      allowance: 800,
      ot: 350,
      deduction: 0,
      remarks: 'October salary credited',
      rate: 22.8,
      totalAED: 6150,
      totalINR: 140220
    },
    {
      id: 'sc_2',
      year: 2026,
      month: '09',
      basic: 5000,
      allowance: 800,
      ot: 200,
      deduction: 50,
      remarks: 'September salary credited',
      rate: 22.75,
      totalAED: 6000,
      totalINR: 136500
    },
    {
      id: 'sc_3',
      year: 2026,
      month: '08',
      basic: 5000,
      allowance: 800,
      ot: 400,
      deduction: 0,
      remarks: 'August salary credited with bonus OT',
      rate: 22.7,
      totalAED: 6200,
      totalINR: 140740
    }
  ],
  bucketList: [
    {
      id: 'bl_1',
      country: 'UAE',
      state: 'Ajman',
      district: 'Al Bustan',
      placeName: 'Ajman Museum & Fort',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
      mapLink: 'https://maps.google.com/?q=Ajman+Museum',
      category: 'Historical',
      rating: 5,
      notes: 'Entry fee 5 AED. Beautiful historical fort depicting traditional UAE life and crafts.'
    },
    {
      id: 'bl_2',
      country: 'India',
      state: 'Karnataka',
      district: 'Chikkamagaluru',
      placeName: 'Kudremukh Peak Trek',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      mapLink: 'https://maps.google.com/?q=Kudremukh+Peak',
      category: 'Adventure',
      rating: 5,
      notes: 'Best time post-monsoon (September to January). Need forest department permit early morning.'
    },
    {
      id: 'bl_3',
      country: 'India',
      state: 'Karnataka',
      district: 'Udupi',
      placeName: 'Malpe Sea Walk & St Mary Island',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      mapLink: 'https://maps.google.com/?q=Malpe+Beach',
      category: 'Beach',
      rating: 5,
      notes: 'Evening sunset walking, basaltic rock formations at St Mary Island by boat.'
    },
    {
      id: 'bl_4',
      country: 'UAE',
      state: 'Dubai',
      district: 'Downtown',
      placeName: 'Dubai Miracle Garden',
      imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&auto=format&fit=crop&q=80',
      mapLink: 'https://maps.google.com/?q=Dubai+Miracle+Garden',
      category: 'Nature',
      rating: 5,
      notes: 'Open during winter months from November to April. Incredible floral installations.'
    }
  ],
  plans: [
    {
      id: 'plan_1',
      name: 'India Vacation Trip',
      items: [
        { id: 'pi_1', type: 'INCOME', name: 'Vacation Fund Savings', amount: 120000, ticked: true },
        { id: 'pi_2', type: 'INCOME', name: 'Annual Bonus', amount: 50000, ticked: true },
        { id: 'pi_3', type: 'EXPENSE', name: 'Flight Tickets (Return)', amount: 48000, ticked: true },
        { id: 'pi_4', type: 'EXPENSE', name: 'Family Shopping & Gifts', amount: 35000, ticked: false },
        { id: 'pi_5', type: 'EXPENSE', name: 'Local Travel & Fuel', amount: 15000, ticked: false },
        { id: 'pi_6', type: 'EXPENSE', name: 'Emergency Contingency', amount: 10000, ticked: false }
      ]
    },
    {
      id: 'plan_2',
      name: 'Shop Equipment Upgrade',
      items: [
        { id: 'pi_7', type: 'INCOME', name: 'Graphic Zone Retained Profit', amount: 95000, ticked: true },
        { id: 'pi_8', type: 'EXPENSE', name: 'High-Res Laser Color Printer', amount: 65000, ticked: false },
        { id: 'pi_9', type: 'EXPENSE', name: 'Heavy Duty Thermal Lamination', amount: 18000, ticked: false }
      ]
    }
  ],
  graphicJobs: [
    {
      id: 'gj_1',
      jobNo: 'G315',
      date: todayYMD(),
      customerName: 'Sullia Traders',
      phone: '917204296418',
      place: 'Sullia',
      item: 'Premium Matte Business Cards (1000 pcs)',
      qty: 1000,
      rate: 1.5,
      totalAmount: 1500,
      paid: 1500,
      balanceDue: 0,
      printCost: 650,
      otherCost: 50,
      estimatedProfit: 800,
      status: 'Delivered',
      remarks: 'Delivered to Shop directly. Client verified.'
    },
    {
      id: 'gj_2',
      jobNo: 'G316',
      date: todayYMD(),
      customerName: 'Al Shifa Clinic',
      phone: '919845012345',
      place: 'Puttur',
      item: 'Vinyl Star Flex Banner (8x4 ft)',
      qty: 1,
      rate: 960,
      totalAmount: 960,
      paid: 500,
      balanceDue: 460,
      printCost: 380,
      otherCost: 40,
      estimatedProfit: 80,
      status: 'Printing',
      remarks: 'Eyelet fitting required on corners.'
    },
    {
      id: 'gj_3',
      jobNo: 'G317',
      date: daysAgoYMD(1),
      customerName: 'Green Valley College',
      phone: '918762000111',
      place: 'Mangalore',
      item: 'Certificate Printing & Golden Foil (300 pcs)',
      qty: 300,
      rate: 12,
      totalAmount: 3600,
      paid: 2000,
      balanceDue: 1600,
      printCost: 1400,
      otherCost: 100,
      estimatedProfit: 500,
      status: 'Design Pending',
      remarks: 'Waiting for student names excel file.'
    },
    {
      id: 'gj_4',
      jobNo: 'G314',
      date: daysAgoYMD(3),
      customerName: 'Royal Sweets & Bakery',
      phone: '919448123456',
      place: 'Sullia',
      item: 'Packaging Box Stickers (5000 pcs)',
      qty: 5000,
      rate: 0.8,
      totalAmount: 4000,
      paid: 4000,
      balanceDue: 0,
      printCost: 1800,
      otherCost: 100,
      estimatedProfit: 2100,
      status: 'Delivered',
      remarks: 'High quality gloss vinyl waterproof.'
    }
  ],
  inflowHoldings: [
    {
      id: 'inf_1',
      category: 'core',
      name: 'PPF & Sovereign Gold Bond',
      type: 'Government Backed',
      investedAmount: 180000,
      currentValue: 225000,
      sipAmount: 5000,
      notes: 'Guaranteed safety and sovereign gold interest'
    },
    {
      id: 'inf_2',
      category: 'mf',
      name: 'Parag Parikh Flexi Cap Fund',
      type: 'Equity Mutual Fund',
      investedAmount: 125000,
      currentValue: 162500,
      sipAmount: 4000,
      notes: 'Core global + Indian bluechip allocation'
    },
    {
      id: 'inf_3',
      category: 'mf',
      name: 'Nippon India Small Cap Fund',
      type: 'Equity Mutual Fund',
      investedAmount: 90000,
      currentValue: 132000,
      sipAmount: 3000,
      notes: 'High growth small-cap compounding engine'
    },
    {
      id: 'inf_4',
      category: 'stocks',
      name: 'Tata Consultancy Services (TCS)',
      type: 'Large Cap IT',
      investedAmount: 75000,
      currentValue: 88500,
      sipAmount: 20,
      notes: 'Consistent dividend payer'
    },
    {
      id: 'inf_5',
      category: 'stocks',
      name: 'HDFC Bank Ltd',
      type: 'Private Banking',
      investedAmount: 80000,
      currentValue: 91200,
      sipAmount: 50,
      notes: 'Market leader in Indian financial system'
    }
  ],
  trades: [
    {
      id: 'tr_1',
      asset: 'Coal India Ltd',
      investment: 30000,
      entryDate: daysAgoYMD(12),
      exitDate: todayYMD(),
      holdingDays: 12,
      exitPct: 5.2,
      brokerCharges: 45,
      grossPnl: 1560,
      netPnl: 1515,
      isExited: true
    },
    {
      id: 'tr_2',
      asset: 'NTPC Ltd',
      investment: 25000,
      entryDate: daysAgoYMD(18),
      exitDate: daysAgoYMD(4),
      holdingDays: 14,
      exitPct: 5.0,
      brokerCharges: 40,
      grossPnl: 1250,
      netPnl: 1210,
      isExited: true
    },
    {
      id: 'tr_3',
      asset: 'State Bank of India',
      investment: 35000,
      entryDate: daysAgoYMD(5),
      holdingDays: 5,
      isExited: false
    },
    {
      id: 'tr_4',
      asset: 'Tata Motors Ltd',
      investment: 30000,
      entryDate: daysAgoYMD(2),
      holdingDays: 2,
      isExited: false
    }
  ],
  skills: initialSkills,
  specialDays: [
    {
      id: 'sd_1',
      title: 'Ammavara Birthday',
      dateStr: `${new Date().getFullYear()}-11-04`,
      category: 'Birthday',
      phone: '919876543210',
      notes: 'Order fresh cake and family dinner.'
    },
    {
      id: 'sd_2',
      title: 'Marriage Anniversary',
      dateStr: `${new Date().getFullYear()}-11-20`,
      category: 'Anniversary',
      phone: '917204296418',
      notes: 'Special anniversary celebration gift.'
    },
    {
      id: 'sd_3',
      title: 'Nadeem Friend Birthday',
      dateStr: `${new Date().getFullYear()}-12-14`,
      category: 'Birthday',
      phone: '919988776655',
      notes: 'Wish early morning via WhatsApp.'
    }
  ],
  health: [
    {
      id: 'hl_1',
      date: todayYMD(),
      waterLiters: 3.5,
      sleepHours: 7.5,
      workoutMinutes: 45,
      weightKg: 68.2,
      notes: 'Felt energetic after morning walk.'
    },
    {
      id: 'hl_2',
      date: daysAgoYMD(1),
      waterLiters: 3.2,
      sleepHours: 7.0,
      workoutMinutes: 40,
      weightKg: 68.4,
      notes: 'Adequate hydration achieved.'
    }
  ]
};
