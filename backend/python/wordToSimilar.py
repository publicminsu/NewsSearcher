#flask,flask_cors, flask-restx,sentence_transformers 설치(오류시 관리자 권한 또는 --user)
from sentence_transformers import SentenceTransformer, util
import numpy as np
from flask import Flask,request
from flask_restx import Api,Resource
embedder = SentenceTransformer("jhgan/ko-sroberta-multitask")

app=Flask(__name__)
api=Api(app)
def sentenceToScore(corpus,title):
  corpus_embeddings = embedder.encode(corpus, convert_to_tensor=True)
  title_embedding = embedder.encode(title, convert_to_tensor=True)
  cos_scores = util.pytorch_cos_sim(title_embedding, corpus_embeddings)[0]
  cos_scores = cos_scores.cpu()
  return cos_scores
@api.route('/') 
class wordPost(Resource):
    def post(self):
      searchTitle=request.json.get('title')
      objectList=request.json.get('data')['items']
      titleList=[o['title'] for o in objectList]
      scoreList=sentenceToScore(titleList,searchTitle).tolist()
      return scoreList
# Corpus with example sentences
if __name__ == "__main__":
    app.run(debug=True)