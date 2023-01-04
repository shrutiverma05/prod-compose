import os
from haystack.document_stores import ElasticsearchDocumentStore
from haystack.nodes import EmbeddingRetriever
import pandas as pd
import urllib.request
import csv
import time

data_file = 'faq_data.csv'
index_names = ['haytest','vootours','gts']
document_store = []
retriever = []
pipe = []
host = os.environ.get("ELASTICSEARCH_HOST", "localhost")
#hostedserverUrl=os.getenv("DOCUMENTSTORE_ENDPOINT", "http://localhost:8060/")
hostedserverUrl = "https://novacorpweb.azurewebsites.net/"

def duplicate(data_file,index_name):
    path = data_file
    isExist = os.path.exists(path)

    if isExist == True:
        url = hostedserverUrl+index_name+'/'+data_file
        urllib.request.urlretrieve(url, 'data.csv')
        
        with open(data_file, encoding='utf-8') as csvf:
            csvReader = csv.DictReader(csvf)
            data = []
            for rows in csvReader:
                data.append(rows)
        with open('data.csv', encoding='utf-8') as csvf:
            csvReader2 = csv.DictReader(csvf)
            data2 = []
            for rows in csvReader2:
                data2.append(rows)
        if data == data2:
            os.remove('data.csv')
        else:
            os.remove(data_file)
            os.rename('data.csv', data_file)
        
    else:
        url = hostedserverUrl+index_name+'/'+data_file
        urllib.request.urlretrieve(url, data_file)
    
def train(data_file,index_name,retriever,document_store):
    duplicate(data_file,index_name)
    df = pd.read_csv(data_file)
    df.fillna(value="", inplace=True)
    df["question"] = df["question"].apply(lambda x: x.strip())
    # Get embeddings for our questions from the FAQs
    questions = list(df["question"].values)
    try:
        df["question_emb"] = retriever.embed_queries(queries=questions).tolist()
    except:
        df["question_emb"] = retriever.embed_queries(texts=questions)
    df = df.rename(columns={"question": "content"})
    # Convert Dataframe to list of dicts and index them in our DocumentStore
    docs_to_index = df.to_dict(orient="records")
    document_store.write_documents(docs_to_index)

while True:
    for i in range(len(index_names)):
        document_store.append(ElasticsearchDocumentStore(
            host=host,
            username="",
            password="",
            index=index_names[i],
            embedding_field="question_emb",
            embedding_dim=384,
            excluded_meta_data=["question_emb"],
            similarity="cosine",
        ))
        retriever.append(EmbeddingRetriever(
            document_store=document_store[i],
            embedding_model="sentence-transformers/all-MiniLM-L6-v2",
            use_gpu=True,
            scale_score=False,
        ))
        train(data_file,index_names[i],retriever[i],document_store[i])

    time.sleep(21600)