import json

data = []
with open('hashtag LetsGoWarriors tweets.txt') as f:
    for line in f:
    	current_json = json.loads(line)
        if current_json["coordinates"] is not None:
        	data.append(current_json)


file = open("hashtag LetsGoWarriors tweets_geo_json.json", "w")
file.write(json.dumps(data, indent=4, sort_keys=False))
file.close()