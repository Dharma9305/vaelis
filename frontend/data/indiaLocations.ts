/**
 * VAELIS India Location Master
 *
 * Administrative State/UT + District master prepared for checkout use.
 * District names are based on current government directory references and
 * a maintained India district dataset. City coverage is intentionally
 * conservative: each district has a district-name fallback, with common
 * city names/aliases added where confidently mapped.
 *
 * IMPORTANT:
 * - This is NOT a census-grade list of every village/locality in India.
 * - Checkout must keep an `Other` fallback for unlisted localities.
 * - Pincode verification remains the authoritative delivery-location check.
 */

export type IndiaDistrict = {
  name: string;
  cities: string[];
};

export type IndiaState = {
  name: string;
  districts: IndiaDistrict[];
};

const cityOverrides: Record<string, string[]> = {
  "Andhra Pradesh|Alluri Sitharama Raju": ["Alluri Sitharama Raju"],
  "Andhra Pradesh|Anakapalli": ["Anakapalli"],
  "Andhra Pradesh|Anantapuramu": ["Anantapuramu"],
  "Andhra Pradesh|Annamayya": ["Annamayya"],
  "Andhra Pradesh|Bapatla": ["Bapatla"],
  "Andhra Pradesh|Chittoor": ["Chittoor"],
  "Andhra Pradesh|Dr. B.R. Ambedkar Konaseema": ["Dr. B.R. Ambedkar Konaseema"],
  "Andhra Pradesh|East Godavari": ["East Godavari"],
  "Andhra Pradesh|Eluru": ["Eluru"],
  "Andhra Pradesh|Guntur": ["Guntur"],
  "Andhra Pradesh|Kakinada": ["Kakinada"],
  "Andhra Pradesh|Krishna": ["Krishna"],
  "Andhra Pradesh|Kurnool": ["Kurnool"],
  "Andhra Pradesh|Nandyal": ["Nandyal"],
  "Andhra Pradesh|NTR": ["Vijayawada"],
  "Andhra Pradesh|Palnadu": ["Palnadu"],
  "Andhra Pradesh|Parvathipuram Manyam": ["Parvathipuram Manyam"],
  "Andhra Pradesh|Prakasam": ["Prakasam"],
  "Andhra Pradesh|Sri Potti Sriramulu Nellore": ["Sri Potti Sriramulu Nellore"],
  "Andhra Pradesh|Sri Sathya Sai": ["Sri Sathya Sai"],
  "Andhra Pradesh|Srikakulam": ["Srikakulam"],
  "Andhra Pradesh|Tirupati": ["Tirupati"],
  "Andhra Pradesh|Visakhapatnam": ["Visakhapatnam"],
  "Andhra Pradesh|Vizianagaram": ["Vizianagaram"],
  "Andhra Pradesh|West Godavari": ["West Godavari"],
  "Andhra Pradesh|YSR": ["YSR"],
  "Arunachal Pradesh|Anjaw": ["Anjaw"],
  "Arunachal Pradesh|Changlang": ["Changlang"],
  "Arunachal Pradesh|Dibang Valley": ["Dibang Valley"],
  "Arunachal Pradesh|East Kameng": ["East Kameng"],
  "Arunachal Pradesh|East Siang": ["East Siang"],
  "Arunachal Pradesh|Itanagar Capital Complex": ["Itanagar Capital Complex"],
  "Arunachal Pradesh|Kamle": ["Kamle"],
  "Arunachal Pradesh|Kra Daadi": ["Kra Daadi"],
  "Arunachal Pradesh|Kurung Kumey": ["Kurung Kumey"],
  "Arunachal Pradesh|Lepa Rada": ["Lepa Rada"],
  "Arunachal Pradesh|Lohit": ["Lohit"],
  "Arunachal Pradesh|Longding": ["Longding"],
  "Arunachal Pradesh|Lower Dibang Valley": ["Lower Dibang Valley"],
  "Arunachal Pradesh|Lower Siang": ["Lower Siang"],
  "Arunachal Pradesh|Lower Subansiri": ["Lower Subansiri"],
  "Arunachal Pradesh|Namsai": ["Namsai"],
  "Arunachal Pradesh|Pakke-Kessang": ["Pakke-Kessang"],
  "Arunachal Pradesh|Papum Pare": ["Papum Pare"],
  "Arunachal Pradesh|Shi Yomi": ["Shi Yomi"],
  "Arunachal Pradesh|Siang": ["Siang"],
  "Arunachal Pradesh|Tawang": ["Tawang"],
  "Arunachal Pradesh|Tirap": ["Tirap"],
  "Arunachal Pradesh|Upper Dibang Valley": ["Upper Dibang Valley"],
  "Arunachal Pradesh|Upper Siang": ["Upper Siang"],
  "Arunachal Pradesh|Upper Subansiri": ["Upper Subansiri"],
  "Arunachal Pradesh|West Kameng": ["West Kameng"],
  "Arunachal Pradesh|West Siang": ["West Siang"],
  "Assam|Baksa": ["Baksa"],
  "Assam|Barpeta": ["Barpeta"],
  "Assam|Biswanath": ["Biswanath"],
  "Assam|Bongaigaon": ["Bongaigaon"],
  "Assam|Cachar": ["Cachar"],
  "Assam|Charaideo": ["Charaideo"],
  "Assam|Chirang": ["Chirang"],
  "Assam|Darrang": ["Darrang"],
  "Assam|Dhemaji": ["Dhemaji"],
  "Assam|Dhubri": ["Dhubri"],
  "Assam|Dibrugarh": ["Dibrugarh"],
  "Assam|Dima Hasao": ["Dima Hasao"],
  "Assam|Goalpara": ["Goalpara"],
  "Assam|Golaghat": ["Golaghat"],
  "Assam|Hailakandi": ["Hailakandi"],
  "Assam|Hojai": ["Hojai"],
  "Assam|Jorhat": ["Jorhat"],
  "Assam|Kamrup": ["Kamrup"],
  "Assam|Kamrup Metropolitan": ["Guwahati"],
  "Assam|Karbi Anglong": ["Karbi Anglong"],
  "Assam|Karimganj": ["Karimganj"],
  "Assam|Kokrajhar": ["Kokrajhar"],
  "Assam|Lakhimpur": ["Lakhimpur"],
  "Assam|Majuli": ["Majuli"],
  "Assam|Morigaon": ["Morigaon"],
  "Assam|Nagaon": ["Nagaon"],
  "Assam|Nalbari": ["Nalbari"],
  "Assam|Sivasagar": ["Sivasagar"],
  "Assam|Sonitpur": ["Sonitpur"],
  "Assam|South Salmara-Mankachar": ["South Salmara-Mankachar"],
  "Assam|Tinsukia": ["Tinsukia"],
  "Assam|Udalguri": ["Udalguri"],
  "Assam|West Karbi Anglong": ["West Karbi Anglong"],
  "Bihar|Araria": ["Araria"],
  "Bihar|Arwal": ["Arwal"],
  "Bihar|Aurangabad": ["Aurangabad"],
  "Bihar|Banka": ["Banka"],
  "Bihar|Begusarai": ["Begusarai"],
  "Bihar|Bhagalpur": ["Bhagalpur"],
  "Bihar|Bhojpur": ["Bhojpur"],
  "Bihar|Buxar": ["Buxar"],
  "Bihar|Darbhanga": ["Darbhanga"],
  "Bihar|East Champaran": ["East Champaran"],
  "Bihar|Gaya": ["Gaya"],
  "Bihar|Gopalganj": ["Gopalganj"],
  "Bihar|Jamui": ["Jamui"],
  "Bihar|Jehanabad": ["Jehanabad"],
  "Bihar|Kaimur": ["Kaimur"],
  "Bihar|Katihar": ["Katihar"],
  "Bihar|Khagaria": ["Khagaria"],
  "Bihar|Kishanganj": ["Kishanganj"],
  "Bihar|Lakhisarai": ["Lakhisarai"],
  "Bihar|Madhepura": ["Madhepura"],
  "Bihar|Madhubani": ["Madhubani"],
  "Bihar|Munger": ["Munger"],
  "Bihar|Muzaffarpur": ["Muzaffarpur"],
  "Bihar|Nalanda": ["Nalanda"],
  "Bihar|Nawada": ["Nawada"],
  "Bihar|Patna": ["Patna"],
  "Bihar|Purnia": ["Purnia"],
  "Bihar|Rohtas": ["Rohtas"],
  "Bihar|Saharsa": ["Saharsa"],
  "Bihar|Samastipur": ["Samastipur"],
  "Bihar|Saran": ["Saran"],
  "Bihar|Sheikhpura": ["Sheikhpura"],
  "Bihar|Sheohar": ["Sheohar"],
  "Bihar|Sitamarhi": ["Sitamarhi"],
  "Bihar|Siwan": ["Siwan"],
  "Bihar|Supaul": ["Supaul"],
  "Bihar|Vaishali": ["Vaishali"],
  "Bihar|West Champaran": ["West Champaran"],
  "Chhattisgarh|Balod": ["Balod"],
  "Chhattisgarh|Baloda Bazar": ["Baloda Bazar"],
  "Chhattisgarh|Balrampur-Ramanujganj": ["Balrampur-Ramanujganj"],
  "Chhattisgarh|Bastar": ["Bastar"],
  "Chhattisgarh|Bemetara": ["Bemetara"],
  "Chhattisgarh|Bijapur": ["Bijapur"],
  "Chhattisgarh|Bilaspur": ["Bilaspur"],
  "Chhattisgarh|Dantewada": ["Dantewada"],
  "Chhattisgarh|Dhamtari": ["Dhamtari"],
  "Chhattisgarh|Durg": ["Durg"],
  "Chhattisgarh|Gariaband": ["Gariaband"],
  "Chhattisgarh|Gaurela-Pendra-Marwahi": ["Gaurela-Pendra-Marwahi"],
  "Chhattisgarh|Janjgir-Champa": ["Janjgir-Champa"],
  "Chhattisgarh|Jashpur": ["Jashpur"],
  "Chhattisgarh|Kabirdham": ["Kabirdham"],
  "Chhattisgarh|Kanker": ["Kanker"],
  "Chhattisgarh|Khairagarh-Chhuikhadan-Gandai": ["Khairagarh-Chhuikhadan-Gandai"],
  "Chhattisgarh|Kondagaon": ["Kondagaon"],
  "Chhattisgarh|Korba": ["Korba"],
  "Chhattisgarh|Korea": ["Korea"],
  "Chhattisgarh|Manendragarh-Chirmiri-Bharatpur": ["Manendragarh-Chirmiri-Bharatpur"],
  "Chhattisgarh|Mahasamund": ["Mahasamund"],
  "Chhattisgarh|Mohla-Manpur-Ambagarh Chowki": ["Mohla-Manpur-Ambagarh Chowki"],
  "Chhattisgarh|Mungeli": ["Mungeli"],
  "Chhattisgarh|Narayanpur": ["Narayanpur"],
  "Chhattisgarh|Raigarh": ["Raigarh"],
  "Chhattisgarh|Raipur": ["Raipur"],
  "Chhattisgarh|Rajnandgaon": ["Rajnandgaon"],
  "Chhattisgarh|Sarangarh-Bilaigarh": ["Sarangarh-Bilaigarh"],
  "Chhattisgarh|Sakti": ["Sakti"],
  "Chhattisgarh|Sukma": ["Sukma"],
  "Chhattisgarh|Surajpur": ["Surajpur"],
  "Chhattisgarh|Surguja": ["Surguja"],
  "Goa|North Goa": ["North Goa"],
  "Goa|South Goa": ["South Goa"],
  "Gujarat|Ahmedabad": ["Ahmedabad"],
  "Gujarat|Amreli": ["Amreli"],
  "Gujarat|Anand": ["Anand"],
  "Gujarat|Aravalli": ["Aravalli"],
  "Gujarat|Banaskantha": ["Banaskantha"],
  "Gujarat|Bharuch": ["Bharuch"],
  "Gujarat|Bhavnagar": ["Bhavnagar"],
  "Gujarat|Botad": ["Botad"],
  "Gujarat|Chhota Udaipur": ["Chhota Udaipur"],
  "Gujarat|Dahod": ["Dahod"],
  "Gujarat|Dang": ["Dang"],
  "Gujarat|Devbhumi Dwarka": ["Devbhumi Dwarka"],
  "Gujarat|Gandhinagar": ["Gandhinagar"],
  "Gujarat|Gir Somnath": ["Gir Somnath"],
  "Gujarat|Jamnagar": ["Jamnagar"],
  "Gujarat|Junagadh": ["Junagadh"],
  "Gujarat|Kheda": ["Kheda"],
  "Gujarat|Kutch": ["Kutch"],
  "Gujarat|Mahisagar": ["Mahisagar"],
  "Gujarat|Mehsana": ["Mehsana"],
  "Gujarat|Morbi": ["Morbi"],
  "Gujarat|Narmada": ["Narmada"],
  "Gujarat|Navsari": ["Navsari"],
  "Gujarat|Panchmahal": ["Panchmahal"],
  "Gujarat|Patan": ["Patan"],
  "Gujarat|Porbandar": ["Porbandar"],
  "Gujarat|Rajkot": ["Rajkot"],
  "Gujarat|Sabarkantha": ["Sabarkantha"],
  "Gujarat|Surat": ["Surat"],
  "Gujarat|Surendranagar": ["Surendranagar"],
  "Gujarat|Tapi": ["Tapi"],
  "Gujarat|Vadodara": ["Vadodara"],
  "Gujarat|Valsad": ["Valsad"],
  "Haryana|Ambala": ["Ambala"],
  "Haryana|Bhiwani": ["Bhiwani"],
  "Haryana|Charkhi Dadri": ["Charkhi Dadri"],
  "Haryana|Faridabad": ["Faridabad"],
  "Haryana|Fatehabad": ["Fatehabad"],
  "Haryana|Gurugram": ["Gurugram"],
  "Haryana|Hisar": ["Hisar"],
  "Haryana|Jhajjar": ["Jhajjar"],
  "Haryana|Jind": ["Jind"],
  "Haryana|Kaithal": ["Kaithal"],
  "Haryana|Karnal": ["Karnal"],
  "Haryana|Kurukshetra": ["Kurukshetra"],
  "Haryana|Mahendragarh": ["Mahendragarh"],
  "Haryana|Nuh": ["Nuh"],
  "Haryana|Palwal": ["Palwal"],
  "Haryana|Panchkula": ["Panchkula"],
  "Haryana|Panipat": ["Panipat"],
  "Haryana|Rewari": ["Rewari"],
  "Haryana|Rohtak": ["Rohtak"],
  "Haryana|Sirsa": ["Sirsa"],
  "Haryana|Sonipat": ["Sonipat"],
  "Haryana|Yamunanagar": ["Yamunanagar"],
  "Himachal Pradesh|Bilaspur": ["Bilaspur"],
  "Himachal Pradesh|Chamba": ["Chamba"],
  "Himachal Pradesh|Hamirpur": ["Hamirpur"],
  "Himachal Pradesh|Kangra": ["Kangra"],
  "Himachal Pradesh|Kinnaur": ["Kinnaur"],
  "Himachal Pradesh|Kullu": ["Kullu"],
  "Himachal Pradesh|Lahaul and Spiti": ["Lahaul and Spiti"],
  "Himachal Pradesh|Mandi": ["Mandi"],
  "Himachal Pradesh|Shimla": ["Shimla"],
  "Himachal Pradesh|Sirmaur": ["Sirmaur"],
  "Himachal Pradesh|Solan": ["Solan"],
  "Himachal Pradesh|Una": ["Una"],
  "Jharkhand|Bokaro": ["Bokaro"],
  "Jharkhand|Chatra": ["Chatra"],
  "Jharkhand|Deoghar": ["Deoghar"],
  "Jharkhand|Dhanbad": ["Dhanbad"],
  "Jharkhand|Dumka": ["Dumka"],
  "Jharkhand|East Singhbhum": ["Jamshedpur"],
  "Jharkhand|Garhwa": ["Garhwa"],
  "Jharkhand|Giridih": ["Giridih"],
  "Jharkhand|Godda": ["Godda"],
  "Jharkhand|Gumla": ["Gumla"],
  "Jharkhand|Hazaribag": ["Hazaribag"],
  "Jharkhand|Jamtara": ["Jamtara"],
  "Jharkhand|Khunti": ["Khunti"],
  "Jharkhand|Koderma": ["Koderma"],
  "Jharkhand|Latehar": ["Latehar"],
  "Jharkhand|Lohardaga": ["Lohardaga"],
  "Jharkhand|Pakur": ["Pakur"],
  "Jharkhand|Palamu": ["Palamu"],
  "Jharkhand|Ramgarh": ["Ramgarh"],
  "Jharkhand|Ranchi": ["Ranchi"],
  "Jharkhand|Sahibganj": ["Sahibganj"],
  "Jharkhand|Seraikela-Kharsawan": ["Seraikela-Kharsawan"],
  "Jharkhand|Simdega": ["Simdega"],
  "Jharkhand|West Singhbhum": ["West Singhbhum"],
  "Karnataka|Bagalkote": ["Bagalkote"],
  "Karnataka|Ballari": ["Ballari"],
  "Karnataka|Belagavi": ["Belagavi"],
  "Karnataka|Bengaluru Rural": ["Bengaluru Rural"],
  "Karnataka|Bengaluru Urban": ["Bengaluru"],
  "Karnataka|Bidar": ["Bidar"],
  "Karnataka|Chamarajanagar": ["Chamarajanagar"],
  "Karnataka|Chikkaballapura": ["Chikkaballapura"],
  "Karnataka|Chikkamagaluru": ["Chikkamagaluru"],
  "Karnataka|Chitradurga": ["Chitradurga"],
  "Karnataka|Dakshina Kannada": ["Dakshina Kannada"],
  "Karnataka|Davanagere": ["Davanagere"],
  "Karnataka|Dharwad": ["Dharwad"],
  "Karnataka|Gadag": ["Gadag"],
  "Karnataka|Hassan": ["Hassan"],
  "Karnataka|Haveri": ["Haveri"],
  "Karnataka|Kalaburagi": ["Kalaburagi"],
  "Karnataka|Kodagu": ["Kodagu"],
  "Karnataka|Kolar": ["Kolar"],
  "Karnataka|Koppal": ["Koppal"],
  "Karnataka|Mandya": ["Mandya"],
  "Karnataka|Mysuru": ["Mysuru"],
  "Karnataka|Raichur": ["Raichur"],
  "Karnataka|Ramanagara": ["Ramanagara"],
  "Karnataka|Shivamogga": ["Shivamogga"],
  "Karnataka|Tumakuru": ["Tumakuru"],
  "Karnataka|Udupi": ["Udupi"],
  "Karnataka|Uttara Kannada": ["Uttara Kannada"],
  "Karnataka|Vijayapura": ["Vijayapura"],
  "Karnataka|Vijayanagara": ["Vijayanagara"],
  "Karnataka|Yadgir": ["Yadgir"],
  "Kerala|Alappuzha": ["Alappuzha"],
  "Kerala|Ernakulam": ["Kochi"],
  "Kerala|Idukki": ["Idukki"],
  "Kerala|Kannur": ["Kannur"],
  "Kerala|Kasaragod": ["Kasaragod"],
  "Kerala|Kollam": ["Kollam"],
  "Kerala|Kottayam": ["Kottayam"],
  "Kerala|Kozhikode": ["Kozhikode"],
  "Kerala|Malappuram": ["Malappuram"],
  "Kerala|Palakkad": ["Palakkad"],
  "Kerala|Pathanamthitta": ["Pathanamthitta"],
  "Kerala|Thiruvananthapuram": ["Thiruvananthapuram"],
  "Kerala|Thrissur": ["Thrissur"],
  "Kerala|Wayanad": ["Wayanad"],
  "Madhya Pradesh|Agar Malwa": ["Agar Malwa"],
  "Madhya Pradesh|Alirajpur": ["Alirajpur"],
  "Madhya Pradesh|Anuppur": ["Anuppur"],
  "Madhya Pradesh|Ashoknagar": ["Ashoknagar"],
  "Madhya Pradesh|Balaghat": ["Balaghat"],
  "Madhya Pradesh|Barwani": ["Barwani"],
  "Madhya Pradesh|Betul": ["Betul"],
  "Madhya Pradesh|Bhind": ["Bhind"],
  "Madhya Pradesh|Bhopal": ["Bhopal"],
  "Madhya Pradesh|Burhanpur": ["Burhanpur"],
  "Madhya Pradesh|Chhatarpur": ["Chhatarpur"],
  "Madhya Pradesh|Chhindwara": ["Chhindwara"],
  "Madhya Pradesh|Damoh": ["Damoh"],
  "Madhya Pradesh|Datia": ["Datia"],
  "Madhya Pradesh|Dewas": ["Dewas"],
  "Madhya Pradesh|Dhar": ["Dhar"],
  "Madhya Pradesh|Dindori": ["Dindori"],
  "Madhya Pradesh|Guna": ["Guna"],
  "Madhya Pradesh|Gwalior": ["Gwalior"],
  "Madhya Pradesh|Harda": ["Harda"],
  "Madhya Pradesh|Indore": ["Indore"],
  "Madhya Pradesh|Jabalpur": ["Jabalpur"],
  "Madhya Pradesh|Jhabua": ["Jhabua"],
  "Madhya Pradesh|Katni": ["Katni"],
  "Madhya Pradesh|Khandwa": ["Khandwa"],
  "Madhya Pradesh|Khargone": ["Khargone"],
  "Madhya Pradesh|Mandla": ["Mandla"],
  "Madhya Pradesh|Mandsaur": ["Mandsaur"],
  "Madhya Pradesh|Maihar": ["Maihar"],
  "Madhya Pradesh|Mauganj": ["Mauganj"],
  "Madhya Pradesh|Morena": ["Morena"],
  "Madhya Pradesh|Narmadapuram": ["Narmadapuram"],
  "Madhya Pradesh|Narsinghpur": ["Narsinghpur"],
  "Madhya Pradesh|Neemuch": ["Neemuch"],
  "Madhya Pradesh|Niwari": ["Niwari"],
  "Madhya Pradesh|Panna": ["Panna"],
  "Madhya Pradesh|Pandhurna": ["Pandhurna"],
  "Madhya Pradesh|Raisen": ["Raisen"],
  "Madhya Pradesh|Rajgarh": ["Rajgarh"],
  "Madhya Pradesh|Ratlam": ["Ratlam"],
  "Madhya Pradesh|Rewa": ["Rewa"],
  "Madhya Pradesh|Sagar": ["Sagar"],
  "Madhya Pradesh|Satna": ["Satna"],
  "Madhya Pradesh|Sehore": ["Sehore"],
  "Madhya Pradesh|Seoni": ["Seoni"],
  "Madhya Pradesh|Shahdol": ["Shahdol"],
  "Madhya Pradesh|Shajapur": ["Shajapur"],
  "Madhya Pradesh|Sheopur": ["Sheopur"],
  "Madhya Pradesh|Shivpuri": ["Shivpuri"],
  "Madhya Pradesh|Sidhi": ["Sidhi"],
  "Madhya Pradesh|Singrauli": ["Singrauli"],
  "Madhya Pradesh|Tikamgarh": ["Tikamgarh"],
  "Madhya Pradesh|Ujjain": ["Ujjain"],
  "Madhya Pradesh|Umaria": ["Umaria"],
  "Madhya Pradesh|Vidisha": ["Vidisha"],
  "Maharashtra|Ahilyanagar": ["Ahilyanagar"],
  "Maharashtra|Akola": ["Akola"],
  "Maharashtra|Amravati": ["Amravati"],
  "Maharashtra|Beed": ["Beed"],
  "Maharashtra|Bhandara": ["Bhandara"],
  "Maharashtra|Buldhana": ["Buldhana"],
  "Maharashtra|Chandrapur": ["Chandrapur"],
  "Maharashtra|Chhatrapati Sambhajinagar": ["Chhatrapati Sambhajinagar"],
  "Maharashtra|Dharashiv": ["Dharashiv"],
  "Maharashtra|Dhule": ["Dhule"],
  "Maharashtra|Gadchiroli": ["Gadchiroli"],
  "Maharashtra|Gondia": ["Gondia"],
  "Maharashtra|Hingoli": ["Hingoli"],
  "Maharashtra|Jalgaon": ["Jalgaon"],
  "Maharashtra|Jalna": ["Jalna"],
  "Maharashtra|Kolhapur": ["Kolhapur"],
  "Maharashtra|Latur": ["Latur"],
  "Maharashtra|Mumbai City": ["Mumbai"],
  "Maharashtra|Mumbai Suburban": ["Mumbai"],
  "Maharashtra|Nagpur": ["Nagpur"],
  "Maharashtra|Nanded": ["Nanded"],
  "Maharashtra|Nandurbar": ["Nandurbar"],
  "Maharashtra|Nashik": ["Nashik"],
  "Maharashtra|Palghar": ["Palghar"],
  "Maharashtra|Parbhani": ["Parbhani"],
  "Maharashtra|Pune": ["Pune"],
  "Maharashtra|Raigad": ["Raigad"],
  "Maharashtra|Ratnagiri": ["Ratnagiri"],
  "Maharashtra|Sangli": ["Sangli"],
  "Maharashtra|Satara": ["Satara"],
  "Maharashtra|Sindhudurg": ["Sindhudurg"],
  "Maharashtra|Solapur": ["Solapur"],
  "Maharashtra|Thane": ["Thane"],
  "Maharashtra|Wardha": ["Wardha"],
  "Maharashtra|Washim": ["Washim"],
  "Maharashtra|Yavatmal": ["Yavatmal"],
  "Manipur|Bishnupur": ["Bishnupur"],
  "Manipur|Chandel": ["Chandel"],
  "Manipur|Churachandpur": ["Churachandpur"],
  "Manipur|Imphal East": ["Imphal East"],
  "Manipur|Imphal West": ["Imphal West"],
  "Manipur|Jiribam": ["Jiribam"],
  "Manipur|Kakching": ["Kakching"],
  "Manipur|Kamjong": ["Kamjong"],
  "Manipur|Kangpokpi": ["Kangpokpi"],
  "Manipur|Noney": ["Noney"],
  "Manipur|Pherzawl": ["Pherzawl"],
  "Manipur|Senapati": ["Senapati"],
  "Manipur|Tamenglong": ["Tamenglong"],
  "Manipur|Tengnoupal": ["Tengnoupal"],
  "Manipur|Thoubal": ["Thoubal"],
  "Manipur|Ukhrul": ["Ukhrul"],
  "Meghalaya|East Garo Hills": ["East Garo Hills"],
  "Meghalaya|East Khasi Hills": ["East Khasi Hills"],
  "Meghalaya|East Jaintia Hills": ["East Jaintia Hills"],
  "Meghalaya|Eastern West Khasi Hills": ["Eastern West Khasi Hills"],
  "Meghalaya|North Garo Hills": ["North Garo Hills"],
  "Meghalaya|Ri Bhoi": ["Ri Bhoi"],
  "Meghalaya|South Garo Hills": ["South Garo Hills"],
  "Meghalaya|South West Garo Hills": ["South West Garo Hills"],
  "Meghalaya|South West Khasi Hills": ["South West Khasi Hills"],
  "Meghalaya|West Garo Hills": ["West Garo Hills"],
  "Meghalaya|West Jaintia Hills": ["West Jaintia Hills"],
  "Meghalaya|West Khasi Hills": ["West Khasi Hills"],
  "Mizoram|Aizawl": ["Aizawl"],
  "Mizoram|Champhai": ["Champhai"],
  "Mizoram|Hnahthial": ["Hnahthial"],
  "Mizoram|Khawzawl": ["Khawzawl"],
  "Mizoram|Kolasib": ["Kolasib"],
  "Mizoram|Lawngtlai": ["Lawngtlai"],
  "Mizoram|Lunglei": ["Lunglei"],
  "Mizoram|Mamit": ["Mamit"],
  "Mizoram|Saitual": ["Saitual"],
  "Mizoram|Saiha": ["Saiha"],
  "Mizoram|Serchhip": ["Serchhip"],
  "Nagaland|Chümoukedima": ["Chümoukedima"],
  "Nagaland|Dimapur": ["Dimapur"],
  "Nagaland|Kiphire": ["Kiphire"],
  "Nagaland|Kohima": ["Kohima"],
  "Nagaland|Longleng": ["Longleng"],
  "Nagaland|Mokokchung": ["Mokokchung"],
  "Nagaland|Mon": ["Mon"],
  "Nagaland|Niuland": ["Niuland"],
  "Nagaland|Noklak": ["Noklak"],
  "Nagaland|Peren": ["Peren"],
  "Nagaland|Phek": ["Phek"],
  "Nagaland|Shamator": ["Shamator"],
  "Nagaland|Tseminyü": ["Tseminyü"],
  "Nagaland|Tuensang": ["Tuensang"],
  "Nagaland|Wokha": ["Wokha"],
  "Nagaland|Zunheboto": ["Zunheboto"],
  "Odisha|Angul": ["Angul"],
  "Odisha|Balangir": ["Balangir"],
  "Odisha|Balasore": ["Balasore"],
  "Odisha|Bargarh": ["Bargarh"],
  "Odisha|Bhadrak": ["Bhadrak"],
  "Odisha|Boudh": ["Boudh"],
  "Odisha|Cuttack": ["Cuttack"],
  "Odisha|Debagarh": ["Debagarh"],
  "Odisha|Dhenkanal": ["Dhenkanal"],
  "Odisha|Gajapati": ["Gajapati"],
  "Odisha|Ganjam": ["Ganjam"],
  "Odisha|Jagatsinghpur": ["Jagatsinghpur"],
  "Odisha|Jajpur": ["Jajpur"],
  "Odisha|Jharsuguda": ["Jharsuguda"],
  "Odisha|Kalahandi": ["Kalahandi"],
  "Odisha|Kandhamal": ["Kandhamal"],
  "Odisha|Kendrapara": ["Kendrapara"],
  "Odisha|Kendujhar": ["Kendujhar"],
  "Odisha|Khordha": ["Bhubaneswar"],
  "Odisha|Koraput": ["Koraput"],
  "Odisha|Malkangiri": ["Malkangiri"],
  "Odisha|Mayurbhanj": ["Mayurbhanj"],
  "Odisha|Nabarangpur": ["Nabarangpur"],
  "Odisha|Nayagarh": ["Nayagarh"],
  "Odisha|Nuapada": ["Nuapada"],
  "Odisha|Puri": ["Puri"],
  "Odisha|Rayagada": ["Rayagada"],
  "Odisha|Sambalpur": ["Sambalpur"],
  "Odisha|Subarnapur": ["Subarnapur"],
  "Odisha|Sundargarh": ["Sundargarh"],
  "Punjab|Amritsar": ["Amritsar"],
  "Punjab|Barnala": ["Barnala"],
  "Punjab|Bathinda": ["Bathinda"],
  "Punjab|Faridkot": ["Faridkot"],
  "Punjab|Fatehgarh Sahib": ["Fatehgarh Sahib"],
  "Punjab|Fazilka": ["Fazilka"],
  "Punjab|Ferozepur": ["Ferozepur"],
  "Punjab|Gurdaspur": ["Gurdaspur"],
  "Punjab|Hoshiarpur": ["Hoshiarpur"],
  "Punjab|Jalandhar": ["Jalandhar"],
  "Punjab|Kapurthala": ["Kapurthala"],
  "Punjab|Ludhiana": ["Ludhiana"],
  "Punjab|Malerkotla": ["Malerkotla"],
  "Punjab|Mansa": ["Mansa"],
  "Punjab|Moga": ["Moga"],
  "Punjab|Pathankot": ["Pathankot"],
  "Punjab|Patiala": ["Patiala"],
  "Punjab|Rupnagar": ["Rupnagar"],
  "Punjab|Sahibzada Ajit Singh Nagar": ["Mohali"],
  "Punjab|Sangrur": ["Sangrur"],
  "Punjab|Shahid Bhagat Singh Nagar": ["Shahid Bhagat Singh Nagar"],
  "Punjab|Sri Muktsar Sahib": ["Sri Muktsar Sahib"],
  "Punjab|Tarn Taran": ["Tarn Taran"],
  "Rajasthan|Ajmer": ["Ajmer"],
  "Rajasthan|Alwar": ["Alwar"],
  "Rajasthan|Balotra": ["Balotra"],
  "Rajasthan|Banswara": ["Banswara"],
  "Rajasthan|Baran": ["Baran"],
  "Rajasthan|Barmer": ["Barmer"],
  "Rajasthan|Beawar": ["Beawar"],
  "Rajasthan|Bharatpur": ["Bharatpur"],
  "Rajasthan|Bhilwara": ["Bhilwara"],
  "Rajasthan|Bikaner": ["Bikaner"],
  "Rajasthan|Bundi": ["Bundi"],
  "Rajasthan|Chittorgarh": ["Chittorgarh"],
  "Rajasthan|Churu": ["Churu"],
  "Rajasthan|Dausa": ["Dausa"],
  "Rajasthan|Deeg": ["Deeg"],
  "Rajasthan|Dholpur": ["Dholpur"],
  "Rajasthan|Didwana-Kuchamana": ["Didwana-Kuchamana"],
  "Rajasthan|Dungarpur": ["Dungarpur"],
  "Rajasthan|Hanumangarh": ["Hanumangarh"],
  "Rajasthan|Jaipur": ["Jaipur"],
  "Rajasthan|Jaisalmer": ["Jaisalmer"],
  "Rajasthan|Jalore": ["Jalore"],
  "Rajasthan|Jhalawar": ["Jhalawar"],
  "Rajasthan|Jhunjhunu": ["Jhunjhunu"],
  "Rajasthan|Jodhpur": ["Jodhpur"],
  "Rajasthan|Karauli": ["Karauli"],
  "Rajasthan|Kota": ["Kota"],
  "Rajasthan|Khairthal-Tijara": ["Khairthal-Tijara"],
  "Rajasthan|Nagaur": ["Nagaur"],
  "Rajasthan|Pali": ["Pali"],
  "Rajasthan|Phalodi": ["Phalodi"],
  "Rajasthan|Pratapgarh": ["Pratapgarh"],
  "Rajasthan|Rajsamand": ["Rajsamand"],
  "Rajasthan|Salumbar": ["Salumbar"],
  "Rajasthan|Sawai Madhopur": ["Sawai Madhopur"],
  "Rajasthan|Sikar": ["Sikar"],
  "Rajasthan|Sirohi": ["Sirohi"],
  "Rajasthan|Sri Ganganagar": ["Sri Ganganagar"],
  "Rajasthan|Tonk": ["Tonk"],
  "Rajasthan|Udaipur": ["Udaipur"],
  "Sikkim|Gangtok": ["Gangtok"],
  "Sikkim|Mangan": ["Mangan"],
  "Sikkim|Namchi": ["Namchi"],
  "Sikkim|Pakyong": ["Pakyong"],
  "Sikkim|Soreng": ["Soreng"],
  "Sikkim|Gyalshing": ["Gyalshing"],
  "Tamil Nadu|Ariyalur": ["Ariyalur"],
  "Tamil Nadu|Chengalpattu": ["Chengalpattu"],
  "Tamil Nadu|Chennai": ["Chennai"],
  "Tamil Nadu|Coimbatore": ["Coimbatore"],
  "Tamil Nadu|Cuddalore": ["Cuddalore"],
  "Tamil Nadu|Dharmapuri": ["Dharmapuri"],
  "Tamil Nadu|Dindigul": ["Dindigul"],
  "Tamil Nadu|Erode": ["Erode"],
  "Tamil Nadu|Kallakurichi": ["Kallakurichi"],
  "Tamil Nadu|Kancheepuram": ["Kancheepuram"],
  "Tamil Nadu|Kanniyakumari": ["Kanniyakumari"],
  "Tamil Nadu|Karur": ["Karur"],
  "Tamil Nadu|Krishnagiri": ["Krishnagiri"],
  "Tamil Nadu|Madurai": ["Madurai"],
  "Tamil Nadu|Mayiladuthurai": ["Mayiladuthurai"],
  "Tamil Nadu|Nagapattinam": ["Nagapattinam"],
  "Tamil Nadu|Namakkal": ["Namakkal"],
  "Tamil Nadu|Nilgiris": ["Nilgiris"],
  "Tamil Nadu|Perambalur": ["Perambalur"],
  "Tamil Nadu|Pudukkottai": ["Pudukkottai"],
  "Tamil Nadu|Ramanathapuram": ["Ramanathapuram"],
  "Tamil Nadu|Ranipet": ["Ranipet"],
  "Tamil Nadu|Salem": ["Salem"],
  "Tamil Nadu|Sivaganga": ["Sivaganga"],
  "Tamil Nadu|Tenkasi": ["Tenkasi"],
  "Tamil Nadu|Thanjavur": ["Thanjavur"],
  "Tamil Nadu|Theni": ["Theni"],
  "Tamil Nadu|Thoothukudi": ["Thoothukudi"],
  "Tamil Nadu|Tiruchirappalli": ["Tiruchirappalli"],
  "Tamil Nadu|Tirunelveli": ["Tirunelveli"],
  "Tamil Nadu|Tirupathur": ["Tirupathur"],
  "Tamil Nadu|Tiruppur": ["Tiruppur"],
  "Tamil Nadu|Tiruvallur": ["Tiruvallur"],
  "Tamil Nadu|Tiruvannamalai": ["Tiruvannamalai"],
  "Tamil Nadu|Tiruvarur": ["Tiruvarur"],
  "Tamil Nadu|Vellore": ["Vellore"],
  "Tamil Nadu|Viluppuram": ["Viluppuram"],
  "Tamil Nadu|Virudhunagar": ["Virudhunagar"],
  "Telangana|Adilabad": ["Adilabad"],
  "Telangana|Bhadradri Kothagudem": ["Bhadradri Kothagudem"],
  "Telangana|Hanamkonda": ["Hanamkonda"],
  "Telangana|Hyderabad": ["Hyderabad"],
  "Telangana|Jagtial": ["Jagtial"],
  "Telangana|Jangaon": ["Jangaon"],
  "Telangana|Jayashankar Bhupalpally": ["Jayashankar Bhupalpally"],
  "Telangana|Jogulamba Gadwal": ["Jogulamba Gadwal"],
  "Telangana|Kamareddy": ["Kamareddy"],
  "Telangana|Karimnagar": ["Karimnagar"],
  "Telangana|Khammam": ["Khammam"],
  "Telangana|Kumuram Bheem Asifabad": ["Kumuram Bheem Asifabad"],
  "Telangana|Mahabubabad": ["Mahabubabad"],
  "Telangana|Mahbubnagar": ["Mahbubnagar"],
  "Telangana|Mancherial": ["Mancherial"],
  "Telangana|Medak": ["Medak"],
  "Telangana|Medchal-Malkajgiri": ["Medchal-Malkajgiri"],
  "Telangana|Mulugu": ["Mulugu"],
  "Telangana|Nagarkurnool": ["Nagarkurnool"],
  "Telangana|Nalgonda": ["Nalgonda"],
  "Telangana|Narayanpet": ["Narayanpet"],
  "Telangana|Nirmal": ["Nirmal"],
  "Telangana|Nizamabad": ["Nizamabad"],
  "Telangana|Peddapalli": ["Peddapalli"],
  "Telangana|Rajanna Sircilla": ["Rajanna Sircilla"],
  "Telangana|Ranga Reddy": ["Hyderabad"],
  "Telangana|Sangareddy": ["Sangareddy"],
  "Telangana|Siddipet": ["Siddipet"],
  "Telangana|Suryapet": ["Suryapet"],
  "Telangana|Vikarabad": ["Vikarabad"],
  "Telangana|Wanaparthy": ["Wanaparthy"],
  "Telangana|Warangal": ["Warangal"],
  "Telangana|Yadadri Bhuvanagiri": ["Yadadri Bhuvanagiri"],
  "Tripura|Dhalai": ["Dhalai"],
  "Tripura|Gomati": ["Gomati"],
  "Tripura|Khowai": ["Khowai"],
  "Tripura|North Tripura": ["North Tripura"],
  "Tripura|Sepahijala": ["Sepahijala"],
  "Tripura|South Tripura": ["South Tripura"],
  "Tripura|Unakoti": ["Unakoti"],
  "Tripura|West Tripura": ["West Tripura"],
  "Uttar Pradesh|Agra": ["Agra"],
  "Uttar Pradesh|Aligarh": ["Aligarh"],
  "Uttar Pradesh|Ambedkar Nagar": ["Ambedkar Nagar"],
  "Uttar Pradesh|Amethi": ["Amethi"],
  "Uttar Pradesh|Amroha": ["Amroha"],
  "Uttar Pradesh|Auraiya": ["Auraiya"],
  "Uttar Pradesh|Ayodhya": ["Ayodhya"],
  "Uttar Pradesh|Azamgarh": ["Azamgarh"],
  "Uttar Pradesh|Baghpat": ["Baghpat"],
  "Uttar Pradesh|Bahraich": ["Bahraich"],
  "Uttar Pradesh|Ballia": ["Ballia"],
  "Uttar Pradesh|Balrampur": ["Balrampur"],
  "Uttar Pradesh|Banda": ["Banda"],
  "Uttar Pradesh|Barabanki": ["Barabanki"],
  "Uttar Pradesh|Bareilly": ["Bareilly"],
  "Uttar Pradesh|Basti": ["Basti"],
  "Uttar Pradesh|Bhadohi": ["Bhadohi"],
  "Uttar Pradesh|Bijnor": ["Bijnor"],
  "Uttar Pradesh|Budaun": ["Budaun"],
  "Uttar Pradesh|Bulandshahr": ["Bulandshahr"],
  "Uttar Pradesh|Chandauli": ["Chandauli"],
  "Uttar Pradesh|Chitrakoot": ["Chitrakoot"],
  "Uttar Pradesh|Deoria": ["Deoria"],
  "Uttar Pradesh|Etah": ["Etah"],
  "Uttar Pradesh|Etawah": ["Etawah"],
  "Uttar Pradesh|Farrukhabad": ["Farrukhabad"],
  "Uttar Pradesh|Fatehpur": ["Fatehpur"],
  "Uttar Pradesh|Firozabad": ["Firozabad"],
  "Uttar Pradesh|Gautam Buddha Nagar": ["Noida", "Greater Noida"],
  "Uttar Pradesh|Ghaziabad": ["Ghaziabad"],
  "Uttar Pradesh|Ghazipur": ["Ghazipur"],
  "Uttar Pradesh|Gonda": ["Gonda"],
  "Uttar Pradesh|Gorakhpur": ["Gorakhpur"],
  "Uttar Pradesh|Hamirpur": ["Hamirpur"],
  "Uttar Pradesh|Hapur": ["Hapur"],
  "Uttar Pradesh|Hardoi": ["Hardoi"],
  "Uttar Pradesh|Hathras": ["Hathras"],
  "Uttar Pradesh|Jalaun": ["Jalaun"],
  "Uttar Pradesh|Jaunpur": ["Jaunpur"],
  "Uttar Pradesh|Jhansi": ["Jhansi"],
  "Uttar Pradesh|Kannauj": ["Kannauj"],
  "Uttar Pradesh|Kanpur Dehat": ["Kanpur Dehat"],
  "Uttar Pradesh|Kanpur Nagar": ["Kanpur"],
  "Uttar Pradesh|Kasganj": ["Kasganj"],
  "Uttar Pradesh|Kaushambi": ["Kaushambi"],
  "Uttar Pradesh|Kushinagar": ["Kushinagar"],
  "Uttar Pradesh|Lakhimpur Kheri": ["Lakhimpur Kheri"],
  "Uttar Pradesh|Lalitpur": ["Lalitpur"],
  "Uttar Pradesh|Lucknow": ["Lucknow"],
  "Uttar Pradesh|Maharajganj": ["Maharajganj"],
  "Uttar Pradesh|Mahoba": ["Mahoba"],
  "Uttar Pradesh|Mainpuri": ["Mainpuri"],
  "Uttar Pradesh|Mathura": ["Mathura"],
  "Uttar Pradesh|Mau": ["Mau"],
  "Uttar Pradesh|Meerut": ["Meerut"],
  "Uttar Pradesh|Mirzapur": ["Mirzapur"],
  "Uttar Pradesh|Moradabad": ["Moradabad"],
  "Uttar Pradesh|Muzaffarnagar": ["Muzaffarnagar"],
  "Uttar Pradesh|Pilibhit": ["Pilibhit"],
  "Uttar Pradesh|Pratapgarh": ["Pratapgarh"],
  "Uttar Pradesh|Prayagraj": ["Prayagraj"],
  "Uttar Pradesh|Raebareli": ["Raebareli"],
  "Uttar Pradesh|Rampur": ["Rampur"],
  "Uttar Pradesh|Saharanpur": ["Saharanpur"],
  "Uttar Pradesh|Sambhal": ["Sambhal"],
  "Uttar Pradesh|Sant Kabir Nagar": ["Sant Kabir Nagar"],
  "Uttar Pradesh|Shahjahanpur": ["Shahjahanpur"],
  "Uttar Pradesh|Shamli": ["Shamli"],
  "Uttar Pradesh|Shravasti": ["Shravasti"],
  "Uttar Pradesh|Siddharthnagar": ["Siddharthnagar"],
  "Uttar Pradesh|Sitapur": ["Sitapur"],
  "Uttar Pradesh|Sonbhadra": ["Sonbhadra"],
  "Uttar Pradesh|Sultanpur": ["Sultanpur"],
  "Uttar Pradesh|Unnao": ["Unnao"],
  "Uttar Pradesh|Varanasi": ["Varanasi"],
  "Uttarakhand|Almora": ["Almora"],
  "Uttarakhand|Bageshwar": ["Bageshwar"],
  "Uttarakhand|Chamoli": ["Chamoli"],
  "Uttarakhand|Champawat": ["Champawat"],
  "Uttarakhand|Dehradun": ["Dehradun"],
  "Uttarakhand|Haridwar": ["Haridwar"],
  "Uttarakhand|Nainital": ["Nainital"],
  "Uttarakhand|Pauri Garhwal": ["Pauri Garhwal"],
  "Uttarakhand|Pithoragarh": ["Pithoragarh"],
  "Uttarakhand|Rudraprayag": ["Rudraprayag"],
  "Uttarakhand|Tehri Garhwal": ["Tehri Garhwal"],
  "Uttarakhand|Udham Singh Nagar": ["Udham Singh Nagar"],
  "Uttarakhand|Uttarkashi": ["Uttarkashi"],
  "West Bengal|Alipurduar": ["Alipurduar"],
  "West Bengal|Bankura": ["Bankura"],
  "West Bengal|Birbhum": ["Birbhum"],
  "West Bengal|Cooch Behar": ["Cooch Behar"],
  "West Bengal|Dakshin Dinajpur": ["Dakshin Dinajpur"],
  "West Bengal|Darjeeling": ["Darjeeling"],
  "West Bengal|Hooghly": ["Hooghly"],
  "West Bengal|Howrah": ["Howrah"],
  "West Bengal|Jalpaiguri": ["Jalpaiguri"],
  "West Bengal|Jhargram": ["Jhargram"],
  "West Bengal|Kalimpong": ["Kalimpong"],
  "West Bengal|Kolkata": ["Kolkata"],
  "West Bengal|Malda": ["Malda"],
  "West Bengal|Murshidabad": ["Murshidabad"],
  "West Bengal|Nadia": ["Nadia"],
  "West Bengal|North 24 Parganas": ["North 24 Parganas"],
  "West Bengal|Paschim Bardhaman": ["Paschim Bardhaman"],
  "West Bengal|Paschim Medinipur": ["Paschim Medinipur"],
  "West Bengal|Purba Bardhaman": ["Purba Bardhaman"],
  "West Bengal|Purba Medinipur": ["Purba Medinipur"],
  "West Bengal|Purulia": ["Purulia"],
  "West Bengal|South 24 Parganas": ["South 24 Parganas"],
  "West Bengal|Uttar Dinajpur": ["Uttar Dinajpur"],
  "Andaman and Nicobar Islands|Nicobar": ["Nicobar"],
  "Andaman and Nicobar Islands|North and Middle Andaman": ["North and Middle Andaman"],
  "Andaman and Nicobar Islands|South Andaman": ["South Andaman"],
  "Chandigarh|Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu|Dadra and Nagar Haveli": ["Dadra and Nagar Haveli"],
  "Dadra and Nagar Haveli and Daman and Diu|Daman": ["Daman"],
  "Dadra and Nagar Haveli and Daman and Diu|Diu": ["Diu"],
  "Delhi|Central Delhi": ["Delhi"],
  "Delhi|East Delhi": ["Delhi"],
  "Delhi|New Delhi": ["New Delhi"],
  "Delhi|North Delhi": ["Delhi"],
  "Delhi|North East Delhi": ["Delhi"],
  "Delhi|North West Delhi": ["Delhi"],
  "Delhi|Shahdara": ["Delhi"],
  "Delhi|South Delhi": ["Delhi"],
  "Delhi|South East Delhi": ["Delhi"],
  "Delhi|South West Delhi": ["Delhi"],
  "Delhi|West Delhi": ["Delhi"],
  "Jammu and Kashmir|Anantnag": ["Anantnag"],
  "Jammu and Kashmir|Bandipora": ["Bandipora"],
  "Jammu and Kashmir|Baramulla": ["Baramulla"],
  "Jammu and Kashmir|Budgam": ["Budgam"],
  "Jammu and Kashmir|Doda": ["Doda"],
  "Jammu and Kashmir|Ganderbal": ["Ganderbal"],
  "Jammu and Kashmir|Jammu": ["Jammu"],
  "Jammu and Kashmir|Kathua": ["Kathua"],
  "Jammu and Kashmir|Kishtwar": ["Kishtwar"],
  "Jammu and Kashmir|Kulgam": ["Kulgam"],
  "Jammu and Kashmir|Kupwara": ["Kupwara"],
  "Jammu and Kashmir|Poonch": ["Poonch"],
  "Jammu and Kashmir|Pulwama": ["Pulwama"],
  "Jammu and Kashmir|Rajouri": ["Rajouri"],
  "Jammu and Kashmir|Ramban": ["Ramban"],
  "Jammu and Kashmir|Reasi": ["Reasi"],
  "Jammu and Kashmir|Samba": ["Samba"],
  "Jammu and Kashmir|Shopian": ["Shopian"],
  "Jammu and Kashmir|Srinagar": ["Srinagar"],
  "Jammu and Kashmir|Udhampur": ["Udhampur"],
  "Ladakh|Kargil": ["Kargil"],
  "Ladakh|Leh": ["Leh"],
  "Lakshadweep|Lakshadweep": ["Lakshadweep"],
  "Puducherry|Karaikal": ["Karaikal"],
  "Puducherry|Mahe": ["Mahe"],
  "Puducherry|Puducherry": ["Puducherry"],
  "Puducherry|Yanam": ["Yanam"],
};

