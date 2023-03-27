# RUN uvicorn api:app --reload --port 8000
from fastapi import FastAPI
import os
from haystack.document_stores import ElasticsearchDocumentStore
from haystack.nodes import EmbeddingRetriever
from haystack.pipelines import FAQPipeline
from fastapi.middleware.cors import CORSMiddleware
import ftplib

HOSTNAME = "waws-prod-db3-177.ftp.azurewebsites.windows.net"
USERNAME = "novaeu\$novaeu"
PASSWORD = "r8d0hfMcM1ssZ0K4jspHbQ1zwdqjH29PvMnMzFugnpyrfZ1kZfG6Yc9kJbi7"
# HOSTNAME = "waws-prod-db3-177.ftp.azurewebsites.windows.net"
# USERNAME = "novaeu\$novaeu"
# PASSWORD = "r8d0hfMcM1ssZ0K4jspHbQ1zwdqjH29PvMnMzFugnpyrfZ1kZfG6Yc9kJbi7"

ftp_server = ftplib.FTP(HOSTNAME, USERNAME, PASSWORD)
ftp_server.encoding = "utf-8"
ftp_server.cwd('/site/wwwroot')

index_names = []
ftp_server.retrlines('LIST', lambda x: index_names.append(x.split()[-1]))
# index_names = ['gts','propertyhub','valueleaf','recruitment','novacept','haytest']

host = os.environ.get("ELASTICSEARCH_HOST", "localhost")
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/query/{index_name}")
async def query(q,index_name):
    document_store = (ElasticsearchDocumentStore(
        host=host,
        username="",
        password="",
        index=index_name,
        embedding_field="question_emb",
        embedding_dim=384,
        excluded_meta_data=["question_emb"],
        similarity="cosine",
    ))
    retriever = (EmbeddingRetriever(
        document_store=document_store,
        embedding_model="sentence-transformers/all-MiniLM-L6-v2",
        use_gpu=True,
        scale_score=False,
    ))
    pipe = (FAQPipeline(retriever=retriever))
    return pipe.run(query=q, params={"Retriever": {"top_k": 2}})