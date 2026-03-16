import json
from pathlib import Path

INPUT_PATH = Path("src/data/word_bank.json")
OUTPUT_PATH = Path("src/data/word_bank.json")

# Proper nouns, brands, places, names
BLOCKLIST = {
    # Names
    "john", "james", "george", "david", "michael", "robert", "william", "thomas",
    "richard", "charles", "peter", "paul", "mark", "andrew", "edward", "henry",
    "joseph", "daniel", "matthew", "christopher", "johnson", "williams", "jones",
    "smith", "miller", "wilson", "moore", "taylor", "anderson", "jackson", "harris",
    "martin", "thompson", "garcia", "martinez", "robinson", "clark", "lewis", "lee",
    "walker", "hall", "allen", "young", "king", "wright", "scott", "green", "adams",
    "baker", "nelson", "carter", "mitchell", "perez", "roberts", "turner", "phillips",
    "campbell", "parker", "evans", "edwards", "collins", "stewart", "sanchez", "morris",
    "rogers", "reed", "cook", "morgan", "bell", "murphy", "bailey", "rivera", "cooper",
    "richardson", "cox", "howard", "ward", "torres", "peterson", "gray", "ramirez",
    "james", "watson", "brooks", "kelly", "sanders", "price", "bennett", "wood",
    "barnes", "ross", "henderson", "coleman", "jenkins", "perry", "powell", "long",
    "patterson", "hughes", "flores", "washington", "butler", "simmons", "foster",
    "gonzales", "bryant", "alexander", "russell", "griffin", "diaz", "hayes",
    "alice", "anna", "mary", "sarah", "emma", "elizabeth", "helen", "laura",
    "jennifer", "jessica", "lisa", "maria", "margaret", "susan", "barbara",
    "karen", "patricia", "linda", "betty", "dorothy", "ruth", "sharon", "donna",
    "carol", "ruth", "virginia", "diane", "julie", "joyce", "evelyn", "judith",
    "victoria", "catherine", "jane", "amy", "angela", "brenda", "pamela", "emma",
    "nicole", "helen", "samantha", "katherine", "christine", "debra", "rachel",
    "carolyn", "janet", "catherine", "maria", "heather", "diane", "julie", "joyce",
    "amy", "kelly", "angela", "melissa", "donna",
    # First names (male)
    "alex", "adam", "alan", "albert", "alfred", "ali", "allen", "andy", "angel",
    "anthony", "arthur", "barry", "ben", "billy", "bob", "bobby", "brad", "brian",
    "bruce", "carl", "charlie", "chris", "dan", "danny", "dave", "dennis", "derek",
    "dick", "don", "donald", "doug", "douglas", "drew", "dude", "earl", "eric",
    "eugene", "frank", "franklin", "fred", "gary", "gene", "george", "gordon",
    "graham", "grant", "greg", "guy", "harry", "henry", "howard", "ian", "jack",
    "jacob", "jake", "jason", "jay", "jeff", "jerry", "jim", "jimmy", "joe",
    "joel", "john", "johnny", "jon", "jonathan", "jordan", "josh", "justin",
    "karl", "keith", "ken", "kevin", "kim", "kyle", "larry", "lawrence", "leo",
    "lewis", "lloyd", "louis", "luke", "mac", "mario", "mark", "martin", "matt",
    "max", "mike", "morgan", "murray", "nathan", "neil", "nelson", "nick", "noah",
    "oliver", "oscar", "patrick", "paul", "peter", "phil", "philip", "ray",
    "richard", "rick", "rob", "robert", "robin", "roger", "ron", "ross", "roy",
    "russell", "ryan", "sam", "samuel", "scott", "sean", "simon", "stephen",
    "steve", "steven", "ted", "terry", "thomas", "tim", "timothy", "tom", "tommy",
    "tony", "travis", "tyler", "victor", "vincent", "walter", "warren", "wayne",
    "william", "zachary", "billy", "brad", "brent", "brett", "chad", "chase",
    "clay", "clinton", "cody", "colin", "conner", "craig", "curtis", "dale",
    "dallas", "damian", "damon", "darren", "darwin", "david", "dean", "derek",
    "derek", "devin", "dominic", "duane", "dylan", "edgar", "elvis", "ethan",
    "evan", "felix", "fernando", "floyd", "francisco", "fred", "fredrick",
    "gabriel", "gareth", "gavin", "glen", "harvey", "heath", "hugo", "hunter",
    "ibrahim", "ivan", "james", "jarrod", "javier", "jeff", "jeffery", "jermaine",
    "jerome", "jesse", "jimmy", "joaquin", "joel", "joey", "julian", "julio",
    "junior", "kai", "kaleb", "kane", "kareem", "karl", "kasey", "kendall",
    # Places
    "london", "paris", "rome", "berlin", "tokyo", "beijing", "moscow", "sydney",
    "melbourne", "toronto", "chicago", "boston", "dallas", "houston", "miami",
    "seattle", "denver", "phoenix", "atlanta", "detroit", "cleveland", "baltimore",
    "philadelphia", "washington", "california", "texas", "florida", "georgia",
    "virginia", "illinois", "ohio", "michigan", "indiana", "wisconsin", "minnesota",
    "colorado", "arizona", "oregon", "iowa", "kentucky", "tennessee", "alabama",
    "louisiana", "maryland", "mississippi", "missouri", "oklahoma", "utah",
    "alaska", "hawaii", "canada", "america", "england", "france", "germany",
    "russia", "china", "japan", "india", "australia", "brazil", "mexico",
    "spain", "italy", "africa", "europe", "asia", "pacific", "atlantic",
    "ireland", "scotland", "wales", "britain", "israel", "iran", "iraq",
    "pakistan", "syria", "egypt", "turkey", "ukraine", "sweden", "switzerland",
    "netherlands", "poland", "greece", "portugal", "norway", "denmark", "finland",
    "belgium", "austria", "czech", "hungary", "romania", "bulgaria", "croatia",
    "serbia", "slovakia", "slovenia", "estonia", "latvia", "lithuania", "belarus",
    "moldova", "albania", "macedonia", "bosnia", "montenegro", "kosovo", "andorra",
    "monaco", "liechtenstein", "luxembourg", "malta", "cyprus", "iceland",
    "nigeria", "kenya", "ghana", "ethiopia", "tanzania", "uganda", "rwanda",
    "sudan", "somalia", "zimbabwe", "zambia", "mozambique", "angola", "congo",
    "cameroon", "senegal", "mali", "niger", "chad", "mauritania", "morocco",
    "algeria", "tunisia", "libya", "saudi", "jordan", "lebanon", "qatar",
    "kuwait", "bahrain", "oman", "yemen", "afghanistan", "indonesia", "malaysia",
    "philippines", "thailand", "vietnam", "korea", "taiwan", "singapore",
    "bangladesh", "nepal", "myanmar", "cambodia", "laos", "mongolia",
    "york", "angeles", "francisco", "diego", "antonio", "jose", "vegas",
    "orlando", "austin", "portland", "nashville", "memphis", "louisville",
    "indianapolis", "columbus", "jacksonville", "charlotte", "raleigh",
    "pittsburgh", "cincinnati", "minneapolis", "kansas", "tampa", "richmond",
    "virginia", "sacramento", "fresno", "tucson", "albuquerque", "mesa",
    "omaha", "colorado", "arlington", "bakersfield", "honolulu", "anaheim",
    "cambridge", "oxford", "edinburgh", "glasgow", "manchester", "liverpool",
    "birmingham", "bristol", "cardiff", "belfast", "dublin", "amsterdam",
    "brussels", "vienna", "zurich", "geneva", "stockholm", "oslo", "copenhagen",
    "helsinki", "warsaw", "prague", "budapest", "bucharest", "sofia", "athens",
    "lisbon", "madrid", "barcelona", "milan", "naples", "venice", "florence",
    "toronto", "montreal", "vancouver", "calgary", "ottawa", "winnipeg",
    "sydney", "melbourne", "brisbane", "perth", "adelaide", "auckland",
    "delhi", "mumbai", "bangalore", "kolkata", "chennai", "hyderabad",
    "karachi", "lahore", "dhaka", "colombo", "kathmandu",
    "rio", "paulo", "buenos", "lima", "bogota", "santiago", "caracas",
    "havana", "panama", "guadalajara", "monterrey",
    "brooklyn", "manhattan", "bronx", "queens", "staten",
    "hollywood", "beverly", "malibu", "pasadena", "burbank",
    # Brands/Companies/Organizations
    "google", "facebook", "twitter", "instagram", "youtube", "amazon", "apple",
    "microsoft", "netflix", "disney", "sony", "samsung", "nokia", "motorola",
    "toyota", "honda", "ford", "bmw", "mercedes", "volkswagen", "nissan",
    "chevrolet", "dodge", "ferrari", "lamborghini", "porsche", "tesla",
    "coca", "pepsi", "mcdonald", "starbucks", "walmart", "target", "costco",
    "nike", "adidas", "puma", "reebok", "converse", "vans", "gucci", "prada",
    "chanel", "versace", "armani", "calvin", "ralph", "tommy", "hugo",
    "cnn", "bbc", "nbc", "abc", "fox", "nfl", "nba", "nhl", "mlb", "fifa",
    "nato", "cia", "fbi", "nasa", "isis", "isis", "dna", "gop",
    "iphone", "android", "windows", "linux", "safari", "chrome", "firefox",
    "harvard", "oxford", "cambridge", "stanford", "yale", "princeton", "mit",
    # Offensive/inappropriate
    "shit", "fuck", "ass", "bitch", "damn", "hell", "crap", "bastard",
    "fucking", "fucked", "fuckin", "asshole", "bullshit", "pissed", "suck",
    "sucks", "dumb", "stupid", "idiot", "moron", "retard", "ugly", "fat",
    "porn", "sex", "rape", "kill", "die", "hate", "murder", "suicide",
    "racist", "racism", "sexist", "nazi", "slave", "slavery",
    "cock", "dick", "pussy", "butt", "naked", "nude", "sexy",
    "drug", "drugs", "marijuana", "cocaine", "heroin", "meth", "weed",
    "alcohol", "drunk", "smoking", "cigarette",
    "gay", "lesbian", "trans", "queer",
    # Internet slang / informal
    "lol", "wtf", "lmao", "haha", "yeah", "yep", "yea", "nah", "nope",
    "okay", "gonna", "wanna", "gotta", "kinda", "sorta", "dunno",
    "hey", "wow", "ugh", "huh", "hmm", "oops", "omg", "smh",
    "dont", "cant", "wont", "isnt", "wasnt", "arent", "werent",
    "thats", "whats", "whos", "hows", "whens", "wheres", "whys",
    "http", "https", "www", "com", "org", "net",
    # Too short / not useful as secret words
    "the", "and", "for", "that", "you", "with", "this", "was", "are",
    "have", "not", "but", "from", "your", "all", "his", "they", "one",
    "can", "will", "just", "out", "what", "has", "when", "who", "had",
    "were", "her", "its", "our", "two", "any", "she", "him", "ago",
    "per", "non", "via", "etc", "inc", "ltd", "pro", "sub", "pre",
    "mid", "anti", "semi", "multi", "ultra", "mega", "mini", "geo",
    "bio", "eco", "gen", "vol", "rep", "sec", "nov", "dec", "jan",
    "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct",
    "yes", "sir", "mrs", "mum", "mom", "dad", "bro", "sis",
    "lot", "bit", "guy", "men", "boy", "old", "new", "big", "hot",
    "bad", "sad", "mad", "ran", "sat", "ate", "lit", "bid", "aid",
    "aim", "arc", "ban", "bar", "bat", "bay", "bed", "bin", "bow",
    "box", "bug", "bus", "cap", "cat", "cop", "cup", "cut", "dig",
    "doc", "dog", "dot", "dry", "dug", "duo", "ear", "eat", "egg",
    "ego", "elk", "elm", "end", "era", "eve", "ewe", "eye", "fan",
    "fat", "fed", "fee", "few", "fin", "fit", "fix", "fly", "fog",
    "fun", "fur", "gap", "gas", "gel", "gem", "gin", "gnu", "god",
    "gun", "gut", "gym", "ham", "hat", "hay", "hen", "her", "hid",
    "him", "hip", "his", "hit", "hog", "hop", "hub", "hug", "hut",
    "ice", "ill", "imp", "ink", "ion", "ivy", "jab", "jam", "jar",
    "jaw", "jet", "jig", "job", "jot", "joy", "jug", "keg", "kid",
    "kin", "kit", "lab", "lag", "lay", "led", "leg", "lid", "lip",
    "log", "lot", "low", "lug", "mad", "map", "mat", "max", "met",
    "mob", "mod", "mop", "mud", "mug", "nap", "net", "nil", "nip",
    "nit", "nod", "nun", "oar", "odd", "oil", "opt", "orb", "ore",
    "owl", "own", "pad", "pal", "pan", "par", "pat", "paw", "pay",
    "peg", "pen", "pet", "pie", "pig", "pin", "pit", "pod", "pop",
    "pot", "pry", "pub", "pun", "pup", "ram", "rap", "rat", "raw",
    "ray", "rid", "rig", "rim", "rip", "rob", "rod", "rot", "row",
    "rub", "rue", "rug", "rum", "run", "rut", "rye", "sac", "sag",
    "sap", "saw", "sew", "sin", "sip", "ski", "sky", "sly", "sob",
    "sod", "son", "sow", "spa", "spy", "sue", "sum", "sup", "tab",
    "tag", "tan", "tap", "tar", "tax", "ten", "tip", "toe", "ton",
    "too", "top", "tow", "toy", "tug", "urn", "van", "vat", "vet",
    "vow", "wax", "web", "wed", "wig", "win", "wit", "woe", "won",
    "woo", "yam", "yap", "yew",
    # Abbreviations
    "bbc", "cnn", "nfl", "nba", "nhl", "mlb", "cia", "fbi", "nasa",
    "isis", "dna", "gop", "usa", "inc", "ltd", "etc", "iii", "lol",
    "wtf", "omg", "smh", "diy", "aka", "asap", "atm", "fyi", "tbh",
    "tho", "tbd", "tldr", "imo", "imho", "irl", "afk", "brb", "btw",
    "ngl", "rn", "smh", "til", "yolo", "iirc", "afaik",
    # Political figures / celebrities
    "trump", "obama", "clinton", "biden", "bush", "reagan", "lincoln",
    "kennedy", "churchill", "gandhi", "hitler", "stalin", "mao", "putin",
    "hillary", "bernie", "boris", "tony", "margaret", "theresa", "jeremy",
    "donald", "joe", "george", "bill", "jimmy", "carter", "johnson",
    # Sports teams / leagues
    "nfl", "nba", "nhl", "mlb", "fifa", "uefa", "nascar",
    "rangers", "giants", "eagles", "bears", "bulls", "celtics", "lakers",
    "warriors", "arsenal", "chelsea", "liverpool", "manchester",
}

def is_valid(word):
    word = word.lower().strip()
    if not word.isalpha():
        return False
    if len(word) < 4:
        return False
    if len(word) > 12:
        return False
    if word in BLOCKLIST:
        return False
    # Remove words ending in common suffixes that make them too derivative
    if word.endswith("ing") and len(word) < 7:
        return False
    return True

def main():
    with open(INPUT_PATH) as f:
        words = json.load(f)

    print(f"Before: {len(words)} words")
    cleaned = [w for w in words if is_valid(w.lower())]
    # Remove duplicates while preserving order
    seen = set()
    final = []
    for w in cleaned:
        w = w.lower()
        if w not in seen:
            seen.add(w)
            final.append(w)

    print(f"After: {len(final)} words")
    print(f"Removed: {len(words) - len(final)} words")
    print(f"Sample: {final[:20]}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)

    print(f"Saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()