from flask import Flask, jsonify, request
import json
import requests

app = Flask(__name__)
api_key = "37507d36d2313ed25315986f04c5a317"
trending_url = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + api_key
tv_url = "https://api.themoviedb.org/3/tv/airing_today?api_key=" + api_key
genre_ids_url = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + api_key + "&language=en-US"
genre_dict = {}

def swap(arr, a, b):
    arr[a], arr[b] = arr[b], arr[a]

@app.route("/")
def home():
    return app.send_static_file('index.html')

@app.route("/trending", methods=['GET'])
def trending():
    trending_movies_response = requests.get(url=trending_url)
    json_data = json.loads(trending_movies_response.text)
    trending_movie_results = json_data['results'][:5]
    
    top_five_movies_list = []
    for i in range(len(trending_movie_results)):
        movie_obj = {"title": trending_movie_results[i]['title'],
                     "backdrop_path": trending_movie_results[i]['backdrop_path'],
                     "release_date": trending_movie_results[i]['release_date'][:4]}
        top_five_movies_list.append(movie_obj)

    response = jsonify(top_five_movies_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.add('Expires', 0)
    response.headers.add('Pragma', 'no-cache')
    return response

@app.route("/tv", methods=["GET"])
def tv():
    tv_airing_today_response = requests.get(url=tv_url)
    json_data = json.loads(tv_airing_today_response.text)

    tv_airing_results = json_data['results'][:5]
    top_five_tv_list = []
    for i in range(len(tv_airing_results)):
        tv_obj = {"name" : tv_airing_results[i]['name'],
                  "backdrop_path" : tv_airing_results[i]['backdrop_path'],
                  "first_air_date" : tv_airing_results[i]['first_air_date'][:4]}
        top_five_tv_list.append(tv_obj)
    
    response = jsonify(top_five_tv_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.add('Expires', 0)
    response.headers.add('Pragma', 'no-cache')
    return response

@app.route("/search", methods=["GET"])
def search():
    keyword = request.args.get("keyword")
    categories = request.args.get("categories")
    final_keyword = keyword.strip().replace(" ", "%20")
    response = {}
    genre_response = requests.get(url=genre_ids_url)

    genre_json_data = json.loads(genre_response.text)['genres']
    for i in range(len(genre_json_data)):
        key = genre_json_data[i]['id']
        val = genre_json_data[i]['name']
        if key not in genre_dict:
            genre_dict[key] = val

    if categories == "movies":
        search_movies_url = 'https://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&language=en-US&query=' + final_keyword + '&include_adult=false'

        search_movies_response = requests.get(url=search_movies_url)
        json_data = json.loads(search_movies_response.text)

        search_movies_results = json_data['results'][:10]
        top_ten_movies_list = []
        for i in range(len(search_movies_results)):
            genre_ids = search_movies_results[i]['genre_ids']
            genre_text = [genre_dict[genre_id] for genre_id in genre_ids if genre_id in genre_dict]
            if not search_movies_results[i].get('title'):
                search_movies_results[i]['title'] = 'N/A'
            if not search_movies_results[i].get('overview'):
                search_movies_results[i]['overview'] = 'N/A'
            if not search_movies_results[i].get('first_air_date'):
                search_movies_results[i]['first_air_date'] = 'N/A'
            if not search_movies_results[i].get('release_date'):
                search_movies_results[i]['release_date'] = 'N/A'
            if not genre_text:
                genre_text = ['N/A']
            if not search_movies_results[i].get('id'):
                search_movies_results[i]['id'] = 'N/A'

            movies_obj = {"id" : search_movies_results[i]['id'],
                    "title" : search_movies_results[i]['title'],
                    "overview" : search_movies_results[i]['overview'],
                    "poster_path" : search_movies_results[i]['poster_path'],
                    "release_date" : search_movies_results[i]['release_date'][:4],
                    "vote_average" : search_movies_results[i]['vote_average']/2,
                    "vote_count" : search_movies_results[i]['vote_count'],
                    "genre_ids" : genre_text}
            top_ten_movies_list.append(movies_obj)
        
        response = jsonify(top_ten_movies_list)

    elif categories == "tv-shows":
        search_tv_url = 'https://api.themoviedb.org/3/search/tv?api_key=' + api_key + '&language=en-US&query=' + final_keyword + '&include_adult=false'

        search_tv_response = requests.get(url=search_tv_url)
        json_data = json.loads(search_tv_response.text)

        search_tv_results = json_data['results'][:10]
        top_ten_tv_list = []
        for i in range(len(search_tv_results)):
            genre_ids = search_tv_results[i]['genre_ids']
            genre_text = [genre_dict[genre_id] for genre_id in genre_ids if genre_id in genre_dict]
            if not search_tv_results[i].get('name'):
                search_tv_results[i]['name'] = 'N/A'
            if not search_tv_results[i].get('overview'):
                search_tv_results[i]['overview'] = 'N/A'
            if not search_tv_results[i].get('first_air_date'):
                search_tv_results[i]['first_air_date'] = 'N/A'
            if not genre_text:
                genre_text = ['N/A']
            if not search_tv_results[i].get('id'):
                search_tv_results[i]['id'] = 'N/A'

            tv_obj = {"id" : search_tv_results[i]['id'],
                    "name" : search_tv_results[i]['name'],
                    "overview" : search_tv_results[i]['overview'],
                    "poster_path" : search_tv_results[i]['poster_path'],
                    "first_air_date" : search_tv_results[i]['first_air_date'][:4],
                    "vote_average" : search_tv_results[i]['vote_average']/2,
                    "vote_count" : search_tv_results[i]['vote_count'],
                    "genre_ids" : genre_text}
            top_ten_tv_list.append(tv_obj)
        
        response = jsonify(top_ten_tv_list)

    elif categories == "movies-and-tv-shows":
        search_multi_url = 'https://api.themoviedb.org/3/search/multi?api_key=' + api_key + '&language=en-US&query=' + final_keyword + '&include_adult=false'

        search_multi_response = requests.get(url=search_multi_url)
        json_data = json.loads(search_multi_response.text)
        
        search_multi_results = json_data['results']

        top_ten_multi_list = []
        for i in range(len(search_multi_results)):
            if len(top_ten_multi_list) < 10:
                media_type = search_multi_results[i]['media_type']
                genre_ids = search_multi_results[i]['genre_ids']
                genre_text = [genre_dict[genre_id] for genre_id in genre_ids if genre_id in genre_dict]

                if media_type == "movie":
                    if not search_multi_results[i].get('title'):
                        search_multi_results[i]['title'] = 'N/A'
                    if not search_multi_results[i].get('overview'):
                        search_multi_results[i]['overview'] = 'N/A'
                    if not search_multi_results[i].get('release_date'):
                        search_multi_results[i]['release_date'] = 'N/A'
                    if not genre_text:
                        genre_text = ['N/A']
                    if not search_multi_results[i].get('id'):
                        search_multi_results[i]['id'] = 'N/A'

                    movies_obj = {"id" : search_multi_results[i]['id'],
                            "title" : search_multi_results[i]['title'],
                            "overview" : search_multi_results[i]['overview'],
                            "poster_path" : search_multi_results[i]['poster_path'],
                            "release_date" : search_multi_results[i]['release_date'][:4],
                            "vote_average" : search_multi_results[i]['vote_average']/2,
                            "vote_count" : search_multi_results[i]['vote_count'],
                            "genre_ids" : genre_text,
                            "media_type" : search_multi_results[i]['media_type']}
                    top_ten_multi_list.append(movies_obj)
                elif media_type == "tv":
                    if not search_multi_results[i].get('name'):
                        search_multi_results[i]['name'] = 'N/A'
                    if not search_multi_results[i].get('overview'):
                        search_multi_results[i]['overview'] = 'N/A'
                    if not search_multi_results[i].get('first_air_date'):
                        search_multi_results[i]['first_air_date'] = 'N/A'
                    if not genre_text:
                        genre_text = ['N/A']
                    if not search_multi_results[i].get('id'):
                        search_multi_results[i]['id'] = 'N/A'

                    tv_obj = {"id" : search_multi_results[i]['id'],
                            "name" : search_multi_results[i]['name'],
                            "overview" : search_multi_results[i]['overview'],
                            "poster_path" : search_multi_results[i]['poster_path'],
                            "first_air_date" : search_multi_results[i]['first_air_date'][:4],
                            "vote_average" : search_multi_results[i]['vote_average']/2,
                            "vote_count" : search_multi_results[i]['vote_count'],
                            "genre_ids" : genre_text,
                            "media_type" : search_multi_results[i]['media_type']}
                    top_ten_multi_list.append(tv_obj)
        
        response = jsonify(top_ten_multi_list)
    
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.add('Expires', 0)
    response.headers.add('Pragma', 'no-cache')
    return response

@app.route("/movie", methods=['GET'])
def movie():
    movieId = request.args.get("id")
    movie_details_url = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + api_key + '&language=en-US'
    movie_credits_url = 'https://api.themoviedb.org/3/movie/' + movieId + '/credits?api_key=' + api_key + '&language=en-US'
    movie_reviews_url = 'https://api.themoviedb.org/3/movie/' + movieId + '/reviews?api_key=' + api_key + '&language=en-US'

    response = {}
    
    movie_details_response = requests.get(url=movie_details_url)
    movie_credits_response = requests.get(url=movie_credits_url)
    movie_reviews_response = requests.get(url=movie_reviews_url)
    json_data = json.loads(movie_details_response.text)
    json_data2 = json.loads(movie_credits_response.text)
    json_data3 = json.loads(movie_reviews_response.text)
    genre_text = json_data['genres']

    movie_reviews_results = json_data3['results'][:5]

    if not json_data.get('title'):
        json_data['title'] = 'N/A'
    if not json_data.get('release_date'):
        json_data['release_date'] = 'N/A'
    if not json_data.get('genres'):
        genre_text = ['N/A']
    if not json_data.get('id'):
        json_data['id'] = 'N/A'
    if not json_data.get('runtime'):
        json_data['runtime'] = 'N/A'
    if not json_data.get('spoken_languages'):
        json_data['spoken_languages'] = 'N/A'

    movie_obj = {"id" : json_data['id'],
            "title" : json_data['title'],
            "runtime" : json_data['runtime'],
            "poster_path" : json_data['poster_path'],
            "backdrop_path" : json_data['backdrop_path'],
            "release_date" : json_data['release_date'][:4],
            "spoken_languages" : json_data['spoken_languages'],
            "vote_average" : json_data['vote_average']/2,
            "vote_count" : json_data['vote_count'],
            "genres" : genre_text}

    movie_credits_results = json_data2['cast']

    top_eight_credits_list = []
    for i in range(len(movie_credits_results)):
        if len(top_eight_credits_list) < 8:
            if movie_credits_results[i]['known_for_department'] == "Acting":
                if not movie_credits_results[i].get('name'):
                    movie_credits_results[i]['name'] = 'N/A'
                if not movie_credits_results[i].get('character'):
                    movie_credits_results[i]['character'] = 'N/A'
                credits_obj = {"name" : movie_credits_results[i]['name'],
                            "profile_path" : movie_credits_results[i]['profile_path'],
                            "character" : movie_credits_results[i]['character']}
                top_eight_credits_list.append(credits_obj)

    top_five_reviews_list = []
    for i in range(len(movie_reviews_results)):
        if len(top_five_reviews_list) < 5:
            cur_review = movie_reviews_results[i]['author_details']
            if not cur_review.get('username'):
                cur_review['username'] = 'N/A'
            if not movie_reviews_results[i].get('content'):
                movie_reviews_results[i]['content'] = 'N/A'
            if not cur_review.get('rating'):
                rating = 'N/A'
            else:
                rating = float(cur_review['rating'])/2
            if not movie_reviews_results[i].get('created_at'):
                date = 'N/A'
            else:
                date = movie_reviews_results[i]['created_at'][:10].split("-")
                swap(date, 0, 2)
                swap(date, 0, 1)
                date = "/".join(date)
            reviews_obj = {"username" : cur_review['username'],
                        "created_at" : date,
                        "rating" : rating,
                        "content" : movie_reviews_results[i]['content']}
            top_five_reviews_list.append(reviews_obj)

    response['movie'] = movie_obj
    response['cast'] = top_eight_credits_list
    response['review'] = top_five_reviews_list
    
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.add('Expires', 0)
    response.headers.add('Pragma', 'no-cache')
    return response

@app.route("/tvDetails", methods=['GET'])
def tvDetails():
    tvId = request.args.get("id")
    tv_details_url = 'https://api.themoviedb.org/3/tv/' + tvId + '?api_key=' + api_key + '&language=en-US'
    tv_credits_url = 'https://api.themoviedb.org/3/tv/' + tvId + '/credits?api_key=' + api_key + '&language=en-US'
    tv_reviews_url = 'https://api.themoviedb.org/3/tv/' + tvId + '/reviews?api_key=' + api_key + '&language=en-US'

    response = {}
    
    tv_details_response = requests.get(url=tv_details_url)
    tv_credits_response = requests.get(url=tv_credits_url)
    tv_reviews_response = requests.get(url=tv_reviews_url)
    json_data = json.loads(tv_details_response.text)
    json_data2 = json.loads(tv_credits_response.text)
    json_data3 = json.loads(tv_reviews_response.text)
    genre_text = json_data['genres']
    
    tv_reviews_results = json_data3['results'][:5]

    if not json_data.get('name'):
        json_data['name'] = 'N/A'
    if not json_data.get('first_air_date'):
        json_data['first_air_date'] = 'N/A'
    if not json_data.get('genres'):
        genre_text = ['N/A']
    if not json_data.get('id'):
        json_data['id'] = 'N/A'
    if not json_data.get('episode_run_time'):
        json_data['episode_run_time'] = 'N/A'
    if not json_data.get('spoken_languages'):
        json_data['spoken_languages'] = 'N/A'
    if not json_data.get('number_of_seasons'):
        json_data['number_of_seasons'] = 'N/A'
    if not json_data.get('overview'):
        json_data['overview'] = 'N/A'
    if not json_data.get('vote_average'):
        vote_average = 'N/A'
    else:
        vote_average = float(json_data['vote_average'])/2
    if not json_data.get('vote_count'):
        json_data['vote_count'] = 'N/A'

    tv_obj = {"id" : json_data['id'],
            "name" : json_data['name'],
            "episode_run_time" : json_data['episode_run_time'],
            "backdrop_path" : json_data['backdrop_path'],
            "poster_path" : json_data['poster_path'],
            "first_air_date" : json_data['first_air_date'][:4],
            "spoken_languages" : json_data['spoken_languages'],
            "vote_average" : vote_average,
            "vote_count" : json_data['vote_count'],
            "overview" : json_data['overview'],
            "number_of_seasons" : json_data['number_of_seasons'],
            "vote_count" : json_data['vote_count'],
            "genres" : genre_text}
    
    tv_credits_results = json_data2['cast']

    top_eight_credits_list = []
    for i in range(len(tv_credits_results)):
        if len(top_eight_credits_list) < 8:
            if tv_credits_results[i]['known_for_department'] == "Acting":
                if not tv_credits_results[i].get('name'):
                    tv_credits_results[i]['name'] = 'N/A'
                if not tv_credits_results[i].get('character'):
                    tv_credits_results[i]['character'] = 'N/A'
                credits_obj = {"name" : tv_credits_results[i]['name'],
                            "profile_path" : tv_credits_results[i]['profile_path'],
                            "character" : tv_credits_results[i]['character']}
                top_eight_credits_list.append(credits_obj)

    top_five_reviews_list = []
    for i in range(len(tv_reviews_results)):
        if len(top_five_reviews_list) < 5:
            cur_review = tv_reviews_results[i]['author_details']
            if not cur_review.get('username'):
                cur_review['username'] = 'N/A'
            if not tv_reviews_results[i].get('content'):
                tv_reviews_results[i]['content'] = 'N/A'
            if not cur_review.get('rating'):
                rating = 'N/A'
            else:
                rating = float(cur_review['rating'])/2
            if not tv_reviews_results[i].get('created_at'):
                date = 'N/A'
            else:
                date = tv_reviews_results[i]['created_at'][:10].split("-")
                swap(date, 0, 2)
                swap(date, 0, 1)
                date = "/".join(date)
            reviews_obj = {"username" : cur_review['username'],
                        "created_at" : date,
                        "rating" : rating,
                        "content" : tv_reviews_results[i]['content']}
            top_five_reviews_list.append(reviews_obj)

    response['tv'] = tv_obj
    response['cast'] = top_eight_credits_list
    response['review'] = top_five_reviews_list
    
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.add('Expires', 0)
    response.headers.add('Pragma', 'no-cache')
    return response

if __name__ == '__main__':
    app.run(debug=True)