export const indiaLocations: IndiaState[] = [
  {
    name: "Andhra Pradesh",
    districts: [
      {
        name: "Alluri Sitharama Raju",
        cities: cityOverrides["Andhra Pradesh|Alluri Sitharama Raju"] || ["Alluri Sitharama Raju"],
      },
      {
        name: "Anakapalli",
        cities: cityOverrides["Andhra Pradesh|Anakapalli"] || ["Anakapalli"],
      },
      {
        name: "Anantapuramu",
        cities: cityOverrides["Andhra Pradesh|Anantapuramu"] || ["Anantapuramu"],
      },
      {
        name: "Annamayya",
        cities: cityOverrides["Andhra Pradesh|Annamayya"] || ["Annamayya"],
      },
      {
        name: "Bapatla",
        cities: cityOverrides["Andhra Pradesh|Bapatla"] || ["Bapatla"],
      },
      {
        name: "Chittoor",
        cities: cityOverrides["Andhra Pradesh|Chittoor"] || ["Chittoor"],
      },
      {
        name: "Dr. B.R. Ambedkar Konaseema",
        cities: cityOverrides["Andhra Pradesh|Dr. B.R. Ambedkar Konaseema"] || ["Dr. B.R. Ambedkar Konaseema"],
      },
      {
        name: "East Godavari",
        cities: cityOverrides["Andhra Pradesh|East Godavari"] || ["East Godavari"],
      },
      {
        name: "Eluru",
        cities: cityOverrides["Andhra Pradesh|Eluru"] || ["Eluru"],
      },
      {
        name: "Guntur",
        cities: cityOverrides["Andhra Pradesh|Guntur"] || ["Guntur"],
      },
      {
        name: "Kakinada",
        cities: cityOverrides["Andhra Pradesh|Kakinada"] || ["Kakinada"],
      },
      {
        name: "Krishna",
        cities: cityOverrides["Andhra Pradesh|Krishna"] || ["Krishna"],
      },
      {
        name: "Kurnool",
        cities: cityOverrides["Andhra Pradesh|Kurnool"] || ["Kurnool"],
      },
      {
        name: "Nandyal",
        cities: cityOverrides["Andhra Pradesh|Nandyal"] || ["Nandyal"],
      },
      {
        name: "NTR",
        cities: cityOverrides["Andhra Pradesh|NTR"] || ["NTR"],
      },
      {
        name: "Palnadu",
        cities: cityOverrides["Andhra Pradesh|Palnadu"] || ["Palnadu"],
      },
      {
        name: "Parvathipuram Manyam",
        cities: cityOverrides["Andhra Pradesh|Parvathipuram Manyam"] || ["Parvathipuram Manyam"],
      },
      {
        name: "Prakasam",
        cities: cityOverrides["Andhra Pradesh|Prakasam"] || ["Prakasam"],
      },
      {
        name: "Sri Potti Sriramulu Nellore",
        cities: cityOverrides["Andhra Pradesh|Sri Potti Sriramulu Nellore"] || ["Sri Potti Sriramulu Nellore"],
      },
      {
        name: "Sri Sathya Sai",
        cities: cityOverrides["Andhra Pradesh|Sri Sathya Sai"] || ["Sri Sathya Sai"],
      },
      {
        name: "Srikakulam",
        cities: cityOverrides["Andhra Pradesh|Srikakulam"] || ["Srikakulam"],
      },
      {
        name: "Tirupati",
        cities: cityOverrides["Andhra Pradesh|Tirupati"] || ["Tirupati"],
      },
      {
        name: "Visakhapatnam",
        cities: cityOverrides["Andhra Pradesh|Visakhapatnam"] || ["Visakhapatnam"],
      },
      {
        name: "Vizianagaram",
        cities: cityOverrides["Andhra Pradesh|Vizianagaram"] || ["Vizianagaram"],
      },
      {
        name: "West Godavari",
        cities: cityOverrides["Andhra Pradesh|West Godavari"] || ["West Godavari"],
      },
      {
        name: "YSR",
        cities: cityOverrides["Andhra Pradesh|YSR"] || ["YSR"],
      },
    ],
  },
  {
    name: "Arunachal Pradesh",
    districts: [
      {
        name: "Anjaw",
        cities: cityOverrides["Arunachal Pradesh|Anjaw"] || ["Anjaw"],
      },
      {
        name: "Changlang",
        cities: cityOverrides["Arunachal Pradesh|Changlang"] || ["Changlang"],
      },
      {
        name: "Dibang Valley",
        cities: cityOverrides["Arunachal Pradesh|Dibang Valley"] || ["Dibang Valley"],
      },
      {
        name: "East Kameng",
        cities: cityOverrides["Arunachal Pradesh|East Kameng"] || ["East Kameng"],
      },
      {
        name: "East Siang",
        cities: cityOverrides["Arunachal Pradesh|East Siang"] || ["East Siang"],
      },
      {
        name: "Itanagar Capital Complex",
        cities: cityOverrides["Arunachal Pradesh|Itanagar Capital Complex"] || ["Itanagar Capital Complex"],
      },
      {
        name: "Kamle",
        cities: cityOverrides["Arunachal Pradesh|Kamle"] || ["Kamle"],
      },
      {
        name: "Kra Daadi",
        cities: cityOverrides["Arunachal Pradesh|Kra Daadi"] || ["Kra Daadi"],
      },
      {
        name: "Kurung Kumey",
        cities: cityOverrides["Arunachal Pradesh|Kurung Kumey"] || ["Kurung Kumey"],
      },
      {
        name: "Lepa Rada",
        cities: cityOverrides["Arunachal Pradesh|Lepa Rada"] || ["Lepa Rada"],
      },
      {
        name: "Lohit",
        cities: cityOverrides["Arunachal Pradesh|Lohit"] || ["Lohit"],
      },
      {
        name: "Longding",
        cities: cityOverrides["Arunachal Pradesh|Longding"] || ["Longding"],
      },
      {
        name: "Lower Dibang Valley",
        cities: cityOverrides["Arunachal Pradesh|Lower Dibang Valley"] || ["Lower Dibang Valley"],
      },
      {
        name: "Lower Siang",
        cities: cityOverrides["Arunachal Pradesh|Lower Siang"] || ["Lower Siang"],
      },
      {
        name: "Lower Subansiri",
        cities: cityOverrides["Arunachal Pradesh|Lower Subansiri"] || ["Lower Subansiri"],
      },
      {
        name: "Namsai",
        cities: cityOverrides["Arunachal Pradesh|Namsai"] || ["Namsai"],
      },
      {
        name: "Pakke-Kessang",
        cities: cityOverrides["Arunachal Pradesh|Pakke-Kessang"] || ["Pakke-Kessang"],
      },
      {
        name: "Papum Pare",
        cities: cityOverrides["Arunachal Pradesh|Papum Pare"] || ["Papum Pare"],
      },
      {
        name: "Shi Yomi",
        cities: cityOverrides["Arunachal Pradesh|Shi Yomi"] || ["Shi Yomi"],
      },
      {
        name: "Siang",
        cities: cityOverrides["Arunachal Pradesh|Siang"] || ["Siang"],
      },
      {
        name: "Tawang",
        cities: cityOverrides["Arunachal Pradesh|Tawang"] || ["Tawang"],
      },
      {
        name: "Tirap",
        cities: cityOverrides["Arunachal Pradesh|Tirap"] || ["Tirap"],
      },
      {
        name: "Upper Dibang Valley",
        cities: cityOverrides["Arunachal Pradesh|Upper Dibang Valley"] || ["Upper Dibang Valley"],
      },
      {
        name: "Upper Siang",
        cities: cityOverrides["Arunachal Pradesh|Upper Siang"] || ["Upper Siang"],
      },
      {
        name: "Upper Subansiri",
        cities: cityOverrides["Arunachal Pradesh|Upper Subansiri"] || ["Upper Subansiri"],
      },
      {
        name: "West Kameng",
        cities: cityOverrides["Arunachal Pradesh|West Kameng"] || ["West Kameng"],
      },
      {
        name: "West Siang",
        cities: cityOverrides["Arunachal Pradesh|West Siang"] || ["West Siang"],
      },
    ],
  },
  {
    name: "Assam",
    districts: [
      {
        name: "Baksa",
        cities: cityOverrides["Assam|Baksa"] || ["Baksa"],
      },
      {
        name: "Barpeta",
        cities: cityOverrides["Assam|Barpeta"] || ["Barpeta"],
      },
      {
        name: "Biswanath",
        cities: cityOverrides["Assam|Biswanath"] || ["Biswanath"],
      },
      {
        name: "Bongaigaon",
        cities: cityOverrides["Assam|Bongaigaon"] || ["Bongaigaon"],
      },
      {
        name: "Cachar",
        cities: cityOverrides["Assam|Cachar"] || ["Cachar"],
      },
      {
        name: "Charaideo",
        cities: cityOverrides["Assam|Charaideo"] || ["Charaideo"],
      },
      {
        name: "Chirang",
        cities: cityOverrides["Assam|Chirang"] || ["Chirang"],
      },
      {
        name: "Darrang",
        cities: cityOverrides["Assam|Darrang"] || ["Darrang"],
      },
      {
        name: "Dhemaji",
        cities: cityOverrides["Assam|Dhemaji"] || ["Dhemaji"],
      },
      {
        name: "Dhubri",
        cities: cityOverrides["Assam|Dhubri"] || ["Dhubri"],
      },
      {
        name: "Dibrugarh",
        cities: cityOverrides["Assam|Dibrugarh"] || ["Dibrugarh"],
      },
      {
        name: "Dima Hasao",
        cities: cityOverrides["Assam|Dima Hasao"] || ["Dima Hasao"],
      },
      {
        name: "Goalpara",
        cities: cityOverrides["Assam|Goalpara"] || ["Goalpara"],
      },
      {
        name: "Golaghat",
        cities: cityOverrides["Assam|Golaghat"] || ["Golaghat"],
      },
      {
        name: "Hailakandi",
        cities: cityOverrides["Assam|Hailakandi"] || ["Hailakandi"],
      },
      {
        name: "Hojai",
        cities: cityOverrides["Assam|Hojai"] || ["Hojai"],
      },
      {
        name: "Jorhat",
        cities: cityOverrides["Assam|Jorhat"] || ["Jorhat"],
      },
      {
        name: "Kamrup",
        cities: cityOverrides["Assam|Kamrup"] || ["Kamrup"],
      },
      {
        name: "Kamrup Metropolitan",
        cities: cityOverrides["Assam|Kamrup Metropolitan"] || ["Kamrup Metropolitan"],
      },
      {
        name: "Karbi Anglong",
        cities: cityOverrides["Assam|Karbi Anglong"] || ["Karbi Anglong"],
      },
      {
        name: "Karimganj",
        cities: cityOverrides["Assam|Karimganj"] || ["Karimganj"],
      },
      {
        name: "Kokrajhar",
        cities: cityOverrides["Assam|Kokrajhar"] || ["Kokrajhar"],
      },
      {
        name: "Lakhimpur",
        cities: cityOverrides["Assam|Lakhimpur"] || ["Lakhimpur"],
      },
      {
        name: "Majuli",
        cities: cityOverrides["Assam|Majuli"] || ["Majuli"],
      },
      {
        name: "Morigaon",
        cities: cityOverrides["Assam|Morigaon"] || ["Morigaon"],
      },
      {
        name: "Nagaon",
        cities: cityOverrides["Assam|Nagaon"] || ["Nagaon"],
      },
      {
        name: "Nalbari",
        cities: cityOverrides["Assam|Nalbari"] || ["Nalbari"],
      },
      {
        name: "Sivasagar",
        cities: cityOverrides["Assam|Sivasagar"] || ["Sivasagar"],
      },
      {
        name: "Sonitpur",
        cities: cityOverrides["Assam|Sonitpur"] || ["Sonitpur"],
      },
      {
        name: "South Salmara-Mankachar",
        cities: cityOverrides["Assam|South Salmara-Mankachar"] || ["South Salmara-Mankachar"],
      },
      {
        name: "Tinsukia",
        cities: cityOverrides["Assam|Tinsukia"] || ["Tinsukia"],
      },
      {
        name: "Udalguri",
        cities: cityOverrides["Assam|Udalguri"] || ["Udalguri"],
      },
      {
        name: "West Karbi Anglong",
        cities: cityOverrides["Assam|West Karbi Anglong"] || ["West Karbi Anglong"],
      },
    ],
  },
  {
    name: "Bihar",
    districts: [
      {
        name: "Araria",
        cities: cityOverrides["Bihar|Araria"] || ["Araria"],
      },
      {
        name: "Arwal",
        cities: cityOverrides["Bihar|Arwal"] || ["Arwal"],
      },
      {
        name: "Aurangabad",
        cities: cityOverrides["Bihar|Aurangabad"] || ["Aurangabad"],
      },
      {
        name: "Banka",
        cities: cityOverrides["Bihar|Banka"] || ["Banka"],
      },
      {
        name: "Begusarai",
        cities: cityOverrides["Bihar|Begusarai"] || ["Begusarai"],
      },
      {
        name: "Bhagalpur",
        cities: cityOverrides["Bihar|Bhagalpur"] || ["Bhagalpur"],
      },
      {
        name: "Bhojpur",
        cities: cityOverrides["Bihar|Bhojpur"] || ["Bhojpur"],
      },
      {
        name: "Buxar",
        cities: cityOverrides["Bihar|Buxar"] || ["Buxar"],
      },
      {
        name: "Darbhanga",
        cities: cityOverrides["Bihar|Darbhanga"] || ["Darbhanga"],
      },
      {
        name: "East Champaran",
        cities: cityOverrides["Bihar|East Champaran"] || ["East Champaran"],
      },
      {
        name: "Gaya",
        cities: cityOverrides["Bihar|Gaya"] || ["Gaya"],
      },
      {
        name: "Gopalganj",
        cities: cityOverrides["Bihar|Gopalganj"] || ["Gopalganj"],
      },
      {
        name: "Jamui",
        cities: cityOverrides["Bihar|Jamui"] || ["Jamui"],
      },
      {
        name: "Jehanabad",
        cities: cityOverrides["Bihar|Jehanabad"] || ["Jehanabad"],
      },
      {
        name: "Kaimur",
        cities: cityOverrides["Bihar|Kaimur"] || ["Kaimur"],
      },
      {
        name: "Katihar",
        cities: cityOverrides["Bihar|Katihar"] || ["Katihar"],
      },
      {
        name: "Khagaria",
        cities: cityOverrides["Bihar|Khagaria"] || ["Khagaria"],
      },
      {
        name: "Kishanganj",
        cities: cityOverrides["Bihar|Kishanganj"] || ["Kishanganj"],
      },
      {
        name: "Lakhisarai",
        cities: cityOverrides["Bihar|Lakhisarai"] || ["Lakhisarai"],
      },
      {
        name: "Madhepura",
        cities: cityOverrides["Bihar|Madhepura"] || ["Madhepura"],
      },
      {
        name: "Madhubani",
        cities: cityOverrides["Bihar|Madhubani"] || ["Madhubani"],
      },
      {
        name: "Munger",
        cities: cityOverrides["Bihar|Munger"] || ["Munger"],
      },
      {
        name: "Muzaffarpur",
        cities: cityOverrides["Bihar|Muzaffarpur"] || ["Muzaffarpur"],
      },
      {
        name: "Nalanda",
        cities: cityOverrides["Bihar|Nalanda"] || ["Nalanda"],
      },
      {
        name: "Nawada",
        cities: cityOverrides["Bihar|Nawada"] || ["Nawada"],
      },
      {
        name: "Patna",
        cities: cityOverrides["Bihar|Patna"] || ["Patna"],
      },
      {
        name: "Purnia",
        cities: cityOverrides["Bihar|Purnia"] || ["Purnia"],
      },
      {
        name: "Rohtas",
        cities: cityOverrides["Bihar|Rohtas"] || ["Rohtas"],
      },
      {
        name: "Saharsa",
        cities: cityOverrides["Bihar|Saharsa"] || ["Saharsa"],
      },
      {
        name: "Samastipur",
        cities: cityOverrides["Bihar|Samastipur"] || ["Samastipur"],
      },
      {
        name: "Saran",
        cities: cityOverrides["Bihar|Saran"] || ["Saran"],
      },
      {
        name: "Sheikhpura",
        cities: cityOverrides["Bihar|Sheikhpura"] || ["Sheikhpura"],
      },
      {
        name: "Sheohar",
        cities: cityOverrides["Bihar|Sheohar"] || ["Sheohar"],
      },
      {
        name: "Sitamarhi",
        cities: cityOverrides["Bihar|Sitamarhi"] || ["Sitamarhi"],
      },
      {
        name: "Siwan",
        cities: cityOverrides["Bihar|Siwan"] || ["Siwan"],
      },
      {
        name: "Supaul",
        cities: cityOverrides["Bihar|Supaul"] || ["Supaul"],
      },
      {
        name: "Vaishali",
        cities: cityOverrides["Bihar|Vaishali"] || ["Vaishali"],
      },
      {
        name: "West Champaran",
        cities: cityOverrides["Bihar|West Champaran"] || ["West Champaran"],
      },
    ],
  },
  {
    name: "Chhattisgarh",
    districts: [
      {
        name: "Balod",
        cities: cityOverrides["Chhattisgarh|Balod"] || ["Balod"],
      },
      {
        name: "Baloda Bazar",
        cities: cityOverrides["Chhattisgarh|Baloda Bazar"] || ["Baloda Bazar"],
      },
      {
        name: "Balrampur-Ramanujganj",
        cities: cityOverrides["Chhattisgarh|Balrampur-Ramanujganj"] || ["Balrampur-Ramanujganj"],
      },
      {
        name: "Bastar",
        cities: cityOverrides["Chhattisgarh|Bastar"] || ["Bastar"],
      },
      {
        name: "Bemetara",
        cities: cityOverrides["Chhattisgarh|Bemetara"] || ["Bemetara"],
      },
      {
        name: "Bijapur",
        cities: cityOverrides["Chhattisgarh|Bijapur"] || ["Bijapur"],
      },
      {
        name: "Bilaspur",
        cities: cityOverrides["Chhattisgarh|Bilaspur"] || ["Bilaspur"],
      },
      {
        name: "Dantewada",
        cities: cityOverrides["Chhattisgarh|Dantewada"] || ["Dantewada"],
      },
      {
        name: "Dhamtari",
        cities: cityOverrides["Chhattisgarh|Dhamtari"] || ["Dhamtari"],
      },
      {
        name: "Durg",
        cities: cityOverrides["Chhattisgarh|Durg"] || ["Durg"],
      },
      {
        name: "Gariaband",
        cities: cityOverrides["Chhattisgarh|Gariaband"] || ["Gariaband"],
      },
      {
        name: "Gaurela-Pendra-Marwahi",
        cities: cityOverrides["Chhattisgarh|Gaurela-Pendra-Marwahi"] || ["Gaurela-Pendra-Marwahi"],
      },
      {
        name: "Janjgir-Champa",
        cities: cityOverrides["Chhattisgarh|Janjgir-Champa"] || ["Janjgir-Champa"],
      },
      {
        name: "Jashpur",
        cities: cityOverrides["Chhattisgarh|Jashpur"] || ["Jashpur"],
      },
      {
        name: "Kabirdham",
        cities: cityOverrides["Chhattisgarh|Kabirdham"] || ["Kabirdham"],
      },
      {
        name: "Kanker",
        cities: cityOverrides["Chhattisgarh|Kanker"] || ["Kanker"],
      },
      {
        name: "Khairagarh-Chhuikhadan-Gandai",
        cities: cityOverrides["Chhattisgarh|Khairagarh-Chhuikhadan-Gandai"] || ["Khairagarh-Chhuikhadan-Gandai"],
      },
      {
        name: "Kondagaon",
        cities: cityOverrides["Chhattisgarh|Kondagaon"] || ["Kondagaon"],
      },
      {
        name: "Korba",
        cities: cityOverrides["Chhattisgarh|Korba"] || ["Korba"],
      },
      {
        name: "Korea",
        cities: cityOverrides["Chhattisgarh|Korea"] || ["Korea"],
      },
      {
        name: "Manendragarh-Chirmiri-Bharatpur",
        cities: cityOverrides["Chhattisgarh|Manendragarh-Chirmiri-Bharatpur"] || ["Manendragarh-Chirmiri-Bharatpur"],
      },
      {
        name: "Mahasamund",
        cities: cityOverrides["Chhattisgarh|Mahasamund"] || ["Mahasamund"],
      },
      {
        name: "Mohla-Manpur-Ambagarh Chowki",
        cities: cityOverrides["Chhattisgarh|Mohla-Manpur-Ambagarh Chowki"] || ["Mohla-Manpur-Ambagarh Chowki"],
      },
      {
        name: "Mungeli",
        cities: cityOverrides["Chhattisgarh|Mungeli"] || ["Mungeli"],
      },
      {
        name: "Narayanpur",
        cities: cityOverrides["Chhattisgarh|Narayanpur"] || ["Narayanpur"],
      },
      {
        name: "Raigarh",
        cities: cityOverrides["Chhattisgarh|Raigarh"] || ["Raigarh"],
      },
      {
        name: "Raipur",
        cities: cityOverrides["Chhattisgarh|Raipur"] || ["Raipur"],
      },
      {
        name: "Rajnandgaon",
        cities: cityOverrides["Chhattisgarh|Rajnandgaon"] || ["Rajnandgaon"],
      },
      {
        name: "Sarangarh-Bilaigarh",
        cities: cityOverrides["Chhattisgarh|Sarangarh-Bilaigarh"] || ["Sarangarh-Bilaigarh"],
      },
      {
        name: "Sakti",
        cities: cityOverrides["Chhattisgarh|Sakti"] || ["Sakti"],
      },
      {
        name: "Sukma",
        cities: cityOverrides["Chhattisgarh|Sukma"] || ["Sukma"],
      },
      {
        name: "Surajpur",
        cities: cityOverrides["Chhattisgarh|Surajpur"] || ["Surajpur"],
      },
      {
        name: "Surguja",
        cities: cityOverrides["Chhattisgarh|Surguja"] || ["Surguja"],
      },
    ],
  },
  {
    name: "Goa",
    districts: [
      {
        name: "North Goa",
        cities: cityOverrides["Goa|North Goa"] || ["North Goa"],
      },
      {
        name: "South Goa",
        cities: cityOverrides["Goa|South Goa"] || ["South Goa"],
      },
    ],
  },
  {
    name: "Gujarat",
    districts: [
      {
        name: "Ahmedabad",
        cities: cityOverrides["Gujarat|Ahmedabad"] || ["Ahmedabad"],
      },
      {
        name: "Amreli",
        cities: cityOverrides["Gujarat|Amreli"] || ["Amreli"],
      },
      {
        name: "Anand",
        cities: cityOverrides["Gujarat|Anand"] || ["Anand"],
      },
      {
        name: "Aravalli",
        cities: cityOverrides["Gujarat|Aravalli"] || ["Aravalli"],
      },
      {
        name: "Banaskantha",
        cities: cityOverrides["Gujarat|Banaskantha"] || ["Banaskantha"],
      },
      {
        name: "Bharuch",
        cities: cityOverrides["Gujarat|Bharuch"] || ["Bharuch"],
      },
      {
        name: "Bhavnagar",
        cities: cityOverrides["Gujarat|Bhavnagar"] || ["Bhavnagar"],
      },
      {
        name: "Botad",
        cities: cityOverrides["Gujarat|Botad"] || ["Botad"],
      },
      {
        name: "Chhota Udaipur",
        cities: cityOverrides["Gujarat|Chhota Udaipur"] || ["Chhota Udaipur"],
      },
      {
        name: "Dahod",
        cities: cityOverrides["Gujarat|Dahod"] || ["Dahod"],
      },
      {
        name: "Dang",
        cities: cityOverrides["Gujarat|Dang"] || ["Dang"],
      },
      {
        name: "Devbhumi Dwarka",
        cities: cityOverrides["Gujarat|Devbhumi Dwarka"] || ["Devbhumi Dwarka"],
      },
      {
        name: "Gandhinagar",
        cities: cityOverrides["Gujarat|Gandhinagar"] || ["Gandhinagar"],
      },
      {
        name: "Gir Somnath",
        cities: cityOverrides["Gujarat|Gir Somnath"] || ["Gir Somnath"],
      },
      {
        name: "Jamnagar",
        cities: cityOverrides["Gujarat|Jamnagar"] || ["Jamnagar"],
      },
      {
        name: "Junagadh",
        cities: cityOverrides["Gujarat|Junagadh"] || ["Junagadh"],
      },
      {
        name: "Kheda",
        cities: cityOverrides["Gujarat|Kheda"] || ["Kheda"],
      },
      {
        name: "Kutch",
        cities: cityOverrides["Gujarat|Kutch"] || ["Kutch"],
      },
      {
        name: "Mahisagar",
        cities: cityOverrides["Gujarat|Mahisagar"] || ["Mahisagar"],
      },
      {
        name: "Mehsana",
        cities: cityOverrides["Gujarat|Mehsana"] || ["Mehsana"],
      },
      {
        name: "Morbi",
        cities: cityOverrides["Gujarat|Morbi"] || ["Morbi"],
      },
      {
        name: "Narmada",
        cities: cityOverrides["Gujarat|Narmada"] || ["Narmada"],
      },
      {
        name: "Navsari",
        cities: cityOverrides["Gujarat|Navsari"] || ["Navsari"],
      },
      {
        name: "Panchmahal",
        cities: cityOverrides["Gujarat|Panchmahal"] || ["Panchmahal"],
      },
      {
        name: "Patan",
        cities: cityOverrides["Gujarat|Patan"] || ["Patan"],
      },
      {
        name: "Porbandar",
        cities: cityOverrides["Gujarat|Porbandar"] || ["Porbandar"],
      },
      {
        name: "Rajkot",
        cities: cityOverrides["Gujarat|Rajkot"] || ["Rajkot"],
      },
      {
        name: "Sabarkantha",
        cities: cityOverrides["Gujarat|Sabarkantha"] || ["Sabarkantha"],
      },
      {
        name: "Surat",
        cities: cityOverrides["Gujarat|Surat"] || ["Surat"],
      },
      {
        name: "Surendranagar",
        cities: cityOverrides["Gujarat|Surendranagar"] || ["Surendranagar"],
      },
      {
        name: "Tapi",
        cities: cityOverrides["Gujarat|Tapi"] || ["Tapi"],
      },
      {
        name: "Vadodara",
        cities: cityOverrides["Gujarat|Vadodara"] || ["Vadodara"],
      },
      {
        name: "Valsad",
        cities: cityOverrides["Gujarat|Valsad"] || ["Valsad"],
      },
    ],
  },
  {
    name: "Haryana",
    districts: [
      {
        name: "Ambala",
        cities: cityOverrides["Haryana|Ambala"] || ["Ambala"],
      },
      {
        name: "Bhiwani",
        cities: cityOverrides["Haryana|Bhiwani"] || ["Bhiwani"],
      },
      {
        name: "Charkhi Dadri",
        cities: cityOverrides["Haryana|Charkhi Dadri"] || ["Charkhi Dadri"],
      },
      {
        name: "Faridabad",
        cities: cityOverrides["Haryana|Faridabad"] || ["Faridabad"],
      },
      {
        name: "Fatehabad",
        cities: cityOverrides["Haryana|Fatehabad"] || ["Fatehabad"],
      },
      {
        name: "Gurugram",
        cities: cityOverrides["Haryana|Gurugram"] || ["Gurugram"],
      },
      {
        name: "Hisar",
        cities: cityOverrides["Haryana|Hisar"] || ["Hisar"],
      },
      {
        name: "Jhajjar",
        cities: cityOverrides["Haryana|Jhajjar"] || ["Jhajjar"],
      },
      {
        name: "Jind",
        cities: cityOverrides["Haryana|Jind"] || ["Jind"],
      },
      {
        name: "Kaithal",
        cities: cityOverrides["Haryana|Kaithal"] || ["Kaithal"],
      },
      {
        name: "Karnal",
        cities: cityOverrides["Haryana|Karnal"] || ["Karnal"],
      },
      {
        name: "Kurukshetra",
        cities: cityOverrides["Haryana|Kurukshetra"] || ["Kurukshetra"],
      },
      {
        name: "Mahendragarh",
        cities: cityOverrides["Haryana|Mahendragarh"] || ["Mahendragarh"],
      },
      {
        name: "Nuh",
        cities: cityOverrides["Haryana|Nuh"] || ["Nuh"],
      },
      {
        name: "Palwal",
        cities: cityOverrides["Haryana|Palwal"] || ["Palwal"],
      },
      {
        name: "Panchkula",
        cities: cityOverrides["Haryana|Panchkula"] || ["Panchkula"],
      },
      {
        name: "Panipat",
        cities: cityOverrides["Haryana|Panipat"] || ["Panipat"],
      },
      {
        name: "Rewari",
        cities: cityOverrides["Haryana|Rewari"] || ["Rewari"],
      },
      {
        name: "Rohtak",
        cities: cityOverrides["Haryana|Rohtak"] || ["Rohtak"],
      },
      {
        name: "Sirsa",
        cities: cityOverrides["Haryana|Sirsa"] || ["Sirsa"],
      },
      {
        name: "Sonipat",
        cities: cityOverrides["Haryana|Sonipat"] || ["Sonipat"],
      },
      {
        name: "Yamunanagar",
        cities: cityOverrides["Haryana|Yamunanagar"] || ["Yamunanagar"],
      },
    ],
  },
  {
    name: "Himachal Pradesh",
    districts: [
      {
        name: "Bilaspur",
        cities: cityOverrides["Himachal Pradesh|Bilaspur"] || ["Bilaspur"],
      },
      {
        name: "Chamba",
        cities: cityOverrides["Himachal Pradesh|Chamba"] || ["Chamba"],
      },
      {
        name: "Hamirpur",
        cities: cityOverrides["Himachal Pradesh|Hamirpur"] || ["Hamirpur"],
      },
      {
        name: "Kangra",
        cities: cityOverrides["Himachal Pradesh|Kangra"] || ["Kangra"],
      },
      {
        name: "Kinnaur",
        cities: cityOverrides["Himachal Pradesh|Kinnaur"] || ["Kinnaur"],
      },
      {
        name: "Kullu",
        cities: cityOverrides["Himachal Pradesh|Kullu"] || ["Kullu"],
      },
      {
        name: "Lahaul and Spiti",
        cities: cityOverrides["Himachal Pradesh|Lahaul and Spiti"] || ["Lahaul and Spiti"],
      },
      {
        name: "Mandi",
        cities: cityOverrides["Himachal Pradesh|Mandi"] || ["Mandi"],
      },
      {
        name: "Shimla",
        cities: cityOverrides["Himachal Pradesh|Shimla"] || ["Shimla"],
      },
      {
        name: "Sirmaur",
        cities: cityOverrides["Himachal Pradesh|Sirmaur"] || ["Sirmaur"],
      },
      {
        name: "Solan",
        cities: cityOverrides["Himachal Pradesh|Solan"] || ["Solan"],
      },
      {
        name: "Una",
        cities: cityOverrides["Himachal Pradesh|Una"] || ["Una"],
      },
    ],
  },
  {
    name: "Jharkhand",
    districts: [
      {
        name: "Bokaro",
        cities: cityOverrides["Jharkhand|Bokaro"] || ["Bokaro"],
      },
      {
        name: "Chatra",
        cities: cityOverrides["Jharkhand|Chatra"] || ["Chatra"],
      },
      {
        name: "Deoghar",
        cities: cityOverrides["Jharkhand|Deoghar"] || ["Deoghar"],
      },
      {
        name: "Dhanbad",
        cities: cityOverrides["Jharkhand|Dhanbad"] || ["Dhanbad"],
      },
      {
        name: "Dumka",
        cities: cityOverrides["Jharkhand|Dumka"] || ["Dumka"],
      },
      {
        name: "East Singhbhum",
        cities: cityOverrides["Jharkhand|East Singhbhum"] || ["East Singhbhum"],
      },
      {
        name: "Garhwa",
        cities: cityOverrides["Jharkhand|Garhwa"] || ["Garhwa"],
      },
      {
        name: "Giridih",
        cities: cityOverrides["Jharkhand|Giridih"] || ["Giridih"],
      },
      {
        name: "Godda",
        cities: cityOverrides["Jharkhand|Godda"] || ["Godda"],
      },
      {
        name: "Gumla",
        cities: cityOverrides["Jharkhand|Gumla"] || ["Gumla"],
      },
      {
        name: "Hazaribag",
        cities: cityOverrides["Jharkhand|Hazaribag"] || ["Hazaribag"],
      },
      {
        name: "Jamtara",
        cities: cityOverrides["Jharkhand|Jamtara"] || ["Jamtara"],
      },
      {
        name: "Khunti",
        cities: cityOverrides["Jharkhand|Khunti"] || ["Khunti"],
      },
      {
        name: "Koderma",
        cities: cityOverrides["Jharkhand|Koderma"] || ["Koderma"],
      },
      {
        name: "Latehar",
        cities: cityOverrides["Jharkhand|Latehar"] || ["Latehar"],
      },
      {
        name: "Lohardaga",
        cities: cityOverrides["Jharkhand|Lohardaga"] || ["Lohardaga"],
      },
      {
        name: "Pakur",
        cities: cityOverrides["Jharkhand|Pakur"] || ["Pakur"],
      },
      {
        name: "Palamu",
        cities: cityOverrides["Jharkhand|Palamu"] || ["Palamu"],
      },
      {
        name: "Ramgarh",
        cities: cityOverrides["Jharkhand|Ramgarh"] || ["Ramgarh"],
      },
      {
        name: "Ranchi",
        cities: cityOverrides["Jharkhand|Ranchi"] || ["Ranchi"],
      },
      {
        name: "Sahibganj",
        cities: cityOverrides["Jharkhand|Sahibganj"] || ["Sahibganj"],
      },
      {
        name: "Seraikela-Kharsawan",
        cities: cityOverrides["Jharkhand|Seraikela-Kharsawan"] || ["Seraikela-Kharsawan"],
      },
      {
        name: "Simdega",
        cities: cityOverrides["Jharkhand|Simdega"] || ["Simdega"],
      },
      {
        name: "West Singhbhum",
        cities: cityOverrides["Jharkhand|West Singhbhum"] || ["West Singhbhum"],
      },
    ],
  },
  {
    name: "Karnataka",
    districts: [
      {
        name: "Bagalkote",
        cities: cityOverrides["Karnataka|Bagalkote"] || ["Bagalkote"],
      },
      {
        name: "Ballari",
        cities: cityOverrides["Karnataka|Ballari"] || ["Ballari"],
      },
      {
        name: "Belagavi",
        cities: cityOverrides["Karnataka|Belagavi"] || ["Belagavi"],
      },
      {
        name: "Bengaluru Rural",
        cities: cityOverrides["Karnataka|Bengaluru Rural"] || ["Bengaluru Rural"],
      },
      {
        name: "Bengaluru Urban",
        cities: cityOverrides["Karnataka|Bengaluru Urban"] || ["Bengaluru Urban"],
      },
      {
        name: "Bidar",
        cities: cityOverrides["Karnataka|Bidar"] || ["Bidar"],
      },
      {
        name: "Chamarajanagar",
        cities: cityOverrides["Karnataka|Chamarajanagar"] || ["Chamarajanagar"],
      },
      {
        name: "Chikkaballapura",
        cities: cityOverrides["Karnataka|Chikkaballapura"] || ["Chikkaballapura"],
      },
      {
        name: "Chikkamagaluru",
        cities: cityOverrides["Karnataka|Chikkamagaluru"] || ["Chikkamagaluru"],
      },
      {
        name: "Chitradurga",
        cities: cityOverrides["Karnataka|Chitradurga"] || ["Chitradurga"],
      },
      {
        name: "Dakshina Kannada",
        cities: cityOverrides["Karnataka|Dakshina Kannada"] || ["Dakshina Kannada"],
      },
      {
        name: "Davanagere",
        cities: cityOverrides["Karnataka|Davanagere"] || ["Davanagere"],
      },
      {
        name: "Dharwad",
        cities: cityOverrides["Karnataka|Dharwad"] || ["Dharwad"],
      },
      {
        name: "Gadag",
        cities: cityOverrides["Karnataka|Gadag"] || ["Gadag"],
      },
      {
        name: "Hassan",
        cities: cityOverrides["Karnataka|Hassan"] || ["Hassan"],
      },
      {
        name: "Haveri",
        cities: cityOverrides["Karnataka|Haveri"] || ["Haveri"],
      },
      {
        name: "Kalaburagi",
        cities: cityOverrides["Karnataka|Kalaburagi"] || ["Kalaburagi"],
      },
      {
        name: "Kodagu",
        cities: cityOverrides["Karnataka|Kodagu"] || ["Kodagu"],
      },
      {
        name: "Kolar",
        cities: cityOverrides["Karnataka|Kolar"] || ["Kolar"],
      },
      {
        name: "Koppal",
        cities: cityOverrides["Karnataka|Koppal"] || ["Koppal"],
      },
      {
        name: "Mandya",
        cities: cityOverrides["Karnataka|Mandya"] || ["Mandya"],
      },
      {
        name: "Mysuru",
        cities: cityOverrides["Karnataka|Mysuru"] || ["Mysuru"],
      },
      {
        name: "Raichur",
        cities: cityOverrides["Karnataka|Raichur"] || ["Raichur"],
      },
      {
        name: "Ramanagara",
        cities: cityOverrides["Karnataka|Ramanagara"] || ["Ramanagara"],
      },
      {
        name: "Shivamogga",
        cities: cityOverrides["Karnataka|Shivamogga"] || ["Shivamogga"],
      },
      {
        name: "Tumakuru",
        cities: cityOverrides["Karnataka|Tumakuru"] || ["Tumakuru"],
      },
      {
        name: "Udupi",
        cities: cityOverrides["Karnataka|Udupi"] || ["Udupi"],
      },
      {
        name: "Uttara Kannada",
        cities: cityOverrides["Karnataka|Uttara Kannada"] || ["Uttara Kannada"],
      },
      {
        name: "Vijayapura",
        cities: cityOverrides["Karnataka|Vijayapura"] || ["Vijayapura"],
      },
      {
        name: "Vijayanagara",
        cities: cityOverrides["Karnataka|Vijayanagara"] || ["Vijayanagara"],
      },
      {
        name: "Yadgir",
        cities: cityOverrides["Karnataka|Yadgir"] || ["Yadgir"],
      },
    ],
  },
  {
    name: "Kerala",
    districts: [
      {
        name: "Alappuzha",
        cities: cityOverrides["Kerala|Alappuzha"] || ["Alappuzha"],
      },
      {
        name: "Ernakulam",
        cities: cityOverrides["Kerala|Ernakulam"] || ["Ernakulam"],
      },
      {
        name: "Idukki",
        cities: cityOverrides["Kerala|Idukki"] || ["Idukki"],
      },
      {
        name: "Kannur",
        cities: cityOverrides["Kerala|Kannur"] || ["Kannur"],
      },
      {
        name: "Kasaragod",
        cities: cityOverrides["Kerala|Kasaragod"] || ["Kasaragod"],
      },
      {
        name: "Kollam",
        cities: cityOverrides["Kerala|Kollam"] || ["Kollam"],
      },
      {
        name: "Kottayam",
        cities: cityOverrides["Kerala|Kottayam"] || ["Kottayam"],
      },
      {
        name: "Kozhikode",
        cities: cityOverrides["Kerala|Kozhikode"] || ["Kozhikode"],
      },
      {
        name: "Malappuram",
        cities: cityOverrides["Kerala|Malappuram"] || ["Malappuram"],
      },
      {
        name: "Palakkad",
        cities: cityOverrides["Kerala|Palakkad"] || ["Palakkad"],
      },
      {
        name: "Pathanamthitta",
        cities: cityOverrides["Kerala|Pathanamthitta"] || ["Pathanamthitta"],
      },
      {
        name: "Thiruvananthapuram",
        cities: cityOverrides["Kerala|Thiruvananthapuram"] || ["Thiruvananthapuram"],
      },
      {
        name: "Thrissur",
        cities: cityOverrides["Kerala|Thrissur"] || ["Thrissur"],
      },
      {
        name: "Wayanad",
        cities: cityOverrides["Kerala|Wayanad"] || ["Wayanad"],
      },
    ],
  },
  {
    name: "Madhya Pradesh",
    districts: [
      {
        name: "Agar Malwa",
        cities: cityOverrides["Madhya Pradesh|Agar Malwa"] || ["Agar Malwa"],
      },
      {
        name: "Alirajpur",
        cities: cityOverrides["Madhya Pradesh|Alirajpur"] || ["Alirajpur"],
      },
      {
        name: "Anuppur",
        cities: cityOverrides["Madhya Pradesh|Anuppur"] || ["Anuppur"],
      },
      {
        name: "Ashoknagar",
        cities: cityOverrides["Madhya Pradesh|Ashoknagar"] || ["Ashoknagar"],
      },
      {
        name: "Balaghat",
        cities: cityOverrides["Madhya Pradesh|Balaghat"] || ["Balaghat"],
      },
      {
        name: "Barwani",
        cities: cityOverrides["Madhya Pradesh|Barwani"] || ["Barwani"],
      },
      {
        name: "Betul",
        cities: cityOverrides["Madhya Pradesh|Betul"] || ["Betul"],
      },
      {
        name: "Bhind",
        cities: cityOverrides["Madhya Pradesh|Bhind"] || ["Bhind"],
      },
      {
        name: "Bhopal",
        cities: cityOverrides["Madhya Pradesh|Bhopal"] || ["Bhopal"],
      },
      {
        name: "Burhanpur",
        cities: cityOverrides["Madhya Pradesh|Burhanpur"] || ["Burhanpur"],
      },
      {
        name: "Chhatarpur",
        cities: cityOverrides["Madhya Pradesh|Chhatarpur"] || ["Chhatarpur"],
      },
      {
        name: "Chhindwara",
        cities: cityOverrides["Madhya Pradesh|Chhindwara"] || ["Chhindwara"],
      },
      {
        name: "Damoh",
        cities: cityOverrides["Madhya Pradesh|Damoh"] || ["Damoh"],
      },
      {
        name: "Datia",
        cities: cityOverrides["Madhya Pradesh|Datia"] || ["Datia"],
      },
      {
        name: "Dewas",
        cities: cityOverrides["Madhya Pradesh|Dewas"] || ["Dewas"],
      },
      {
        name: "Dhar",
        cities: cityOverrides["Madhya Pradesh|Dhar"] || ["Dhar"],
      },
      {
        name: "Dindori",
        cities: cityOverrides["Madhya Pradesh|Dindori"] || ["Dindori"],
      },
      {
        name: "Guna",
        cities: cityOverrides["Madhya Pradesh|Guna"] || ["Guna"],
      },
      {
        name: "Gwalior",
        cities: cityOverrides["Madhya Pradesh|Gwalior"] || ["Gwalior"],
      },
      {
        name: "Harda",
        cities: cityOverrides["Madhya Pradesh|Harda"] || ["Harda"],
      },
      {
        name: "Indore",
        cities: cityOverrides["Madhya Pradesh|Indore"] || ["Indore"],
      },
      {
        name: "Jabalpur",
        cities: cityOverrides["Madhya Pradesh|Jabalpur"] || ["Jabalpur"],
      },
      {
        name: "Jhabua",
        cities: cityOverrides["Madhya Pradesh|Jhabua"] || ["Jhabua"],
      },
      {
        name: "Katni",
        cities: cityOverrides["Madhya Pradesh|Katni"] || ["Katni"],
      },
      {
        name: "Khandwa",
        cities: cityOverrides["Madhya Pradesh|Khandwa"] || ["Khandwa"],
      },
      {
        name: "Khargone",
        cities: cityOverrides["Madhya Pradesh|Khargone"] || ["Khargone"],
      },
      {
        name: "Mandla",
        cities: cityOverrides["Madhya Pradesh|Mandla"] || ["Mandla"],
      },
      {
        name: "Mandsaur",
        cities: cityOverrides["Madhya Pradesh|Mandsaur"] || ["Mandsaur"],
      },
      {
        name: "Maihar",
        cities: cityOverrides["Madhya Pradesh|Maihar"] || ["Maihar"],
      },
      {
        name: "Mauganj",
        cities: cityOverrides["Madhya Pradesh|Mauganj"] || ["Mauganj"],
      },
      {
        name: "Morena",
        cities: cityOverrides["Madhya Pradesh|Morena"] || ["Morena"],
      },
      {
        name: "Narmadapuram",
        cities: cityOverrides["Madhya Pradesh|Narmadapuram"] || ["Narmadapuram"],
      },
      {
        name: "Narsinghpur",
        cities: cityOverrides["Madhya Pradesh|Narsinghpur"] || ["Narsinghpur"],
      },
      {
        name: "Neemuch",
        cities: cityOverrides["Madhya Pradesh|Neemuch"] || ["Neemuch"],
      },
      {
        name: "Niwari",
        cities: cityOverrides["Madhya Pradesh|Niwari"] || ["Niwari"],
      },
      {
        name: "Panna",
        cities: cityOverrides["Madhya Pradesh|Panna"] || ["Panna"],
      },
      {
        name: "Pandhurna",
        cities: cityOverrides["Madhya Pradesh|Pandhurna"] || ["Pandhurna"],
      },
      {
        name: "Raisen",
        cities: cityOverrides["Madhya Pradesh|Raisen"] || ["Raisen"],
      },
      {
        name: "Rajgarh",
        cities: cityOverrides["Madhya Pradesh|Rajgarh"] || ["Rajgarh"],
      },
      {
        name: "Ratlam",
        cities: cityOverrides["Madhya Pradesh|Ratlam"] || ["Ratlam"],
      },
      {
        name: "Rewa",
        cities: cityOverrides["Madhya Pradesh|Rewa"] || ["Rewa"],
      },
      {
        name: "Sagar",
        cities: cityOverrides["Madhya Pradesh|Sagar"] || ["Sagar"],
      },
      {
        name: "Satna",
        cities: cityOverrides["Madhya Pradesh|Satna"] || ["Satna"],
      },
      {
        name: "Sehore",
        cities: cityOverrides["Madhya Pradesh|Sehore"] || ["Sehore"],
      },
      {
        name: "Seoni",
        cities: cityOverrides["Madhya Pradesh|Seoni"] || ["Seoni"],
      },
      {
        name: "Shahdol",
        cities: cityOverrides["Madhya Pradesh|Shahdol"] || ["Shahdol"],
      },
      {
        name: "Shajapur",
        cities: cityOverrides["Madhya Pradesh|Shajapur"] || ["Shajapur"],
      },
      {
        name: "Sheopur",
        cities: cityOverrides["Madhya Pradesh|Sheopur"] || ["Sheopur"],
      },
      {
        name: "Shivpuri",
        cities: cityOverrides["Madhya Pradesh|Shivpuri"] || ["Shivpuri"],
      },
      {
        name: "Sidhi",
        cities: cityOverrides["Madhya Pradesh|Sidhi"] || ["Sidhi"],
      },
      {
        name: "Singrauli",
        cities: cityOverrides["Madhya Pradesh|Singrauli"] || ["Singrauli"],
      },
      {
        name: "Tikamgarh",
        cities: cityOverrides["Madhya Pradesh|Tikamgarh"] || ["Tikamgarh"],
      },
      {
        name: "Ujjain",
        cities: cityOverrides["Madhya Pradesh|Ujjain"] || ["Ujjain"],
      },
      {
        name: "Umaria",
        cities: cityOverrides["Madhya Pradesh|Umaria"] || ["Umaria"],
      },
      {
        name: "Vidisha",
        cities: cityOverrides["Madhya Pradesh|Vidisha"] || ["Vidisha"],
      },
    ],
  },
  {
    name: "Maharashtra",
    districts: [
      {
        name: "Ahilyanagar",
        cities: cityOverrides["Maharashtra|Ahilyanagar"] || ["Ahilyanagar"],
      },
      {
        name: "Akola",
        cities: cityOverrides["Maharashtra|Akola"] || ["Akola"],
      },
      {
        name: "Amravati",
        cities: cityOverrides["Maharashtra|Amravati"] || ["Amravati"],
      },
      {
        name: "Beed",
        cities: cityOverrides["Maharashtra|Beed"] || ["Beed"],
      },
      {
        name: "Bhandara",
        cities: cityOverrides["Maharashtra|Bhandara"] || ["Bhandara"],
      },
      {
        name: "Buldhana",
        cities: cityOverrides["Maharashtra|Buldhana"] || ["Buldhana"],
      },
      {
        name: "Chandrapur",
        cities: cityOverrides["Maharashtra|Chandrapur"] || ["Chandrapur"],
      },
      {
        name: "Chhatrapati Sambhajinagar",
        cities: cityOverrides["Maharashtra|Chhatrapati Sambhajinagar"] || ["Chhatrapati Sambhajinagar"],
      },
      {
        name: "Dharashiv",
        cities: cityOverrides["Maharashtra|Dharashiv"] || ["Dharashiv"],
      },
      {
        name: "Dhule",
        cities: cityOverrides["Maharashtra|Dhule"] || ["Dhule"],
      },
      {
        name: "Gadchiroli",
        cities: cityOverrides["Maharashtra|Gadchiroli"] || ["Gadchiroli"],
      },
      {
        name: "Gondia",
        cities: cityOverrides["Maharashtra|Gondia"] || ["Gondia"],
      },
      {
        name: "Hingoli",
        cities: cityOverrides["Maharashtra|Hingoli"] || ["Hingoli"],
      },
      {
        name: "Jalgaon",
        cities: cityOverrides["Maharashtra|Jalgaon"] || ["Jalgaon"],
      },
      {
        name: "Jalna",
        cities: cityOverrides["Maharashtra|Jalna"] || ["Jalna"],
      },
      {
        name: "Kolhapur",
        cities: cityOverrides["Maharashtra|Kolhapur"] || ["Kolhapur"],
      },
      {
        name: "Latur",
        cities: cityOverrides["Maharashtra|Latur"] || ["Latur"],
      },
      {
        name: "Mumbai City",
        cities: cityOverrides["Maharashtra|Mumbai City"] || ["Mumbai City"],
      },
      {
        name: "Mumbai Suburban",
        cities: cityOverrides["Maharashtra|Mumbai Suburban"] || ["Mumbai Suburban"],
      },
      {
        name: "Nagpur",
        cities: cityOverrides["Maharashtra|Nagpur"] || ["Nagpur"],
      },
      {
        name: "Nanded",
        cities: cityOverrides["Maharashtra|Nanded"] || ["Nanded"],
      },
      {
        name: "Nandurbar",
        cities: cityOverrides["Maharashtra|Nandurbar"] || ["Nandurbar"],
      },
      {
        name: "Nashik",
        cities: cityOverrides["Maharashtra|Nashik"] || ["Nashik"],
      },
      {
        name: "Palghar",
        cities: cityOverrides["Maharashtra|Palghar"] || ["Palghar"],
      },
      {
        name: "Parbhani",
        cities: cityOverrides["Maharashtra|Parbhani"] || ["Parbhani"],
      },
      {
        name: "Pune",
        cities: cityOverrides["Maharashtra|Pune"] || ["Pune"],
      },
      {
        name: "Raigad",
        cities: cityOverrides["Maharashtra|Raigad"] || ["Raigad"],
      },
      {
        name: "Ratnagiri",
        cities: cityOverrides["Maharashtra|Ratnagiri"] || ["Ratnagiri"],
      },
      {
        name: "Sangli",
        cities: cityOverrides["Maharashtra|Sangli"] || ["Sangli"],
      },
      {
        name: "Satara",
        cities: cityOverrides["Maharashtra|Satara"] || ["Satara"],
      },
      {
        name: "Sindhudurg",
        cities: cityOverrides["Maharashtra|Sindhudurg"] || ["Sindhudurg"],
      },
      {
        name: "Solapur",
        cities: cityOverrides["Maharashtra|Solapur"] || ["Solapur"],
      },
      {
        name: "Thane",
        cities: cityOverrides["Maharashtra|Thane"] || ["Thane"],
      },
      {
        name: "Wardha",
        cities: cityOverrides["Maharashtra|Wardha"] || ["Wardha"],
      },
      {
        name: "Washim",
        cities: cityOverrides["Maharashtra|Washim"] || ["Washim"],
      },
      {
        name: "Yavatmal",
        cities: cityOverrides["Maharashtra|Yavatmal"] || ["Yavatmal"],
      },
    ],
  },
  {
    name: "Manipur",
    districts: [
      {
        name: "Bishnupur",
        cities: cityOverrides["Manipur|Bishnupur"] || ["Bishnupur"],
      },
      {
        name: "Chandel",
        cities: cityOverrides["Manipur|Chandel"] || ["Chandel"],
      },
      {
        name: "Churachandpur",
        cities: cityOverrides["Manipur|Churachandpur"] || ["Churachandpur"],
      },
      {
        name: "Imphal East",
        cities: cityOverrides["Manipur|Imphal East"] || ["Imphal East"],
      },
      {
        name: "Imphal West",
        cities: cityOverrides["Manipur|Imphal West"] || ["Imphal West"],
      },
      {
        name: "Jiribam",
        cities: cityOverrides["Manipur|Jiribam"] || ["Jiribam"],
      },
      {
        name: "Kakching",
        cities: cityOverrides["Manipur|Kakching"] || ["Kakching"],
      },
      {
        name: "Kamjong",
        cities: cityOverrides["Manipur|Kamjong"] || ["Kamjong"],
      },
      {
        name: "Kangpokpi",
        cities: cityOverrides["Manipur|Kangpokpi"] || ["Kangpokpi"],
      },
      {
        name: "Noney",
        cities: cityOverrides["Manipur|Noney"] || ["Noney"],
      },
      {
        name: "Pherzawl",
        cities: cityOverrides["Manipur|Pherzawl"] || ["Pherzawl"],
      },
      {
        name: "Senapati",
        cities: cityOverrides["Manipur|Senapati"] || ["Senapati"],
      },
      {
        name: "Tamenglong",
        cities: cityOverrides["Manipur|Tamenglong"] || ["Tamenglong"],
      },
      {
        name: "Tengnoupal",
        cities: cityOverrides["Manipur|Tengnoupal"] || ["Tengnoupal"],
      },
      {
        name: "Thoubal",
        cities: cityOverrides["Manipur|Thoubal"] || ["Thoubal"],
      },
      {
        name: "Ukhrul",
        cities: cityOverrides["Manipur|Ukhrul"] || ["Ukhrul"],
      },
    ],
  },
  {
    name: "Meghalaya",
    districts: [
      {
        name: "East Garo Hills",
        cities: cityOverrides["Meghalaya|East Garo Hills"] || ["East Garo Hills"],
      },
      {
        name: "East Khasi Hills",
        cities: cityOverrides["Meghalaya|East Khasi Hills"] || ["East Khasi Hills"],
      },
      {
        name: "East Jaintia Hills",
        cities: cityOverrides["Meghalaya|East Jaintia Hills"] || ["East Jaintia Hills"],
      },
      {
        name: "Eastern West Khasi Hills",
        cities: cityOverrides["Meghalaya|Eastern West Khasi Hills"] || ["Eastern West Khasi Hills"],
      },
      {
        name: "North Garo Hills",
        cities: cityOverrides["Meghalaya|North Garo Hills"] || ["North Garo Hills"],
      },
      {
        name: "Ri Bhoi",
        cities: cityOverrides["Meghalaya|Ri Bhoi"] || ["Ri Bhoi"],
      },
      {
        name: "South Garo Hills",
        cities: cityOverrides["Meghalaya|South Garo Hills"] || ["South Garo Hills"],
      },
      {
        name: "South West Garo Hills",
        cities: cityOverrides["Meghalaya|South West Garo Hills"] || ["South West Garo Hills"],
      },
      {
        name: "South West Khasi Hills",
        cities: cityOverrides["Meghalaya|South West Khasi Hills"] || ["South West Khasi Hills"],
      },
      {
        name: "West Garo Hills",
        cities: cityOverrides["Meghalaya|West Garo Hills"] || ["West Garo Hills"],
      },
      {
        name: "West Jaintia Hills",
        cities: cityOverrides["Meghalaya|West Jaintia Hills"] || ["West Jaintia Hills"],
      },
      {
        name: "West Khasi Hills",
        cities: cityOverrides["Meghalaya|West Khasi Hills"] || ["West Khasi Hills"],
      },
    ],
  },
  {
    name: "Mizoram",
    districts: [
      {
        name: "Aizawl",
        cities: cityOverrides["Mizoram|Aizawl"] || ["Aizawl"],
      },
      {
        name: "Champhai",
        cities: cityOverrides["Mizoram|Champhai"] || ["Champhai"],
      },
      {
        name: "Hnahthial",
        cities: cityOverrides["Mizoram|Hnahthial"] || ["Hnahthial"],
      },
      {
        name: "Khawzawl",
        cities: cityOverrides["Mizoram|Khawzawl"] || ["Khawzawl"],
      },
      {
        name: "Kolasib",
        cities: cityOverrides["Mizoram|Kolasib"] || ["Kolasib"],
      },
      {
        name: "Lawngtlai",
        cities: cityOverrides["Mizoram|Lawngtlai"] || ["Lawngtlai"],
      },
      {
        name: "Lunglei",
        cities: cityOverrides["Mizoram|Lunglei"] || ["Lunglei"],
      },
      {
        name: "Mamit",
        cities: cityOverrides["Mizoram|Mamit"] || ["Mamit"],
      },
      {
        name: "Saitual",
        cities: cityOverrides["Mizoram|Saitual"] || ["Saitual"],
      },
      {
        name: "Saiha",
        cities: cityOverrides["Mizoram|Saiha"] || ["Saiha"],
      },
      {
        name: "Serchhip",
        cities: cityOverrides["Mizoram|Serchhip"] || ["Serchhip"],
      },
    ],
  },
  {
    name: "Nagaland",
    districts: [
      {
        name: "Chümoukedima",
        cities: cityOverrides["Nagaland|Chümoukedima"] || ["Chümoukedima"],
      },
      {
        name: "Dimapur",
        cities: cityOverrides["Nagaland|Dimapur"] || ["Dimapur"],
      },
      {
        name: "Kiphire",
        cities: cityOverrides["Nagaland|Kiphire"] || ["Kiphire"],
      },
      {
        name: "Kohima",
        cities: cityOverrides["Nagaland|Kohima"] || ["Kohima"],
      },
      {
        name: "Longleng",
        cities: cityOverrides["Nagaland|Longleng"] || ["Longleng"],
      },
      {
        name: "Mokokchung",
        cities: cityOverrides["Nagaland|Mokokchung"] || ["Mokokchung"],
      },
      {
        name: "Mon",
        cities: cityOverrides["Nagaland|Mon"] || ["Mon"],
      },
      {
        name: "Niuland",
        cities: cityOverrides["Nagaland|Niuland"] || ["Niuland"],
      },
      {
        name: "Noklak",
        cities: cityOverrides["Nagaland|Noklak"] || ["Noklak"],
      },
      {
        name: "Peren",
        cities: cityOverrides["Nagaland|Peren"] || ["Peren"],
      },
      {
        name: "Phek",
        cities: cityOverrides["Nagaland|Phek"] || ["Phek"],
      },
      {
        name: "Shamator",
        cities: cityOverrides["Nagaland|Shamator"] || ["Shamator"],
      },
      {
        name: "Tseminyü",
        cities: cityOverrides["Nagaland|Tseminyü"] || ["Tseminyü"],
      },
      {
        name: "Tuensang",
        cities: cityOverrides["Nagaland|Tuensang"] || ["Tuensang"],
      },
      {
        name: "Wokha",
        cities: cityOverrides["Nagaland|Wokha"] || ["Wokha"],
      },
      {
        name: "Zunheboto",
        cities: cityOverrides["Nagaland|Zunheboto"] || ["Zunheboto"],
      },
    ],
  },
  {
    name: "Odisha",
    districts: [
      {
        name: "Angul",
        cities: cityOverrides["Odisha|Angul"] || ["Angul"],
      },
      {
        name: "Balangir",
        cities: cityOverrides["Odisha|Balangir"] || ["Balangir"],
      },
      {
        name: "Balasore",
        cities: cityOverrides["Odisha|Balasore"] || ["Balasore"],
      },
      {
        name: "Bargarh",
        cities: cityOverrides["Odisha|Bargarh"] || ["Bargarh"],
      },
      {
        name: "Bhadrak",
        cities: cityOverrides["Odisha|Bhadrak"] || ["Bhadrak"],
      },
      {
        name: "Boudh",
        cities: cityOverrides["Odisha|Boudh"] || ["Boudh"],
      },
      {
        name: "Cuttack",
        cities: cityOverrides["Odisha|Cuttack"] || ["Cuttack"],
      },
      {
        name: "Debagarh",
        cities: cityOverrides["Odisha|Debagarh"] || ["Debagarh"],
      },
      {
        name: "Dhenkanal",
        cities: cityOverrides["Odisha|Dhenkanal"] || ["Dhenkanal"],
      },
      {
        name: "Gajapati",
        cities: cityOverrides["Odisha|Gajapati"] || ["Gajapati"],
      },
      {
        name: "Ganjam",
        cities: cityOverrides["Odisha|Ganjam"] || ["Ganjam"],
      },
      {
        name: "Jagatsinghpur",
        cities: cityOverrides["Odisha|Jagatsinghpur"] || ["Jagatsinghpur"],
      },
      {
        name: "Jajpur",
        cities: cityOverrides["Odisha|Jajpur"] || ["Jajpur"],
      },
      {
        name: "Jharsuguda",
        cities: cityOverrides["Odisha|Jharsuguda"] || ["Jharsuguda"],
      },
      {
        name: "Kalahandi",
        cities: cityOverrides["Odisha|Kalahandi"] || ["Kalahandi"],
      },
      {
        name: "Kandhamal",
        cities: cityOverrides["Odisha|Kandhamal"] || ["Kandhamal"],
      },
      {
        name: "Kendrapara",
        cities: cityOverrides["Odisha|Kendrapara"] || ["Kendrapara"],
      },
      {
        name: "Kendujhar",
        cities: cityOverrides["Odisha|Kendujhar"] || ["Kendujhar"],
      },
      {
        name: "Khordha",
        cities: cityOverrides["Odisha|Khordha"] || ["Khordha"],
      },
      {
        name: "Koraput",
        cities: cityOverrides["Odisha|Koraput"] || ["Koraput"],
      },
      {
        name: "Malkangiri",
        cities: cityOverrides["Odisha|Malkangiri"] || ["Malkangiri"],
      },
      {
        name: "Mayurbhanj",
        cities: cityOverrides["Odisha|Mayurbhanj"] || ["Mayurbhanj"],
      },
      {
        name: "Nabarangpur",
        cities: cityOverrides["Odisha|Nabarangpur"] || ["Nabarangpur"],
      },
      {
        name: "Nayagarh",
        cities: cityOverrides["Odisha|Nayagarh"] || ["Nayagarh"],
      },
      {
        name: "Nuapada",
        cities: cityOverrides["Odisha|Nuapada"] || ["Nuapada"],
      },
      {
        name: "Puri",
        cities: cityOverrides["Odisha|Puri"] || ["Puri"],
      },
      {
        name: "Rayagada",
        cities: cityOverrides["Odisha|Rayagada"] || ["Rayagada"],
      },
      {
        name: "Sambalpur",
        cities: cityOverrides["Odisha|Sambalpur"] || ["Sambalpur"],
      },
      {
        name: "Subarnapur",
        cities: cityOverrides["Odisha|Subarnapur"] || ["Subarnapur"],
      },
      {
        name: "Sundargarh",
        cities: cityOverrides["Odisha|Sundargarh"] || ["Sundargarh"],
      },
    ],
  },
  {
    name: "Punjab",
    districts: [
      {
        name: "Amritsar",
        cities: cityOverrides["Punjab|Amritsar"] || ["Amritsar"],
      },
      {
        name: "Barnala",
        cities: cityOverrides["Punjab|Barnala"] || ["Barnala"],
      },
      {
        name: "Bathinda",
        cities: cityOverrides["Punjab|Bathinda"] || ["Bathinda"],
      },
      {
        name: "Faridkot",
        cities: cityOverrides["Punjab|Faridkot"] || ["Faridkot"],
      },
      {
        name: "Fatehgarh Sahib",
        cities: cityOverrides["Punjab|Fatehgarh Sahib"] || ["Fatehgarh Sahib"],
      },
      {
        name: "Fazilka",
        cities: cityOverrides["Punjab|Fazilka"] || ["Fazilka"],
      },
      {
        name: "Ferozepur",
        cities: cityOverrides["Punjab|Ferozepur"] || ["Ferozepur"],
      },
      {
        name: "Gurdaspur",
        cities: cityOverrides["Punjab|Gurdaspur"] || ["Gurdaspur"],
      },
      {
        name: "Hoshiarpur",
        cities: cityOverrides["Punjab|Hoshiarpur"] || ["Hoshiarpur"],
      },
      {
        name: "Jalandhar",
        cities: cityOverrides["Punjab|Jalandhar"] || ["Jalandhar"],
      },
      {
        name: "Kapurthala",
        cities: cityOverrides["Punjab|Kapurthala"] || ["Kapurthala"],
      },
      {
        name: "Ludhiana",
        cities: cityOverrides["Punjab|Ludhiana"] || ["Ludhiana"],
      },
      {
        name: "Malerkotla",
        cities: cityOverrides["Punjab|Malerkotla"] || ["Malerkotla"],
      },
      {
        name: "Mansa",
        cities: cityOverrides["Punjab|Mansa"] || ["Mansa"],
      },
      {
        name: "Moga",
        cities: cityOverrides["Punjab|Moga"] || ["Moga"],
      },
      {
        name: "Pathankot",
        cities: cityOverrides["Punjab|Pathankot"] || ["Pathankot"],
      },
      {
        name: "Patiala",
        cities: cityOverrides["Punjab|Patiala"] || ["Patiala"],
      },
      {
        name: "Rupnagar",
        cities: cityOverrides["Punjab|Rupnagar"] || ["Rupnagar"],
      },
      {
        name: "Sahibzada Ajit Singh Nagar",
        cities: cityOverrides["Punjab|Sahibzada Ajit Singh Nagar"] || ["Sahibzada Ajit Singh Nagar"],
      },
      {
        name: "Sangrur",
        cities: cityOverrides["Punjab|Sangrur"] || ["Sangrur"],
      },
      {
        name: "Shahid Bhagat Singh Nagar",
        cities: cityOverrides["Punjab|Shahid Bhagat Singh Nagar"] || ["Shahid Bhagat Singh Nagar"],
      },
      {
        name: "Sri Muktsar Sahib",
        cities: cityOverrides["Punjab|Sri Muktsar Sahib"] || ["Sri Muktsar Sahib"],
      },
      {
        name: "Tarn Taran",
        cities: cityOverrides["Punjab|Tarn Taran"] || ["Tarn Taran"],
      },
    ],
  },
  {
    name: "Rajasthan",
    districts: [
      {
        name: "Ajmer",
        cities: cityOverrides["Rajasthan|Ajmer"] || ["Ajmer"],
      },
      {
        name: "Alwar",
        cities: cityOverrides["Rajasthan|Alwar"] || ["Alwar"],
      },
      {
        name: "Balotra",
        cities: cityOverrides["Rajasthan|Balotra"] || ["Balotra"],
      },
      {
        name: "Banswara",
        cities: cityOverrides["Rajasthan|Banswara"] || ["Banswara"],
      },
      {
        name: "Baran",
        cities: cityOverrides["Rajasthan|Baran"] || ["Baran"],
      },
      {
        name: "Barmer",
        cities: cityOverrides["Rajasthan|Barmer"] || ["Barmer"],
      },
      {
        name: "Beawar",
        cities: cityOverrides["Rajasthan|Beawar"] || ["Beawar"],
      },
      {
        name: "Bharatpur",
        cities: cityOverrides["Rajasthan|Bharatpur"] || ["Bharatpur"],
      },
      {
        name: "Bhilwara",
        cities: cityOverrides["Rajasthan|Bhilwara"] || ["Bhilwara"],
      },
      {
        name: "Bikaner",
        cities: cityOverrides["Rajasthan|Bikaner"] || ["Bikaner"],
      },
      {
        name: "Bundi",
        cities: cityOverrides["Rajasthan|Bundi"] || ["Bundi"],
      },
      {
        name: "Chittorgarh",
        cities: cityOverrides["Rajasthan|Chittorgarh"] || ["Chittorgarh"],
      },
      {
        name: "Churu",
        cities: cityOverrides["Rajasthan|Churu"] || ["Churu"],
      },
      {
        name: "Dausa",
        cities: cityOverrides["Rajasthan|Dausa"] || ["Dausa"],
      },
      {
        name: "Deeg",
        cities: cityOverrides["Rajasthan|Deeg"] || ["Deeg"],
      },
      {
        name: "Dholpur",
        cities: cityOverrides["Rajasthan|Dholpur"] || ["Dholpur"],
      },
      {
        name: "Didwana-Kuchamana",
        cities: cityOverrides["Rajasthan|Didwana-Kuchamana"] || ["Didwana-Kuchamana"],
      },
      {
        name: "Dungarpur",
        cities: cityOverrides["Rajasthan|Dungarpur"] || ["Dungarpur"],
      },
      {
        name: "Hanumangarh",
        cities: cityOverrides["Rajasthan|Hanumangarh"] || ["Hanumangarh"],
      },
      {
        name: "Jaipur",
        cities: cityOverrides["Rajasthan|Jaipur"] || ["Jaipur"],
      },
      {
        name: "Jaisalmer",
        cities: cityOverrides["Rajasthan|Jaisalmer"] || ["Jaisalmer"],
      },
      {
        name: "Jalore",
        cities: cityOverrides["Rajasthan|Jalore"] || ["Jalore"],
      },
      {
        name: "Jhalawar",
        cities: cityOverrides["Rajasthan|Jhalawar"] || ["Jhalawar"],
      },
      {
        name: "Jhunjhunu",
        cities: cityOverrides["Rajasthan|Jhunjhunu"] || ["Jhunjhunu"],
      },
      {
        name: "Jodhpur",
        cities: cityOverrides["Rajasthan|Jodhpur"] || ["Jodhpur"],
      },
      {
        name: "Karauli",
        cities: cityOverrides["Rajasthan|Karauli"] || ["Karauli"],
      },
      {
        name: "Kota",
        cities: cityOverrides["Rajasthan|Kota"] || ["Kota"],
      },
      {
        name: "Khairthal-Tijara",
        cities: cityOverrides["Rajasthan|Khairthal-Tijara"] || ["Khairthal-Tijara"],
      },
      {
        name: "Nagaur",
        cities: cityOverrides["Rajasthan|Nagaur"] || ["Nagaur"],
      },
      {
        name: "Pali",
        cities: cityOverrides["Rajasthan|Pali"] || ["Pali"],
      },
      {
        name: "Phalodi",
        cities: cityOverrides["Rajasthan|Phalodi"] || ["Phalodi"],
      },
      {
        name: "Pratapgarh",
        cities: cityOverrides["Rajasthan|Pratapgarh"] || ["Pratapgarh"],
      },
      {
        name: "Rajsamand",
        cities: cityOverrides["Rajasthan|Rajsamand"] || ["Rajsamand"],
      },
      {
        name: "Salumbar",
        cities: cityOverrides["Rajasthan|Salumbar"] || ["Salumbar"],
      },
      {
        name: "Sawai Madhopur",
        cities: cityOverrides["Rajasthan|Sawai Madhopur"] || ["Sawai Madhopur"],
      },
      {
        name: "Sikar",
        cities: cityOverrides["Rajasthan|Sikar"] || ["Sikar"],
      },
      {
        name: "Sirohi",
        cities: cityOverrides["Rajasthan|Sirohi"] || ["Sirohi"],
      },
      {
        name: "Sri Ganganagar",
        cities: cityOverrides["Rajasthan|Sri Ganganagar"] || ["Sri Ganganagar"],
      },
      {
        name: "Tonk",
        cities: cityOverrides["Rajasthan|Tonk"] || ["Tonk"],
      },
      {
        name: "Udaipur",
        cities: cityOverrides["Rajasthan|Udaipur"] || ["Udaipur"],
      },
    ],
  },
  {
    name: "Sikkim",
    districts: [
      {
        name: "Gangtok",
        cities: cityOverrides["Sikkim|Gangtok"] || ["Gangtok"],
      },
      {
        name: "Mangan",
        cities: cityOverrides["Sikkim|Mangan"] || ["Mangan"],
      },
      {
        name: "Namchi",
        cities: cityOverrides["Sikkim|Namchi"] || ["Namchi"],
      },
      {
        name: "Pakyong",
        cities: cityOverrides["Sikkim|Pakyong"] || ["Pakyong"],
      },
      {
        name: "Soreng",
        cities: cityOverrides["Sikkim|Soreng"] || ["Soreng"],
      },
      {
        name: "Gyalshing",
        cities: cityOverrides["Sikkim|Gyalshing"] || ["Gyalshing"],
      },
    ],
  },
  {
    name: "Tamil Nadu",
    districts: [
      {
        name: "Ariyalur",
        cities: cityOverrides["Tamil Nadu|Ariyalur"] || ["Ariyalur"],
      },
      {
        name: "Chengalpattu",
        cities: cityOverrides["Tamil Nadu|Chengalpattu"] || ["Chengalpattu"],
      },
      {
        name: "Chennai",
        cities: cityOverrides["Tamil Nadu|Chennai"] || ["Chennai"],
      },
      {
        name: "Coimbatore",
        cities: cityOverrides["Tamil Nadu|Coimbatore"] || ["Coimbatore"],
      },
      {
        name: "Cuddalore",
        cities: cityOverrides["Tamil Nadu|Cuddalore"] || ["Cuddalore"],
      },
      {
        name: "Dharmapuri",
        cities: cityOverrides["Tamil Nadu|Dharmapuri"] || ["Dharmapuri"],
      },
      {
        name: "Dindigul",
        cities: cityOverrides["Tamil Nadu|Dindigul"] || ["Dindigul"],
      },
      {
        name: "Erode",
        cities: cityOverrides["Tamil Nadu|Erode"] || ["Erode"],
      },
      {
        name: "Kallakurichi",
        cities: cityOverrides["Tamil Nadu|Kallakurichi"] || ["Kallakurichi"],
      },
      {
        name: "Kancheepuram",
        cities: cityOverrides["Tamil Nadu|Kancheepuram"] || ["Kancheepuram"],
      },
      {
        name: "Kanniyakumari",
        cities: cityOverrides["Tamil Nadu|Kanniyakumari"] || ["Kanniyakumari"],
      },
      {
        name: "Karur",
        cities: cityOverrides["Tamil Nadu|Karur"] || ["Karur"],
      },
      {
        name: "Krishnagiri",
        cities: cityOverrides["Tamil Nadu|Krishnagiri"] || ["Krishnagiri"],
      },
      {
        name: "Madurai",
        cities: cityOverrides["Tamil Nadu|Madurai"] || ["Madurai"],
      },
      {
        name: "Mayiladuthurai",
        cities: cityOverrides["Tamil Nadu|Mayiladuthurai"] || ["Mayiladuthurai"],
      },
      {
        name: "Nagapattinam",
        cities: cityOverrides["Tamil Nadu|Nagapattinam"] || ["Nagapattinam"],
      },
      {
        name: "Namakkal",
        cities: cityOverrides["Tamil Nadu|Namakkal"] || ["Namakkal"],
      },
      {
        name: "Nilgiris",
        cities: cityOverrides["Tamil Nadu|Nilgiris"] || ["Nilgiris"],
      },
      {
        name: "Perambalur",
        cities: cityOverrides["Tamil Nadu|Perambalur"] || ["Perambalur"],
      },
      {
        name: "Pudukkottai",
        cities: cityOverrides["Tamil Nadu|Pudukkottai"] || ["Pudukkottai"],
      },
      {
        name: "Ramanathapuram",
        cities: cityOverrides["Tamil Nadu|Ramanathapuram"] || ["Ramanathapuram"],
      },
      {
        name: "Ranipet",
        cities: cityOverrides["Tamil Nadu|Ranipet"] || ["Ranipet"],
      },
      {
        name: "Salem",
        cities: cityOverrides["Tamil Nadu|Salem"] || ["Salem"],
      },
      {
        name: "Sivaganga",
        cities: cityOverrides["Tamil Nadu|Sivaganga"] || ["Sivaganga"],
      },
      {
        name: "Tenkasi",
        cities: cityOverrides["Tamil Nadu|Tenkasi"] || ["Tenkasi"],
      },
      {
        name: "Thanjavur",
        cities: cityOverrides["Tamil Nadu|Thanjavur"] || ["Thanjavur"],
      },
      {
        name: "Theni",
        cities: cityOverrides["Tamil Nadu|Theni"] || ["Theni"],
      },
      {
        name: "Thoothukudi",
        cities: cityOverrides["Tamil Nadu|Thoothukudi"] || ["Thoothukudi"],
      },
      {
        name: "Tiruchirappalli",
        cities: cityOverrides["Tamil Nadu|Tiruchirappalli"] || ["Tiruchirappalli"],
      },
      {
        name: "Tirunelveli",
        cities: cityOverrides["Tamil Nadu|Tirunelveli"] || ["Tirunelveli"],
      },
      {
        name: "Tirupathur",
        cities: cityOverrides["Tamil Nadu|Tirupathur"] || ["Tirupathur"],
      },
      {
        name: "Tiruppur",
        cities: cityOverrides["Tamil Nadu|Tiruppur"] || ["Tiruppur"],
      },
      {
        name: "Tiruvallur",
        cities: cityOverrides["Tamil Nadu|Tiruvallur"] || ["Tiruvallur"],
      },
      {
        name: "Tiruvannamalai",
        cities: cityOverrides["Tamil Nadu|Tiruvannamalai"] || ["Tiruvannamalai"],
      },
      {
        name: "Tiruvarur",
        cities: cityOverrides["Tamil Nadu|Tiruvarur"] || ["Tiruvarur"],
      },
      {
        name: "Vellore",
        cities: cityOverrides["Tamil Nadu|Vellore"] || ["Vellore"],
      },
      {
        name: "Viluppuram",
        cities: cityOverrides["Tamil Nadu|Viluppuram"] || ["Viluppuram"],
      },
      {
        name: "Virudhunagar",
        cities: cityOverrides["Tamil Nadu|Virudhunagar"] || ["Virudhunagar"],
      },
    ],
  },
  {
    name: "Telangana",
    districts: [
      {
        name: "Adilabad",
        cities: cityOverrides["Telangana|Adilabad"] || ["Adilabad"],
      },
      {
        name: "Bhadradri Kothagudem",
        cities: cityOverrides["Telangana|Bhadradri Kothagudem"] || ["Bhadradri Kothagudem"],
      },
      {
        name: "Hanamkonda",
        cities: cityOverrides["Telangana|Hanamkonda"] || ["Hanamkonda"],
      },
      {
        name: "Hyderabad",
        cities: cityOverrides["Telangana|Hyderabad"] || ["Hyderabad"],
      },
      {
        name: "Jagtial",
        cities: cityOverrides["Telangana|Jagtial"] || ["Jagtial"],
      },
      {
        name: "Jangaon",
        cities: cityOverrides["Telangana|Jangaon"] || ["Jangaon"],
      },
      {
        name: "Jayashankar Bhupalpally",
        cities: cityOverrides["Telangana|Jayashankar Bhupalpally"] || ["Jayashankar Bhupalpally"],
      },
      {
        name: "Jogulamba Gadwal",
        cities: cityOverrides["Telangana|Jogulamba Gadwal"] || ["Jogulamba Gadwal"],
      },
      {
        name: "Kamareddy",
        cities: cityOverrides["Telangana|Kamareddy"] || ["Kamareddy"],
      },
      {
        name: "Karimnagar",
        cities: cityOverrides["Telangana|Karimnagar"] || ["Karimnagar"],
      },
      {
        name: "Khammam",
        cities: cityOverrides["Telangana|Khammam"] || ["Khammam"],
      },
      {
        name: "Kumuram Bheem Asifabad",
        cities: cityOverrides["Telangana|Kumuram Bheem Asifabad"] || ["Kumuram Bheem Asifabad"],
      },
      {
        name: "Mahabubabad",
        cities: cityOverrides["Telangana|Mahabubabad"] || ["Mahabubabad"],
      },
      {
        name: "Mahbubnagar",
        cities: cityOverrides["Telangana|Mahbubnagar"] || ["Mahbubnagar"],
      },
      {
        name: "Mancherial",
        cities: cityOverrides["Telangana|Mancherial"] || ["Mancherial"],
      },
      {
        name: "Medak",
        cities: cityOverrides["Telangana|Medak"] || ["Medak"],
      },
      {
        name: "Medchal-Malkajgiri",
        cities: cityOverrides["Telangana|Medchal-Malkajgiri"] || ["Medchal-Malkajgiri"],
      },
      {
        name: "Mulugu",
        cities: cityOverrides["Telangana|Mulugu"] || ["Mulugu"],
      },
      {
        name: "Nagarkurnool",
        cities: cityOverrides["Telangana|Nagarkurnool"] || ["Nagarkurnool"],
      },
      {
        name: "Nalgonda",
        cities: cityOverrides["Telangana|Nalgonda"] || ["Nalgonda"],
      },
      {
        name: "Narayanpet",
        cities: cityOverrides["Telangana|Narayanpet"] || ["Narayanpet"],
      },
      {
        name: "Nirmal",
        cities: cityOverrides["Telangana|Nirmal"] || ["Nirmal"],
      },
      {
        name: "Nizamabad",
        cities: cityOverrides["Telangana|Nizamabad"] || ["Nizamabad"],
      },
      {
        name: "Peddapalli",
        cities: cityOverrides["Telangana|Peddapalli"] || ["Peddapalli"],
      },
      {
        name: "Rajanna Sircilla",
        cities: cityOverrides["Telangana|Rajanna Sircilla"] || ["Rajanna Sircilla"],
      },
      {
        name: "Ranga Reddy",
        cities: cityOverrides["Telangana|Ranga Reddy"] || ["Ranga Reddy"],
      },
      {
        name: "Sangareddy",
        cities: cityOverrides["Telangana|Sangareddy"] || ["Sangareddy"],
      },
      {
        name: "Siddipet",
        cities: cityOverrides["Telangana|Siddipet"] || ["Siddipet"],
      },
      {
        name: "Suryapet",
        cities: cityOverrides["Telangana|Suryapet"] || ["Suryapet"],
      },
      {
        name: "Vikarabad",
        cities: cityOverrides["Telangana|Vikarabad"] || ["Vikarabad"],
      },
      {
        name: "Wanaparthy",
        cities: cityOverrides["Telangana|Wanaparthy"] || ["Wanaparthy"],
      },
      {
        name: "Warangal",
        cities: cityOverrides["Telangana|Warangal"] || ["Warangal"],
      },
      {
        name: "Yadadri Bhuvanagiri",
        cities: cityOverrides["Telangana|Yadadri Bhuvanagiri"] || ["Yadadri Bhuvanagiri"],
      },
    ],
  },
  {
    name: "Tripura",
    districts: [
      {
        name: "Dhalai",
        cities: cityOverrides["Tripura|Dhalai"] || ["Dhalai"],
      },
      {
        name: "Gomati",
        cities: cityOverrides["Tripura|Gomati"] || ["Gomati"],
      },
      {
        name: "Khowai",
        cities: cityOverrides["Tripura|Khowai"] || ["Khowai"],
      },
      {
        name: "North Tripura",
        cities: cityOverrides["Tripura|North Tripura"] || ["North Tripura"],
      },
      {
        name: "Sepahijala",
        cities: cityOverrides["Tripura|Sepahijala"] || ["Sepahijala"],
      },
      {
        name: "South Tripura",
        cities: cityOverrides["Tripura|South Tripura"] || ["South Tripura"],
      },
      {
        name: "Unakoti",
        cities: cityOverrides["Tripura|Unakoti"] || ["Unakoti"],
      },
      {
        name: "West Tripura",
        cities: cityOverrides["Tripura|West Tripura"] || ["West Tripura"],
      },
    ],
  },
  {
    name: "Uttar Pradesh",
    districts: [
      {
        name: "Agra",
        cities: cityOverrides["Uttar Pradesh|Agra"] || ["Agra"],
      },
      {
        name: "Aligarh",
        cities: cityOverrides["Uttar Pradesh|Aligarh"] || ["Aligarh"],
      },
      {
        name: "Ambedkar Nagar",
        cities: cityOverrides["Uttar Pradesh|Ambedkar Nagar"] || ["Ambedkar Nagar"],
      },
      {
        name: "Amethi",
        cities: cityOverrides["Uttar Pradesh|Amethi"] || ["Amethi"],
      },
      {
        name: "Amroha",
        cities: cityOverrides["Uttar Pradesh|Amroha"] || ["Amroha"],
      },
      {
        name: "Auraiya",
        cities: cityOverrides["Uttar Pradesh|Auraiya"] || ["Auraiya"],
      },
      {
        name: "Ayodhya",
        cities: cityOverrides["Uttar Pradesh|Ayodhya"] || ["Ayodhya"],
      },
      {
        name: "Azamgarh",
        cities: cityOverrides["Uttar Pradesh|Azamgarh"] || ["Azamgarh"],
      },
      {
        name: "Baghpat",
        cities: cityOverrides["Uttar Pradesh|Baghpat"] || ["Baghpat"],
      },
      {
        name: "Bahraich",
        cities: cityOverrides["Uttar Pradesh|Bahraich"] || ["Bahraich"],
      },
      {
        name: "Ballia",
        cities: cityOverrides["Uttar Pradesh|Ballia"] || ["Ballia"],
      },
      {
        name: "Balrampur",
        cities: cityOverrides["Uttar Pradesh|Balrampur"] || ["Balrampur"],
      },
      {
        name: "Banda",
        cities: cityOverrides["Uttar Pradesh|Banda"] || ["Banda"],
      },
      {
        name: "Barabanki",
        cities: cityOverrides["Uttar Pradesh|Barabanki"] || ["Barabanki"],
      },
      {
        name: "Bareilly",
        cities: cityOverrides["Uttar Pradesh|Bareilly"] || ["Bareilly"],
      },
      {
        name: "Basti",
        cities: cityOverrides["Uttar Pradesh|Basti"] || ["Basti"],
      },
      {
        name: "Bhadohi",
        cities: cityOverrides["Uttar Pradesh|Bhadohi"] || ["Bhadohi"],
      },
      {
        name: "Bijnor",
        cities: cityOverrides["Uttar Pradesh|Bijnor"] || ["Bijnor"],
      },
      {
        name: "Budaun",
        cities: cityOverrides["Uttar Pradesh|Budaun"] || ["Budaun"],
      },
      {
        name: "Bulandshahr",
        cities: cityOverrides["Uttar Pradesh|Bulandshahr"] || ["Bulandshahr"],
      },
      {
        name: "Chandauli",
        cities: cityOverrides["Uttar Pradesh|Chandauli"] || ["Chandauli"],
      },
      {
        name: "Chitrakoot",
        cities: cityOverrides["Uttar Pradesh|Chitrakoot"] || ["Chitrakoot"],
      },
      {
        name: "Deoria",
        cities: cityOverrides["Uttar Pradesh|Deoria"] || ["Deoria"],
      },
      {
        name: "Etah",
        cities: cityOverrides["Uttar Pradesh|Etah"] || ["Etah"],
      },
      {
        name: "Etawah",
        cities: cityOverrides["Uttar Pradesh|Etawah"] || ["Etawah"],
      },
      {
        name: "Farrukhabad",
        cities: cityOverrides["Uttar Pradesh|Farrukhabad"] || ["Farrukhabad"],
      },
      {
        name: "Fatehpur",
        cities: cityOverrides["Uttar Pradesh|Fatehpur"] || ["Fatehpur"],
      },
      {
        name: "Firozabad",
        cities: cityOverrides["Uttar Pradesh|Firozabad"] || ["Firozabad"],
      },
      {
        name: "Gautam Buddha Nagar",
        cities: cityOverrides["Uttar Pradesh|Gautam Buddha Nagar"] || ["Gautam Buddha Nagar"],
      },
      {
        name: "Ghaziabad",
        cities: cityOverrides["Uttar Pradesh|Ghaziabad"] || ["Ghaziabad"],
      },
      {
        name: "Ghazipur",
        cities: cityOverrides["Uttar Pradesh|Ghazipur"] || ["Ghazipur"],
      },
      {
        name: "Gonda",
        cities: cityOverrides["Uttar Pradesh|Gonda"] || ["Gonda"],
      },
      {
        name: "Gorakhpur",
        cities: cityOverrides["Uttar Pradesh|Gorakhpur"] || ["Gorakhpur"],
      },
      {
        name: "Hamirpur",
        cities: cityOverrides["Uttar Pradesh|Hamirpur"] || ["Hamirpur"],
      },
      {
        name: "Hapur",
        cities: cityOverrides["Uttar Pradesh|Hapur"] || ["Hapur"],
      },
      {
        name: "Hardoi",
        cities: cityOverrides["Uttar Pradesh|Hardoi"] || ["Hardoi"],
      },
      {
        name: "Hathras",
        cities: cityOverrides["Uttar Pradesh|Hathras"] || ["Hathras"],
      },
      {
        name: "Jalaun",
        cities: cityOverrides["Uttar Pradesh|Jalaun"] || ["Jalaun"],
      },
      {
        name: "Jaunpur",
        cities: cityOverrides["Uttar Pradesh|Jaunpur"] || ["Jaunpur"],
      },
      {
        name: "Jhansi",
        cities: cityOverrides["Uttar Pradesh|Jhansi"] || ["Jhansi"],
      },
      {
        name: "Kannauj",
        cities: cityOverrides["Uttar Pradesh|Kannauj"] || ["Kannauj"],
      },
      {
        name: "Kanpur Dehat",
        cities: cityOverrides["Uttar Pradesh|Kanpur Dehat"] || ["Kanpur Dehat"],
      },
      {
        name: "Kanpur Nagar",
        cities: cityOverrides["Uttar Pradesh|Kanpur Nagar"] || ["Kanpur Nagar"],
      },
      {
        name: "Kasganj",
        cities: cityOverrides["Uttar Pradesh|Kasganj"] || ["Kasganj"],
      },
      {
        name: "Kaushambi",
        cities: cityOverrides["Uttar Pradesh|Kaushambi"] || ["Kaushambi"],
      },
      {
        name: "Kushinagar",
        cities: cityOverrides["Uttar Pradesh|Kushinagar"] || ["Kushinagar"],
      },
      {
        name: "Lakhimpur Kheri",
        cities: cityOverrides["Uttar Pradesh|Lakhimpur Kheri"] || ["Lakhimpur Kheri"],
      },
      {
        name: "Lalitpur",
        cities: cityOverrides["Uttar Pradesh|Lalitpur"] || ["Lalitpur"],
      },
      {
        name: "Lucknow",
        cities: cityOverrides["Uttar Pradesh|Lucknow"] || ["Lucknow"],
      },
      {
        name: "Maharajganj",
        cities: cityOverrides["Uttar Pradesh|Maharajganj"] || ["Maharajganj"],
      },
      {
        name: "Mahoba",
        cities: cityOverrides["Uttar Pradesh|Mahoba"] || ["Mahoba"],
      },
      {
        name: "Mainpuri",
        cities: cityOverrides["Uttar Pradesh|Mainpuri"] || ["Mainpuri"],
      },
      {
        name: "Mathura",
        cities: cityOverrides["Uttar Pradesh|Mathura"] || ["Mathura"],
      },
      {
        name: "Mau",
        cities: cityOverrides["Uttar Pradesh|Mau"] || ["Mau"],
      },
      {
        name: "Meerut",
        cities: cityOverrides["Uttar Pradesh|Meerut"] || ["Meerut"],
      },
      {
        name: "Mirzapur",
        cities: cityOverrides["Uttar Pradesh|Mirzapur"] || ["Mirzapur"],
      },
      {
        name: "Moradabad",
        cities: cityOverrides["Uttar Pradesh|Moradabad"] || ["Moradabad"],
      },
      {
        name: "Muzaffarnagar",
        cities: cityOverrides["Uttar Pradesh|Muzaffarnagar"] || ["Muzaffarnagar"],
      },
      {
        name: "Pilibhit",
        cities: cityOverrides["Uttar Pradesh|Pilibhit"] || ["Pilibhit"],
      },
      {
        name: "Pratapgarh",
        cities: cityOverrides["Uttar Pradesh|Pratapgarh"] || ["Pratapgarh"],
      },
      {
        name: "Prayagraj",
        cities: cityOverrides["Uttar Pradesh|Prayagraj"] || ["Prayagraj"],
      },
      {
        name: "Raebareli",
        cities: cityOverrides["Uttar Pradesh|Raebareli"] || ["Raebareli"],
      },
      {
        name: "Rampur",
        cities: cityOverrides["Uttar Pradesh|Rampur"] || ["Rampur"],
      },
      {
        name: "Saharanpur",
        cities: cityOverrides["Uttar Pradesh|Saharanpur"] || ["Saharanpur"],
      },
      {
        name: "Sambhal",
        cities: cityOverrides["Uttar Pradesh|Sambhal"] || ["Sambhal"],
      },
      {
        name: "Sant Kabir Nagar",
        cities: cityOverrides["Uttar Pradesh|Sant Kabir Nagar"] || ["Sant Kabir Nagar"],
      },
      {
        name: "Shahjahanpur",
        cities: cityOverrides["Uttar Pradesh|Shahjahanpur"] || ["Shahjahanpur"],
      },
      {
        name: "Shamli",
        cities: cityOverrides["Uttar Pradesh|Shamli"] || ["Shamli"],
      },
      {
        name: "Shravasti",
        cities: cityOverrides["Uttar Pradesh|Shravasti"] || ["Shravasti"],
      },
      {
        name: "Siddharthnagar",
        cities: cityOverrides["Uttar Pradesh|Siddharthnagar"] || ["Siddharthnagar"],
      },
      {
        name: "Sitapur",
        cities: cityOverrides["Uttar Pradesh|Sitapur"] || ["Sitapur"],
      },
      {
        name: "Sonbhadra",
        cities: cityOverrides["Uttar Pradesh|Sonbhadra"] || ["Sonbhadra"],
      },
      {
        name: "Sultanpur",
        cities: cityOverrides["Uttar Pradesh|Sultanpur"] || ["Sultanpur"],
      },
      {
        name: "Unnao",
        cities: cityOverrides["Uttar Pradesh|Unnao"] || ["Unnao"],
      },
      {
        name: "Varanasi",
        cities: cityOverrides["Uttar Pradesh|Varanasi"] || ["Varanasi"],
      },
    ],
  },
  {
    name: "Uttarakhand",
    districts: [
      {
        name: "Almora",
        cities: cityOverrides["Uttarakhand|Almora"] || ["Almora"],
      },
      {
        name: "Bageshwar",
        cities: cityOverrides["Uttarakhand|Bageshwar"] || ["Bageshwar"],
      },
      {
        name: "Chamoli",
        cities: cityOverrides["Uttarakhand|Chamoli"] || ["Chamoli"],
      },
      {
        name: "Champawat",
        cities: cityOverrides["Uttarakhand|Champawat"] || ["Champawat"],
      },
      {
        name: "Dehradun",
        cities: cityOverrides["Uttarakhand|Dehradun"] || ["Dehradun"],
      },
      {
        name: "Haridwar",
        cities: cityOverrides["Uttarakhand|Haridwar"] || ["Haridwar"],
      },
      {
        name: "Nainital",
        cities: cityOverrides["Uttarakhand|Nainital"] || ["Nainital"],
      },
      {
        name: "Pauri Garhwal",
        cities: cityOverrides["Uttarakhand|Pauri Garhwal"] || ["Pauri Garhwal"],
      },
      {
        name: "Pithoragarh",
        cities: cityOverrides["Uttarakhand|Pithoragarh"] || ["Pithoragarh"],
      },
      {
        name: "Rudraprayag",
        cities: cityOverrides["Uttarakhand|Rudraprayag"] || ["Rudraprayag"],
      },
      {
        name: "Tehri Garhwal",
        cities: cityOverrides["Uttarakhand|Tehri Garhwal"] || ["Tehri Garhwal"],
      },
      {
        name: "Udham Singh Nagar",
        cities: cityOverrides["Uttarakhand|Udham Singh Nagar"] || ["Udham Singh Nagar"],
      },
      {
        name: "Uttarkashi",
        cities: cityOverrides["Uttarakhand|Uttarkashi"] || ["Uttarkashi"],
      },
    ],
  },
  {
    name: "West Bengal",
    districts: [
      {
        name: "Alipurduar",
        cities: cityOverrides["West Bengal|Alipurduar"] || ["Alipurduar"],
      },
      {
        name: "Bankura",
        cities: cityOverrides["West Bengal|Bankura"] || ["Bankura"],
      },
      {
        name: "Birbhum",
        cities: cityOverrides["West Bengal|Birbhum"] || ["Birbhum"],
      },
      {
        name: "Cooch Behar",
        cities: cityOverrides["West Bengal|Cooch Behar"] || ["Cooch Behar"],
      },
      {
        name: "Dakshin Dinajpur",
        cities: cityOverrides["West Bengal|Dakshin Dinajpur"] || ["Dakshin Dinajpur"],
      },
      {
        name: "Darjeeling",
        cities: cityOverrides["West Bengal|Darjeeling"] || ["Darjeeling"],
      },
      {
        name: "Hooghly",
        cities: cityOverrides["West Bengal|Hooghly"] || ["Hooghly"],
      },
      {
        name: "Howrah",
        cities: cityOverrides["West Bengal|Howrah"] || ["Howrah"],
      },
      {
        name: "Jalpaiguri",
        cities: cityOverrides["West Bengal|Jalpaiguri"] || ["Jalpaiguri"],
      },
      {
        name: "Jhargram",
        cities: cityOverrides["West Bengal|Jhargram"] || ["Jhargram"],
      },
      {
        name: "Kalimpong",
        cities: cityOverrides["West Bengal|Kalimpong"] || ["Kalimpong"],
      },
      {
        name: "Kolkata",
        cities: cityOverrides["West Bengal|Kolkata"] || ["Kolkata"],
      },
      {
        name: "Malda",
        cities: cityOverrides["West Bengal|Malda"] || ["Malda"],
      },
      {
        name: "Murshidabad",
        cities: cityOverrides["West Bengal|Murshidabad"] || ["Murshidabad"],
      },
      {
        name: "Nadia",
        cities: cityOverrides["West Bengal|Nadia"] || ["Nadia"],
      },
      {
        name: "North 24 Parganas",
        cities: cityOverrides["West Bengal|North 24 Parganas"] || ["North 24 Parganas"],
      },
      {
        name: "Paschim Bardhaman",
        cities: cityOverrides["West Bengal|Paschim Bardhaman"] || ["Paschim Bardhaman"],
      },
      {
        name: "Paschim Medinipur",
        cities: cityOverrides["West Bengal|Paschim Medinipur"] || ["Paschim Medinipur"],
      },
      {
        name: "Purba Bardhaman",
        cities: cityOverrides["West Bengal|Purba Bardhaman"] || ["Purba Bardhaman"],
      },
      {
        name: "Purba Medinipur",
        cities: cityOverrides["West Bengal|Purba Medinipur"] || ["Purba Medinipur"],
      },
      {
        name: "Purulia",
        cities: cityOverrides["West Bengal|Purulia"] || ["Purulia"],
      },
      {
        name: "South 24 Parganas",
        cities: cityOverrides["West Bengal|South 24 Parganas"] || ["South 24 Parganas"],
      },
      {
        name: "Uttar Dinajpur",
        cities: cityOverrides["West Bengal|Uttar Dinajpur"] || ["Uttar Dinajpur"],
      },
    ],
  },
  {
    name: "Andaman and Nicobar Islands",
    districts: [
      {
        name: "Nicobar",
        cities: cityOverrides["Andaman and Nicobar Islands|Nicobar"] || ["Nicobar"],
      },
      {
        name: "North and Middle Andaman",
        cities: cityOverrides["Andaman and Nicobar Islands|North and Middle Andaman"] || ["North and Middle Andaman"],
      },
      {
        name: "South Andaman",
        cities: cityOverrides["Andaman and Nicobar Islands|South Andaman"] || ["South Andaman"],
      },
    ],
  },
  {
    name: "Chandigarh",
    districts: [
      {
        name: "Chandigarh",
        cities: cityOverrides["Chandigarh|Chandigarh"] || ["Chandigarh"],
      },
    ],
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    districts: [
      {
        name: "Dadra and Nagar Haveli",
        cities: cityOverrides["Dadra and Nagar Haveli and Daman and Diu|Dadra and Nagar Haveli"] || ["Dadra and Nagar Haveli"],
      },
      {
        name: "Daman",
        cities: cityOverrides["Dadra and Nagar Haveli and Daman and Diu|Daman"] || ["Daman"],
      },
      {
        name: "Diu",
        cities: cityOverrides["Dadra and Nagar Haveli and Daman and Diu|Diu"] || ["Diu"],
      },
    ],
  },
  {
    name: "Delhi",
    districts: [
      {
        name: "Central Delhi",
        cities: cityOverrides["Delhi|Central Delhi"] || ["Central Delhi"],
      },
      {
        name: "East Delhi",
        cities: cityOverrides["Delhi|East Delhi"] || ["East Delhi"],
      },
      {
        name: "New Delhi",
        cities: cityOverrides["Delhi|New Delhi"] || ["New Delhi"],
      },
      {
        name: "North Delhi",
        cities: cityOverrides["Delhi|North Delhi"] || ["North Delhi"],
      },
      {
        name: "North East Delhi",
        cities: cityOverrides["Delhi|North East Delhi"] || ["North East Delhi"],
      },
      {
        name: "North West Delhi",
        cities: cityOverrides["Delhi|North West Delhi"] || ["North West Delhi"],
      },
      {
        name: "Shahdara",
        cities: cityOverrides["Delhi|Shahdara"] || ["Shahdara"],
      },
      {
        name: "South Delhi",
        cities: cityOverrides["Delhi|South Delhi"] || ["South Delhi"],
      },
      {
        name: "South East Delhi",
        cities: cityOverrides["Delhi|South East Delhi"] || ["South East Delhi"],
      },
      {
        name: "South West Delhi",
        cities: cityOverrides["Delhi|South West Delhi"] || ["South West Delhi"],
      },
      {
        name: "West Delhi",
        cities: cityOverrides["Delhi|West Delhi"] || ["West Delhi"],
      },
    ],
  },
  {
    name: "Jammu and Kashmir",
    districts: [
      {
        name: "Anantnag",
        cities: cityOverrides["Jammu and Kashmir|Anantnag"] || ["Anantnag"],
      },
      {
        name: "Bandipora",
        cities: cityOverrides["Jammu and Kashmir|Bandipora"] || ["Bandipora"],
      },
      {
        name: "Baramulla",
        cities: cityOverrides["Jammu and Kashmir|Baramulla"] || ["Baramulla"],
      },
      {
        name: "Budgam",
        cities: cityOverrides["Jammu and Kashmir|Budgam"] || ["Budgam"],
      },
      {
        name: "Doda",
        cities: cityOverrides["Jammu and Kashmir|Doda"] || ["Doda"],
      },
      {
        name: "Ganderbal",
        cities: cityOverrides["Jammu and Kashmir|Ganderbal"] || ["Ganderbal"],
      },
      {
        name: "Jammu",
        cities: cityOverrides["Jammu and Kashmir|Jammu"] || ["Jammu"],
      },
      {
        name: "Kathua",
        cities: cityOverrides["Jammu and Kashmir|Kathua"] || ["Kathua"],
      },
      {
        name: "Kishtwar",
        cities: cityOverrides["Jammu and Kashmir|Kishtwar"] || ["Kishtwar"],
      },
      {
        name: "Kulgam",
        cities: cityOverrides["Jammu and Kashmir|Kulgam"] || ["Kulgam"],
      },
      {
        name: "Kupwara",
        cities: cityOverrides["Jammu and Kashmir|Kupwara"] || ["Kupwara"],
      },
      {
        name: "Poonch",
        cities: cityOverrides["Jammu and Kashmir|Poonch"] || ["Poonch"],
      },
      {
        name: "Pulwama",
        cities: cityOverrides["Jammu and Kashmir|Pulwama"] || ["Pulwama"],
      },
      {
        name: "Rajouri",
        cities: cityOverrides["Jammu and Kashmir|Rajouri"] || ["Rajouri"],
      },
      {
        name: "Ramban",
        cities: cityOverrides["Jammu and Kashmir|Ramban"] || ["Ramban"],
      },
      {
        name: "Reasi",
        cities: cityOverrides["Jammu and Kashmir|Reasi"] || ["Reasi"],
      },
      {
        name: "Samba",
        cities: cityOverrides["Jammu and Kashmir|Samba"] || ["Samba"],
      },
      {
        name: "Shopian",
        cities: cityOverrides["Jammu and Kashmir|Shopian"] || ["Shopian"],
      },
      {
        name: "Srinagar",
        cities: cityOverrides["Jammu and Kashmir|Srinagar"] || ["Srinagar"],
      },
      {
        name: "Udhampur",
        cities: cityOverrides["Jammu and Kashmir|Udhampur"] || ["Udhampur"],
      },
    ],
  },
  {
    name: "Ladakh",
    districts: [
      {
        name: "Kargil",
        cities: cityOverrides["Ladakh|Kargil"] || ["Kargil"],
      },
      {
        name: "Leh",
        cities: cityOverrides["Ladakh|Leh"] || ["Leh"],
      },
    ],
  },
  {
    name: "Lakshadweep",
    districts: [
      {
        name: "Lakshadweep",
        cities: cityOverrides["Lakshadweep|Lakshadweep"] || ["Lakshadweep"],
      },
    ],
  },
  {
    name: "Puducherry",
    districts: [
      {
        name: "Karaikal",
        cities: cityOverrides["Puducherry|Karaikal"] || ["Karaikal"],
      },
      {
        name: "Mahe",
        cities: cityOverrides["Puducherry|Mahe"] || ["Mahe"],
      },
      {
        name: "Puducherry",
        cities: cityOverrides["Puducherry|Puducherry"] || ["Puducherry"],
      },
      {
        name: "Yanam",
        cities: cityOverrides["Puducherry|Yanam"] || ["Yanam"],
      },
    ],
  },
];

export const indiaStates = indiaLocations.map((item) => item.name);
